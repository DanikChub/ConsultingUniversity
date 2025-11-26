import React, { useState } from "react";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import { ADMIN_REGISTRATE_USER } from "../../utils/consts";
import { useNavigate, Link } from "react-router-dom";

import { useAdminListeners } from "../../hooks/useAdminListeners";
import UserTable from "../../components/AdminListeners/UserTable";
import Pagination from "../../components/AdminListeners/Pagination";
import SearchAndSortPanel from "../../components/AdminListeners/SearchAndSortPanel";
import Button from "../../components/ui/Button";
import AdminPath from "../../components/ui/AdminPath";
import AppContainer from "../../components/ui/AppContainer";
import SearchInput from "../../components/ui/SearchInput";

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    userId: number | null;
    programId: number | null;
}

const AdminListeners: React.FC = () => {
    const navigate = useNavigate();
    const {
        users, filteredUsers, loading, countUsers,
        searchInput,
        handleSearchInput,
        handleClickPagination, destroyUser
    } = useAdminListeners();
    
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        userId: null,
        programId: null
    });


    const handleEdit = (id: number) => navigate(`/admin/listeners/new_listener/${id}`);

    const handleContextMenu = (e: React.MouseEvent, userId: number, programId: number) => {
        e.preventDefault(); // отключаем стандартное меню
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.pageY,
            userId,
            programId
        });
    };

    const handleClickOutside = () => {
        if (contextMenu.visible) {
            setContextMenu({ visible: false, x: 0, y: 0, userId: null, programId: null });
        }
    };

    return (
        <AppContainer onClick={handleClickOutside}>
                    
            <Button 
                to={ADMIN_REGISTRATE_USER}
                >
                Добавить слушателя
            </Button>
           
            <SearchInput 
                className="mt-7"
                value={searchInput} 
                onChange={e => handleSearchInput(e)} 
                placeholder="Поиск" 
            />

            <UserTable
                handleContextMenu={handleContextMenu}
                users={filteredUsers}
                loading={loading}
                onEdit={handleEdit}
                onDelete={destroyUser}
            />

            {/* <Pagination
                pages={countUsers}
                onClick={handleClickPagination}
            /> */}
            {contextMenu.visible && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="absolute bg-white z-50 w-[220px] rounded-md overflow-hidden"
                >
                    <button
                        onClick={() => {
                            if (contextMenu.userId) navigate(`/admin/listeners/${contextMenu.userId}`);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null, programId: null });
                        }}
                        className="w-full bg-[#D9D9D9] hover:bg-[#2D91CB] hover:text-white py-2 px-3 transition text-left text-sm"
                    >
                        Перейти к слушателю
                    </button>
                    <button
                        onClick={() => {
                            if (contextMenu.userId) navigate(`/admin/programs/${contextMenu.programId}`);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null, programId: null });
                        }}
                        className="w-full bg-[#D9D9D9] hover:bg-[#2D91CB] hover:text-white py-2 px-3 transition text-left text-sm"
                    >
                        Перейти к программе
                    </button>
                    <button
                        onClick={() => {
                            if (contextMenu.userId) handleEdit(contextMenu.userId);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null, programId: null });
                        }}
                        className="w-full bg-[#D9D9D9] hover:bg-[#2D91CB] hover:text-white py-2 px-3 transition text-left text-sm"
                    >
                        Изменить
                    </button>
                    <button
                        onClick={() => {
                            if (contextMenu.userId) destroyUser(contextMenu.userId);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null, programId: null });
                        }}
                       
                        className="w-full bg-[#D9D9D9] hover:bg-red-600 hover:text-white py-2 px-3 transition text-left text-sm"
                    >
                        Удалить
                    </button>
                </div>
            )}
        </AppContainer>
    );
};

export default AdminListeners;