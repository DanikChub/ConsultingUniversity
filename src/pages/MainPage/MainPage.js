import React, { useState } from 'react';


import "./MainPage.css";

import video from "../../assets/videos/bg/bg.mp4";
import logo from "../../assets/imgs/logo/logo.png"
import training_program_1 from "../../assets/imgs/training_programs/1.png";
import training_program_2 from "../../assets/imgs/training_programs/2.png";
import training_program_3 from "../../assets/imgs/training_programs/3.png";
import { Link } from 'react-router-dom';
import { AUTH_ROUTE, ADMIN_ROUTE } from '../../utils/consts';
import { createApplication } from '../../http/applicationAPI';

const MainPage = () => {
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
    }
    return (
        <div>
            {/* <div className="header">
        <div className="top_nav">
            <div className="big_container">
                <div className="top_nav_links">
                    <div className="top_nav_number">Позвонить: 8 800 550 5690</div>
                    <Link to={AUTH_ROUTE} className="top_nav_sign_in">
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.875 14.4033C13.875 15.1839 13.6512 15.8535 13.2036 16.4121C12.756 16.9707 12.2171 17.25 11.5869 17.25H2.41309C1.78288 17.25 1.24398 16.9707 0.796387 16.4121C0.348796 15.8535 0.125 15.1839 0.125 14.4033C0.125 13.7946 0.155436 13.2199 0.216309 12.6792C0.277181 12.1385 0.389974 11.5942 0.554688 11.0464C0.719401 10.4985 0.928874 10.0295 1.18311 9.63916C1.43734 9.24886 1.77393 8.93018 2.19287 8.68311V8.68311C3.0266 8.19142 3.99197 8.75789 4.85566 9.19479C5.505 9.52326 6.21978 9.6875 7 9.6875C7.78022 9.6875 8.495 9.52326 9.14434 9.19479C10.008 8.75789 10.9734 8.19142 11.8071 8.68311V8.68311C12.2261 8.93018 12.5627 9.24886 12.8169 9.63916C13.0711 10.0295 13.2806 10.4985 13.4453 11.0464C13.61 11.5942 13.7228 12.1385 13.7837 12.6792C13.8446 13.2199 13.875 13.7946 13.875 14.4033ZM9.9165 1.9585C9.9165 1.9585 10.1179 2.15991 10.5208 2.56274C10.9236 2.96558 11.125 3.73633 11.125 4.875C11.125 6.01367 10.7222 6.98584 9.9165 7.7915C9.11084 8.59717 8.13867 9 7 9C5.86133 9 4.88916 8.59717 4.0835 7.7915C3.27783 6.98584 2.875 6.01367 2.875 4.875C2.875 3.73633 3.27783 2.76416 4.0835 1.9585C4.88916 1.15283 5.86133 0.75 7 0.75C8.13867 0.75 9.11084 1.15283 9.9165 1.9585Z" fill="#ECF0F1"/>
                        </svg>
                        <span>Войти в ЛК</span>  
                    </Link>
                </div>
            </div>
        </div>
        <div className="nav">
            <div className="big_container">
                <div className="nav_inner">
                    <a href="#" className="nav_logo">
                        <img src={logo} alt=""/>
                        <div className="nav_logo_text">
                            <div className="nav_logo_title"><span style={{color: "#2980B9"}}>Консалтинг</span> <span style={{color: "#2980B9"}}>Университет</span></div>
                            <div className="nav_logo_subtitle">Вместе к совершенству!</div>
                        </div>
                    </a>
                    <div className="nav_links">
                        <a href="#" className="nav_link active">Главная</a>
                        <a href="#" className="nav_link">Для поступающих</a>
                        <a href="#" className="nav_link">О нас</a>
                        <a href="#" className="nav_link">Контакты</a>
                        <a href="#" className="nav_link">ИПС “Консалтинг”</a>
                    </div>
                </div>
            </div>
        </div>
    </div> */}
    <div className="intro">
        <div className="intro_video_bg_container">
            <video className="intro_video_bg" src={video} autoPlay muted loop="loop"></video>
        </div>
        
        <div className="intro_inner">
            <div className="intro_title">Обучение по закупкам<br/>44-фз, 223-фз</div>
            <div className="intro_text">Онлайн курсы для заказчиков и поставщиков по закупкам с выдачей удостоверения о повышении квалификации или диплома о профессиональной переподготовке</div>
        </div>
        
    </div>
    <div className="training_programs">
        <div className="container">
            <div className="training_buttons">
                <a href="#" className="training_button black">Выбрать программу</a>
                <Link to={AUTH_ROUTE} className="training_button blue">Войти в ЛК</Link>
                <a href="#" className="training_button lightblue">Спросить</a>
            </div>

            <div className="training_programs_title">Программы обучения</div>
            <div className="kit_buttons">
                <div className="kit_button active">Диплом</div>
                <div className="kit_button">Удостоверение</div>
            </div>

            <div className="kit_container">
                <div className="kit_items">
                    <div className="kit_item">
                        <img src={training_program_1} alt="" className="kit_item_img"/>
                        <div className="kit_item_ontitle">Госзакупки</div>
                        <div className="kit_item_title">Управление государственными, муниципальными и корпоративными закупками</div>
                        <div className="kit_item_text">Профпереподготовка 260 акад. часов</div>
                        <div className="kit_item_button">Читать далее</div>
                    </div>
                    <div className="kit_item">
                        <img src={training_program_2} alt="" className="kit_item_img"/>
                        <div className="kit_item_ontitle">Госзакупки</div>
                        <div className="kit_item_title">Эксперт в сфере корпоративных закупок (223-ФЗ)</div>
                        <div className="kit_item_text">Профпереподготовка 260 акад. часов</div>
                        <div className="kit_item_button">Читать далее</div>
                    </div>
                    <div className="kit_item">
                        <img src={training_program_3} alt="" className="kit_item_img"/>
                        <div className="kit_item_ontitle">Госслужба</div>
                        <div className="kit_item_title">Противодействие коррупции</div>
                        <div className="kit_item_text">Профпереподготовка 180 акад. часов</div>
                        <div className="kit_item_button">Читать далее</div>
                    </div>
                </div>
                <div className="training_programs_button">Смотреть все программы</div>
            </div>
        </div>
    </div>

    <div className="docs">
        <div className="container">
            <div className="docs_inner">
                
                <div className="docs_title">Образец документа об образовании</div>
                <div className="docs_text">По завершении обучения слушателю выдается диплом установленного (ранее — государственного) образца на защищенном бланке категории «Б» Киржачской типографии. Форма обучения в образовательном документе не указывается. Диплом действует бессрочно.</div>
                <div className="slider">
                    <div className="arrow">
                        <svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.1911 1L1 14.1782" stroke="#ECF0F1" strokeOpacity="0.61" strokeLinecap="round"/>
                            <path d="M17.4813 28L1.22006 14.698" stroke="#ECF0F1" strokeOpacity="0.61" strokeLinecap="round"/>
                        </svg>     
                    </div>
                    <img className="slider_img" src="../../assets/imgs/slider_docs/diploma.png" alt=""/>
                    <img className="slider_img" src="../../assets/imgs/slider_docs/diploma1.png" alt=""/>
                    <div className="arrow">
                        <svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L18.1911 14.1782" stroke="#ECF0F1" strokeOpacity="0.61" strokeLinecap="round"/>
                            <path d="M1.70984 28L17.971 14.698" stroke="#ECF0F1" strokeOpacity="0.61" strokeLinecap="round"/>
                        </svg>    
                    </div>
                </div>
            </div>
        </div>
        <img className="docs_img" src="../../assets/imgs/bg/university.png" alt=""/>
    </div>

    <div className="faq">
        <div className="container">
            <div className="faq_title">Часто задаваемые вопросы</div>
            <div className="faq_items">
                <div className="faq_item">
                    <img src={null} alt="" width="98px" height="98px" className="faq_item_img"/>
                    <div className="faq_item_description">
                        <div className="faq_item_title">Когда можно начать обучение?</div>
                        <div className="faq_item_text">Вы можете начинать учиться в любое удобное для Вас время, после того, как будет открыт доступ к личному кабинету. Предоставление доступа к образовательному порталу не привязано к определенным датам.</div>
                    </div>
                </div>
                <div className="faq_item">
                    <img src={null} alt="" width="98px" height="98px" className="faq_item_img"/>
                    <div className="faq_item_description">
                        <div className="faq_item_title">Какие есть форматы обучения?</div>
                        <div className="faq_item_text">Мы проводим обучение только в одном формате: дистанционно, с использованием образовательной интернет-платформы. Слушателю предоставляется доступ к личному кабинету, где загружены видео с лекциями, занятия и промежуточные проверки полученных знаний.</div>
                    </div>
                </div>
                <div className="faq_item">
                    <img src={null} alt="" width="98px" height="98px" className="faq_item_img"/>
                    <div className="faq_item_description">
                        <div className="faq_item_title">Как проходит практика?</div>
                        <div className="faq_item_text">По мере обучения слушателям предлагают выполнить практические задания на основе пройденного материала. Проверка работ проводится куратором.</div>
                    </div>
                </div>
                <div className="faq_item">
                    <img src={null} alt="" width="98px" height="98px" className="faq_item_img"/>
                    <div className="faq_item_description">
                        <div className="faq_item_title">Сколько попыток в тестировании?</div>
                        <div className="faq_item_text">Количество попыток пройти тестирование не ограничено<br/>
                            В оценку засчитывается лучшая попытка.</div>
                    </div>
                </div>
            </div>
            <div className="faq_button training_programs_button">Читать все вопросы</div>
        </div>
    </div>

    <div className="return_call">
        <img src="../../assets/imgs/bg/girl.png" alt="" className="return_call_img"/>
        <div className="container">
            <div className="return_call_form">
                <div className="return_call_form_title">Оставить заявку на обучение</div>
                <div className="return_call_form_text">Ваше обращение будет обработано нашими клиентскими менеджерами в рабочее время</div>
                <input onChange={(e) => setNameInput(e.target.value)} value={nameInput} type="text"  className="return_call_form_input" placeholder="Имя"/>
                <input onChange={(e) => setEmailInput(e.target.value)} value={emailInput} type="text"  className="return_call_form_input" placeholder="e-mail"/>
                <input onChange={(e) => setPhoneInput(e.target.value)} value={phoneInput} type="text"  className="return_call_form_input" placeholder="Телефон"/>
                <div onClick={() => clickHandler()} className="return_call_button training_programs_button">Отправить</div>
            </div>
        </div>
    </div>


    <div className="certificates">
        <div className="container">
            <div className="certificates_title">Документы на осуществление образовательной деятельности</div>
            <div className="certificates_text">Лицензия на дополнительное профессиональное образование выдается бессрочно и действует на всей территории Российской Федерации.</div>
            <div className="certificates_items">
                <img src="../../assets/imgs/diploms/1.png" alt="" className="certificates_item_img"/>
                <img src="../../assets/imgs/diploms/2.png" alt="" className="certificates_item_img"/>
                <img src="../../assets/imgs/diploms/3.png" alt="" className="certificates_item_img"/>
                <img src="../../assets/imgs/diploms/4.png" alt="" className="certificates_item_img"/>
            </div>

        </div>
    </div>

    {/* <div className="legal">
        <div className="container">
            <div className="legal_text">Образовательные услуги оказываются ООО «Консалтинг-Университет» на основании Лицензии № ________________ от ”___” _______________ 202__ года</div>
        </div>
        
    </div>

    <div className="nav footer_nav">
        <div className="container">
            <div className="nav_inner">
                <div className="nav_links footer_nav">
                    <a href="#" className="nav_link active">Главная</a>
                    <a href="#" className="nav_link">Для поступающих</a>
                    <a href="#" className="nav_link">О нас</a>
                    <a href="#" className="nav_link">Контакты</a>
                    <a href="#" className="nav_link">ИПС “Консалтинг”</a>
                </div>
            </div>
        </div>
    </div>

    <footer className="footer">
         <div className="container">
            <div className="footer_items">
                <div className="footer_item">
                    <div className="footer_item_title">О нас</div>
                    <a href="#" className="footer_item_link">Контакты</a>
                    <a href="#" className="footer_item_link">ИПС “Консалтинг”</a>
                    <a href="#" className="footer_item_link">Документы</a>
                </div>
                <div className="footer_item">
                    <div className="footer_item_title">Обучение</div>
                    <a href="#" className="footer_item_link">Программы обучения</a>
                    <a href="#" className="footer_item_link">Стоимость</a>
                    <a href="#" className="footer_item_link">Процесс обучения</a>
                </div>
                <div className="footer_item">
                    <div className="footer_item_title">Помощь</div>
                    <a href="#" className="footer_item_link">Правила работы</a>
                    <a href="#" className="footer_item_link">Вопросы и ответы</a>
                    <a href="#" className="footer_item_link">Политика конфиденциальности </a>
                </div>
            </div>
            <div className="footer_contacts">
                <div className="footer_contacts_img">
                    <svg width="73" height="72" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M68.6763 39.7215C66.7972 55.9044 52.9976 68.4672 36.2535 68.4672C18.2267 68.4672 3.61224 53.9048 3.61224 35.9423C3.61224 19.1926 16.32 5.3998 32.6527 3.61328" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M38.7854 3.43555C55.4181 4.18909 68.7706 17.4792 69.5521 34.0457" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M59.9026 39.6481C58.1016 51.0268 48.2154 59.7292 36.2902 59.7292C23.0871 59.7292 12.3848 49.0651 12.3848 35.909C12.3848 23.96 21.2149 14.0654 32.7274 12.3511" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M38.2257 12.0371C50.2163 12.7803 59.813 22.3325 60.5749 34.2758" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M50.2152 39.4398C48.6119 45.5644 43.0228 50.0845 36.3753 50.0845C28.4762 50.0845 22.0734 43.7045 22.0734 35.8336C22.0734 29.1433 26.6994 23.5295 32.9389 21.9961" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M38.5555 20.8818C45.5398 21.577 51.0967 27.1026 51.8127 34.0562" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        
                </div>
                <div className="footer_contacts_text">
                    <b>Телефон:</b> 8 800 550 5690<br/>
                    <b>e-mail:</b> gl@kv34.ru<br/>
                    <b>Адрес:</b> 400066, г. Волгоград, ул. Донецкая, 16, оф. 408
                </div>
            </div>
         </div>
    </footer> */}
        </div>
    );
};

export default MainPage;