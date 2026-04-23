'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Добавляем новые колонки
        await queryInterface.addColumn('users', 'login', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('users', 'temporary_password_hash', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('users', 'temporary_password_plain', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('users', 'must_change_password', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        // 2. Ослабляем старые поля
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

        // 3. Убираем unique с email и number
        // В PostgreSQL constraint часто называется users_email_key / users_number_key
        // Если у тебя имена другие — их нужно поправить.
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

        // 4. Заполняем login старым пользователям
        // Логика:
        // - если есть email -> login = email
        // - иначе если есть number -> login = number
        // - иначе -> user_<id>
        await queryInterface.sequelize.query(`
      UPDATE users
      SET login = CASE
        WHEN email IS NOT NULL AND TRIM(email) <> '' THEN email
        WHEN number IS NOT NULL AND TRIM(number) <> '' THEN number
        ELSE 'user_' || id::text
      END
      WHERE login IS NULL
    `);

        // 5. На всякий случай: если вдруг есть дубли login,
        // делаем их уникальными добавлением _id
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
    },

    async down(queryInterface, Sequelize) {
        // Возвращаем old state максимально близко

        // 1. Удаляем новые колонки
        await queryInterface.removeColumn('users', 'must_change_password');
        await queryInterface.removeColumn('users', 'temporary_password_plain');
        await queryInterface.removeColumn('users', 'temporary_password_hash');
        await queryInterface.removeColumn('users', 'login');

        // 2. Возвращаем password в old state
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.ST
            allowNull: true, // оставил true, потому что насильно обратно делать false может упасть
        });

        // 3. Возвращаем unique constraints
        await queryInterface.addConstraint('users', {
            fields: ['email'],
            type: 'unique',
            name: 'users_email_key',
        });

        await queryInterface.addConstraint('users', {
            fields: ['number'],
            type: 'unique',
            name: 'users_number_key',
        });
    },
};