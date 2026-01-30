import React, { useContext, useEffect, useState } from 'react';
import { deleteUser, getAllAdmins, getAllUsersWithPage,  } from '../../../entities/user/api/user.api';
import {ADMIN_REGISTRATE_ADMIN, ADMIN_REGISTRATE_USER} from '../../../shared/utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import pencil from '../../../assets/imgs/pencil.png'

import "./AdministratorsPage.css"
import LeftMenu from '../../../components/LeftMenu/LeftMenu';

import ListenersSkeleton from '../AdminListeners/components/ListenersSkeleton';
import { Context } from '../../../index';
import AppContainer from "../../../components/ui/AppContainer";
import ProgressBar from "../AdminListeners/components/ProgressBar";
import Button from "../../../shared/ui/buttons/Button";

function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}


const AdministratorsPage = () => {
    const userContext = useContext(Context);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        userId: null
    });

    useEffect(() => {
        const fetchAdmins = async () => {
            setLoading(true);       // включаем спиннер
                    // сбрасываем ошибки

            try {
                const users = await getAllAdmins();

                // выделяем текущего пользователя
                const you = users.filter(
                    user => user.id === userContext.user.user.id
                );
                const otherUsers = users.filter(
                    user => user.id !== userContext.user.user.id
                );

                // ставим текущего пользователя в начало
                if (you.length) {
                    otherUsers.unshift(you[0]);
                }

                setUsers(otherUsers);
                setFilteredUsers(otherUsers);

            } catch (error) {
                console.error('fetchAdmins error:', error);

                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Ошибка получения администраторов';

                alert(message)

            } finally {
                setLoading(true);  // выключаем спиннер
            }
        };

        fetchAdmins();


        
    }, [])

    const destroyUser = (id) => {
        deleteUser(id).then(d => 
            getAllAdmins().then(users => {
                let you = users.filter(user => user.id == userContext.user.user.id)

                users = users.filter(user => user.id != userContext.user.user.id)
                
                users.unshift(you[0])
                setUsers(users);
                setFilteredUsers(users);
                setLoading(true);
            })
        );
    }

    const handleContextMenu = (e, userId) => {
        e.preventDefault(); // отключаем стандартное меню
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.pageY,
            userId
        });
    };

    const handleClickOutside = () => {
        if (contextMenu.visible) {
            setContextMenu({ visible: false, x: 0, y: 0, userId: null });
        }
    };

    const handleEdit = (id) => navigate(`/admin/listeners/new_listener/${id}`);
    
    return (
        <AppContainer onClick={handleClickOutside}>

            <Button to={ADMIN_REGISTRATE_ADMIN + '?admin=true'}  checkRole='ADMIN' className="admin_button">Добавить администратора</Button>
            <div className="w-full mt-4 min-h-[410px]">
                {/* Шапка */}
                <div
                    className="
                    grid
                    grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr]
                    gap-[40px]
                    items-center
                    font-semibold
                    pb-2
                "
                >

                    <div className="text-sm text-[#2C3E50] font-semibold">ID</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">ФИО</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">EMAIL</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">Роль</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">Дата создания</div>

                    <div className="text-sm text-[#2C3E50] font-semibold">Сеанс</div>

                </div>

                {/* Строки */}
                {!loading ? (
                    <ListenersSkeleton/>
                ) : (
                    filteredUsers.map((user, i) => (
                        <div
                            key={user.id}
                            onContextMenu={(e) => handleContextMenu(e, user.id)}
                            className={`
                            grid
                            grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr]
                            gap-[40px]
                            items-center
                            py-2
                            
                            relative ${i==0?'bg-green-200':'hover:bg-gray-100'}
                        `}
                        >
                            <div className="text-sm text-[#2C3E50]">{user.id}.</div>
                            <div className="text-sm text-[#2C3E50]">{user.name}</div>
                            <div className="text-sm text-[#2C3E50]">{user.email}</div>
                            <div className="text-sm text-[#2C3E50]">{user.role}</div>
                            <div className="text-sm text-[#2C3E50]">{dateToString(user.createdAt)}</div>
                            <div className="text-sm text-[#2C3E50]">{i==0?`(Текущий)`:''}</div>
                        </div>
                    ))
                )}


            </div>
            {contextMenu.visible && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="absolute bg-white z-50 w-[220px] rounded-md overflow-hidden"
                >

                    <button
                        onClick={() => {
                            if (contextMenu.userId) handleEdit(contextMenu.userId);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null });
                        }}
                        className="w-full bg-[#D9D9D9] hover:bg-[#2D91CB] hover:text-white py-2 px-3 transition text-left text-sm"
                    >
                        Изменить
                    </button>
                    <button
                        onClick={() => {
                            if (contextMenu.userId) destroyUser(contextMenu.userId);
                            setContextMenu({ visible: false, x: 0, y: 0, userId: null });
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

export default AdministratorsPage;