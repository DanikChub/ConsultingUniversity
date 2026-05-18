const { Op } = require("sequelize");
const sequelize = require("../db");

async function getNextOrderIndex(Model, where) {
    const maxOrder = await Model.max("order_index", { where });
    return Number.isFinite(maxOrder) ? maxOrder + 1 : 0;
}

async function moveOrderedItem({ Model, itemId, parentWhere, newIndex }) {
    const item = await Model.findByPk(itemId);

    if (!item) {
        const err = new Error("Элемент не найден");
        err.status = 404;
        throw err;
    }

    const currentIndex = item.order_index;

    if (currentIndex === newIndex) {
        return { success: true, item };
    }

    if (newIndex > currentIndex) {
        await Model.update(
            { order_index: sequelize.literal("order_index - 1") },
            {
                where: {
                    ...parentWhere,
                    order_index: {
                        [Op.gt]: currentIndex,
                        [Op.lte]: newIndex,
                    },
                },
            }
        );
    } else {
        await Model.update(
            { order_index: sequelize.literal("order_index + 1") },
            {
                where: {
                    ...parentWhere,
                    order_index: {
                        [Op.gte]: newIndex,
                        [Op.lt]: currentIndex,
                    },
                },
            }
        );
    }

    item.order_index = newIndex;
    await item.save();

    return { success: true, item };
}

module.exports = {
    getNextOrderIndex,
    moveOrderedItem,
};