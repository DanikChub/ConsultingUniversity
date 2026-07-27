"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "additional_number", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("users", "note", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("users", "note");
        await queryInterface.removeColumn("users", "additional_number");
    },
};