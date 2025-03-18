import React from 'react';
import { Link } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { ADMIN_LISTENERS_ROUTE, ADMIN_PROGRAMS_ROUTE } from '../../utils/consts';
import './AdminPage.css';

const AdminPage = () => {
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_statisitcs_items">
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">5</div>
                            <div className="admin_statisitcs_item_title">Активные слушатели</div>
                        </div>
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">7</div>
                            <div className="admin_statisitcs_item_title">Пройдено тестов</div>
                        </div>
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">1</div>
                            <div className="admin_statisitcs_item_title">Завершено курсов</div>
                        </div>
                    </div>
                    <div className="admin_title title">
                        <b>Программы</b>
                    </div>
                    <div className="admin_programs">
                        <div className="admin_program">
                            <img src={null} alt="" className="admin_program_img"/>
                            <div className="admin_program_content">
                                <div className="admin_program_title">Управление государственными, муниципальными и корпоративными закупками</div>
                                <div className="admin_program_listeners">Слушатели: <b>5</b></div>
                            </div>
                        </div>
                        <div className="admin_program">
                            <img src={null} alt="" className="admin_program_img"/>
                            <div className="admin_program_content">
                                <div className="admin_program_title">Эксперт в сфере корпоративных закупок (223-ФЗ)</div>
                                <div className="admin_program_listeners">Слушатели: <b>0</b></div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default AdminPage;