import React, {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login, getUserById, forgotPassword } from '../../http/userAPI';
import { Context } from '../../index';
import { ADMIN_ROUTE, FORGOT_PASSWORD_ROUTE, USER_ROUTE } from '../../utils/consts';
import "./LoginPage.css"

const LoginPage = () => {
    const {user} = useContext(Context)
    const [inputLogin, setInputLogin] = useState('');
    const [inputPass, setInputPass] = useState('');

    const navigate = useNavigate();

    const signIn = async () => {
        try {

            login(inputLogin, inputPass).then(data => {
                getUserById(data.id).then(data => {
                    user.setUser(data)
                    user.setIsAuth(true)
                    console.log(user.isAuth);
                })
                .finally(data => {
                    if (user.user.role == "USER") {
                        navigate(USER_ROUTE);
                    } else if (user.user.role == "ADMIN") {
                        navigate(ADMIN_ROUTE);
                    }
                    
                })
            })
        } catch(e) {
            alert("ошибка")
        }
        
    }
    return (
        <div className="login_form">
            <h3>Войти в личный кабинет</h3>
            <input className='login_form_input' value={inputLogin} onChange={(e) => setInputLogin(e.target.value)} placeholder='Логин'/>
            <input className='login_form_input' value={inputPass}  onChange={(e) => setInputPass(e.target.value)} placeholder='Пароль' type="password"/>
            <div className='login_form_button' onClick={signIn}>Войти</div>
            <Link onClick={() => forgotPassword(inputLogin)} to={FORGOT_PASSWORD_ROUTE + '?email=' + 'inputLogin'} className='login_form_forgot_pass'>Забыл пароль</Link>
        </div>
    );
};

export default LoginPage;