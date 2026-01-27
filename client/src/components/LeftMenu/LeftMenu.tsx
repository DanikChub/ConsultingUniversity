import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    ADMIN_PROGRAMS_ROUTE,
    ADMIN_LISTENERS_ROUTE,
    ADMIN_ROUTE,
    ADMIN_DOCUMENTS_ROUTE,
    CHAT_USERS_PAGE_ROUTE, ADMIN_ADMINISTRATORS_ROUTE
} from '../../utils/consts';
import {getAllUserUnreadCount, getUnreadMessagesCount} from '../../http/chatAPI'; // предположим, есть такой API

const LeftMenu: React.FC = () => {
    const [unreadMessages, setUnreadMessages] = useState<string>('0');

    useEffect(() => {
        // получаем количество непрочитанных сообщений
        getAllUserUnreadCount().then(data => setUnreadMessages(data.unreadCount));
    }, []);

    /*const menuItems = [
        { name: 'Главная', path: ADMIN_ROUTE, end: true },
        { name: 'Слушатели', path: ADMIN_LISTENERS_ROUTE },
        { name: 'Сообщения', path: CHAT_USERS_PAGE_ROUTE, unreadCount: unreadMessages },
        { name: 'Программы', path: ADMIN_PROGRAMS_ROUTE },
        { name: 'Выданные документы', path: ADMIN_DOCUMENTS_ROUTE },
        { name: 'Администраторы', path: ADMIN_ADMINISTRATORS_ROUTE },
    ];*/

    const menuItems = [
        { name: 'Главная', path: ADMIN_ROUTE, end: true },
        { name: 'Программы', path: ADMIN_PROGRAMS_ROUTE },

    ];

    return (
        <div className="sticky top-0 self-start pt-8 pb-24 bg-[#D9D9D9] w-52 flex flex-col">
            {menuItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    end={item.end || false}
                    className={({ isActive }) => `
            px-4 py-2 rounded-md mb-2
            text-gray-700 hover:bg-gray-400 flex justify-between items-center
            ${isActive ? 'bg-gray-500 font-bold text-white' : ''}
          `}
                >
                    <span>{item.name}</span>
                    {/*{item.unreadCount && item.unreadCount != '0' ? (*/}
                    {/*    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">*/}
                    {/*      {item.unreadCount}*/}
                    {/*    </span>*/}
                    {/*): ''}*/}

                </NavLink>
            ))}
        </div>
    );
};

export default LeftMenu;
