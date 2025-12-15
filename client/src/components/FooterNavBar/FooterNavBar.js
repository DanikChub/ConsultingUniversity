import React from 'react';

import white_logo from "../../assets/imgs/logo/white.png"

const FooterNavBar = () => {
    return (
        <div>
            <div className="pt-[30px] pb-[22px] bg-[#D9D9D9]">
            <div className="max-w-[1500px] px-[40px] w-full m-auto">
                <div className="text-md font-extralight text-[#000]">Образовательные услуги оказываются ООО «Консалтинг-Университет» на основании Лицензии № ________________ от ”___” _______________ 202__ года</div>
            </div>
        
    </div>

 
    <footer className="bg-[#2C3E50]">
         <div className="max-w-[1300px] px-[40px] w-full m-auto">
            <div className="m-auto pt-[120px] flex w-[78%] justify-between">
                <div className="">
                    <div className="font-extrabold text-2xl pb-[5px] text-[#fff]">Квалитет</div>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/about.html" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">О нас</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/contacts.html" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">Контакты</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/documents.html" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">Документы</a>
                </div>
                <div className="">
                    <div className="font-extrabold text-2xl pb-[5px] text-[#fff]">Обучение</div>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/programs.html" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">Программы обучения</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/index.html#how_learning" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">Процесс обучения </a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/check.html" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">ФИС ФРДО</a>
                </div>
                <div className="">
                    <div className="font-extrabold text-2xl pb-[5px] text-[#fff]">Помощь</div>
                    <a href="https://bk.kv34.ru/" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">ИПС “Консалтинг”</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/index.html#questions" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">Вопросы и ответы</a>
                    <a href="https://xn--34-6kchqrlk8db.xn--p1ai/files/pdfs/politic.pdf" className="block no-underline text-[#fff] font-extralight text-base mt-[25px] transition hover:underline">Политика конфиденциальности</a>
                </div>
            </div>
            <div className="mt-[140px] flex justify-center items-center pb-[83px]">
                <div className="footer_contacts_img">
                    <img src={white_logo} alt=""/>
                        
                        
                </div>
                <div className="ml-[44px] text-[#fff] text-base font-normal">
                    <b>Телефон:</b> <a className="hover:underline" href="tel:88005505690">8 800 550 5690</a><br/>
                    <b>e-mail:</b> <a className="hover:underline" href="mailto:school@kv34.ru">school@kv34.ru</a> <br/>
                    
                </div>
                <div className="ml-[44px] text-[#fff] text-base font-normal">
                    <b>ООО “Консалтинг-Университет”</b><br/>
                    <b>Адрес:</b> <a className="hover:underline" href="https://yandex.ru/maps/-/CLFae-M0">400066, г. Волгоград, ул. Донецкая, 16, оф. 408</a><br/>
                    
                </div>
            </div>
         </div>
    </footer>
    </div>
    );
};

export default FooterNavBar;