import React, { useContext, useEffect } from 'react';

import logo from "../../assets/imgs/logo/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_ROUTE, USER_ROUTE, ADMIN_ROUTE, MAIN_ROUTE, ADMIN_CHANGE_USER } from '../../utils/consts';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';

const NavBar = observer(() => {
    const {user} = useContext(Context)
 

    const handlerClick = () => {
        localStorage.setItem('token', '')
        user.setUser({});
        user.setIsAuth(false);
    }

    

    return (
        <div className="header">
            <div className="top_nav">
                <div className="container">
                    <div className="top_nav_links">
                        <div className="top_nav_links_container">
                            <a href="#" className="top_nav_number">Политика конфиденциальности</a>
                            <a href="#" className="top_nav_number">Правила работы</a>
                            <a href="#" className="top_nav_number">Контакты</a>
                        </div>
                        
                        {user.isAuth ? 
                            user.user.role == "ADMIN" ? 
                            <div style={{display: "flex"}}>
                                <Link to={ADMIN_ROUTE} className="top_nav_sign_in">
                                    <span>Личный кабинет</span>  
                                </Link>
                                <Link to={MAIN_ROUTE} style={{marginLeft: "10px"}} onClick={handlerClick} className="top_nav_sign_in">Выйти</Link>
                            </div>
                             :
                                <Link to={USER_ROUTE} className="top_nav_sign_in">
                                <span>Личный кабинет</span>  
                                </Link> 
                                
                            :
                            <Link to={AUTH_ROUTE} className="top_nav_sign_in">
                                <span>Войти</span>  
                            </Link>
                        }
                        
                    </div>
                </div>
            </div>
            <div className="nav">
                <div className="container">
                    <div className="nav_inner">
                        <a href="#" className="nav_logo">
                            <img src={logo} alt=""/>
                            <div className="nav_logo_text">
                                <div className="nav_logo_title"><span style={{color: "#2980B9"}}>Консалтинг</span> <span style={{color: "#2C3E50"}}>Университет</span></div>
                                <div className="nav_logo_subtitle">Вместе к совершенству!</div>
                            </div>
                        </a>
                        
                    </div>
                </div>
            </div>
            <div className="main_nav">
                <div className="container">
                    <div className="main_nav_links">
                        <a href="#" className="main_nav_link">Главная</a>
                        <a href="#" className="main_nav_link">Программы обучения</a>
                        <a href="#" className="main_nav_link">График обучения</a>
                        <a href="#" className="main_nav_link">Стоимость</a>
                        <a href="#" className="main_nav_link">Для поступающих</a>
                        <a href="#" className="main_nav_link">ИПС Консалтинг</a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NavBar;