import React from "react";
import { FiEdit, FiUser } from "react-icons/fi";

import Button from "../../../../shared/ui/buttons/Button";
import type { User } from "../../../../entities/user/model/type";

interface ListenerHeaderProps {
    user: User;
    onSendMessage: () => void;
}

const ListenerHeader: React.FC<ListenerHeaderProps> = ({
                                                           user,
                                                           onSendMessage,
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
                    </div>

                    <Button className="ml-4" onClick={onSendMessage}>
                        <FiEdit />
                        <span>Написать</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ListenerHeader;