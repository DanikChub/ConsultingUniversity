import React from "react";
import { Link } from "react-router-dom";

import ProgressBar from "./ProgressBar";
import ListenersSkeleton from "./ListenersSkeleton";
import ListenerActionsMenu from "./ListenerActionsMenu";

import type { AdminUserListItem } from "../../../../entities/user/api/user.api";

interface Props {
    users: AdminUserListItem[];
    loading: boolean;

    onOpenUser: (id: number) => void;
    onOpenEnrollments: (id: number) => void;
    onOpenProgram: (programId?: number | null) => void;
    onSendMessage: (id: number) => void;
    onDelete: (user: AdminUserListItem) => void;
    onRestore: (user: AdminUserListItem) => void;
}

const UserTable: React.FC<Props> = ({
                                        users,
                                        loading,
                                        onOpenUser,
                                        onOpenEnrollments,
                                        onOpenProgram,
                                        onSendMessage,
                                        onDelete,
                                        onRestore,
                                    }) => {
    const dateToString = (date?: string | null) =>
        date ? new Date(date).toLocaleDateString("ru-RU") : "-";

    if (loading) {
        return (
            <div className="mt-4 min-h-[410px] w-full">
                <ListenersSkeleton />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
                Слушатели не найдены
            </div>
        );
    }

    return (
        <div className="mt-4 min-h-[410px] w-full overflow-visible rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div
                className="
                    grid
                    grid-cols-[80px_2fr_2fr_2fr_1.4fr_1.2fr_90px]
                    gap-4
                    border-b border-gray-100
                    px-5
                    py-4
                    text-sm
                    font-semibold
                    text-[#2C3E50]
                "
            >
                <div>ID</div>
                <div>Слушатель</div>
                <div>Контакты</div>
                <div>Организация</div>
                <div>Программы</div>
                <div>Регистрация</div>
                <div className="text-right">Действия</div>
            </div>

            {users.map(user => (
                <div
                    key={user.id}
                    className={[
                        "grid grid-cols-[80px_2fr_2fr_2fr_1.4fr_1.2fr_90px] gap-4 px-5 py-4 text-sm transition",
                        "border-b border-gray-50 last:border-b-0",
                        user.is_delete
                            ? "bg-red-50/50 text-gray-500"
                            : "bg-white text-[#2C3E50] hover:bg-gray-50",
                    ].join(" ")}
                >
                    <div className="flex items-center">
                        <span className="font-medium">#{user.id}</span>
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <Link
                                className="truncate font-medium hover:text-blue-700"
                                to={`/admin/listeners/${user.id}`}
                            >
                                {user.name || "Без имени"}
                            </Link>

                            {user.is_delete && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                                    Удален
                                </span>
                            )}

                            {user.must_change_password && (
                                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-700 text-center">
                                    Временный пароль
                                </span>
                            )}
                        </div>

                        <div className="mt-1 truncate text-xs text-gray-400">
                            login: {user.login || "-"}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="truncate">
                            {user.number || (
                                <span className="text-gray-400">Телефон не указан</span>
                            )}
                        </div>

                        <div className="mt-1 truncate text-xs text-gray-400">
                            {user.email || "Email не указан"}
                        </div>
                    </div>

                    <div className="min-w-0">
                        {user.organization ? (
                            <span title={user.organization}>
                                {user.organization.length > 28
                                    ? `${user.organization.slice(0, 28)}...`
                                    : user.organization}
                            </span>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </div>

                    <ProgramsCell
                        user={user}
                        onOpenProgram={onOpenProgram}
                    />

                    <div>
                        {dateToString(user.createdAt)}
                    </div>

                    <div className="flex justify-end">
                        <ListenerActionsMenu
                            user={user}
                            onOpenUser={() => onOpenUser(user.id)}
                            onOpenEnrollments={() => onOpenEnrollments(user.id)}
                            onOpenProgram={() => onOpenProgram(user.programs[0]?.id)}
                            onSendMessage={() => onSendMessage(user.id)}
                            onDelete={() => onDelete(user)}
                            onRestore={() => onRestore(user)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

interface ProgramsCellProps {
    user: AdminUserListItem;
    onOpenProgram: (programId?: number | null) => void;
}

const ProgramsCell: React.FC<ProgramsCellProps> = ({
                                                       user,
                                                       onOpenProgram,
                                                   }) => {
    if (!user.programs || user.programs.length === 0) {
        return (
            <div className="text-gray-400">
                Без программы
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-2">
            {user.programs.map((program) => (
                <div
                    key={program.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                >
                    <button
                        type="button"
                        onClick={() => onOpenProgram(program.id)}
                        className="
                            block
                            w-full
                            truncate
                            text-left
                            text-xs
                            font-medium
                            text-[#2C3E50]
                            hover:text-blue-700
                        "
                        title={program.title}
                    >
                        {program.short_title || program.title}
                    </button>

                    <div className="mt-2 flex items-center gap-2">
                        <EnrollmentBadge
                            status={program.enrollment?.status}
                        />

                        {program.progress != null ? (
                            <div className="min-w-0 flex-1">
                                <ProgressBar value={program.progress} />
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">
                                —
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

interface EnrollmentBadgeProps {
    status?: string;
}

const EnrollmentBadge: React.FC<EnrollmentBadgeProps> = ({ status }) => {
    const map: Record<string, string> = {
        active: "Обучается",
        completed: "Завершил",
        archived: "Архив",
        paused: "Пауза",
    };

    const classMap: Record<string, string> = {
        active: "bg-blue-50 text-blue-700",
        completed: "bg-green-50 text-green-700",
        archived: "bg-gray-100 text-gray-600",
        paused: "bg-yellow-50 text-yellow-700",
    };

    if (!status) return null;

    return (
        <span
            className={[
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                classMap[status] || "bg-gray-100 text-gray-600",
            ].join(" ")}
        >
            {map[status] || status}
        </span>
    );
};

export default UserTable;