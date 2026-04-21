import React, {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login, getUserById, forgotPassword } from '../../entities/user/api/user.api';
import { Context } from '../../index';
import {ADMIN_ROUTE, FORGOT_PASSWORD_ROUTE, SET_INITIAL_PASSWORD_ROUTE, USER_ROUTE} from '../../shared/utils/consts';
import "./LoginPage.css"

const LoginPage = () => {
    const {user} = useContext(Context)
    const [inputLogin, setInputLogin] = useState('');
    const [message, setMessage] = useState('');
    const [inputPass, setInputPass] = useState('');

    const navigate = useNavigate();

    const signIn = async () => {
        try {
            setMessage('');

            const loginData = await login(inputLogin, inputPass);

            const currentUser = loginData.user ?? await getUserById(loginData.user?.id || loginData.id);

            user.setUser(currentUser);
            user.setIsAuth(true);

            if (loginData.mustChangePassword) {
                navigate(SET_INITIAL_PASSWORD_ROUTE);
                return;
            }

            if (currentUser.role === 'USER') {
                navigate(USER_ROUTE);
            } else if (currentUser.role === 'ADMIN' || currentUser.role === 'VIEWER') {
                navigate(ADMIN_ROUTE);
            }
        } catch (e) {
            setMessage(e?.response?.data?.message || 'Ошибка авторизации');
        }
    };
    return (
        <div
            className="mx-auto mt-[150px] mb-[150px] w-[400px] h-max rounded-[10px] bg-white p-[20px] shadow-[2px_2px_10px_2px_rgba(0,0,0,0.181)]">
            <h3>Войти в личный кабинет</h3>

            <input
                className="mt-[40px] w-full border-b border-[rgb(173,173,173)] p-[10px] text-[16px] outline-none"
                value={inputLogin}
                onChange={(e) => setInputLogin(e.target.value)}
                placeholder="Логин"
            />

            <input
                className="mt-[20px] w-full border-b border-[rgb(173,173,173)] p-[10px] text-[16px] outline-none"
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
                placeholder="Пароль"
                type="password"
            />

            <div className="mt-[20px] text-[rgb(251,68,68)]">
                {message}
            </div>

            <div
                onClick={signIn}
                className="mx-auto mt-[40px] cursor-pointer rounded-[4px] bg-[#2980B9] px-[24px] py-[12px] text-center text-white transition-all duration-200 hover:bg-black"
            >
                Войти
            </div>

            <Link
                to={FORGOT_PASSWORD_ROUTE + '?login=' + inputLogin}
                className="mt-[20px] block"
            >
                Забыл пароль
            </Link>
        </div>
    );
};

export default LoginPage;