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
            <div className="w-full h-[50px] flex items-center bg-[#2C3E50]">
                <div className="max-w-[1500px] px-[40px] w-full m-auto">
                    <div className="flex justify-between">
                        <div></div>
                        
                        {user.isAuth ? 
                            user.user.role == "ADMIN" ? 
                       
                                
                                <Link to={MAIN_ROUTE} style={{marginLeft: "10px"}} onClick={handlerClick} className="duration-300 flex items-center bg-[#33CCCC] rounded-md px-[12px] py-[6px] text-base font-medium text-[#fff] cursor-pointer transition hover:text-[#000] hover:bg-[#fff]">Выйти</Link>
                         
                             :
                                <Link to={USER_ROUTE} className="duration-300 flex items-center bg-[#33CCCC] rounded-md px-[12px] py-[6px] text-base font-medium text-[#fff] cursor-pointer transition-[.2s] hover:text-[#000] hover:bg-[#fff]">
                                <span>Личный кабинет</span>  
                                </Link> 
                                
                            :
                            <Link to={AUTH_ROUTE} className="duration-300 flex items-center bg-[#33CCCC] rounded-md px-[12px] py-[6px] text-base font-medium text-[#fff] cursor-pointer transition-[.2s] hover:text-[#000] hover:bg-[#fff]">
                                <span>Войти</span>  
                            </Link>
                        }
                        
                    </div>
                </div>
            </div>
            <div className="h-[90px] flex items-center bg-[#fff]">
                <div className="max-w-[1500px] px-[40px] w-full m-auto">
                    <div className="flex justify-between items-center">
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/" className="flex items-center">
                            <img src={logo} alt=""/>
                            <div className="ml-[5px]">
                                <div className="text-[36px] font-bold"><span style={{color: '#2980B9'}}>КВАЛИТЕТ</span></div>
                                <div className="text-[#2C3E50] font-medium text-xs">Система дистанционного обучения</div>
                            </div>
                        </a>
                        
                    </div>
                </div>
            </div>
            <div className="bg-[#2C3E50] h-[61px] flex items-center">
                <div className="max-w-[1500px] px-[40px] w-full m-auto">
                    <div className="main_nav_links">
                        <Link to={MAIN_ROUTE} href='' className="text-[#fff] ml-0 mr-[30px] font-normal no-underline">Главная</Link>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/programs.html" className="text-[#fff] ml-0 mr-[30px] font-normal no-underline">Программы</a>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/about.html" className="text-[#fff] ml-0 mr-[30px] font-normal no-underline">О нас</a>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/contacts.html" className="text-[#fff] ml-0 mr-[30px] font-normal no-underline">Контакты</a>
                        <a href="https://bk.kv34.ru/" className="text-[#fff] ml-0 mr-[30px] font-normal no-underline">ИПС "Консалтинг"</a>
                        <a href="https://xn--34-6kchqrlk8db.xn--p1ai/check.html" className="text-[#fff] ml-0 mr-[30px] font-normal no-underline">ФИС ФРДО</a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NavBar;