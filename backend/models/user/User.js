const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("user", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        login: { type: DataTypes.STRING, unique: true, allowNull: false },

        email: { type: DataTypes.STRING, allowNull: true },
        number: { type: DataTypes.STRING },

        name: { type: DataTypes.STRING, allowNull: false },

        password: { type: DataTypes.STRING, allowNull: true },

        temporary_password_hash: { type: DataTypes.STRING, allowNull: true },
        temporary_password_plain: { type: DataTypes.STRING, allowNull: true },

        must_change_password: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        role: { type: DataTypes.STRING, defaultValue: "USER" },

        diplom: { type: DataTypes.BOOLEAN },
        address: { type: DataTypes.STRING },
        organization: { type: DataTypes.STRING },
        inn: { type: DataTypes.STRING },

        img: { type: DataTypes.STRING },

        graduation_date: { type: DataTypes.DATE },

        password_reset_token: { type: DataTypes.STRING },
        password_reset_expires: { type: DataTypes.DATE },

        last_login_at: { type: DataTypes.DATE },

        passport: { type: DataTypes.TEXT, allowNull: true },
        education_document: { type: DataTypes.TEXT, allowNull: true },
        snils: { type: DataTypes.STRING, allowNull: true },

        admin_signature: { type: DataTypes.STRING, allowNull: true },

        is_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });
};