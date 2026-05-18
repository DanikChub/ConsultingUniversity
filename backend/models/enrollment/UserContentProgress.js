const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("user_content_progress", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        enrollmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        contentType: {
            type: DataTypes.ENUM("file", "test"),
            allowNull: false,
        },

        contentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "not_started",
                "in_progress",
                "completed",
                "failed"
            ),
            defaultValue: "not_started",
        },

        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        completedAt: {
            type: DataTypes.DATE,
        },
    });
};