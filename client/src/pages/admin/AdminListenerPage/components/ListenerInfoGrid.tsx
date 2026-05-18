import React from "react";
import {
    FiAward,
    FiBookOpen,
    FiCalendar,
    FiCreditCard,
    FiEdit2,
    FiFileText,
    FiMail,
    FiPhone,
} from "react-icons/fi";

import type { User } from "../../../../entities/user/model/type";
import type { EditableListenerField } from "../../../../entities/user/api/user.api";

import { useEditListenerField } from "../../../../features/listener-field-edit/model/useEditListenerField";
import EditListenerFieldModal from "../../../../features/listener-field-edit/ui/EditListenerFieldModal";

interface ListenerInfoGridProps {
    user: User;
    onFieldUpdated: (
        field: EditableListenerField,
        value: string | null
    ) => void;
}

const ListenerInfoGrid: React.FC<ListenerInfoGridProps> = ({
                                                               user,
                                                               onFieldUpdated,
                                                           }) => {
    const edit = useEditListenerField({
        userId: user.id,
        onSuccess: onFieldUpdated,
    });

    return (
        <>
            <section className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-800">
                        Данные слушателя
                    </h2>

                    <div className="text-xs text-gray-400">
                        ID: {user.id}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-1 lg:grid-cols-2">
                    <EditableLine
                        icon={<FiFileText />}
                        label="ФИО"
                        value={user.name}
                        onEdit={() =>
                            edit.openEditField({
                                field: "name",
                                label: "ФИО",
                                value: user.name || "",
                            })
                        }
                    />

                    <EditableLine
                        icon={<FiAward />}
                        label="Организация"
                        value={user.organization}
                        onEdit={() =>
                            edit.openEditField({
                                field: "organization",
                                label: "Организация",
                                value: user.organization || "",
                            })
                        }
                    />

                    <ReadOnlyLine
                        icon={<FiFileText />}
                        label="Логин"
                        value={user.login}
                    />

                    <EditableLine
                        icon={<FiFileText />}
                        label="ИНН"
                        value={user.inn}
                        onEdit={() =>
                            edit.openEditField({
                                field: "inn",
                                label: "ИНН",
                                value: user.inn || "",
                            })
                        }
                    />

                    {user.temporary_password_plain ? (
                        <ReadOnlyLine
                            icon={<FiFileText />}
                            label="Временный пароль"
                            value={
                                user.must_change_password
                                    ? user.temporary_password_plain
                                    : "не актуален"
                            }
                        />
                    ) : (
                        <ReadOnlyLine
                            icon={<FiFileText />}
                            label="Временный пароль"
                            value="Не указан"
                        />
                    )}

                    <EditableLine
                        icon={<FiFileText />}
                        label="СНИЛС"
                        value={user.snils}
                        onEdit={() =>
                            edit.openEditField({
                                field: "snils",
                                label: "СНИЛС",
                                value: user.snils || "",
                            })
                        }
                    />

                    <EditableLine
                        icon={<FiMail />}
                        label="Email"
                        value={user.email}
                        onEdit={() =>
                            edit.openEditField({
                                field: "email",
                                label: "Email",
                                value: user.email || "",
                            })
                        }
                    />

                    <EditableLine
                        icon={<FiCreditCard />}
                        label="Паспорт"
                        value={user.passport}
                        onEdit={() =>
                            edit.openEditField({
                                field: "passport",
                                label: "Паспорт",
                                value: user.passport || "",
                                multiline: true,
                            })
                        }
                    />

                    <EditableLine
                        icon={<FiPhone />}
                        label="Телефон"
                        value={user.number}
                        onEdit={() =>
                            edit.openEditField({
                                field: "number",
                                label: "Телефон",
                                value: user.number || "",
                            })
                        }
                    />

                    <EditableLine
                        icon={<FiBookOpen />}
                        label="Образование"
                        value={user.education_document}
                        onEdit={() =>
                            edit.openEditField({
                                field: "education_document",
                                label: "Документ об образовании",
                                value: user.education_document || "",
                                multiline: true,
                            })
                        }
                    />

                    <EditableLine
                        icon={<FiFileText />}
                        label="Адрес"
                        value={user.address}
                        onEdit={() =>
                            edit.openEditField({
                                field: "address",
                                label: "Адрес",
                                value: user.address || "",
                                multiline: true,
                            })
                        }
                    />

                    <ReadOnlyLine
                        icon={<FiCalendar />}
                        label="Регистрация"
                        value={
                            user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                                : "-"
                        }
                    />

                    <ReadOnlyLine
                        icon={<FiCalendar />}
                        label="Дата выпуска"
                        value={
                            user.graduation_date
                                ? new Date(user.graduation_date).toLocaleDateString("ru-RU")
                                : "Не указана"
                        }
                    />

                </div>
            </section>

            <EditListenerFieldModal
                opened={edit.opened}
                label={edit.label}
                value={edit.value}
                multiline={edit.multiline}
                loading={edit.loading}
                error={edit.error}
                onChange={edit.setValue}
                onClose={edit.closeEditField}
                onSubmit={edit.submitEditField}
            />
        </>
    );
};

interface LineProps {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
}

interface EditableLineProps extends LineProps {
    onEdit: () => void;
}

const EditableLine: React.FC<EditableLineProps> = ({
                                                       icon,
                                                       label,
                                                       value,
                                                       onEdit,
                                                   }) => {
    return (
        <div
            className="group grid grid-cols-[150px_1fr_32px] items-center gap-3 border-b border-gray-100 py-2 last:border-b-0">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="text-gray-400">{icon}</span>
                <span>{label}</span>
            </div>

            <div className="min-w-0 truncate text-sm text-gray-800">
                {value || <span className="text-gray-400">Не указано</span>}
            </div>

            <button
                type="button"
                onClick={onEdit}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-[#2980B9] md:opacity-0 md:group-hover:opacity-100"
                title="Изменить"
            >
                <FiEdit2/>
            </button>
        </div>
    );
};

const ReadOnlyLine: React.FC<LineProps> = ({icon, label, value}) => {
    return (
        <div
            className="grid grid-cols-[150px_1fr_32px] items-center gap-3 border-b border-gray-100 py-2 last:border-b-0">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="text-gray-400">{icon}</span>
                <span>{label}</span>
            </div>

            <div className="min-w-0 truncate text-sm text-gray-800">
                {value || <span className="text-gray-400">Не указано</span>}
            </div>

            <div/>
        </div>
    );
};

export default ListenerInfoGrid;