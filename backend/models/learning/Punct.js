const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("punct", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        title: { type: DataTypes.STRING },

        description: { type: DataTypes.TEXT },

        order_index: { type: DataTypes.INTEGER },
    });
};