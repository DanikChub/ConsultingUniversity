const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("test", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        title: { type: DataTypes.STRING },

        description: { type: DataTypes.TEXT },

        final_test: { type: DataTypes.BOOLEAN },

        time_limit: { type: DataTypes.INTEGER },

        status: {
            type: DataTypes.ENUM("draft", "published", "archived"),
            defaultValue: "draft",
            allowNull: false,
        },

        order_index: { type: DataTypes.INTEGER },

        programId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        punctId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });
};