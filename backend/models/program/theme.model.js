const reorder = require('../utils/reorder');

module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define('theme', {
        title: DataTypes.STRING,
        order_index: DataTypes.INTEGER
    });

    Theme.addHook('afterDestroy', async (theme) => {
        await reorder(Theme, theme.programId, 'programId', theme.order_index);
    });

    return Theme;
};
