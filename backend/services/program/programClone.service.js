const path = require("path");
const fs = require("fs");

const sequelize = require("../../db");
const ApiError = require("../../error/ApiError");

const {
    Program,
    Theme,
    Punct,
    Test,
    File,
    FileAsset,
    Question,
    Answer,
    Event,
    TestQuestionLink,
} = require("../../models/models");

const { STATIC_DIR, cloneStaticFile } = require("../../utils/fileStorage");
const programQueryService = require("./programQuery.service");

class ProgramCloneService {
    async cloneProgramImage(sourceProgram, copiedFiles = []) {
        if (!sourceProgram.img) return null;
        return await cloneStaticFile(sourceProgram.img, copiedFiles);
    }

    async cloneFileEntity(sourceFile, targetIds, transaction, copiedFiles = []) {
        let newStoredName = null;

        if (sourceFile.storage === "local" && sourceFile.stored_name) {
            newStoredName = await cloneStaticFile(sourceFile.stored_name, copiedFiles);
        }

        const newFile = await File.create(
            {
                original_name: sourceFile.original_name,
                stored_name: newStoredName,
                mime_type: sourceFile.mime_type,
                type: sourceFile.type,
                size: sourceFile.size,
                url: sourceFile.url,
                order_index: sourceFile.order_index,
                status: sourceFile.status || "idle",
                storage: sourceFile.storage || "local",
                themeId: targetIds.themeId || null,
                punctId: targetIds.punctId || null,
            },
            { transaction }
        );

        if (sourceFile.file_asset) {
            await FileAsset.create(
                {
                    fileId: newFile.id,
                    type: sourceFile.file_asset.type,
                    content: sourceFile.file_asset.content,
                },
                { transaction }
            );
        }

        return newFile;
    }

    async clonePunctTest(sourceTest, newPunctId, transaction) {
        const newTest = await Test.create(
            {
                title: sourceTest.title,
                description: sourceTest.description,
                final_test: sourceTest.final_test,
                time_limit: sourceTest.time_limit,
                status: "draft",
                order_index: sourceTest.order_index,
                punctId: newPunctId,
                programId: null,
            },
            { transaction }
        );

        const questions = [...(sourceTest.questions || [])].sort(
            (a, b) => (a.order_index || 0) - (b.order_index || 0)
        );

        for (const sourceQuestion of questions) {
            const newQuestion = await Question.create(
                {
                    text: sourceQuestion.text,
                    type: sourceQuestion.type,
                    order_index: sourceQuestion.order_index,
                    testId: newTest.id,
                },
                { transaction }
            );

            const answers = [...(sourceQuestion.answers || [])].sort(
                (a, b) => (a.order_index || 0) - (b.order_index || 0)
            );

            for (const sourceAnswer of answers) {
                await Answer.create(
                    {
                        text: sourceAnswer.text,
                        is_correct: sourceAnswer.is_correct,
                        order_index: sourceAnswer.order_index,
                        questionId: newQuestion.id,
                    },
                    { transaction }
                );
            }
        }

        return newTest;
    }

    async cloneProgramLevelTest(sourceTest, newProgramId, transaction) {
        const newTest = await Test.create(
            {
                title: sourceTest.title,
                description: sourceTest.description,
                final_test: sourceTest.final_test,
                time_limit: sourceTest.time_limit,
                status: "draft",
                order_index: sourceTest.order_index,
                programId: newProgramId,
                punctId: null,
            },
            { transaction }
        );

        const finalQuestions = [...(sourceTest.finalQuestions || [])].sort((a, b) => {
            const aOrder = a.test_question_link?.order_index ?? a.order_index ?? 0;
            const bOrder = b.test_question_link?.order_index ?? b.order_index ?? 0;
            return aOrder - bOrder;
        });

        for (let i = 0; i < finalQuestions.length; i++) {
            const sourceQuestion = finalQuestions[i];

            const newQuestion = await Question.create(
                {
                    text: sourceQuestion.text,
                    type: sourceQuestion.type,
                    order_index: sourceQuestion.order_index ?? i,
                },
                { transaction }
            );

            const answers = [...(sourceQuestion.answers || [])].sort(
                (a, b) => (a.order_index || 0) - (b.order_index || 0)
            );

            for (const sourceAnswer of answers) {
                await Answer.create(
                    {
                        text: sourceAnswer.text,
                        is_correct: sourceAnswer.is_correct,
                        order_index: sourceAnswer.order_index,
                        questionId: newQuestion.id,
                    },
                    { transaction }
                );
            }

            await TestQuestionLink.create(
                {
                    testId: newTest.id,
                    questionId: newQuestion.id,
                    order_index: sourceQuestion.test_question_link?.order_index ?? i,
                },
                { transaction }
            );
        }

        return newTest;
    }

    async duplicateProgram(programId) {
        const transaction = await sequelize.transaction();
        const copiedFiles = [];

        try {
            const sourceProgram = await programQueryService.getProgramForClone(programId);

            const newImg = await this.cloneProgramImage(sourceProgram, copiedFiles);

            const newProgram = await Program.create(
                {
                    admin_id: sourceProgram.admin_id,
                    title: sourceProgram.title
                        ? `${sourceProgram.title} - копия`
                        : "Новая программа - копия",
                    short_title: sourceProgram.short_title
                        ? `${sourceProgram.short_title} - копия`
                        : null,
                    number_of_practical_work: sourceProgram.number_of_practical_work || 0,
                    number_of_test: sourceProgram.number_of_test || 0,
                    number_of_videos: sourceProgram.number_of_videos || 0,
                    img: newImg,
                    price: sourceProgram.price,
                    status: "draft",
                },
                { transaction }
            );

            for (const sourceTheme of sourceProgram.themes || []) {
                const newTheme = await Theme.create(
                    {
                        title: sourceTheme.title,
                        order_index: sourceTheme.order_index,
                        programId: newProgram.id,
                    },
                    { transaction }
                );

                for (const sourceThemeFile of sourceTheme.files || []) {
                    await this.cloneFileEntity(
                        sourceThemeFile,
                        { themeId: newTheme.id, punctId: null },
                        transaction,
                        copiedFiles
                    );
                }

                for (const sourcePunct of sourceTheme.puncts || []) {
                    const newPunct = await Punct.create(
                        {
                            title: sourcePunct.title,
                            description: sourcePunct.description,
                            order_index: sourcePunct.order_index,
                            themeId: newTheme.id,
                        },
                        { transaction }
                    );

                    for (const sourcePunctFile of sourcePunct.files || []) {
                        await this.cloneFileEntity(
                            sourcePunctFile,
                            { themeId: null, punctId: newPunct.id },
                            transaction,
                            copiedFiles
                        );
                    }

                    for (const sourceTest of sourcePunct.tests || []) {
                        await this.clonePunctTest(sourceTest, newPunct.id, transaction);
                    }
                }
            }

            if (sourceProgram.test) {
                await this.cloneProgramLevelTest(sourceProgram.test, newProgram.id, transaction);
            }

            await Event.create(
                {
                    event_text: "Создана копия программы",
                    name: newProgram.title,
                    event_id: newProgram.id,
                    type: "program",
                },
                { transaction }
            );

            await transaction.commit();

            return await programQueryService.getProgramFull(newProgram.id);
        } catch (e) {
            await transaction.rollback();

            for (const filename of copiedFiles) {
                try {
                    const fullPath = path.join(STATIC_DIR, filename);

                    if (fs.existsSync(fullPath)) {
                        await fs.promises.unlink(fullPath);
                    }
                } catch (cleanupErr) {
                    console.warn("Ошибка очистки скопированного файла:", cleanupErr);
                }
            }

            console.error("duplicateProgram error:", e);
            throw ApiError.internal("Ошибка копирования программы");
        }
    }
}

module.exports = new ProgramCloneService();