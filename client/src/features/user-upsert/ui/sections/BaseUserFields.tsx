import React from 'react';
import RHFPhoneInput from '../../../../shared/ui/form/RHFPhoneInput';
import RHFTextInput from '../../../../shared/ui/form/RHFTextInput';

type BaseUserFieldsProps = {
    isEdit: boolean;
};

const normalizeLogin = (value: string) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, '')
        .replace(/^\.+/, '')
        .slice(0, 50);
};

const normalizeName = (value: string) => {
    let next = value.replace(/[^А-Яа-яЁёA-Za-z\s]/g, '');
    next = next.replace(/\s+/g, ' ');
    next = next.replace(/^\s/, '');

    const words = next.split(' ').filter(Boolean);
    if (words.length > 3) {
        return words.slice(0, 3).join(' ');
    }

    return next;
};

const BaseUserFields: React.FC<BaseUserFieldsProps> = ({ isEdit }) => {
    return (
        <>
            <RHFTextInput
                name="login"
                label="Логин"
                placeholder="Введите логин"
                transform={normalizeLogin}
            />

            <RHFTextInput
                name="name"
                label="ФИО"
                placeholder="Введите Фамилию Имя Отчество"
                transform={normalizeName}
            />

            <RHFTextInput
                name="email"
                label="Email"
                placeholder="Введите email"
            />

            <RHFTextInput
                name="password"
                label={isEdit ? 'Новый временный пароль' : 'Временный пароль'}
                placeholder={isEdit ? 'Оставьте пустым, если не менять' : 'Введите временный пароль'}
                type="text"
            />

            <RHFPhoneInput
                name="number"
                label="Телефон"
            />
        </>
    );
};

export default BaseUserFields;