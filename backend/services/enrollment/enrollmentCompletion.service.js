const { Op } = require("sequelize");

const sequelize = require("../../db");
const {
    Program,
    Theme,
    Punct,
    File,
    Test,
    User,
    UserContentProgress,
    Enrollment,
    Certificate,
    Event,
} = require("../../models/models");

const { sendCompletionEmail } = require("../mail.service");

class EnrollmentCompletionService {
    async generateCertificateNumber(transaction) {
        const year = new Date().getFullYear();

        const countThisYear = await Certificate.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(`${year}-01-01`),
                    [Op.lt]: new Date(`${year + 1}-01-01`),
                },
            },
            transaction,
        });

        const sequence = String(countThisYear + 1).padStart(6, "0");

        return `DP-${year}-${sequence}`;
    }

    calculateProgramProgress(program, userProgressMap, enrollmentId) {
        const byContent = {};
        let totalCount = 0;
        let completedCount = 0;

        program.themes.forEach(theme => {
            theme.puncts.forEach(punct => {
                punct.tests.forEach(test => {
                    const key = `test-${test.id}`;

                    const progress = userProgressMap[key] || {
                        id: 0,
                        enrollmentId,
                        contentType: "test",
                        contentId: test.id,
                        status: "not_started",
                    };

                    byContent[key] = progress;
                    totalCount++;

                    if (progress.status === "completed") {
                        completedCount++;
                    }
                });
            });
        });

        const percent = totalCount
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

        return {
            byContent,
            percent,
            totalCount,
            completedCount,
        };
    }

    async recalculateAndComplete(enrollmentId) {
        let completionEmailPayload = null;

        const result = await sequelize.transaction(async transaction => {
            const enrollment = await Enrollment.findByPk(enrollmentId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
                include: [
                    {
                        model: User,
                        attributes: ["id", "name", "email", "organization"],
                    },
                ],
            });

            if (!enrollment) {
                return null;
            }

            const userProgressItems = await UserContentProgress.findAll({
                where: { enrollmentId },
                raw: true,
                transaction,
            });

            const program = await Program.findOne({
                where: { id: enrollment.programId },
                transaction,
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
            });

            if (!program) {
                return null;
            }

            const userProgressMap = {};

            userProgressItems.forEach(item => {
                const key = `${item.contentType}-${item.contentId}`;
                userProgressMap[key] = item;
            });

            const { percent, totalCount, completedCount } =
                this.calculateProgramProgress(
                    program,
                    userProgressMap,
                    enrollment.id
                );

            const wasCompleted = enrollment.status === "completed";

            enrollment.progress_percent = percent;

            if (percent === 100 && !wasCompleted) {
                enrollment.status = "completed";
                enrollment.completed_at = new Date();

                await enrollment.save({ transaction });

                const [certificate, created] = await this.findOrCreateCertificate({
                    enrollment,
                    transaction,
                });

                await Event.create(
                    {
                        event_text: "Пользователь завершил обучение",
                        name: program.title,
                        event_id: program.id,
                        type: "program",
                        organization: enrollment.user?.organization,
                    },
                    { transaction }
                );

                completionEmailPayload = {
                    email: enrollment.user?.email,
                    name: enrollment.user?.name,
                    programTitle: program.title,
                    certificateNumber: certificate.certificate_number,
                    certificateCreated: created,
                };

                return {
                    completedNow: true,
                    percent,
                    totalCount,
                    completedCount,
                    enrollment,
                    certificate,
                };
            }

            if (percent < 100 && enrollment.status !== "completed") {
                enrollment.status = "active";
            }

            await enrollment.save({ transaction });

            return {
                completedNow: false,
                percent,
                totalCount,
                completedCount,
                enrollment,
                certificate: null,
            };
        });

        if (completionEmailPayload?.email) {
            try {
                await sendCompletionEmail(
                    completionEmailPayload.email,
                    completionEmailPayload.name || "Слушатель",
                    completionEmailPayload.programTitle
                );
            } catch (e) {
                console.error("Completion email send failed:", e);
            }
        }

        return result;
    }

    async findOrCreateCertificate({ enrollment, transaction }) {
        const existing = await Certificate.findOne({
            where: { enrollmentId: enrollment.id },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (existing) {
            return [existing, false];
        }

        const certificateNumber = await this.generateCertificateNumber(transaction);

        const certificate = await Certificate.create(
            {
                enrollmentId: enrollment.id,
                certificate_number: certificateNumber,
                status: "pending_contact",
                issued_at: new Date(),
            },
            { transaction }
        );

        return [certificate, true];
    }

    async completeEnrollment(enrollmentId) {
        try {
            let completionEmailPayload = null;

            const result = await sequelize.transaction(async transaction => {
                console.log(Enrollment)
                const enrollment = await Enrollment.findByPk(enrollmentId, {
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });

                if (!enrollment) {
                    return null;
                }

                const user = await User.findByPk(enrollment.userId, {
                    transaction,
                    attributes: ["id", "name", "email", "organization"],
                });

                const program = await Program.findByPk(enrollment.programId, {
                    transaction,
                    attributes: ["id", "title"],
                });

                const wasCompleted = enrollment.status === "completed";

                enrollment.status = "completed";
                enrollment.progress_percent = 100;
                enrollment.completed_at = enrollment.completed_at || new Date();

                await enrollment.save({ transaction });

                const [certificate, created] = await this.findOrCreateCertificate({
                    enrollment,
                    transaction,
                });

                if (!wasCompleted) {
                    await Event.create(
                        {
                            event_text: "Пользователь завершил обучение",
                            name: program?.title || "Программа",
                            event_id: enrollment.programId,
                            type: "program",
                            organization: user?.organization || null,
                        },
                        { transaction }
                    );

                    completionEmailPayload = {
                        email: user?.email,
                        name: user?.name,
                        programTitle: program?.title || "Программа",
                        certificateNumber: certificate.certificate_number,
                        certificateCreated: created,
                    };
                }

                return {
                    message: wasCompleted
                        ? "Обучение уже было завершено"
                        : "Обучение завершено",
                    completedNow: !wasCompleted,
                    enrollment,
                    certificate,
                };
            });

            if (completionEmailPayload?.email) {
                try {
                    await sendCompletionEmail(
                        completionEmailPayload.email,
                        completionEmailPayload.name || "Слушатель",
                        completionEmailPayload.programTitle
                    );
                } catch (e) {
                    console.error("Completion email send failed:", e);
                }
            }

            return result;
        } catch(e) {
            console.log(e)
        }

    }
}

module.exports = new EnrollmentCompletionService();