import React from 'react';

import white_logo from "../../assets/imgs/logo/white.png"

const FooterNavBar = () => {
    return (
        <div>
            <div className="legal">
        <div className="container">
            <div className="legal_text">Образовательные услуги оказываются ООО «Консалтинг-Университет» на основании Лицензии № ________________ от ”___” _______________ 202__ года</div>
        </div>
        
    </div>

 
    <footer className="footer">
         <div className="small_container">
            <div className="footer_items">
                <div className="footer_item">
                    <div className="footer_item_title">Квалитет</div>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/about.html" className="footer_item_link">О нас</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/contacts.html" className="footer_item_link">Контакты</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/documents.html" className="footer_item_link">Документы</a>
                </div>
                <div className="footer_item">
                    <div className="footer_item_title">Обучение</div>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/programs.html" className="footer_item_link">Программы обучения</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/index.html#how_learning" className="footer_item_link">Процесс обучения </a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/check.html" className="footer_item_link">ФИС ФРДО</a>
                </div>
                <div className="footer_item">
                    <div className="footer_item_title">Помощь</div>
                    <a href="https://bk.kv34.ru/" className="footer_item_link">ИПС “Консалтинг”</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/index.html#questions" className="footer_item_link">Вопросы и ответы</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/files/pdfs/politic.pdf" className="footer_item_link">Политика конфиденциальности</a>
                </div>
            </div>
            <div className="footer_contacts">
                <div className="footer_contacts_img">
                    <img src={white_logo} alt=""/>
                        
                        
                </div>
                <div className="footer_contacts_text">
                    <b>Телефон:</b> <a href="tel:88005505690">8 800 550 5690</a><br/>
                    <b>e-mail:</b> <a href="mailto:school@kv34.ru">school@kv34.ru</a> <br/>
                    
                </div>
                <div className="footer_contacts_text">
                    <b>ООО “Консалтинг-Университет”</b><br/>
                    <b>Адрес:</b> <a href="https://yandex.ru/maps/-/CLFae-M0">400066, г. Волгоград, ул. Донецкая, 16, оф. 408</a><br/>
                    
                </div>
            </div>
         </div>
    </footer>
    </div>
    );
};

export default FooterNavBar;