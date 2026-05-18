const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("answer", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        text: { type: DataTypes.TEXT },

        is_correct: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        order_index: { type: DataTypes.INTEGER },
    });
};