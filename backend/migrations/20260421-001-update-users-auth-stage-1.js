'use strict';

async function addColumnIfNotExists(queryInterface, tableName, columnName, definition) {
    const table = await queryInterface.describeTable(tableName);

    if (!table[columnName]) {
        await queryInterface.addColumn(tableName, columnName, definition);
    }
}

async function removeColumnIfExists(queryInterface, tableName, columnName) {
    const table = await queryInterface.describeTable(tableName);

    if (table[columnName]) {
        await queryInterface.removeColumn(tableName, columnName);
    }
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await addColumnIfNotExists(queryInterface, 'users', 'login', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await addColumnIfNotExists(queryInterface, 'users', 'temporary_password_hash', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await addColumnIfNotExists(queryInterface, 'users', 'temporary_password_plain', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await addColumnIfNotExists(queryInterface, 'users', 'must_change_password', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.changeColumn('users', 'email', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('users', 'number', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        try {
            await queryInterface.removeConstraint('users', 'users_email_key');
        } catch (e) {
            console.log('Constraint users_email_key not found, skip');
        }

        try {
            await queryInterface.removeConstraint('users', 'users_number_key');
        } catch (e) {
            console.log('Constraint users_number_key not found, skip');
        }

        await queryInterface.sequelize.query(`
            UPDATE users
            SET login = CASE
                WHEN email IS NOT NULL AND TRIM(email) <> '' THEN email
                WHEN number IS NOT NULL AND TRIM(number) <> '' THEN number
                ELSE 'user_' || id::text
            END
            WHERE login IS NULL
        `);

        await queryInterface.sequelize.query(`
            UPDATE users u
            SET login = u.login || '_' || u.id::text
            WHERE EXISTS (
                SELECT 1
                FROM users u2
                WHERE u2.login = u.login
                  AND u2.id <> u.id
            )
        `);

        await queryInterface.changeColumn('users', 'login', {
            type: Sequelize.STRING,
            allowNull: false,
        });

        try {
            await queryInterface.addConstraint('users', {
                fields: ['login'],
                type: 'unique',
                name: 'users_login_key',
            });
        } catch (e) {
            console.log('Constraint users_login_key already exists, skip');
        }
    },

    async down(queryInterface, Sequelize) {
        try {
            await queryInterface.removeConstraint('users', 'users_login_key');
        } catch (e) {
            console.log('Constraint users_login_key not found, skip');
        }

        await removeColumnIfExists(queryInterface, 'users', 'must_change_password');
        await removeColumnIfExists(queryInterface, 'users', 'temporary_password_plain');
        await removeColumnIfExists(queryInterface, 'users', 'temporary_password_hash');
        await removeColumnIfExists(queryInterface, 'users', 'login');

        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        try {
            await queryInterface.addConstraint('users', {
                fields: ['email'],
                type: 'unique',
                name: 'users_email_key',
            });
        } catch (e) {
            console.log('Constraint users_email_key already exists, skip');
        }

        try {
            await queryInterface.addConstraint('users', {
                fields: ['number'],
                type: 'unique',
                name: 'users_number_key',
            });
        } catch (e) {
            console.log('Constraint users_number_key already exists, skip');
        }
    },
};