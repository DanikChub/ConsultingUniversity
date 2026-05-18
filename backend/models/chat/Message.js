const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("message", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        senderType: {
            type: DataTypes.ENUM("USER", "ADMIN"),
            allowNull: false,
        },

        senderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        readAt: {
            type: DataTypes.DATE,
            defaultValue: null,
        },

        deletedAt: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
    });
};