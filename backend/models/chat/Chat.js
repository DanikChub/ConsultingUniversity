const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("chat", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        lastMessageAt: {
            type: DataTypes.DATE,
        },

        status: {
            type: DataTypes.ENUM("open", "closed"),
            defaultValue: "open",
        },

        lastReadUserMessageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        lastReadAdminMessageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });
};