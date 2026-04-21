'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Делаем login обязательным
        await queryInterface.changeColumn('users', 'login', {
            type: Sequelize.STRING,
            allowNull: false,
        });

        // 2. Навешиваем unique index
        await queryInterface.addIndex('users', ['login'], {
            unique: true,
            name: 'users_login_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('users', 'users_login_unique');

        await queryInterface.changeColumn('users', 'login', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};