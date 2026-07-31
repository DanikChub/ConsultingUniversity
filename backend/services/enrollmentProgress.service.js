// services/enrollmentProgress.service.js

const { Op } = require("sequelize");
const {
    Enrollment,
    Program,
    Theme,
    Punct,
    Test,
    File,
    User,
    UserContentProgress,
    Certificate,
    Event,
} = require("../models/models");
const { sendCompletionEmail } = require("./mail.service");

async function generateCertificateNumber(programType) {
    const year = new Date().getFullYear();

    const prefix = programType === "professional_retraining"
        ? `КС/ПП-${year}`
        : `КС/ПК-${year}`;

    const countThisYear = await Certificate.count({
        where: {
            certificate_number: {
                [Op.like]: `${prefix}-%`
            }
        }
    });

    const sequence = String(countThisYear + 1).padStart(4, "0");

    return `${prefix}-${sequence}`;
}

function collectRequiredContent(program) {
    const content = [];

    for (const theme of program.themes || []) {
        for (const file of theme.files || []) {
            content.push({
                contentType: "file",
                contentId: file.id,
            });
        }

        for (const punct of theme.puncts || []) {
            for (const file of punct.files || []) {
                content.push({
                    contentType: "file",
                    contentId: file.id,
                });
            }

            for (const test of punct.tests || []) {
                if (test.status === "published") {
                    content.push({
                        contentType: "test",
                        contentId: test.id,
                    });
                }
            }
        }
    }

    return content;
}

async function recalculateEnrollmentProgress(enrollmentId, options = {}) {
    const transaction = options.transaction;

    const enrollment = await Enrollment.findByPk(enrollmentId, {
        include: [{ model: User }],
        transaction,
    });

    if (!enrollment) return null;

    if (enrollment.status === "archived") {
        return enrollment.progress_percent;
    }

    const program = await Program.findByPk(enrollment.programId, {
        include: [
            {
                model: Theme,
                include: [
                    { model: File },
                    {
                        model: Punct,
                        include: [{ model: File }, { model: Test }],
                    },
                ],
            },
        ],
        transaction,
    });

    if (!program) return null;

    const requiredContent = collectRequiredContent(program);

    const progressItems = await UserContentProgress.findAll({
        where: { enrollmentId },
        transaction,
    });

    const progressMap = new Map();

    for (const item of progressItems) {
        progressMap.set(`${item.contentType}-${item.contentId}`, item);
    }

    const totalCount = requiredContent.length;

    const completedCount = requiredContent.filter(item => {
        const progress = progressMap.get(`${item.contentType}-${item.contentId}`);
        return progress?.status === "completed";
    }).length;

    const percent = totalCount
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

    const wasCompleted = enrollment.status === "completed";

    enrollment.progress_percent = percent;

    if (percent >= 100 && !wasCompleted) {
        enrollment.status = "completed";
        enrollment.completed_at = new Date();

        await enrollment.save({ transaction });

        await Event.create(
            {
                event_text: "Пользователь завершил обучение",
                name: program.title,
                event_id: program.id,
                type: "program",
            },
            { transaction }
        );

        const existingCertificate = await Certificate.findOne({
            where: { enrollmentId: enrollment.id },
            transaction,
        });



        if (!existingCertificate) {
            const fullEnrollment = await Enrollment.findByPk(enrollmentId, {
                include: [Program]
            });

            if (!fullEnrollment) {
                const error = new Error("Enrollment not found");
                error.status = 404;
                throw error;
            }

            if (!fullEnrollment.program) {
                const error = new Error("Program not found for enrollment");
                error.status = 404;
                throw error;
            }

            const program = fullEnrollment.program;

            const certificateNumber = await this.generateCertificateNumber(
                program.program_type
            );

            await Certificate.create(
                {
                    enrollmentId: enrollment.id,
                    certificate_number: certificateNumber,
                    issued_at: new Date(),
                },
                { transaction }
            );
        }

        if (enrollment.user?.email) {
            await sendCompletionEmail(
                enrollment.user.email,
                enrollment.user.name,
                program.title
            );
        }
    } else if (!wasCompleted) {
        enrollment.status = "active";
        enrollment.completed_at = null;

        await enrollment.save({ transaction });
    } else {
        await enrollment.save({ transaction });
    }

    return percent;
}

module.exports = {
    recalculateEnrollmentProgress,
};