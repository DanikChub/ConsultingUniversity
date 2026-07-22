const { Op, fn, Sequelize } = require("sequelize");

const ApiError = require("../../error/ApiError");
const {
    User,
    Program,
    UserDocument,
    Enrollment,
} = require("../../models/models");

class UserQueryService {
    mapUserWithPrograms(user, includeCompleted = false) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            organization: user.organization,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            programs: user.programs.map(program => ({
                id: program.id,
                title: program.title,
                short_title: program.short_title,
                progress: program.enrollment
                    ? program.enrollment.progress_percent
                    : null,
                completed_at:
                    includeCompleted && program.enrollment
                        ? program.enrollment.completed_at
                        : undefined,
            })),
        };
    }

    async getUserById(userId, requesterRole) {
        const isAdmin = requesterRole === "ADMIN";

        const programInclude = {
            model: Program,

            ...(!isAdmin && {
                where: {
                    is_delete: false,
                },
            }),

            attributes: [
                "id",
                "title",
                "short_title",
                "price",
                "img",
                "status",
                "is_delete",
            ],

            through: {
                as: "enrollment",
                attributes: [
                    "id",
                    "status",
                    "progress_percent",
                    "started_at",
                    "completed_at",
                    "createdAt",
                    "updatedAt",
                ],
                ...(!isAdmin && {
                    where: {
                        status: {
                            [Op.ne]: "archived",
                        },
                    },
                }),
            },

            required: false,
        };

        const user = await User.findOne({
            where: {
                id: userId,
                is_delete: false,
            },

            attributes: {
                exclude: [
                    "password",
                    "temporary_password_hash",
                    "forgot_pass_code",
                ],
            },

            include: [
                programInclude,
                {
                    model: UserDocument,
                    as: "documents",
                    attributes: [
                        "id",
                        "original_name",
                        "file_name",
                        "file_path",
                        "mime_type",
                        "size",
                        "document_type",
                        "createdAt",
                        "updatedAt",
                    ],
                    required: false,
                    separate: true,
                    order: [["createdAt", "DESC"]],
                },
            ],

            order: [[Program, "id", "DESC"]],
        });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        return user;
    }

    async getAllUsers() {
        return User.findAll({
            where: {
                role: "USER",
                is_delete: false,
            },
        });
    }

    async getAllAdmins() {
        return User.findAll({
            where: {
                role: {
                    [Op.in]: ["ADMIN", "VIEWER"],
                },
                is_delete: false,
            },
        });
    }

    async getAllUsersGraduation() {
        const users = await User.findAndCountAll({
            where: {
                role: "USER",
                is_delete: false,
            },
            include: [
                {
                    model: Program,
                    attributes: ["id", "title", "short_title"],
                    through: {
                        where: { status: "completed" },
                        attributes: ["progress_percent", "completed_at"],
                    },
                    required: true,
                },
            ],
        });

        return users.rows.map(user => this.mapUserWithPrograms(user, true));
    }

    async getAllUsersWithPage({ page = 1, query = {} }) {
        const currentPage = Number(page) || 1;
        const limit = 10;

        const allowedSortFields = [
            "id",
            "name",
            "email",
            "createdAt",
            "updatedAt",
        ];

        const sortType = allowedSortFields.includes(query.sort_type)
            ? query.sort_type
            : "id";

        const sortDirection =
            query.sort_down === "true" || query.sort_down === "DESC"
                ? "DESC"
                : "ASC";

        const users = await User.findAndCountAll({
            offset: (currentPage - 1) * limit,
            limit,
            distinct: true,
            where: {
                role: "USER",
                is_delete: false,
            },
            order: [[sortType, sortDirection]],
            include: [
                {
                    model: Program,
                    attributes: ["id", "title", "short_title"],
                    through: {
                        where: { status: "active" },
                        attributes: ["progress_percent"],
                    },
                    required: false,
                },
            ],
        });

        const result = users.rows.map(user => this.mapUserWithPrograms(user));

        return {
            count: users.count,
            page: currentPage,
            totalPages: Math.ceil(users.count / limit),
            rows: result,
        };
    }

    async getAdminUsersList(params = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            deleted = "active", // active | deleted | all
            hasProgram = "all", // all | yes | no
            programId,
            enrollmentStatus = "all", // all | active | completed | archived | paused
            createdFrom,
            createdTo,
            completedFrom,
            completedTo,
            sortField = "createdAt",
            sortDirection = "DESC",
        } = params;

        const currentPage = Number(page) || 1;
        const perPage = Number(limit) || 10;

        const userWhere = {
            role: "USER",
        };

        if (deleted === "active") {
            userWhere.is_delete = false;
        }

        if (deleted === "deleted") {
            userWhere.is_delete = true;
        }

        if (search) {
            const q = String(search).toLowerCase();

            userWhere[Op.or] = [
                Sequelize.where(fn("LOWER", Sequelize.col("user.name")), {
                    [Op.like]: `%${q}%`,
                }),
                Sequelize.where(fn("LOWER", Sequelize.col("user.email")), {
                    [Op.like]: `%${q}%`,
                }),
                Sequelize.where(fn("LOWER", Sequelize.col("user.number")), {
                    [Op.like]: `%${q}%`,
                }),
                Sequelize.where(fn("LOWER", Sequelize.col("user.organization")), {
                    [Op.like]: `%${q}%`,
                }),
                Sequelize.where(fn("LOWER", Sequelize.col("user.login")), {
                    [Op.like]: `%${q}%`,
                }),
            ];
        }

        if (createdFrom || createdTo) {
            userWhere.createdAt = {};

            if (createdFrom) {
                userWhere.createdAt[Op.gte] = new Date(createdFrom);
            }

            if (createdTo) {
                const to = new Date(createdTo);
                to.setHours(23, 59, 59, 999);
                userWhere.createdAt[Op.lte] = to;
            }
        }

        const enrollmentWhere = {
            status: {
                [Op.ne]: "archived",
            },
        };

        if (programId) {
            enrollmentWhere.programId = Number(programId);
        }

        if (
            enrollmentStatus !== "all" &&
            enrollmentStatus !== "archived"
        ) {
            enrollmentWhere.status = enrollmentStatus;
        }

        if (completedFrom || completedTo) {
            enrollmentWhere.completed_at = {};

            if (completedFrom) {
                enrollmentWhere.completed_at[Op.gte] = new Date(completedFrom);
            }

            if (completedTo) {
                const to = new Date(completedTo);
                to.setHours(23, 59, 59, 999);
                enrollmentWhere.completed_at[Op.lte] = to;
            }
        }

        const includePrograms = {
            model: Program,
            attributes: ["id", "title", "short_title", "img"],
            through: {
                model: Enrollment,
                attributes: [
                    "id",
                    "status",
                    "progress_percent",
                    "started_at",
                    "completed_at",
                ],
                where: Object.keys(enrollmentWhere).length
                    ? enrollmentWhere
                    : undefined,
            },
            required:
                hasProgram === "yes" ||
                Boolean(programId) ||
                enrollmentStatus !== "all" ||
                Boolean(completedFrom) ||
                Boolean(completedTo),
        };

        const allowedSortFields = [
            "id",
            "name",
            "email",
            "number",
            "organization",
            "createdAt",
            "updatedAt",
        ];

        const safeSortField = allowedSortFields.includes(sortField)
            ? sortField
            : "createdAt";

        const safeSortDirection = sortDirection === "ASC" ? "ASC" : "DESC";

        const result = await User.findAndCountAll({
            where: userWhere,
            offset: (currentPage - 1) * perPage,
            limit: perPage,
            distinct: true,
            order: [[safeSortField, safeSortDirection]],
            include: [includePrograms],
        });

        let rows = result.rows.map(user => {
            const json = user.toJSON();
            const programs = json.programs || [];

            return {
                id: json.id,
                login: json.login,
                name: json.name,
                email: json.email,
                number: json.number,
                organization: json.organization,
                role: json.role,
                img: json.img,
                is_delete: json.is_delete,
                is_blocked: json.is_blocked,
                must_change_password: json.must_change_password,
                temporary_password_plain: json.temporary_password_plain,
                createdAt: json.createdAt,
                updatedAt: json.updatedAt,
                programs: programs.map(program => ({
                    id: program.id,
                    title: program.title,
                    short_title: program.short_title,
                    img: program.img,
                    enrollment: program.enrollment,
                    progress: program.enrollment?.progress_percent ?? null,
                })),
            };
        });

        if (hasProgram === "no") {
            rows = rows.filter(user => user.programs.length === 0);
        }

        return {
            count: hasProgram === "no" ? rows.length : result.count,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(
                (hasProgram === "no" ? rows.length : result.count) / perPage
            ),
            rows,
        };
    }

    async searchUsers({ page = 1, q = "" }) {
        const currentPage = parseInt(page) || 1;
        const limit = 10;
        const search = String(q || "").toLowerCase();

        const users = await User.findAndCountAll({
            offset: (currentPage - 1) * limit,
            limit,
            where: {
                role: "USER",
                is_delete: false,
                [Op.or]: [
                    Sequelize.where(fn("LOWER", Sequelize.col("name")), {
                        [Op.like]: `%${search}%`,
                    }),
                    Sequelize.where(
                        fn("LOWER", Sequelize.col("organization")),
                        {
                            [Op.like]: `%${search}%`,
                        }
                    ),
                ],
            },
            include: [
                {
                    model: Program,
                    attributes: ["id", "title", "short_title"],
                    through: {
                        where: { status: "active" },
                        attributes: ["progress_percent"],
                    },
                    required: true,
                },
            ],
        });

        const result = users.rows.map(user => this.mapUserWithPrograms(user));

        return {
            count: users.count,
            page: currentPage,
            totalPages: Math.ceil(users.count / limit),
            rows: result,
        };
    }
}

module.exports = new UserQueryService();