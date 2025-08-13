import React, { useContext, useState } from 'react';


import "./MainPage.css";

import video from "../../assets/videos/bg/bg.mp4";
import logo from "../../assets/imgs/logo/logo.png"
import training_program_1 from "../../assets/imgs/training_programs/1.png";
import training_program_2 from "../../assets/imgs/training_programs/2.png";
import training_program_3 from "../../assets/imgs/training_programs/3.png";

import phone from '../../assets/imgs/bg/phone.png'
import phone_img from '../../assets/imgs/bg/phone_img.png'
import phone_img_photo from '../../assets/imgs/bg/phone_img_on.png'
import kit_items_1 from '../../assets/imgs/kit_itmes/1.png'
import kit_items_2 from '../../assets/imgs/kit_itmes/2.png'
import kit_items_3 from '../../assets/imgs/kit_itmes/3.png'
import diploma from "../../assets/imgs/slider_docs/diploma.png"
import diploma1 from "../../assets/imgs/slider_docs/diploma1.png"
import university from "../../assets/imgs/bg/university.png"
import steps_1 from "../../assets/imgs/steps/1.png"
import steps_2 from "../../assets/imgs/steps/2.png"
import steps_3 from "../../assets/imgs/steps/3.png"
import steps_4 from "../../assets/imgs/steps/4.png"
import girl from "../../assets/imgs/bg/girl.png"
import questions_1 from "../../assets/imgs/questions/1.png"
import questions_2 from "../../assets/imgs/questions/2.png"
import questions_3 from "../../assets/imgs/questions/3.png"
import questions_4 from "../../assets/imgs/questions/4.png"
import diploms_1 from "../../assets/imgs/diploms/1.png"
import diploms_2 from "../../assets/imgs/diploms/2.png"
import diploms_3 from "../../assets/imgs/diploms/3.png"
import diploms_4 from "../../assets/imgs/diploms/4.png"
import programs_1 from "../../assets/imgs/programs/1.png"
import programs_2 from "../../assets/imgs/programs/2.png"
import programs_3 from "../../assets/imgs/programs/3.png"
import programs_4 from "../../assets/imgs/programs/4.png"

import { Link } from 'react-router-dom';
import { AUTH_ROUTE, ADMIN_ROUTE, MAIN_ROUTE, USER_ROUTE } from '../../utils/consts';
import { createApplication } from '../../http/applicationAPI';
import { Context } from '../../index';

const MainPage = () => {
    const {user} = useContext(Context)
    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');

    const clickHandler = () => {

        createApplication(nameInput, emailInput, phoneInput).then(data => {
            alert('Заявка успешно отправлена!');
            setNameInput('');
            setEmailInput('');

            setPhoneInput('');
        })
        .catch(e => alert(e.response.data.message))
    }
    return (
        <div className='no_head_footer'>
            <div class="header">
                <div class="top_nav">
                    <div class="big_container">
                        <div class="top_nav_links">
                            <div class="top_nav_number">Позвонить: 8 800 550 5690</div>
                            
                                
                            {user.isAuth ? 
                                user.user.role == "ADMIN" ? 
                                <div style={{display: "flex"}}>
                                    <Link to={ADMIN_ROUTE} className="top_nav_sign_in">
                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.875 14.4033C13.875 15.1839 13.6512 15.8535 13.2036 16.4121C12.756 16.9707 12.2171 17.25 11.5869 17.25H2.41309C1.78288 17.25 1.24398 16.9707 0.796387 16.4121C0.348796 15.8535 0.125 15.1839 0.125 14.4033C0.125 13.7946 0.155436 13.2199 0.216309 12.6792C0.277181 12.1385 0.389974 11.5942 0.554688 11.0464C0.719401 10.4985 0.928874 10.0295 1.18311 9.63916C1.43734 9.24886 1.77393 8.93018 2.19287 8.68311V8.68311C3.0266 8.19142 3.99197 8.75789 4.85566 9.19479C5.505 9.52326 6.21978 9.6875 7 9.6875C7.78022 9.6875 8.495 9.52326 9.14434 9.19479C10.008 8.75789 10.9734 8.19142 11.8071 8.68311V8.68311C12.2261 8.93018 12.5627 9.24886 12.8169 9.63916C13.0711 10.0295 13.2806 10.4985 13.4453 11.0464C13.61 11.5942 13.7228 12.1385 13.7837 12.6792C13.8446 13.2199 13.875 13.7946 13.875 14.4033ZM9.9165 1.9585C9.9165 1.9585 10.1179 2.15991 10.5208 2.56274C10.9236 2.96558 11.125 3.73633 11.125 4.875C11.125 6.01367 10.7222 6.98584 9.9165 7.7915C9.11084 8.59717 8.13867 9 7 9C5.86133 9 4.88916 8.59717 4.0835 7.7915C3.27783 6.98584 2.875 6.01367 2.875 4.875C2.875 3.73633 3.27783 2.76416 4.0835 1.9585C4.88916 1.15283 5.86133 0.75 7 0.75C8.13867 0.75 9.11084 1.15283 9.9165 1.9585Z" fill="#ECF0F1"/>
                                </svg>
                                        <span>Личный кабинет</span>  
                                    </Link>
                                    <Link to={MAIN_ROUTE} style={{marginLeft: "10px"}} onClick={handlerClick} className="top_nav_sign_in">Выйти</Link>
                                </div>
                                :
                                    <Link to={USER_ROUTE} className="top_nav_sign_in">
                                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.875 14.4033C13.875 15.1839 13.6512 15.8535 13.2036 16.4121C12.756 16.9707 12.2171 17.25 11.5869 17.25H2.41309C1.78288 17.25 1.24398 16.9707 0.796387 16.4121C0.348796 15.8535 0.125 15.1839 0.125 14.4033C0.125 13.7946 0.155436 13.2199 0.216309 12.6792C0.277181 12.1385 0.389974 11.5942 0.554688 11.0464C0.719401 10.4985 0.928874 10.0295 1.18311 9.63916C1.43734 9.24886 1.77393 8.93018 2.19287 8.68311V8.68311C3.0266 8.19142 3.99197 8.75789 4.85566 9.19479C5.505 9.52326 6.21978 9.6875 7 9.6875C7.78022 9.6875 8.495 9.52326 9.14434 9.19479C10.008 8.75789 10.9734 8.19142 11.8071 8.68311V8.68311C12.2261 8.93018 12.5627 9.24886 12.8169 9.63916C13.0711 10.0295 13.2806 10.4985 13.4453 11.0464C13.61 11.5942 13.7228 12.1385 13.7837 12.6792C13.8446 13.2199 13.875 13.7946 13.875 14.4033ZM9.9165 1.9585C9.9165 1.9585 10.1179 2.15991 10.5208 2.56274C10.9236 2.96558 11.125 3.73633 11.125 4.875C11.125 6.01367 10.7222 6.98584 9.9165 7.7915C9.11084 8.59717 8.13867 9 7 9C5.86133 9 4.88916 8.59717 4.0835 7.7915C3.27783 6.98584 2.875 6.01367 2.875 4.875C2.875 3.73633 3.27783 2.76416 4.0835 1.9585C4.88916 1.15283 5.86133 0.75 7 0.75C8.13867 0.75 9.11084 1.15283 9.9165 1.9585Z" fill="#ECF0F1"/>
                                </svg>
                                    <span>Личный кабинет</span>  
                                    </Link> 
                                    
                                :
                                <Link to={AUTH_ROUTE} className="top_nav_sign_in">
                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.875 14.4033C13.875 15.1839 13.6512 15.8535 13.2036 16.4121C12.756 16.9707 12.2171 17.25 11.5869 17.25H2.41309C1.78288 17.25 1.24398 16.9707 0.796387 16.4121C0.348796 15.8535 0.125 15.1839 0.125 14.4033C0.125 13.7946 0.155436 13.2199 0.216309 12.6792C0.277181 12.1385 0.389974 11.5942 0.554688 11.0464C0.719401 10.4985 0.928874 10.0295 1.18311 9.63916C1.43734 9.24886 1.77393 8.93018 2.19287 8.68311V8.68311C3.0266 8.19142 3.99197 8.75789 4.85566 9.19479C5.505 9.52326 6.21978 9.6875 7 9.6875C7.78022 9.6875 8.495 9.52326 9.14434 9.19479C10.008 8.75789 10.9734 8.19142 11.8071 8.68311V8.68311C12.2261 8.93018 12.5627 9.24886 12.8169 9.63916C13.0711 10.0295 13.2806 10.4985 13.4453 11.0464C13.61 11.5942 13.7228 12.1385 13.7837 12.6792C13.8446 13.2199 13.875 13.7946 13.875 14.4033ZM9.9165 1.9585C9.9165 1.9585 10.1179 2.15991 10.5208 2.56274C10.9236 2.96558 11.125 3.73633 11.125 4.875C11.125 6.01367 10.7222 6.98584 9.9165 7.7915C9.11084 8.59717 8.13867 9 7 9C5.86133 9 4.88916 8.59717 4.0835 7.7915C3.27783 6.98584 2.875 6.01367 2.875 4.875C2.875 3.73633 3.27783 2.76416 4.0835 1.9585C4.88916 1.15283 5.86133 0.75 7 0.75C8.13867 0.75 9.11084 1.15283 9.9165 1.9585Z" fill="#ECF0F1"/>
                                </svg>
                                    <span>Войти</span>  
                                </Link>
                            }  
                           
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <div class="big_container">
                        <div class="nav_inner">
                            <a href="#" class="nav_logo">
                                <img src={logo} alt=""/>
                                <div class="nav_logo_text">
                                    <div class="nav_logo_title"><span style={{color: '#2980B9'}}>Консалтинг</span> <span style={{color: '#2C3E50'}}>Университет</span></div>
                                    <div class="nav_logo_subtitle">Вместе к совершенству!</div>
                                </div>
                            </a>
                            <div class="nav_links">
                                <a href="#" class="nav_link active">Главная</a>
                                <a href="#" class="nav_link">Обучение</a>
                                <a href="#" class="nav_link">О нас</a>
                                <a href="#" class="nav_link">Контакты</a>
                                <a href="#" class="nav_link">ИПС “Консалтинг”</a>
                                <a href="#" class="nav_link">ФГИС ФРДО</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="intro">
                <div class="big_intro_container">
                    <div class="intro_inner">
                        <div class="intro_phone">
                            <img class="intro_phone_img" src={phone} alt=""/>
                            <img class="intro_phone_img_photo" src={phone_img} alt=""/>
                            <img class="intro_phone_img_on" src={phone_img_photo} alt=""/>
                            <div class="intro_phone_text">
                                <div class="intro_phone_title">ОБУЧЕНИЕ</div>
                                <div class="intro_phone_subtitle">ПО ЗАКУПКАМ</div>
                                <div class="intro_phone_decription">44-ФЗ, 223-ФЗ</div>
                            </div>
                            
                        </div>
                        
                
                    </div>
                </div>
                    
                
            </div>
            
        </div>
    );
};

export default MainPage;