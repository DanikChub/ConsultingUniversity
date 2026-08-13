"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("users");

        if (!columns.is_blocked) {
            await queryInterface.addColumn("users", "is_blocked", {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            });
        }

        if (!columns.blocked_until) {
            await queryInterface.addColumn("users", "blocked_until", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }

        if (!columns.block_reason) {
            await queryInterface.addColumn("users", "block_reason", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("users");

        if (columns.block_reason) {
            await queryInterface.removeColumn("users", "block_reason");
        }

        if (columns.blocked_until) {
            await queryInterface.removeColumn("users", "blocked_until");
        }

        if (columns.is_blocked) {
            await queryInterface.removeColumn("users", "is_blocked");
        }
    },
};