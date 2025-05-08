import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import "./FinishTestPage.css"

import complete from '../../assets/imgs/complete.png';
import fall from '../../assets/imgs/fall.jpg';
import { COURSE_ROUTE, TEST_ROUTE } from '../../utils/consts';

const FinishTestPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    useEffect(() => {
        console.log(params.get("title"))
    }, [])
    return (
        <div className="content">
        <div className="container">
            <div className="back_button">
                <a onClick={() => navigate(COURSE_ROUTE)}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#DCDCDC"/>
                        <path d="M15.2954 29.2433C14.9036 29.6325 14.9015 30.2657 15.2907 30.6575L21.6331 37.0429C22.0223 37.4348 22.6555 37.4369 23.0473 37.0477C23.4392 36.6585 23.4413 36.0253 23.0521 35.6335L17.4144 29.9576L23.0903 24.3198C23.4821 23.9306 23.4842 23.2975 23.095 22.9056C22.7058 22.5138 22.0727 22.5117 21.6808 22.9009L15.2954 29.2433ZM44.0034 29.0472L16.0035 28.9528L15.9968 30.9528L43.9966 31.0472L44.0034 29.0472Z" fill="#898989"/>
                    </svg>
                </a>
                
                <span>Назад</span>
            </div>
            <div className="title">
                <b>Тест.</b><span> {params.get("title")}</span>
            </div>
            
            <div className="finish_test">
                {Number(params.get("correct_answers")) / Number(params.get("questions")) > 0.75 ?
                    <img className="finish_img" src={complete} alt=""/>
                :
                    <img className="finish_img" width="260px" src={fall} alt=""/>
                }
                <div className="finish_result">{params.get("correct_answers")} / {params.get("questions")}</div>
                <div className="finish_text">{Number(params.get("correct_answers")) / Number(params.get("questions")) > 0.75 ? 'Вы справились с тестом, можно переходить к следующему уроку.' : 'Вы не прошли тест. Попробуйте еще раз!'}</div>
                <div onClick={() => navigate(-1)} className="finish_button">Пройти еще раз</div>
            </div>
            
        </div>
    </div>
    );
};

export default FinishTestPage;