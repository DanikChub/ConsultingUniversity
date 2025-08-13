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
            
        </div>
    );
};

export default MainPage;