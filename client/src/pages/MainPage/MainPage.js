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
import { AUTH_ROUTE, ADMIN_ROUTE, MAIN_ROUTE, USER_ROUTE, EXPERT_ROUTE } from '../../utils/consts';
import { createApplication } from '../../http/applicationAPI';
import { Context } from '../../index';
import Footer from '../../components/Footer/Footer';

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
            <div className="header">
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
                                    <div className="nav_logo_title"><span style={{color: '#2980B9'}}>Консалтинг</span> <span style={{color: '#2C3E50'}}>Университет</span></div>
                                    <div className="nav_logo_subtitle">Вместе к совершенству!</div>
                                </div>
                            </a>
                            <div className="nav_links">
                                <a href="#" className="nav_link active">Главная</a>
                                <a href="#" className="nav_link">Обучение</a>
                                <a href="#" className="nav_link">О нас</a>
                                <a href="#" className="nav_link">Контакты</a>
                                <a href="#" className="nav_link">ИПС “Консалтинг”</a>
                                <a href="#" className="nav_link">ФИС ФРДО</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="intro">
                <div className="big_intro_container">
                    <div className="intro_inner">
                        <div className="intro_phone">
                            <img className="intro_phone_img" src={phone} alt=""/>
                            <img className="intro_phone_img_photo" src={phone_img} alt=""/>
                            <img className="intro_phone_img_on" src={phone_img_photo} alt=""/>
                            <div className="intro_phone_text">
                                <div className="intro_phone_title">ОБУЧЕНИЕ</div>
                                <div className="intro_phone_subtitle">ПО ЗАКУПКАМ</div>
                                <div className="intro_phone_decription">44-ФЗ, 223-ФЗ</div>
                            </div>
                            
                        </div>
                        
                
                    </div>
                </div>
                    
                
            </div>
            <div className="training_programs">
                <div className="big_container">
                    

                    <div className="training_programs_title">Программы обучения</div>
                    <div className="kit_buttons">
                        <div className="kit_button active">Все</div>
                        <div className="kit_button">Удостоверение</div>
                        <div className="kit_button">Диплом</div>
                    </div>

                    <div className="kit_container">
                        <div className="kit_items">
                            <div className="kit_item">
                                <img src={kit_items_1} alt="" className="kit_item_img"/>
                            </div>
                            <Link to={EXPERT_ROUTE} className="kit_item">
                                <img src={kit_items_2} alt="" className="kit_item_img"/>
                            </Link>
                            <div className="kit_item">
                                <img src={kit_items_3} alt="" className="kit_item_img"/>
                            </div>
                        </div>
                    
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
                                    <path d="M18.1911 1L1 14.1782" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                    <path d="M17.4813 28L1.22006 14.698" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                </svg>     
                            </div>
                            <img className="slider_img" src={diploma} alt=""/>
                            <img className="slider_img" src={diploma1} alt=""/>
                            <div className="arrow">
                                <svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L18.1911 14.1782" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                    <path d="M1.70984 28L17.971 14.698" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                </svg>    
                            </div>
                        </div>
                    </div>
                </div>
                <img className="docs_img" src={university} alt=""/>
            </div>

            <div className="steps">
                <div className="big_container">
                    <div className="steps_inner">
                        <div className="steps_description">
                            <div className="steps_description_text">
                                Сведения о выданных документах о повышении квалификации и/или профессиональной переподготовке передаются в <a href="#">Федеральный реестр сведений о документах об образовании и (или) о квалификации</a> (ФИС ФРДО).
                            </div>
                            <div className="steps_description_text">
                                Мы всегда готовы вам помочь! 
        В личном кабинете вы можете задавать <a href="#">технические и практические вопросы</a> по обучению
                            </div>
                            <div className="steps_description_text">
                                Поддержка и <a href="#">живое общение</a> с преподавателями и экспертами в сфере закупок по 44-ФЗ и 223-ФЗ
                            </div>
                        </div>
                        <div className="steps_items">
                            <div className="step_item">
                                <img src={steps_1} alt="" className="step_item_img"/>
                                <div className="step_item_description">
                                    <div className="step_item_title">Подготовка</div>
                                    <div className="step_item_text">Вы формируете заявку на обучение. Мы оцениваем Ваши потребности, определяем подходящую программу.<br/>
                                        Заключение договора.</div>
                                </div>
                            </div>
                            <div className="step_item">
                                <img src={steps_2} alt="" className="step_item_img"/>
                                <div className="step_item_description">
                                    <div className="step_item_title">Обучение</div>
                                    <div className="step_item_text">Программа обучения разделена на удобные блоки.<br/>
                                        Обучающие материалы состоят из видео-уроков, лекций
                                        и презентаций.</div>
                                </div>
                            </div>
                            <div className="step_item">
                                <img src={steps_3} alt="" className="step_item_img"/>
                                <div className="step_item_description">
                                    <div className="step_item_title">Тестирование</div>
                                    <div className="step_item_text">В завершении каждого учебного блока, обучающиеся проходят тестирование. Успешные попытки идут в зачет.<br/>
                                        После успешного прохождения всех учебных модулей, обучающиеся проходят итоговое тестирование. </div>
                                </div>
                            </div>
                            <div className="step_item">
                                <img src={steps_4} alt="" className="step_item_img"/>
                                <div className="step_item_description">
                                    <div className="step_item_title">Диплом</div>
                                    <div className="step_item_text">Документ (диплом или удостоверение) направляется Почтой России заказным письмом с трек-номером для отслеживания</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="return_call">
            <img src={girl} alt="" className="return_call_img"/>
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

            <div className="questions">
                <div className="container">
                    <div className="questions_inner">
                        <div className="questions_title">Часто задаваемые вопросы</div>
                        <div className="questions_items">
                            <div className="questions_item">
                                <img src={questions_1} alt="" className="questions_item_img"/>
                                <div className="questions_item_description">
                                    <div className="questions_item_title">Когда можно начать обучение?</div>
                                    <div className="questions_item_text">Вы можете начинать учиться в любое удобное для Вас время, после того, как будет открыт доступ к личному кабинету. Предоставление доступа к образовательному порталу не привязано к определенным датам.</div>
                                </div>
                            </div>
                            <div className="questions_item">
                                <img src={questions_2} alt="" className="questions_item_img"/>
                                <div className="questions_item_description">
                                    <div className="questions_item_title">Какие есть форматы обучения?</div>
                                    <div className="questions_item_text">Мы проводим обучение только в одном формате: дистанционно, с использованием образовательной интернет-платформы. Слушателю предоставляется доступ к личному кабинету, где загружены видео с лекциями, занятия и промежуточные проверки полученных знаний.</div>
                                </div>
                            </div>
                            <div className="questions_item">
                                <img src={questions_3} alt="" className="questions_item_img"/>
                                <div className="questions_item_description">
                                    <div className="questions_item_title">Как проходит практика?</div>
                                    <div className="questions_item_text">По мере обучения слушателям предлагают выполнить практические задания на основе пройденного материала. Проверка работ проводится куратором.</div>
                                </div>
                            </div>
                            <div className="questions_item">
                                <img src={questions_4} alt="" className="questions_item_img"/>
                                <div className="questions_item_description">
                                    <div className="questions_item_title">Сколько попыток в тестировании?</div>
                                    <div className="questions_item_text">Количество попыток пройти тестирование не ограничено
                                        В оценку засчитывается лучшая попытка.</div>
                                </div>
                            </div>
                        </div>
                        <div className="faq_button training_programs_button">Читать все вопросы</div>
                    </div>
                </div>
            </div>

            <div className="certificates">
                <div className="container">
                    <div className="certificates_title">Документы на осуществление образовательной деятельности</div>
                    <div className="certificates_text">Лицензия на дополнительное профессиональное образование выдается бессрочно и действует на всей территории Российской Федерации.</div>
                    <div className="certificates_items">
                        <img src={diploms_1} alt="" className="certificates_item_img"/>
                        <img src={diploms_2} alt="" className="certificates_item_img"/>
                        <img src={diploms_3} alt="" className="certificates_item_img"/>
                        <img src={diploms_4} alt="" className="certificates_item_img"/>
                    </div>

                </div>
            </div>

            <div className="programs">
                <div className="container">
                    <div className="programs_inner">
                        <div className="programs_title">Программы обучения предназначеня для:</div>
                        <div className="programs_items">
                            <div className="programs_item">
                                <img src={programs_1} alt="" className="programs_item_img"/>

                                <div className="program_item_title">Заказчики</div>
                                <div className="program_item_text">Организации и учреждения, осуществляющие закупки в соответствии с законом, включая государственные органы, муниципальные учреждения, коммерческие организации, участвующие в государственных или муниципальных закупках</div>
                            </div>
                        
                            <div className="programs_item">
                                <img src={programs_2} alt="" className="programs_item_img"/>

                                <div className="program_item_title">Участники</div>
                                <div className="program_item_text">Юридические лица и индивидуальные предприниматели, участвующие в процедурах закупок (подготовка и подача заявок, участие в торгах)</div>
                            </div>

                            <div className="programs_item">
                                <img src={programs_3} alt="" className="programs_item_img"/>

                                <div className="program_item_title">Специалисты </div>
                                <div className="program_item_text">Сотрудники организаций, ответственные за подготовку и проведение закупочных процедур, а также за соблюдение требований законодательства при осуществлении закупок</div>
                            </div>

                            <div className="programs_item">
                                <img src={programs_4} alt="" className="programs_item_img"/>

                                <div className="program_item_title">Руководители и менеджеры</div>
                                <div className="program_item_text">Специалисты, принимающие участие в закупках или контролирующие их проведение.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="legal">
                <div className="container">
                    <div className="legal_text">Образовательные услуги оказываются ООО «Консалтинг-Университет» на основании Лицензии № ________________ от ”___” _______________ 202__ года</div>
                </div>
                
            </div>


            <Footer/>
        </div>
    );
};

export default MainPage;