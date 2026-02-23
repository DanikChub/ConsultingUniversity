import React, {useEffect, useState} from "react";
import { User } from "../../../../entities/user/model/type";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import ListenersSkeleton from "./ListenersSkeleton";

interface Props {
    users: User[];
    loading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    handleContextMenu: (e: React.MouseEvent, userId: number, programId: number) => void;
    
}

const UserTable: React.FC<Props> = ({ users, loading, onEdit, onDelete, handleContextMenu }) => {

    useEffect(() => {
        console.log(users)
    }, [users]);

    const dateToString = (date?: string | null) =>
        date ? new Date(date).toLocaleDateString("ru-RU") : "-";

    return (
        <div className="w-full mt-4 min-h-[410px]">
            {/* Шапка */}
            <div
                className="
                    grid 
                    grid-cols-[20px_2fr_2fr_2fr_2fr_1fr]
                    gap-[40px] 
                    items-center
                    font-semibold 
                    pb-2
                "
            >
                <div>#</div>
                <div className="text-sm text-[#2C3E50] font-semibold">ФИО</div>
                <div className="text-sm text-[#2C3E50] font-semibold">Организация</div>
                <div className="text-sm text-[#2C3E50] font-semibold">Программа</div>
                <div className="text-sm text-[#2C3E50] font-semibold">Процент завершенности</div>
                <div className="text-sm text-[#2C3E50] font-semibold">Дата начала</div>

            </div>

            {/* Строки */}
            {!loading ? (
                <ListenersSkeleton />
            ) : <>
                {users.map((user) => {
                    const program = user.programs?.[0];

                    return (
                        <div
                            key={user.id}
                            onContextMenu={(e) =>
                                handleContextMenu(e, user.id, program?.id)
                            }
                            className="
                                grid
                                grid-cols-[20px_2fr_2fr_2fr_2fr_1fr]
                                gap-[40px]
                                items-center
                                py-2
                                hover:bg-gray-100
                                relative
                              "
                        >
                            <div className="text-sm text-[#2C3E50]">{user?.id}.</div>

                            <div className="text-sm text-[#2C3E50]">
                                <Link className="hover:text-blue-700" to={`/admin/listeners/${user?.id}`}>
                                    {user?.name}
                                </Link>
                            </div>

                            <div className="text-sm text-[#2C3E50]">
                                {user?.organization?.length > 21
                                    ? `${user.organization.slice(0, 21)}...`
                                    : user.organization}
                            </div>

                            <div className="text-sm text-[#2C3E50]">
                                {program ? (
                                    <Link
                                        className="hover:text-blue-700"
                                        to={`/admin/programs/${program.id}`}
                                    >
                                        {program?.short_title}
                                    </Link>
                                ) : (
                                    <span className="text-gray-400 italic">Нет программы</span>
                                )}
                            </div>

                            <div className="text-sm text-[#2C3E50]">
                                {user.programs[0]?.progress != null ? (
                                    <ProgressBar value={user.programs[0]?.progress} />
                                ) : (
                                    <span className="text-gray-400">—</span>
                                )}
                            </div>

                            <div className="text-sm text-[#2C3E50]">
                                {dateToString(user?.createdAt)}
                            </div>


                        </div>
                    );
                })}


            </>


            }

            
        </div>
    );
};

export default UserTable;
