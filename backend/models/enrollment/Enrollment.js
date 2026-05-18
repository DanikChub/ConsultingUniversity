const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("enrollment", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        userId: { type: DataTypes.INTEGER, allowNull: false },

        programId: { type: DataTypes.INTEGER, allowNull: false },

        status: {
            type: DataTypes.ENUM("active", "paused", "completed", "archived"),
            defaultValue: "active",
        },

        progress_percent: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        started_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        completed_at: {
            type: DataTypes.DATE,
        },
    });
};