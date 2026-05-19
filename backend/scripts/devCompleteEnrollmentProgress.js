require("dotenv").config();

const models = require("../models/models");
const sequelize = require("../db");

const {
    Enrollment,
    Program,
    Theme,
    Punct,
    Test,
    UserContentProgress,
} = models;

async function main() {
    const enrollmentId = Number(process.argv[2]);

    if (!enrollmentId) {
        throw new Error("Передай enrollmentId: node scripts/devCompleteEnrollmentProgress.js 22");
    }

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
        throw new Error("Enrollment не найден");
    }

    const program = await Program.findByPk(enrollment.programId, {
        include: [
            {
                model: Theme,
                include: [
                    {
                        model: Punct,
                        include: [Test],
                    },
                ],
            },
        ],
    });

    if (!program) {
        throw new Error("Program не найдена");
    }

    const tests = [];

    for (const theme of program.themes || []) {
        for (const punct of theme.puncts || []) {
            for (const test of punct.tests || []) {
                tests.push(test);
            }
        }
    }

    console.log(`Найдено тестов: ${tests.length}`);

    for (const test of tests) {
        const [progress] = await UserContentProgress.findOrCreate({
            where: {
                enrollmentId,
                contentType: "test",
                contentId: test.id,
            },
            defaults: {
                enrollmentId,
                contentType: "test",
                contentId: test.id,
                status: "completed",
                score: 100,
                completedAt: new Date(),
            },
        });

        progress.status = "completed";
        progress.score = 100;
        progress.completedAt = new Date();

        await progress.save();

        console.log(`completed test-${test.id}`);
    }

    const updatedEnrollment = await Enrollment.findByPk(enrollmentId);
    console.log("Enrollment:", {
        id: updatedEnrollment.id,
        status: updatedEnrollment.status,
        progress_percent: updatedEnrollment.progress_percent,
        completed_at: updatedEnrollment.completed_at,
    });

    await sequelize.close();
}

main().catch(async e => {
    console.error(e);
    await sequelize.close();
    process.exit(1);
});