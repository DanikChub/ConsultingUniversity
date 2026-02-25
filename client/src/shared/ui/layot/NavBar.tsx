import React, { useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import logo from '../../../assets/imgs/logo/logo.png';
import {
    AUTH_ROUTE,
    USER_ROUTE,
    MAIN_ROUTE,
} from '../../utils/consts';

// Типизация для user контекста
interface IUser {
    user: {
        role: string;
    };
    isAuth: boolean;
    setUser: (user: object) => void;
    setIsAuth: (auth: boolean) => void;
}

const NavBar: React.FC = observer(() => {
    const { user } = useContext(Context) as { user: IUser };

    const navigate = useNavigate()

    const handleClick = () => {
        localStorage.setItem('token', '');
        user.setUser({});
        user.setIsAuth(false);
        navigate(AUTH_ROUTE);
    };

    return (
        <div>
            {/* Верхняя панель */}
            <div className="w-full h-[50px] flex items-center bg-[#2C3E50]">
                <div className="max-w-[1500px] px-[40px] w-full m-auto">
                    <div className="flex justify-between">
                        <div></div>
                        {user.isAuth ? (

                            <Link
                                to={MAIN_ROUTE}
                                style={{ marginLeft: '10px' }}
                                onClick={handleClick}
                                className="duration-300 flex items-center bg-[#33CCCC] rounded-md px-[12px] py-[6px] text-base font-medium text-[#fff] cursor-pointer transition hover:text-[#000] hover:bg-[#fff]"
                            >
                                Выйти
                            </Link>

                        ) : (
                            <Link
                                to={AUTH_ROUTE}
                                className="duration-300 flex items-center bg-[#33CCCC] rounded-md px-[12px] py-[6px] text-base font-medium text-[#fff] cursor-pointer transition-[.2s] hover:text-[#000] hover:bg-[#fff]"
                            >
                                Войти
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Логотип */}
            <div className="h-[90px] flex items-center bg-[#fff]">
                <div className="max-w-[1500px] px-[40px] w-full m-auto">
                    <div className="flex justify-between items-center">
                        <a
                            href="https://xn--34-6kchqrlk8db.xn--p1ai/"
                            className="flex items-center"
                        >
                            <img src={logo} alt="Логотип" />
                            <div className="ml-[5px]">
                                <div className="text-[36px] font-bold">
                                    <span style={{ color: '#2980B9' }}>КВАЛИТЕТ</span>
                                </div>
                                <div className="text-[#2C3E50] font-medium text-xs">
                                    Система дистанционного обучения
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Основная навигация */}
            <div className="bg-[#2C3E50] h-[61px] flex items-center">
                <div className="max-w-[1500px] px-[40px] w-full m-auto">
                    <div className="main_nav_links">
                        <Link
                            to={MAIN_ROUTE}
                            className="text-[#fff] ml-0 mr-[30px] font-normal no-underline"
                        >
                            Главная
                        </Link>
                        <a
                            href="https://xn--34-6kchqrlk8db.xn--p1ai/programs.html"
                            className="text-[#fff] ml-0 mr-[30px] font-normal no-underline"
                        >
                            Программы
                        </a>
                        <a
                            href="https://xn--34-6kchqrlk8db.xn--p1ai/about.html"
                            className="text-[#fff] ml-0 mr-[30px] font-normal no-underline"
                        >
                            О нас
                        </a>
                        <a
                            href="https://xn--34-6kchqrlk8db.xn--p1ai/contacts.html"
                            className="text-[#fff] ml-0 mr-[30px] font-normal no-underline"
                        >
                            Контакты
                        </a>
                        <a
                            href="https://bk.kv34.ru/"
                            className="text-[#fff] ml-0 mr-[30px] font-normal no-underline"
                        >
                            ИПС "Консалтинг"
                        </a>
                        <a
                            href="https://xn--34-6kchqrlk8db.xn--p1ai/check.html"
                            className="text-[#fff] ml-0 mr-[30px] font-normal no-underline"
                        >
                            ФИС ФРДО
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NavBar;
