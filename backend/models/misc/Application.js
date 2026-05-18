const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("application", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },

        number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};