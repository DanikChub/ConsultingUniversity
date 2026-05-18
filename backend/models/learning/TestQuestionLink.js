const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "test_question_link",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

            order_index: { type: DataTypes.INTEGER },
        },
        {
            timestamps: false,
        }
    );
};