import React, { useEffect } from 'react';
import { ADMIN_PROGRAMS_ROUTE, ADMIN_LISTENERS_ROUTE, ADMIN_ROUTE, ADMIN_APPLICATIONS_ROUTE, ADMIN_PRACTICAL_WORKS_ROUTE, ADMIN_ADMINISTRATORS_ROUTE, ADMIN_DOCUMENTS_ROUTE } from '../../utils/consts';
import { Link } from 'react-router-dom';

const LeftMenu = ({active_arr}) => {

 
    return (
        <div className="left_menu">
            <Link to={ADMIN_ROUTE} className={`left_menu_item ${active_arr[0]}`}>Главная</Link>
            <Link to={ADMIN_LISTENERS_ROUTE} className={`left_menu_item ${active_arr[1]}`}>Слушатели</Link>
            <Link to={ADMIN_APPLICATIONS_ROUTE} className={`left_menu_item ${active_arr[2]}`}>Заявки</Link>
            {/* <Link to={null} className={`left_menu_item ${active_arr[3]}`}>Статистика</Link> */}
            <Link to={ADMIN_PROGRAMS_ROUTE}  className={`left_menu_item ${active_arr[4]}`}>Программы</Link>
            <Link to={ADMIN_PRACTICAL_WORKS_ROUTE} className={`left_menu_item ${active_arr[5]}`}>Практические работы</Link>
            {/* <Link to={null} className={`left_menu_item ${active_arr[6]}`}>Ведомости</Link>
            <Link to={null} className={`left_menu_item ${active_arr[7]}`}>Выданные документы</Link> */}
            <Link to={ADMIN_ADMINISTRATORS_ROUTE} className={`left_menu_item ${active_arr[6]}`}>Администраторы</Link>
            <Link to={ADMIN_DOCUMENTS_ROUTE} className={`left_menu_item ${active_arr[7]}`}>Документы</Link>
        </div>
    );
};

export default LeftMenu;