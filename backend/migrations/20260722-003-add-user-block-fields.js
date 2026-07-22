"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "is_blocked", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.addColumn("users", "blocked_until", {
            type: Sequelize.DATE,
            allowNull: true,
        });

        await queryInterface.addColumn("users", "block_reason", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("users", "block_reason");
        await queryInterface.removeColumn("users", "blocked_until");
        await queryInterface.removeColumn("users", "is_blocked");
    },
};