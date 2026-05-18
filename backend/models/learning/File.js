const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("file", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        original_name: { type: DataTypes.STRING, allowNull: false },

        stored_name: { type: DataTypes.STRING, allowNull: true },

        mime_type: { type: DataTypes.STRING, allowNull: true },

        type: {
            type: DataTypes.ENUM("docx", "pdf", "audio", "video"),
        },

        size: { type: DataTypes.INTEGER },

        url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        order_index: { type: DataTypes.INTEGER },

        status: {
            type: DataTypes.ENUM("uploading", "idle", "error"),
            defaultValue: "uploading",
        },

        storage: {
            type: DataTypes.ENUM("local", "s3", "vimeo"),
            defaultValue: "local",
        },
    });
};