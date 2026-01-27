const reorder = require('../utils/reorder');

module.exports = (sequelize, DataTypes) => {
    const Punct = sequelize.define('punct', {
        title: DataTypes.STRING,
        order_index: DataTypes.INTEGER
    });

    Punct.addHook('afterDestroy', async (punct) => {
        await reorder(Punct, punct.themeId, 'themeId', punct.order_index);
    });

    return Punct;
};
