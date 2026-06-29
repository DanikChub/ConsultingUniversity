const sequelize = require("../../db");
const ApiError = require("../../error/ApiError");

const {
    Program,
    Theme,
    Punct,
    Test,
    User,
    Enrollment,
    File,
    FileAsset,
    Question,
    Answer,
} = require("../../models/models");

function programFullInclude() {
    return [
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
                            include: [
                                {
                                    model: Question,
                                    as: "questions",
                                    include: [Answer],
                                },
                            ],
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
        {
            model: Test,
            as: "test",
            required: false,
            include: [
                {
                    model: Question,
                    as: "finalQuestions",
                    include: [Answer],
                    through: { attributes: ["order_index"] },
                },
            ],
        },
    ];
}

class ProgramQueryService {
    async getAllPrograms() {
        return await Program.findAll({
            attributes: {
                include: [
                    [
                        sequelize.fn("COUNT", sequelize.col("users.id")),
                        "users_quantity",
                    ],
                ],
            },
            include: [
                {
                    model: User,
                    attributes: [],
                    through: {
                        where: { status: "active" },
                        attributes: [],
                    },
                    required: false,
                },
            ],
            group: ["program.id"],
        });
    }

    async getPublishedPrograms() {
        return await Program.findAll({
            where: { status: "published" },
            order: [["id", "DESC"]],
            attributes: [
                "id",
                "title",
                "short_title",
                "price",
                "img",
                [
                    sequelize.fn("COUNT", sequelize.col("users.id")),
                    "users_quantity",
                ],
            ],
            include: [
                {
                    model: User,
                    where: { is_delete: false },
                    attributes: [],
                    through: {
                        where: { status: "active" },
                        attributes: [],
                    },
                    required: false,
                },
            ],
            group: ["program.id"],
        });
    }

    async getDraftPrograms() {
        return await Program.findAll({
            where: { status: "draft" },
            order: [["id", "DESC"]],
        });
    }

    async getProgramFull(programId) {
        try {
            const program = await Program.findOne({
                where: { id: programId },
                include: programFullInclude(),
            });

            if (!program) {
                throw ApiError.notFound("Программа не найдена");
            }

            const usersQuantity = await Enrollment.count({
                where: {
                    programId,
                    status: "active",
                },
                include: [
                    {
                        model: User,
                        where: { is_delete: false },
                        required: true,
                    },
                ],
            });

            return {
                ...program.toJSON(),
                users_quantity: usersQuantity,
            };
        } catch (e) {
            console.error("GET PROGRAM FULL ERROR:");
            console.error(e);
            throw e;
        }
    }

    async getProgramEntityFull(programId) {
        const program = await Program.findOne({
            where: { id: programId },
            include: programFullInclude(),
        });

        if (!program) {
            throw ApiError.notFound("Программа не найдена");
        }

        return program;
    }

    async getProgramForPublish(programId) {
        return await this.getProgramEntityFull(programId);
    }

    async getProgramForClone(programId) {
        return await this.getProgramEntityFull(programId);
    }
}

module.exports = new ProgramQueryService();
module.exports.programFullInclude = programFullInclude;