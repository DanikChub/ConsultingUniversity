const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("question", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        text: { type: DataTypes.TEXT },

        type: {
            type: DataTypes.ENUM("single", "multiple", "text"),
            allowNull: false,
        },

        order_index: { type: DataTypes.INTEGER },
    });
};