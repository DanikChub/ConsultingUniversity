const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("file_asset", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        type: {
            type: DataTypes.ENUM("html"),
            allowNull: false,
        },

        content: { type: DataTypes.TEXT },
    });
};