import React from "react";
import {
    FiEdit,
    FiLock,
    FiUnlock,
    FiUser,
} from "react-icons/fi";
import Button from "../../../../shared/ui/buttons/Button";
import type { User } from "../../../../entities/user/model/type";

interface ListenerHeaderProps {
    user: User;
    onSendMessage: () => void;
    onBlock: () => void;
    onUnblock: () => void;
    blockActionLoading: boolean;
}
const ListenerHeader: React.FC<ListenerHeaderProps> = ({
                                                           user,
                                                           onSendMessage,
                                                           onBlock,
                                                           onUnblock,
                                                           blockActionLoading,
                                                       }) => {
    const imgSrc = user.img ? process.env.REACT_APP_API_URL + user.img : "";

    return (
        <div className="flex flex-col justify-center items-center gap-8 md:flex-row">
            <div className="relative h-28 w-28 flex-shrink-0">
                {user.img ? (
                    <div className="group relative h-28 w-28 overflow-hidden rounded-full">
                        <img
                            src={imgSrc}
                            alt={user.name}
                            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl font-bold text-indigo-400">
                        {user.name?.charAt(0)}
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-left text-3xl font-bold text-gray-800">
                            {user.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <FiUser />
                            <span>{user.login}</span>
                        </div>
                        {user.is_blocked && (
                            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <div className="text-sm font-semibold text-red-700">
                                    Пользователь заблокирован
                                </div>

                                {user.block_reason && (
                                    <div className="mt-1 text-sm text-red-600">
                                        Причина: {user.block_reason}
                                    </div>
                                )}

                                {user.blocked_until && (
                                    <div className="mt-1 text-sm text-red-600">
                                        До:{" "}
                                        {new Date(user.blocked_until).toLocaleString("ru-RU")}
                                    </div>
                                )}

                                {!user.blocked_until && (
                                    <div className="mt-1 text-sm text-red-600">
                                        Блокировка бессрочная
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="ml-4 flex flex-wrap gap-2">
                        <Button onClick={onSendMessage}>
                            <FiEdit />
                            <span>Написать</span>
                        </Button>

                        {user.is_blocked ? (
                            <Button
                                onClick={onUnblock}
                                disabled={blockActionLoading}
                            >
                                <FiUnlock />
                                <span>
                                    {blockActionLoading
                                        ? "Разблокировка..."
                                        : "Разблокировать"}
                                </span>
                            </Button>
                        ) : (
                            <Button
                                onClick={onBlock}
                                disabled={blockActionLoading}
                            >
                                <FiLock />
                                <span>
                                    {blockActionLoading
                                        ? "Блокировка..."
                                        : "Заблокировать"}
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListenerHeader;