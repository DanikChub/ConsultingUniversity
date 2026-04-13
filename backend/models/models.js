const sequelize = require('../db');
const {DataTypes, Op} = require('sequelize');
const path = require('path');
const fs = require('fs');
const {sendCompletionEmail} = require("../services/mail.service");


const STATIC_DIR = path.resolve(__dirname, '..', 'static');
if (!fs.existsSync(STATIC_DIR)) fs.mkdirSync(STATIC_DIR, { recursive: true });

async function generateCertificateNumber() {
    const year = new Date().getFullYear();

    const countThisYear = await Certificate.count({
        where: {
            createdAt: {
                [Op.gte]: new Date(`${year}-01-01`),
                [Op.lt]: new Date(`${year + 1}-01-01`)
            }
        }
    });

    const sequence = String(countThisYear + 1).padStart(6, '0');

    return `DP-${year}-${sequence}`;
}


function calculateProgramProgress(program, userProgressMap, enrollmentId) {
    const byContent = {}
    let totalCount = 0
    let completedCount = 0

    program.themes.forEach(theme => {


        // пункты
        theme.puncts.forEach(punct => {


            // тесты пункта
            punct.tests.forEach(test => {
                const key = `test-${test.id}`
                const progress = userProgressMap[key] || {
                    id: 0,
                    enrollmentId,
                    contentType: 'test',
                    contentId: test.id,
                    status: 'not_started'
                }

                byContent[key] = progress
                totalCount++

                if (progress.status === 'completed') completedCount++
            })
        })
    })

    const percent = totalCount
        ? Math.round((completedCount / totalCount) * 100)
        : 0

    return { byContent, percent }
}

async function recalculateEnrollmentProgress(enrollmentId) {

    // получаем всё, что относится к enrollment
    const userProgressItems = await UserContentProgress.findAll({
        where: { enrollmentId },
        raw: true
    })

    const enrollment = await Enrollment.findByPk(enrollmentId)
    if (!enrollment) return

    const program = await Program.findOne({
        where: { id: enrollment.programId },
        include: [
            {
                model: Theme,
                include: [
                    { model: File },
                    {
                        model: Punct,
                        include: [
                            { model: File },
                            { model: Test }
                        ]
                    }
                ]
            }
        ]
    })

    const userProgressMap = {}
    userProgressItems.forEach(item => {
        const key = `${item.contentType}-${item.contentId}`
        userProgressMap[key] = item
    })

    const { percent } =
        calculateProgramProgress(program, userProgressMap, enrollmentId)

    enrollment.progress_percent = percent
    if (enrollment.progress_percent == 100 && enrollment.status != 'completed') {
        sendCompletionEmail('chabanovdan@gmail.com', 'Даниил Чабанов', 'Тестовая программа потом доделаю')
        enrollment.status = 'completed';
        await Event.create({
            event_text: 'Пользователь завершил обучение',
            name: program.title,
            event_id: program.id,
            type: 'program'
        });
        const number = await generateCertificateNumber();

        await Certificate.create({
            enrollmentId: enrollment.id,
            certificate_number: number,
            issued_at: new Date()
        });
        enrollment.completed_at = new Date();
    } else {
        enrollment.status = 'active';
    }
    await enrollment.save()

    return percent
}

async function reorderAfterDelete(Model, parentId, parentKey, deletedIndex) {
    if (!parentId || deletedIndex === undefined) return;

    await Model.decrement('order_index', {
        by: 1,
        where: {
            [parentKey]: parentId,
            order_index: { [Op.gt]: deletedIndex }
        }
    });
}

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    number: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    diplom: { type: DataTypes.BOOLEAN },
    address: { type: DataTypes.STRING },
    organization: { type: DataTypes.STRING },
    inn: { type: DataTypes.STRING },

    img: { type: DataTypes.STRING },

    graduation_date: { type: DataTypes.DATE },

    password_reset_token: { type: DataTypes.STRING },
    password_reset_expires: { type: DataTypes.DATE },

    last_login_at: { type: DataTypes.DATE },

    // новые поля
    passport: { type: DataTypes.TEXT, allowNull: true },
    education_document: { type: DataTypes.TEXT, allowNull: true },
    snils: { type: DataTypes.STRING, allowNull: true },

    admin_signature: { type: DataTypes.STRING, allowNull: true },
});

const UserDocument = sequelize.define('user_document', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    original_name: { type: DataTypes.STRING, allowNull: false },
    file_name: { type: DataTypes.STRING, allowNull: false }, // имя на сервере
    file_path: { type: DataTypes.STRING, allowNull: false }, // например /static/user-documents/xxx.pdf
    mime_type: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },

    // опционально, если потом захочешь различать
    document_type: {
        type: DataTypes.STRING,
        allowNull: true, // 'passport' | 'education' | 'snils' | 'other'
    },
});

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    organization: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    event_text: {type: DataTypes.STRING},
    type: {type: DataTypes.ENUM('program', 'user', 'admin')},
    event_id: {type: DataTypes.INTEGER}
})

const Application = sequelize.define('application', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    number: {type: DataTypes.STRING, unique: true, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},

})

const Program = sequelize.define('program', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    admin_id: {type: DataTypes.INTEGER},
    number_of_practical_work: {type: DataTypes.INTEGER, allowNull: false},
    number_of_test: {type: DataTypes.INTEGER, allowNull: false},
    number_of_videos: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING},
    price: {type: DataTypes.STRING},
    short_title: {type: DataTypes.STRING},

    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft',
        allowNull: false
    },
})

Program.addHook('beforeDestroy', async (program) => {
    try {
        // Если есть картинка программы на диске
        if (program.img) {
            const fullPath = path.join(STATIC_DIR, program.img);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.warn('Failed to delete program image:', err.message || err);
    }
});

const Theme = sequelize.define('theme', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    order_index: { type: DataTypes.INTEGER },
})

Theme.addHook('afterDestroy', async (theme, options) => {
    await reorderAfterDelete(Theme, theme.programId, 'programId', theme.order_index);
});

const Punct = sequelize.define('punct', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    description: {type: DataTypes.TEXT},
    order_index: { type: DataTypes.INTEGER },
});

Punct.addHook('afterDestroy', async (punct, options) => {
    await reorderAfterDelete(Punct, punct.themeId, 'themeId', punct.order_index);
});


const File = sequelize.define('file', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    original_name: { type: DataTypes.STRING, allowNull: false },
    stored_name: { type: DataTypes.STRING, allowNull: true },
    mime_type: { type: DataTypes.STRING, allowNull: true },

    type: { type: DataTypes.ENUM('docx', 'pdf', 'audio', 'video') },

    size: { type: DataTypes.INTEGER },
    url: { type: DataTypes.TEXT, allowNull: true }, // 🔥 ВАЖНО

    order_index: { type: DataTypes.INTEGER },

    status: {
        type: DataTypes.ENUM('uploading', 'idle', 'error'),
        defaultValue: 'uploading',
    },

    storage: {
        type: DataTypes.ENUM('local', 's3', 'vimeo'),
        defaultValue: 'local',
    },
});

File.addHook('beforeDestroy', async (file) => {
    try {
        if (file.stored_name) {
            const fullPath = path.join(STATIC_DIR, file.stored_name);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log('🗑 Deleted file from disk:', fullPath);
            }
        }
    } catch (err) {
        console.warn('Failed to delete file:', err.message || err);
    }
});

File.addHook('afterDestroy', async (file, options) => {
    const parentId = file.punctId || file.themeId; // если файл может быть у пункта или темы
    const parentKey = file.punctId ? 'punctId' : 'themeId';
    await reorderAfterDelete(File, parentId, parentKey, file.order_index);
});

const FileAsset = sequelize.define('file_asset', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM('html'), allowNull: false },
    content: { type: DataTypes.TEXT },
});


const Test = sequelize.define('test', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    final_test: { type: DataTypes.BOOLEAN },
    time_limit: { type: DataTypes.INTEGER }, // в секундах
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft',
        allowNull: false
    },
    order_index: { type: DataTypes.INTEGER },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    punctId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },


});

const Question = sequelize.define('question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT },
    type: {
        type: DataTypes.ENUM('single', 'multiple', 'text'),
        allowNull: false,
    },
    order_index: { type: DataTypes.INTEGER },
});
const Answer = sequelize.define('answer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT },
    is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
    order_index: { type: DataTypes.INTEGER },
});

const TestQuestionLink = sequelize.define('test_question_link', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_index: { type: DataTypes.INTEGER }
}, {
    timestamps: false
});



const TestAttempt = sequelize.define('test_attempt', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    attempt_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    score: {
        type: DataTypes.INTEGER
    },

    correct_answers: {
        type: DataTypes.INTEGER
    },

    total_questions: {
        type: DataTypes.INTEGER
    },

    passed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    finished_at: {
        type: DataTypes.DATE
    }
});


const TestAttemptAnswer = sequelize.define('test_attempt_answer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },


    selected_answers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    },

    text_answer: {
        type: DataTypes.TEXT
    },

    is_correct: {
        type: DataTypes.BOOLEAN
    }
});



const Enrollment = sequelize.define('enrollment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },
    programId: { type: DataTypes.INTEGER, allowNull: false },

    status: {
        type: DataTypes.ENUM('active', 'paused', 'completed', 'archived'),
        defaultValue: 'active',
    },

    progress_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

    completed_at: {
        type: DataTypes.DATE,
    },
});

const Certificate = sequelize.define('certificate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },



    certificate_number: {
        type: DataTypes.STRING,
        unique: true,
    },

    status: {
        type: DataTypes.ENUM(
            'pending_contact',
            'contacted',
            'waiting_delivery',
            'shipped',
            'picked_up',
            'delivered'
        ),
        defaultValue: 'pending_contact',
    },

    delivery_type: {
        type: DataTypes.ENUM('post', 'pickup'),
        allowNull: true,
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    tracking_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    issued_at: {
        type: DataTypes.DATE,
    }
});



const UserContentProgress = sequelize.define('user_content_progress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    enrollmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    contentType: {
        type: DataTypes.ENUM(
            'file',
            'test',

        ),
        allowNull: false,
    },

    contentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM(
            'not_started',
            'in_progress',
            'completed',
            'failed'
        ),
        defaultValue: 'not_started',
    },

    score: {
        type: DataTypes.INTEGER, // % для тестов
        allowNull: true,
    },

    completedAt: {
        type: DataTypes.DATE,
    },
});

UserContentProgress.addHook('afterSave', async (progress, options) => {


    await recalculateEnrollmentProgress(progress.enrollmentId)
})

const PracticalWork = sequelize.define('practical_work', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    task: {type: DataTypes.TEXT},
    task_theme: {type: DataTypes.STRING},
    practic_title: {type: DataTypes.STRING},
    test: {type: DataTypes.BOOLEAN},
    file_src: {type: DataTypes.STRING},
    answer: {type: DataTypes.STRING},
    users_id: {type: DataTypes.INTEGER},
    user_name: {type: DataTypes.STRING},
    program_id: {type: DataTypes.INTEGER},
    theme_id: {type: DataTypes.INTEGER},
    theme_statistic_id: {type: DataTypes.INTEGER},
    punct_id: {type: DataTypes.INTEGER}
})



const Chat = sequelize.define('chat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },
    lastMessageAt: {type: DataTypes.DATE},
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open'
    },
    lastReadUserMessageId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lastReadAdminMessageId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

const Message = sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    chatId: { type: DataTypes.INTEGER, allowNull: false },

    senderType: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false
    },

    senderId: { type: DataTypes.INTEGER, allowNull: true },

    text: { type: DataTypes.TEXT, allowNull: true },

    readAt: { type: DataTypes.DATE, defaultValue: null },
    deletedAt: { type: DataTypes.DATE, defaultValue: null },
})

const MessageAttachment = sequelize.define('message_attachment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    messageId: { type: DataTypes.INTEGER, allowNull: false },

    originalName: { type: DataTypes.STRING },
    storedName: { type: DataTypes.STRING },

    mimeType: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },

    storage: {
        type: DataTypes.ENUM('local', 's3'),
        defaultValue: 'local'
    },

    url: { type: DataTypes.STRING }
})



Program.hasMany(Theme, { onDelete: 'cascade', hooks: true })
Theme.belongsTo(Program)

Program.hasOne(Test)
Test.belongsTo(Program)

Theme.hasMany(File, { onDelete: 'cascade', hooks: true  })
File.belongsTo(Theme)

Theme.hasMany(Punct, { onDelete: 'cascade', hooks: true })
Punct.belongsTo(Theme)

Punct.hasMany(File, { onDelete: 'cascade', hooks: true  })
File.belongsTo(Punct)

File.hasOne(FileAsset, { onDelete: 'cascade', hooks: true  })
FileAsset.belongsTo(File, { onDelete: 'cascade' })

Punct.hasMany(Test, { onDelete: 'cascade', hooks: true })
Test.belongsTo(Punct)

Test.hasMany(Question, {
    foreignKey: 'testId',
    as: 'questions',
    onDelete: 'CASCADE',
    hooks: true
});
Question.belongsTo(Test, {
    foreignKey: 'testId'
});


Test.belongsToMany(Question, {
    through: TestQuestionLink,
    foreignKey: 'testId',
    otherKey: 'questionId',
    as: 'finalQuestions',
    onDelete: 'CASCADE'
});
Question.belongsToMany(Test, {
    through: TestQuestionLink,
    foreignKey: 'questionId',
    otherKey: 'testId',
    onDelete: 'CASCADE'
});


Question.hasMany(Answer, { onDelete: 'cascade', hooks: true });
Answer.belongsTo(Question);

Enrollment.hasMany(TestAttempt, { onDelete: 'cascade' });
TestAttempt.belongsTo(Enrollment);

Test.hasMany(TestAttempt, { onDelete: 'cascade' });
TestAttempt.belongsTo(Test);

TestAttempt.hasMany(TestAttemptAnswer, { onDelete: 'cascade' });
TestAttemptAnswer.belongsTo(TestAttempt);

Question.hasMany(TestAttemptAnswer, { onDelete: 'cascade' });
TestAttemptAnswer.belongsTo(Question);

Chat.belongsTo(User, { foreignKey: "userId" })
Chat.hasMany(Message, { foreignKey: "chatId" })

Chat.hasMany(Message)
Message.belongsTo(Chat)

Message.hasMany(MessageAttachment)
MessageAttachment.belongsTo(Message)

User.belongsToMany(Program, {through: Enrollment})
Program.belongsToMany(User, {through: Enrollment})

User.hasMany(UserDocument, { foreignKey: 'userId', as: 'documents', onDelete: 'CASCADE' });
UserDocument.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Enrollment.belongsTo(User);
User.hasMany(Enrollment);

Enrollment.belongsTo(Program);
Program.hasMany(Enrollment);

Enrollment.hasOne(Certificate, { onDelete: 'cascade' });
Certificate.belongsTo(Enrollment);

User.hasMany(PracticalWork)
PracticalWork.belongsTo(User)


const updateProgramStatusToDraft = async (programId) => {
    const program = await Program.findByPk(programId);
    if (!program) return;

    if (program.status === 'published') {
        program.status = 'draft';
        await program.save();
    }
};


// Для Theme (есть programId)
Theme.addHook('afterCreate', async (theme) => {
    if (theme.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});
Theme.addHook('afterSave', async (theme) => {
    if (theme.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

Theme.addHook('afterDestroy', async (theme) => {
    if (theme.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

// Для Punct
Punct.addHook('afterCreate', async (punct) => {
    const theme = await Theme.findByPk(punct.themeId); // themeId есть
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});
Punct.addHook('afterSave', async (punct) => {
    const theme = await Theme.findByPk(punct.themeId); // themeId есть
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

Punct.addHook('afterDestroy', async (punct) => {
    const theme = await Theme.findByPk(punct.themeId);
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

// Для File
File.addHook('afterCreate', async (file) => {
    const punct = await Punct.findByPk(file.punctId);
    const theme = punct ? await Theme.findByPk(punct.themeId) : null;
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});
File.addHook('afterSave', async (file) => {
    const punct = await Punct.findByPk(file.punctId);
    const theme = punct ? await Theme.findByPk(punct.themeId) : null;
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

File.addHook('afterDestroy', async (file) => {
    const punct = await Punct.findByPk(file.punctId);
    const theme = punct ? await Theme.findByPk(punct.themeId) : null;
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

// Для Test
Test.addHook('afterCreate', async (test) => {
    const punct = await Punct.findByPk(test.punctId);
    const theme = punct ? await Theme.findByPk(punct.themeId) : null;
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});
Test.addHook('afterSave', async (test) => {
    const punct = await Punct.findByPk(test.punctId);
    const theme = punct ? await Theme.findByPk(punct.themeId) : null;
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});

Test.addHook('afterDestroy', async (test) => {
    const punct = await Punct.findByPk(test.punctId);
    const theme = punct ? await Theme.findByPk(punct.themeId) : null;
    if (theme?.programId) {
        await updateProgramStatusToDraft(theme.programId);
    }
});


module.exports = {
    Event,
    User,
    UserDocument,
    Program,
    Theme,
    Punct,
    File,
    FileAsset,
    Application,
    Test,
    Question,
    Answer,
    Chat,
    Message,
    MessageAttachment,
    Enrollment,
    PracticalWork,
    TestAttempt,
    TestAttemptAnswer,
    UserContentProgress,
    Certificate,
    TestQuestionLink
}