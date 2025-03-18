import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { checkForgotPassword } from '../../http/userAPI';

import "./ForgotPasswordPage.css"
const ForgotPasswordPage = () => {
    const [inputPass, setInputPass] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [queryParams] = useSearchParams('');

    const handleClick = () => {
        checkForgotPassword(queryParams.get('email'), inputCode, inputPass).then(data => console.log(data));
    }
    return (
        <div className="login_form">
            <h3>Код для восстановления пароля был отправлен Вам на почту</h3>
            <input onChange={(e) => setInputCode(e.target.value)} className='login_form_input' value={inputCode} placeholder='****'/>
            <input onChange={(e) => setInputPass(e.target.value)} className='login_form_input' value={inputPass} placeholder='Новый пароль'/>
            <div onClick={handleClick} className='login_form_button'>Сменить пароль</div>
        </div>
    );
};

export default ForgotPasswordPage;