import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import RHFPhoneInput from "../../../../shared/ui/form/RHFPhoneInput";
import RHFTextInput from "../../../../shared/ui/form/RHFTextInput";
import RHFPasswordInput from "../../../../shared/ui/form/RHFPasswordInput";

type BaseUserFieldsProps = {
    isEdit: boolean;
};

const normalizeLogin = (value: string) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "")
        .replace(/^\.+/, "")
        .slice(0, 50);
};

const normalizeName = (value: string) => {
    let next = value.replace(/[^А-Яа-яЁёA-Za-z\s]/g, "");
    next = next.replace(/\s+/g, " ");
    next = next.replace(/^\s/, "");

    const words = next.split(" ").filter(Boolean);
    if (words.length > 3) {
        return words.slice(0, 3).join(" ");
    }

    return next;
};

const generateTemporaryPassword = () => {
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

    let password = "";

    for (let i = 0; i < 10; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    return password;
};

const BaseUserFields: React.FC<BaseUserFieldsProps> = ({ isEdit }) => {
    const { setValue, getValues } = useFormContext();

    useEffect(() => {
        if (isEdit) return;

        const currentPassword = getValues("password");

        if (!currentPassword) {
            setValue("password", generateTemporaryPassword(), {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [isEdit, getValues, setValue]);

    const regeneratePassword = () => {
        setValue("password", generateTemporaryPassword(), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <>
            <RHFTextInput
                name="login"
                label="Логин"
                placeholder="Введите логин"
                transform={normalizeLogin}
                required
            />

            <RHFTextInput
                name="name"
                label="ФИО"
                placeholder="Введите Фамилию Имя Отчество"
                transform={normalizeName}
                required
            />

            <RHFTextInput
                name="email"
                label="Email"
                placeholder="Введите email"
                required
            />

            <RHFPasswordInput
                name="password"
                label={isEdit ? "Новый временный пароль" : "Временный пароль"}
                placeholder={
                    isEdit
                        ? "Оставьте пустым, если не менять"
                        : "Введите временный пароль"
                }
                isEdit={isEdit}
            />

            <RHFPhoneInput
                name="number"
                label="Телефон"
            />
        </>
    );
};

export default BaseUserFields;