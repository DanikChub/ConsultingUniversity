"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("programs", "program_type", {
            type: Sequelize.ENUM("ПК", "ПП"),
            allowNull: false,
            defaultValue: "ПК",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("programs", "program_type");

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_programs_program_type";'
        );
    },
};