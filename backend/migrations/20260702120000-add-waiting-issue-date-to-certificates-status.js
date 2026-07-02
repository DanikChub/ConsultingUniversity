"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
            ALTER TYPE "enum_certificates_status"
            ADD VALUE IF NOT EXISTS 'waiting_issue_date'
            BEFORE 'pending_contact';
        `);
    },

    async down() {
        // PostgreSQL не поддерживает удаление значения из ENUM.
        // Откат вручную через пересоздание типа при необходимости.
    },
};