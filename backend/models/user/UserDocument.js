const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("user_document", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        userId: { type: DataTypes.INTEGER, allowNull: false },

        original_name: { type: DataTypes.STRING, allowNull: false },
        file_name: { type: DataTypes.STRING, allowNull: false },
        file_path: { type: DataTypes.STRING, allowNull: false },
        mime_type: { type: DataTypes.STRING, allowNull: false },
        size: { type: DataTypes.INTEGER, allowNull: false },

        document_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};