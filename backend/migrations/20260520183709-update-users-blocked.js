"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "status", {
            type: Sequelize.ENUM("active", "blocked"),
            allowNull: false,
            defaultValue: "active",
        });

        await queryInterface.addColumn("users", "blocked_until", {
            type: Sequelize.DATE,
            allowNull: true,
        });

        await queryInterface.addColumn("users", "blocked_reason", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("users", "blocked_reason");
        await queryInterface.removeColumn("users", "blocked_until");
        await queryInterface.removeColumn("users", "status");

        // PostgreSQL enum type cleanup
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_users_status";'
        );
    },
};