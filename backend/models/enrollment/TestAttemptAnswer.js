const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("test_attempt_answer", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        selected_answers: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
        },

        text_answer: {
            type: DataTypes.TEXT,
        },

        is_correct: {
            type: DataTypes.BOOLEAN,
        },
    });
};