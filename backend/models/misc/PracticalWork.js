const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("practical_work", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        task: { type: DataTypes.TEXT },

        task_theme: { type: DataTypes.STRING },

        practic_title: { type: DataTypes.STRING },

        test: { type: DataTypes.BOOLEAN },

        file_src: { type: DataTypes.STRING },

        answer: { type: DataTypes.STRING },

        users_id: { type: DataTypes.INTEGER },

        user_name: { type: DataTypes.STRING },

        program_id: { type: DataTypes.INTEGER },

        theme_id: { type: DataTypes.INTEGER },

        theme_statistic_id: { type: DataTypes.INTEGER },

        punct_id: { type: DataTypes.INTEGER },
    });
};