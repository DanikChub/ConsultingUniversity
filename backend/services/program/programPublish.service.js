const ApiError = require("../../error/ApiError");

const {
    Program,
    Theme,
    Punct,
    File,
    FileAsset,
    Test,
    Event,
} = require("../../models/models");

class ProgramPublishService {
    async getProgramForPublish(programId) {
        const program = await Program.findOne({
            where: { id: programId },
            include: [
                {
                    model: Theme,
                    separate: true,
                    order: [["order_index", "ASC"]],
                    include: [
                        {
                            model: Punct,
                            separate: true,
                            order: [["order_index", "ASC"]],
                            include: [
                                {
                                    model: File,
                                    separate: true,
                                    order: [["order_index", "ASC"]],
                                    include: [FileAsset],
                                },
                                {
                                    model: Test,
                                    separate: true,
                                    order: [["order_index", "ASC"]],
                                },
                            ],
                        },
                        {
                            model: File,
                            separate: true,
                            order: [["order_index", "ASC"]],
                            include: [FileAsset],
                        },
                    ],
                },
            ],
        });

        if (!program) {
            throw ApiError.notFound("Программа не найдена");
        }

        return program;
    }

    validateProgramFields(program) {
        const requiredProgramFields = ["title", "short_title", "img", "price"];

        const fieldNames = {
            title: "Полное название",
            short_title: "Короткое название",
            img: "Изображение",
            price: "Цена",
        };

        for (const field of requiredProgramFields) {
            if (!program[field]) {
                throw ApiError.badRequest(
                    `Программа не может быть опубликована: поле "${fieldNames[field]}" не заполнено`
                );
            }
        }
    }

    validateProgramStructure(program) {
        if (!program.themes || program.themes.length === 0) {
            throw ApiError.badRequest(
                "Программа не может быть опубликована: не создан ни один модуль"
            );
        }

        for (const theme of program.themes) {
            if (!theme.title) {
                throw ApiError.badRequest(
                    `Модуль с номером ${theme.order_index+1} не имеет названия`
                );
            }

            if (!theme.puncts || theme.puncts.length === 0) {
                throw ApiError.badRequest(
                    `Модуль "${theme.title}" не содержит ни одного пункта`
                );
            }

            for (const punct of theme.puncts) {
                if (!punct.title) {
                    throw ApiError.badRequest(
                        `Тема с номером ${punct.order_index+1} в модуле "${theme.title}" не имеет названия`
                    );
                }

                const hasFiles = Array.isArray(punct.files) && punct.files.length > 0;
                const hasTests = Array.isArray(punct.tests) && punct.tests.length > 0;

                if (!hasFiles && !hasTests) {
                    throw ApiError.badRequest(
                        `Тема "${punct.title}" не содержит ни файлов, ни тестов`
                    );
                }
            }
        }
    }

    validatePublishedTests(program) {
        let hasPublishedTest = false;

        for (const theme of program.themes || []) {
            for (const punct of theme.puncts || []) {
                if (punct.tests?.some(test => test.status === "published")) {
                    hasPublishedTest = true;
                    break;
                }
            }

            if (hasPublishedTest) break;
        }

        if (!hasPublishedTest) {
            throw ApiError.badRequest(
                "Программа не содержит ни одного опубликованного теста"
            );
        }
    }

    validateBeforePublish(program) {
        this.validateProgramFields(program);
        this.validateProgramStructure(program);
        this.validatePublishedTests(program);
    }

    async publishProgram(programId) {
        const program = await this.getProgramForPublish(programId);

        this.validateBeforePublish(program);

        await Event.create({
            event_text: "Программа опубликована",
            name: program.title,
            event_id: program.id,
            type: "program",
        });

        program.status = "published";
        await program.save();

        return {
            success: true,
            message: "Программа успешно опубликована",
            program,
        };
    }
}

module.exports = new ProgramPublishService();