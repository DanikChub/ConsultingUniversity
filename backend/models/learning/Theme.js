const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("theme", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        title: { type: DataTypes.STRING },

        order_index: { type: DataTypes.INTEGER },
    });
};