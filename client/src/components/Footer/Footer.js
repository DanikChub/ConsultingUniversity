import React from 'react';

import white_logo from "../../assets/imgs/logo/white.png"

const Footer = () => {
    return (
        <footer className="footer">
         <div className="small_container">
            <div className="footer_items">
                <div className="footer_item">
                    <div className="footer_item_title">Квалитет</div>
                    <a href="#" className="footer_item_link">О нас</a>
                    <a href="https://bk.kv34.ru/" className="footer_item_link">ИПС “Консалтинг”</a>
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
                    <img src={white_logo} alt=""/>
                        
                        
                </div>
                <div className="footer_contacts_text">
                    <b>Телефон:</b> 8 800 550 5690<br/>
                    <b>e-mail:</b> school@kv34.ru <br/>
                    
                </div>
                <div className="footer_contacts_text">
                    <b>ООО “Консалтинг-Университет”</b><br/>
                    <b>Адрес:</b> 400066, г. Волгоград, ул. Донецкая, 16, оф. 408<br/>
                    
                </div>
            </div>
         </div>
    </footer>
    );
};

export default Footer;