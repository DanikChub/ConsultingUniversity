import React from 'react';
import RHFPhoneInput from '../../../../shared/ui/form/RHFPhoneInput';
import RHFSelect from '../../../../shared/ui/form/RHFSelect';
import RHFTextInput from '../../../../shared/ui/form/RHFTextInput';
import RHFTextarea from '../../../../shared/ui/form/RHFTextarea';

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

type AdminFieldsProps = {
    isEdit: boolean;
};

const AdminFields: React.FC<AdminFieldsProps> = ({ isEdit }) => {
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
                label={isEdit ? 'Новый пароль' : 'Пароль'}
                placeholder={isEdit ? 'Оставьте пустым, если не менять' : 'Введите пароль'}
                type="text"
            />

            <RHFPhoneInput
                name="number"
                label="Телефон"
            />

            <RHFSelect
                name="role"
                label="Роль"
                options={[
                    { label: 'Администратор', value: 'ADMIN' },
                    { label: 'Наблюдатель', value: 'VIEWER' },
                ]}
            />

            <RHFTextInput
                name="admin_signature"
                label="Подпись"
                placeholder="Введите подпись администратора"
                rows={3}
            />
        </>
    );
};

export default AdminFields;