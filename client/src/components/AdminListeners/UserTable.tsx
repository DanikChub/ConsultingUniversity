import React, { useState } from "react";
import { User } from "../../types/user";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import ListenersSkeleton from "../ListenersSkeleton/ListenersSkeleton";

interface Props {
    users: User[];
    loading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    handleContextMenu: (e: React.MouseEvent, userId: number, programId: number) => void;
    
}



const UserTable: React.FC<Props> = ({ users, loading, onEdit, onDelete, handleContextMenu }) => {

    const dateToString = (date?: string | null) =>
        date ? new Date(date).toLocaleDateString("ru-RU") : "-";

    return (
        <div className="w-full mt-4 min-h-[410px]">
            {/* Шапка */}
            <div
                className="
                    grid 
                    grid-cols-[max-content_2fr_2fr_2fr_2fr_1fr_1fr]
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
                <div className="text-sm text-[#2C3E50] font-semibold">Дата окончания</div>
            </div>

            {/* Строки */}
            {!loading ? (
                <ListenersSkeleton />
            ) : (
                users.map((user) => (
                    <div
                        key={user.id}
                        onContextMenu={(e) => handleContextMenu(e, user.id, user.program.id)}
                        className="
                            grid 
                            grid-cols-[max-content_2fr_2fr_2fr_2fr_1fr_1fr]
                            gap-[40px] 
                            items-center 
                            py-2 
                            hover:bg-gray-100
                            relative
                        "
                    >
                        <div className="text-sm text-[#2C3E50]">{user.id}.</div>
                        <div className="text-sm text-[#2C3E50]">
                            <Link className="hover:text-blue-700" to={`/admin/listeners/${user.id}`}>
                                {user.name}
                            </Link>
                        </div>
                        <div className="text-sm text-[#2C3E50]">
                            {user.organiztion.length > 21
                                ? `${user.organiztion.slice(0, 21)}...`
                                : user.organiztion}
                        </div>
                        <div className="text-sm text-[#2C3E50]">
                            <Link className="hover:text-blue-700" to={`/admin/programs/${user.program.id}`}>
                                {user.program.short_title}
                            </Link>
                        </div>
                        <div className="text-sm text-[#2C3E50]">
                            <ProgressBar value={user.statistic} />
                        </div>
                        <div className="text-sm text-[#2C3E50]">{dateToString(user.createdAt)}</div>
                        <div className="text-sm text-[#2C3E50]">{dateToString(user.graduation_date)}</div>
                    </div>
                ))
            )}

            
        </div>
    );
};

export default UserTable;
