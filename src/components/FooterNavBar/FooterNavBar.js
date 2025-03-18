import React from 'react';

const FooterNavBar = () => {
    return (
        <div>
            <div className="legal">
        <div className="container">
            <div className="legal_text">Образовательные услуги оказываются ООО «Консалтинг-Университет» на основании Лицензии № ________________ от ”___” _______________ 202__ года</div>
        </div>
        
    </div>

    <div className="nav footer_nav">
        <div className="container">
            <div className="nav_inner">
                <div className="nav_links footer_nav">
                    <a href="#" className="nav_link">Главная</a>
                    <a href="#" className="nav_link">Программы обучения</a>
                    <a href="#" className="nav_link">График обучения</a>
                    <a href="#" className="nav_link">Стоимость</a>
                    <a href="#" className="nav_link">Для поступающих</a>
                    <a href="#" className="nav_link">ИПС Консалтинг</a>
                </div>
            </div>
        </div>
    </div>

    <footer className="footer">
         <div className="container">
            
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
    </footer>
        </div>
    );
};

export default FooterNavBar;