import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    ADMIN_PROGRAMS_ROUTE,
    ADMIN_LISTENERS_ROUTE,
    ADMIN_ROUTE,
    ADMIN_DOCUMENTS_ROUTE,
    CHAT_USERS_PAGE_ROUTE
} from '../../utils/consts';

const menuItems = [
    { name: 'Главная', path: ADMIN_ROUTE, end: true }, // end: true для точного совпадения
    { name: 'Слушатели', path: ADMIN_LISTENERS_ROUTE },
    { name: 'Сообщения', path: CHAT_USERS_PAGE_ROUTE },
    { name: 'Программы', path: ADMIN_PROGRAMS_ROUTE },
    { name: 'Выданные документы', path: ADMIN_DOCUMENTS_ROUTE },
];

const LeftMenu = () => {
    return (
        <div className="left_menu">
            {menuItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    end={item.end || false} // ставим end, если он указан
                    className={({ isActive }) => `left_menu_item ${isActive ? 'active' : ''}`}
                >
                    {item.name}
                </NavLink>
            ))}
        </div>
    );
};

export default LeftMenu;