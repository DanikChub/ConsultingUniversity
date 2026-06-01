const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { sendCompletionEmail } = require("../services/mail.service");
const createEnrollmentProgressService = require("../services/enrollment/enrollmentProgress.service");
const STATIC_DIR = path.resolve(__dirname, "..", "static");

if (!fs.existsSync(STATIC_DIR)) {
    fs.mkdirSync(STATIC_DIR, { recursive: true });
}

module.exports = (models) => {
    const enrollmentProgressService = createEnrollmentProgressService(models);

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
    } = models;



    async function reorderAfterDelete(Model, parentId, parentKey, deletedIndex) {
        if (!parentId || deletedIndex === undefined) return;

        await Model.decrement("order_index", {
            by: 1,
            where: {
                [parentKey]: parentId,
                order_index: { [Op.gt]: deletedIndex },
            },
        });
    }

    async function updateProgramStatusToDraft(programId) {
        const program = await Program.findByPk(programId);
        if (!program) return;

        if (program.status === "published") {
            program.status = "draft";
            await program.save();
        }
    }

    async function getProgramIdFromPunctId(punctId) {
        if (!punctId) return null;

        const punct = await Punct.findByPk(punctId);
        if (!punct) return null;

        const theme = await Theme.findByPk(punct.themeId);
        if (!theme) return null;

        return theme.programId;
    }

    async function getProgramIdFromThemeId(themeId) {
        if (!themeId) return null;

        const theme = await Theme.findByPk(themeId);
        return theme?.programId || null;
    }

    async function getProgramIdFromFile(file) {
        if (file.punctId) {
            return getProgramIdFromPunctId(file.punctId);
        }

        if (file.themeId) {
            const theme = await Theme.findByPk(file.themeId);
            return theme?.programId || null;
        }

        return null;
    }

    async function getProgramIdFromTest(test) {
        if (test.programId) {
            return test.programId;
        }

        if (test.punctId) {
            return getProgramIdFromPunctId(test.punctId);
        }

        return null;
    }

    Program.addHook("beforeDestroy", async (program) => {
        try {
            if (program.img) {
                const fullPath = path.join(STATIC_DIR, program.img);

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
        } catch (err) {
            console.warn("Failed to delete program image:", err.message || err);
        }
    });

    Theme.addHook("afterDestroy", async (theme) => {
        await reorderAfterDelete(
            Theme,
            theme.programId,
            "programId",
            theme.order_index
        );
    });

    Punct.addHook("afterDestroy", async (punct) => {
        await reorderAfterDelete(
            Punct,
            punct.themeId,
            "themeId",
            punct.order_index
        );
    });

    File.addHook("beforeDestroy", async (file) => {
        try {
            if (file.stored_name) {
                const fullPath = path.join(STATIC_DIR, file.stored_name);

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log("🗑 Deleted file from disk:", fullPath);
                }
            }
        } catch (err) {
            console.warn("Failed to delete file:", err.message || err);
        }
    });

    File.addHook("afterDestroy", async (file) => {
        const parentId = file.punctId || file.themeId;
        const parentKey = file.punctId ? "punctId" : "themeId";

        await reorderAfterDelete(File, parentId, parentKey, file.order_index);
    });

    UserContentProgress.addHook("afterSave", async (progress) => {
        await enrollmentProgressService.recalculateEnrollmentProgress(
            progress.enrollmentId
        );
    });

    Theme.addHook("afterCreate", async (theme) => {
        if (theme.programId) {
            await updateProgramStatusToDraft(theme.programId);
        }
    });

    Theme.addHook("afterSave", async (theme) => {
        if (theme.programId) {
            await updateProgramStatusToDraft(theme.programId);
        }
    });

    Theme.addHook("afterDestroy", async (theme) => {
        if (theme.programId) {
            await updateProgramStatusToDraft(theme.programId);
        }
    });

    Punct.addHook("afterCreate", async (punct) => {
        const programId = await getProgramIdFromThemeId(punct.themeId);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    Punct.addHook("afterSave", async (punct) => {
        const programId = await getProgramIdFromThemeId(punct.themeId);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    Punct.addHook("afterDestroy", async (punct) => {
        const programId = await getProgramIdFromThemeId(punct.themeId);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    File.addHook("afterCreate", async (file) => {
        const programId = await getProgramIdFromFile(file);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    File.addHook("afterSave", async (file) => {
        const programId = await getProgramIdFromFile(file);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    File.addHook("afterDestroy", async (file) => {
        const programId = await getProgramIdFromFile(file);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    Test.addHook("afterCreate", async (test) => {
        const programId = await getProgramIdFromTest(test);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    Test.addHook("afterSave", async (test) => {
        const programId = await getProgramIdFromTest(test);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });

    Test.addHook("afterDestroy", async (test) => {
        const programId = await getProgramIdFromTest(test);

        if (programId) {
            await updateProgramStatusToDraft(programId);
        }
    });
};