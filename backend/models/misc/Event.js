const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("event", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        organization: { type: DataTypes.STRING },

        name: { type: DataTypes.STRING },

        event_text: { type: DataTypes.STRING },

        type: {
            type: DataTypes.ENUM("program", "user", "admin"),
        },

        event_id: { type: DataTypes.INTEGER },
    });
};