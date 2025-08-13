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
            <div class="training_programs">
                <div class="big_container">
                    

                    <div class="training_programs_title">Программы обучения</div>
                    <div class="kit_buttons">
                        <div class="kit_button active">Все</div>
                        <div class="kit_button">Удостоверение</div>
                        <div class="kit_button">Диплом</div>
                    </div>

                    <div class="kit_container">
                        <div class="kit_items">
                            <div class="kit_item">
                                <img src={kit_items_1} alt="" class="kit_item_img"/>
                            </div>
                            <div class="kit_item">
                                <img src={kit_items_2} alt="" class="kit_item_img"/>
                            </div>
                            <div class="kit_item">
                                <img src={kit_items_3} alt="" class="kit_item_img"/>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>

            <div class="docs">
                <div class="container">
                    <div class="docs_inner">
                        
                        <div class="docs_title">Образец документа об образовании</div>
                        <div class="docs_text">По завершении обучения слушателю выдается диплом установленного (ранее — государственного) образца на защищенном бланке категории «Б» Киржачской типографии. Форма обучения в образовательном документе не указывается. Диплом действует бессрочно.</div>
                        <div class="slider">
                            <div class="arrow">
                                <svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.1911 1L1 14.1782" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                    <path d="M17.4813 28L1.22006 14.698" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                </svg>     
                            </div>
                            <img class="slider_img" src={diploma} alt=""/>
                            <img class="slider_img" src={diploma1} alt=""/>
                            <div class="arrow">
                                <svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L18.1911 14.1782" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                    <path d="M1.70984 28L17.971 14.698" stroke="#ECF0F1" stroke-opacity="0.61" stroke-linecap="round"/>
                                </svg>    
                            </div>
                        </div>
                    </div>
                </div>
                <img class="docs_img" src={university} alt=""/>
            </div>

            <div class="steps">
                <div class="big_container">
                    <div class="steps_inner">
                        <div class="steps_description">
                            <div class="steps_description_text">
                                Сведения о выданных документах о повышении квалификации и/или профессиональной переподготовке передаются в <a href="#">Федеральный реестр сведений о документах об образовании и (или) о квалификации</a> (ФИС ФРДО).
                            </div>
                            <div class="steps_description_text">
                                Мы всегда готовы вам помочь! 
        В личном кабинете вы можете задавать <a href="#">технические и практические вопросы</a> по обучению
                            </div>
                            <div class="steps_description_text">
                                Поддержка и <a href="#">живое общение</a> с преподавателями и экспертами в сфере закупок по 44-ФЗ и 223-ФЗ
                            </div>
                        </div>
                        <div class="steps_items">
                            <div class="step_item">
                                <img src={steps_1} alt="" class="step_item_img"/>
                                <div class="step_item_description">
                                    <div class="step_item_title">Подготовка</div>
                                    <div class="step_item_text">Вы формируете заявку на обучение. Мы оцениваем Ваши потребности, определяем подходящую программу.<br/>
                                        Заключение договора.</div>
                                </div>
                            </div>
                            <div class="step_item">
                                <img src={steps_2} alt="" class="step_item_img"/>
                                <div class="step_item_description">
                                    <div class="step_item_title">Обучение</div>
                                    <div class="step_item_text">Программа обучения разделена на удобные блоки.<br/>
                                        Обучающие материалы состоят из видео-уроков, лекций
                                        и презентаций.</div>
                                </div>
                            </div>
                            <div class="step_item">
                                <img src={steps_3} alt="" class="step_item_img"/>
                                <div class="step_item_description">
                                    <div class="step_item_title">Тестирование</div>
                                    <div class="step_item_text">В завершении каждого учебного блока, обучающиеся проходят тестирование. Успешные попытки идут в зачет.<br/>
                                        После успешного прохождения всех учебных модулей, обучающиеся проходят итоговое тестирование. </div>
                                </div>
                            </div>
                            <div class="step_item">
                                <img src={steps_4} alt="" class="step_item_img"/>
                                <div class="step_item_description">
                                    <div class="step_item_title">Диплом</div>
                                    <div class="step_item_text">Документ (диплом или удостоверение) направляется Почтой России заказным письмом с трек-номером для отслеживания</div>
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

            <div class="questions">
                <div class="container">
                    <div class="questions_inner">
                        <div class="questions_title">Часто задаваемые вопросы</div>
                        <div class="questions_items">
                            <div class="questions_item">
                                <img src={questions_1} alt="" class="questions_item_img"/>
                                <div class="questions_item_description">
                                    <div class="questions_item_title">Когда можно начать обучение?</div>
                                    <div class="questions_item_text">Вы можете начинать учиться в любое удобное для Вас время, после того, как будет открыт доступ к личному кабинету. Предоставление доступа к образовательному порталу не привязано к определенным датам.</div>
                                </div>
                            </div>
                            <div class="questions_item">
                                <img src={questions_2} alt="" class="questions_item_img"/>
                                <div class="questions_item_description">
                                    <div class="questions_item_title">Какие есть форматы обучения?</div>
                                    <div class="questions_item_text">Мы проводим обучение только в одном формате: дистанционно, с использованием образовательной интернет-платформы. Слушателю предоставляется доступ к личному кабинету, где загружены видео с лекциями, занятия и промежуточные проверки полученных знаний.</div>
                                </div>
                            </div>
                            <div class="questions_item">
                                <img src={questions_3} alt="" class="questions_item_img"/>
                                <div class="questions_item_description">
                                    <div class="questions_item_title">Как проходит практика?</div>
                                    <div class="questions_item_text">По мере обучения слушателям предлагают выполнить практические задания на основе пройденного материала. Проверка работ проводится куратором.</div>
                                </div>
                            </div>
                            <div class="questions_item">
                                <img src={questions_4} alt="" class="questions_item_img"/>
                                <div class="questions_item_description">
                                    <div class="questions_item_title">Сколько попыток в тестировании?</div>
                                    <div class="questions_item_text">Количество попыток пройти тестирование не ограничено
                                        В оценку засчитывается лучшая попытка.</div>
                                </div>
                            </div>
                        </div>
                        <div class="faq_button training_programs_button">Читать все вопросы</div>
                    </div>
                </div>
            </div>

            <div class="certificates">
                <div class="container">
                    <div class="certificates_title">Документы на осуществление образовательной деятельности</div>
                    <div class="certificates_text">Лицензия на дополнительное профессиональное образование выдается бессрочно и действует на всей территории Российской Федерации.</div>
                    <div class="certificates_items">
                        <img src={diploms_1} alt="" class="certificates_item_img"/>
                        <img src={diploms_2} alt="" class="certificates_item_img"/>
                        <img src={diploms_3} alt="" class="certificates_item_img"/>
                        <img src={diploms_4} alt="" class="certificates_item_img"/>
                    </div>

                </div>
            </div>

            <div class="programs">
                <div class="container">
                    <div class="programs_inner">
                        <div class="programs_title">Программы обучения предназначеня для:</div>
                        <div class="programs_items">
                            <div class="programs_item">
                                <img src={programs_1} alt="" class="programs_item_img"/>

                                <div class="program_item_title">Заказчики</div>
                                <div class="program_item_text">Организации и учреждения, осуществляющие закупки в соответствии с законом, включая государственные органы, муниципальные учреждения, коммерческие организации, участвующие в государственных или муниципальных закупках</div>
                            </div>
                        
                            <div class="programs_item">
                                <img src={programs_2} alt="" class="programs_item_img"/>

                                <div class="program_item_title">Участники</div>
                                <div class="program_item_text">Юридические лица и индивидуальные предприниматели, участвующие в процедурах закупок (подготовка и подача заявок, участие в торгах)</div>
                            </div>

                            <div class="programs_item">
                                <img src={programs_3} alt="" class="programs_item_img"/>

                                <div class="program_item_title">Специалисты </div>
                                <div class="program_item_text">Сотрудники организаций, ответственные за подготовку и проведение закупочных процедур, а также за соблюдение требований законодательства при осуществлении закупок</div>
                            </div>

                            <div class="programs_item">
                                <img src={programs_4} alt="" class="programs_item_img"/>

                                <div class="program_item_title">Руководители и менеджеры</div>
                                <div class="program_item_text">Специалисты, принимающие участие в закупках или контролирующие их проведение.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="legal">
                <div class="container">
                    <div class="legal_text">Образовательные услуги оказываются ООО «Консалтинг-Университет» на основании Лицензии № ________________ от ”___” _______________ 202__ года</div>
                </div>
                
            </div>


            <footer class="footer">
                <div class="container">
                    <div class="footer_items">
                        <div class="footer_item">
                            <div class="footer_item_title">О нас</div>
                            <a href="#" class="footer_item_link">Контакты</a>
                            <a href="#" class="footer_item_link">ИПС “Консалтинг”</a>
                            <a href="#" class="footer_item_link">Документы</a>
                        </div>
                        <div class="footer_item">
                            <div class="footer_item_title">Обучение</div>
                            <a href="#" class="footer_item_link">Программы обучения</a>
                            <a href="#" class="footer_item_link">Стоимость</a>
                            <a href="#" class="footer_item_link">Процесс обучения</a>
                        </div>
                        <div class="footer_item">
                            <div class="footer_item_title">Помощь</div>
                            <a href="#" class="footer_item_link">Правила работы</a>
                            <a href="#" class="footer_item_link">Вопросы и ответы</a>
                            <a href="#" class="footer_item_link">Политика конфиденциальности </a>
                        </div>
                    </div>
                    <div class="footer_contacts">
                        <div class="footer_contacts_img">
                            <svg width="73" height="72" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M68.6763 39.7215C66.7972 55.9044 52.9976 68.4672 36.2535 68.4672C18.2267 68.4672 3.61224 53.9048 3.61224 35.9423C3.61224 19.1926 16.32 5.3998 32.6527 3.61328" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M38.7854 3.43555C55.4181 4.18909 68.7706 17.4792 69.5521 34.0457" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M59.9026 39.6481C58.1016 51.0268 48.2154 59.7292 36.2902 59.7292C23.0871 59.7292 12.3848 49.0651 12.3848 35.909C12.3848 23.96 21.2149 14.0654 32.7274 12.3511" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M38.2257 12.0371C50.2163 12.7803 59.813 22.3325 60.5749 34.2758" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M50.2152 39.4398C48.6119 45.5644 43.0228 50.0845 36.3753 50.0845C28.4762 50.0845 22.0734 43.7045 22.0734 35.8336C22.0734 29.1433 26.6994 23.5295 32.9389 21.9961" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M38.5555 20.8818C45.5398 21.577 51.0967 27.1026 51.8127 34.0562" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                
                        </div>
                        <div class="footer_contacts_text">
                            <b>Телефон:</b> 8 800 550 5690<br/>
                            <b>e-mail:</b> gl@kv34.ru<br/>
                            <b>Адрес:</b> 400066, г. Волгоград, ул. Донецкая, 16, оф. 408
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;