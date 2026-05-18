const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("test_attempt", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        attempt_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        score: {
            type: DataTypes.INTEGER,
        },

        correct_answers: {
            type: DataTypes.INTEGER,
        },

        total_questions: {
            type: DataTypes.INTEGER,
        },

        passed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        started_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        finished_at: {
            type: DataTypes.DATE,
        },
    });
};