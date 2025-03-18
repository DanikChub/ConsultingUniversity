import React from 'react';
import { ADMIN_PROGRAMS_ROUTE, ADMIN_LISTENERS_ROUTE, ADMIN_ROUTE, ADMIN_APPLICATIONS_ROUTE } from '../../utils/consts';
import { Link } from 'react-router-dom';

const LeftMenu = () => {
    return (
        <div className="left_menu">
            <Link to={ADMIN_ROUTE} className="left_menu_item">Главная</Link>
            <Link to={ADMIN_LISTENERS_ROUTE} className="left_menu_item">Слушатели</Link>
            <Link to={ADMIN_APPLICATIONS_ROUTE} className="left_menu_item">Заявки</Link>
            <Link to={null} className="left_menu_item">Статистика</Link>
            <Link to={ADMIN_PROGRAMS_ROUTE}  className="left_menu_item">Программы</Link>
            <Link to={null} className="left_menu_item">Ведомости</Link>
            <Link to={null} className="left_menu_item">Выданные документы</Link>
        </div>
    );
};

export default LeftMenu;