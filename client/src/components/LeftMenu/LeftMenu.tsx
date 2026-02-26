import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    ADMIN_PROGRAMS_ROUTE,
    ADMIN_LISTENERS_ROUTE,
    ADMIN_ROUTE,
    ADMIN_DOCUMENTS_ROUTE,
    CHAT_USERS_PAGE_ROUTE, ADMIN_ADMINISTRATORS_ROUTE
} from '../../shared/utils/consts';
import {getAllUserUnreadCount, getUnreadMessagesCount} from '../../entities/chat/api/chat.api'; // предположим, есть такой API

const LeftMenu: React.FC = () => {
    const [unreadMessages, setUnreadMessages] = useState<string>('0');

    useEffect(() => {
        // получаем количество непрочитанных сообщений
        getAllUserUnreadCount().then(data => setUnreadMessages(data.unreadCount));
    }, []);

    const menuItems = [
        { name: 'Главная', path: ADMIN_ROUTE, end: true },
        { name: 'Слушатели', path: ADMIN_LISTENERS_ROUTE },
        { name: 'Сообщения', path: CHAT_USERS_PAGE_ROUTE, unreadCount: unreadMessages },
        { name: 'Программы', path: ADMIN_PROGRAMS_ROUTE },
        { name: 'Дипломы', path: ADMIN_DOCUMENTS_ROUTE },
        { name: 'Администраторы', path: ADMIN_ADMINISTRATORS_ROUTE },
    ];



    return (
        <div
            className="sticky top-0 self-start h-screen w-56 bg-white shadow-lg flex flex-col py-6 px-2 overflow-y-auto">
            {menuItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    end={item.end || false}
                    className={({isActive}) =>
                        `flex items-center justify-between px-4 py-2 mb-2 rounded-lg transition-all duration-200
        hover:bg-blue-100 hover:text-blue-700
        ${isActive ? 'bg-blue-600 text-white font-semibold shadow-md' : 'text-gray-700'}`
                    }
                >
                    <div className="flex items-center gap-2">
                        {/* Если есть иконка */}
                        {item.icon && <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`}/>}
                        <span>{item.name}</span>
                    </div>

                    {/* Badge для уведомлений */}
                    {item.unreadCount && parseInt(item.unreadCount) > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {item.unreadCount}
        </span>
                    )}
                </NavLink>
            ))}
        </div>

    );
};

export default LeftMenu;
