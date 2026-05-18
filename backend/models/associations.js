module.exports = (models) => {
    const {
        User,
        UserDocument,

        Program,
        Theme,
        Punct,
        File,
        FileAsset,

        Test,
        Question,
        Answer,
        TestQuestionLink,

        Enrollment,
        Certificate,
        UserContentProgress,
        TestAttempt,
        TestAttemptAnswer,

        Chat,
        Message,
        MessageAttachment,

        PracticalWork,
    } = models;

    Program.hasMany(Theme, { onDelete: "CASCADE", hooks: true });
    Theme.belongsTo(Program);

    Program.hasOne(Test);
    Test.belongsTo(Program);

    Theme.hasMany(File, { onDelete: "CASCADE", hooks: true });
    File.belongsTo(Theme);

    Theme.hasMany(Punct, { onDelete: "CASCADE", hooks: true });
    Punct.belongsTo(Theme);

    Punct.hasMany(File, { onDelete: "CASCADE", hooks: true });
    File.belongsTo(Punct);

    File.hasOne(FileAsset, { onDelete: "CASCADE", hooks: true });
    FileAsset.belongsTo(File, { onDelete: "CASCADE" });

    Punct.hasMany(Test, { onDelete: "CASCADE", hooks: true });
    Test.belongsTo(Punct);

    Test.hasMany(Question, {
        foreignKey: "testId",
        as: "questions",
        onDelete: "CASCADE",
        hooks: true,
    });

    Question.belongsTo(Test, {
        foreignKey: "testId",
    });

    Test.belongsToMany(Question, {
        through: TestQuestionLink,
        foreignKey: "testId",
        otherKey: "questionId",
        as: "finalQuestions",
        onDelete: "CASCADE",
    });

    Question.belongsToMany(Test, {
        through: TestQuestionLink,
        foreignKey: "questionId",
        otherKey: "testId",
        onDelete: "CASCADE",
    });

    Question.hasMany(Answer, { onDelete: "CASCADE", hooks: true });
    Answer.belongsTo(Question);

    Enrollment.hasMany(TestAttempt, { onDelete: "CASCADE" });
    TestAttempt.belongsTo(Enrollment);

    Test.hasMany(TestAttempt, { onDelete: "CASCADE" });
    TestAttempt.belongsTo(Test);

    TestAttempt.hasMany(TestAttemptAnswer, { onDelete: "CASCADE" });
    TestAttemptAnswer.belongsTo(TestAttempt);

    Question.hasMany(TestAttemptAnswer, { onDelete: "CASCADE" });
    TestAttemptAnswer.belongsTo(Question);

    Chat.belongsTo(User, { foreignKey: "userId" });
    User.hasMany(Chat, { foreignKey: "userId" });

    Chat.hasMany(Message, { foreignKey: "chatId" });
    Message.belongsTo(Chat, { foreignKey: "chatId" });

    Message.hasMany(MessageAttachment);
    MessageAttachment.belongsTo(Message);

    User.belongsToMany(Program, { through: Enrollment });
    Program.belongsToMany(User, { through: Enrollment });

    User.hasMany(UserDocument, {
        foreignKey: "userId",
        as: "documents",
        onDelete: "CASCADE",
    });

    UserDocument.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });

    Enrollment.belongsTo(User);
    User.hasMany(Enrollment);

    Enrollment.belongsTo(Program);
    Program.hasMany(Enrollment);

    Enrollment.hasOne(Certificate, { onDelete: "CASCADE" });
    Certificate.belongsTo(Enrollment);

    Enrollment.hasMany(UserContentProgress, { onDelete: "CASCADE" });
    UserContentProgress.belongsTo(Enrollment);

    User.hasMany(PracticalWork);
    PracticalWork.belongsTo(User);
};