const ApiError = require("../../error/ApiError");
const { Theme, Punct } = require("../../models/models");
const { getNextOrderIndex, moveOrderedItem } = require("../../utils/order");

class ProgramStructureService {
    async getOneTheme(themeId) {
        const theme = await Theme.findByPk(themeId);

        if (!theme) {
            throw ApiError.notFound("Тема не найдена");
        }

        return theme;
    }

    async getOnePunct(punctId) {
        const punct = await Punct.findByPk(punctId);

        if (!punct) {
            throw ApiError.notFound("Пункт не найден");
        }

        return punct;
    }

    async createTheme(programId) {

        if (!programId) {
            throw ApiError.badRequest("programId обязателен");
        }

        const order_index = await getNextOrderIndex(Theme, { programId });

        return await Theme.create({
            programId,
            order_index,
            title: "",
        });
    }

    async updateThemeTitle(themeId, title) {
        if (typeof title !== "string") {
            throw ApiError.badRequest("title обязателен");
        }

        const theme = await Theme.findByPk(themeId);

        if (!theme) {
            throw ApiError.notFound("Тема не найдена");
        }

        theme.title = title;
        await theme.save();

        return {
            id: theme.id,
            title: theme.title,
        };
    }

    async deleteTheme(themeId) {
        const theme = await Theme.findByPk(themeId);

        if (!theme) {
            throw ApiError.notFound("Тема не найдена");
        }

        await theme.destroy();

        return {
            success: true,
            message: "Тема успешно удалена",
        };
    }

    async createPunct(themeId) {
        if (!themeId) {
            throw ApiError.badRequest("themeId обязателен");
        }

        const order_index = await getNextOrderIndex(Punct, { themeId });

        return await Punct.create({
            themeId,
            order_index,
            title: "",
        });
    }

    async updatePunctTitle(punctId, title) {
        if (typeof title !== "string") {
            throw ApiError.badRequest("title обязателен");
        }

        const punct = await Punct.findByPk(punctId);

        if (!punct) {
            throw ApiError.notFound("Пункт не найден");
        }

        punct.title = title;
        await punct.save();

        return {
            id: punct.id,
            title: punct.title,
        };
    }

    async updatePunctDescription(punctId, description) {
        if (typeof description !== "string") {
            throw ApiError.badRequest("description обязателен");
        }

        const punct = await Punct.findByPk(punctId);

        if (!punct) {
            throw ApiError.notFound("Пункт не найден");
        }

        punct.description = description;
        await punct.save();

        return {
            id: punct.id,
            description: punct.description,
        };
    }

    async deletePunct(punctId) {
        const punct = await Punct.findByPk(punctId);

        if (!punct) {
            throw ApiError.notFound("Пункт не найден");
        }

        await punct.destroy();

        return {
            success: true,
            message: "Пункт успешно удалён",
        };
    }

    async movePunct({ punctId, themeId, newIndex }) {
        if (!punctId || newIndex === undefined || !themeId) {
            throw ApiError.badRequest("punctId, themeId и newIndex обязательны");
        }

        return await moveOrderedItem({
            Model: Punct,
            itemId: punctId,
            parentWhere: { themeId },
            newIndex,
        });
    }
}

module.exports = new ProgramStructureService();