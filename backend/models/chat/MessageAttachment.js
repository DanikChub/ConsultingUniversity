const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("message_attachment", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        messageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        originalName: { type: DataTypes.STRING },

        storedName: { type: DataTypes.STRING },

        mimeType: { type: DataTypes.STRING },

        size: { type: DataTypes.INTEGER },

        storage: {
            type: DataTypes.ENUM("local", "s3"),
            defaultValue: "local",
        },

        url: { type: DataTypes.STRING },
    });
};