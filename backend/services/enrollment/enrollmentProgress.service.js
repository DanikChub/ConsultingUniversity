const { Op } = require("sequelize");
const { sendCompletionEmail } = require("../mail.service");

module.exports = (models) => {
    const {
        Program,
        Theme,
        Punct,
        File,
        Test,
        UserContentProgress,
        Enrollment,
        Certificate,
        Event,
        User,
    } = models;

    async function generateCertificateNumber() {
        const year = new Date().getFullYear();

        const countThisYear = await Certificate.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(`${year}-01-01`),
                    [Op.lt]: new Date(`${year + 1}-01-01`),
                },
            },
        });

        const sequence = String(countThisYear + 1).padStart(6, "0");
        return `DP-${year}-${sequence}`;
    }

    async function ensureCertificate(enrollmentId) {
        const existing = await Certificate.findOne({
            where: { enrollmentId },
        });

        if (existing) return existing;

        const number = await generateCertificateNumber();

        return Certificate.create({
            enrollmentId,
            certificate_number: number,
            status: "pending_contact",
            issued_at: new Date(),
        });
    }

    function calculateProgramProgress(program, userProgressMap, enrollmentId) {
        let totalCount = 0;
        let completedCount = 0;

        program.themes.forEach(theme => {
            theme.puncts.forEach(punct => {
                punct.tests.forEach(test => {
                    const key = `test-${test.id}`;

                    const progress = userProgressMap[key] || {
                        enrollmentId,
                        contentType: "test",
                        contentId: test.id,
                        status: "not_started",
                    };

                    totalCount++;

                    if (progress.status === "completed") {
                        completedCount++;
                    }
                });
            });
        });

        return totalCount
            ? Math.round((completedCount / totalCount) * 100)
            : 0;
    }

    async function recalculateEnrollmentProgress(enrollmentId) {
        const enrollment = await Enrollment.findByPk(enrollmentId);

        if (!enrollment) return null;

        const userProgressItems = await UserContentProgress.findAll({
            where: { enrollmentId },
            raw: true,
        });

        const program = await Program.findOne({
            where: { id: enrollment.programId },
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

        if (!program) return null;

        const userProgressMap = {};

        userProgressItems.forEach(item => {
            const key = `${item.contentType}-${item.contentId}`;
            userProgressMap[key] = item;
        });

        const percent = calculateProgramProgress(
            program,
            userProgressMap,
            enrollment.id
        );

        const wasCompleted = enrollment.status === "completed";

        enrollment.progress_percent = percent;

        if (percent === 100 && !wasCompleted) {
            enrollment.status = "completed";
            enrollment.completed_at = new Date();

            await enrollment.save();

            await ensureCertificate(enrollment.id);

            await Event.create({
                event_text: "Пользователь завершил обучение",
                name: program.title,
                event_id: program.id,
                type: "program",
            });

            const user = await User.findByPk(enrollment.userId);

            if (user?.email) {
                try {
                    await sendCompletionEmail(
                        user.email,
                        user.name || "Слушатель",
                        program.title
                    );
                } catch (e) {
                    console.error("Completion email send failed:", e);
                }
            }

            return {
                completedNow: true,
                percent,
                enrollment,
            };
        }

        if (percent < 100 && enrollment.status !== "completed") {
            enrollment.status = "active";
        }

        await enrollment.save();

        return {
            completedNow: false,
            percent,
            enrollment,
        };
    }

    return {
        recalculateEnrollmentProgress,
    };
};