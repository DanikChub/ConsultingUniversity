const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("certificate", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        certificate_number: {
            type: DataTypes.STRING,
            unique: true,
        },

        status: {
            type: DataTypes.ENUM(
                "waiting_issue_date",
                "pending_contact",
                "contacted",
                "waiting_delivery",
                "shipped",
                "picked_up",
                "delivered"
            ),
            defaultValue: "pending_contact",
        },

        delivery_type: {
            type: DataTypes.ENUM("post", "pickup"),
            allowNull: true,
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        tracking_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        issued_at: {
            type: DataTypes.DATE,
        },
    });
};