const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("program", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        title: { type: DataTypes.STRING },
        admin_id: { type: DataTypes.INTEGER },

        number_of_practical_work: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        number_of_test: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        number_of_videos: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        program_type: {
            type: DataTypes.ENUM("ПК", "ПП"),
            allowNull: false,
            defaultValue: "ПК",
        },

        img: { type: DataTypes.STRING },
        price: { type: DataTypes.STRING },
        short_title: { type: DataTypes.STRING },

        status: {
            type: DataTypes.ENUM("draft", "published", "archived"),
            defaultValue: "draft",
            allowNull: false,
        },

        is_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });
};