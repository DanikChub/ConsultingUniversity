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
                        <div></div>
                        
                        {user.isAuth ? 
                            user.user.role == "ADMIN" ? 
                       
                                
                                <Link to={MAIN_ROUTE} style={{marginLeft: "10px"}} onClick={handlerClick} className="top_nav_sign_out">Выйти</Link>
                         
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
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/" className="nav_logo">
                            <img src={logo} alt=""/>
                            <div class="nav_logo_text">
                                <div class="nav_logo_title"><span style={{color: '#2980B9'}}>КВАЛИТЕТ</span></div>
                                <div class="nav_logo_subtitle">Система дистанционного обучения</div>
                            </div>
                        </a>
                        
                    </div>
                </div>
            </div>
            <div className="main_nav">
                <div className="container">
                    <div className="main_nav_links">
                        <Link to={MAIN_ROUTE} href='' className="main_nav_link">Главная</Link>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/programs.html" className="main_nav_link">Программы</a>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/about.html" className="main_nav_link">О нас</a>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/contacts.html" className="main_nav_link">Контакты</a>
                        <a href="https://bk.kv34.ru/" className="main_nav_link">ИПС "Консалтинг"</a>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/check.html" className="main_nav_link">ФИС ФРДО</a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NavBar;