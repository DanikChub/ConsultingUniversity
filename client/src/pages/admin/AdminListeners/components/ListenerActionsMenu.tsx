import React, { useEffect, useRef, useState } from "react";
import {
    FiBookOpen,
    FiMessageCircle,
    FiMoreVertical,
    FiRotateCcw,
    FiTrash2,
    FiUser,
} from "react-icons/fi";

import type { AdminUserListItem } from "../../../../entities/user/api/user.api";

interface Props {
    user: AdminUserListItem;

    onOpenUser: () => void;
    onOpenEnrollments: () => void;
    onOpenProgram: () => void;
    onSendMessage: () => void;
    onDelete: () => void;
    onRestore: () => void;
}

const ListenerActionsMenu: React.FC<Props> = ({
                                                  user,
                                                  onOpenUser,
                                                  onOpenEnrollments,
                                                  onOpenProgram,
                                                  onSendMessage,
                                                  onDelete,
                                                  onRestore,
                                              }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!ref.current) return;

            if (!ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const run = (callback: () => void) => {
        setOpen(false);
        callback();
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-[#2980B9] hover:text-[#2980B9]"
                title="Действия"
            >
                <FiMoreVertical />
            </button>

            {open && (
                <div className="absolute right-0 top-11 z-50 w-[240px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    <MenuButton
                        icon={<FiUser />}
                        label="Открыть слушателя"
                        onClick={() => run(onOpenUser)}
                    />

                    {/*<MenuButton*/}
                    {/*    icon={<FiBookOpen />}*/}
                    {/*    label="Управление доступами"*/}
                    {/*    onClick={() => run(onOpenEnrollments)}*/}
                    {/*/>*/}

                    <MenuButton
                        icon={<FiMessageCircle />}
                        label="Написать"
                        onClick={() => run(onSendMessage)}
                    />

                    {user.programs[0]?.id && (
                        <MenuButton
                            icon={<FiBookOpen />}
                            label="Открыть программу"
                            onClick={() => run(onOpenProgram)}
                        />
                    )}

                    <div className="my-1 border-t border-gray-100" />

                    {user.is_delete ? (
                        <MenuButton
                            icon={<FiRotateCcw />}
                            label="Восстановить"
                            onClick={() => run(onRestore)}
                            className="text-green-700 hover:bg-green-50"
                        />
                    ) : (
                        <MenuButton
                            icon={<FiTrash2 />}
                            label="Удалить"
                            onClick={() => run(onDelete)}
                            className="text-red-600 hover:bg-red-50"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
                                                   icon,
                                                   label,
                                                   onClick,
                                                   className = "",
                                               }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50",
                className,
            ].join(" ")}
        >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </button>
    );
};

export default ListenerActionsMenu;