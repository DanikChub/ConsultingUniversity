import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import "./FinishTestPage.css"

import complete from '../../../assets/imgs/complete.png';
import fall from '../../../assets/imgs/fall.jpg';
import { COURSE_ROUTE, TEST_ROUTE } from '../../../utils/consts';
import { getOneTest, getTestStatistic } from '../../../http/testAPI';
import { Context } from '../../../index';
import UserContainer from "../../../components/ui/UserContainer";

const FinishTestPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [test, setTest] = useState(null);
    const [testStatistic, setTestStatistic] = useState();
    const userContext = useContext(Context);


    useEffect(() => {
        let test_statistics = []
      
        getTestStatistic(userContext.user.user.id, params.get("test_id")).then(data => {
            console.log(data)
            setTestStatistic(data)
            console.log(data)
        })
        getOneTest(params.get("test_id")).then(data => {
            console.log(data)
            setTest(data)
       
        })
    }, [])
   
    return (
        
        <UserContainer loading={true}>
            <div className="back_button">
                <a onClick={() => navigate(-1)}>
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
            
            <div className="flex flex-col items-center">
                {(Number(params.get("correct_answers")) / Number(params.get("questions")) > 0.75) || params.get("look") ?
                    <img className="finish_img" src={complete} alt=""/>
                :
                    <img className="finish_img" width="260px" src={fall} alt=""/>
                }
                {
                    !params.get("look") ?
                    <div className="text-center">
                        <div className="text-xl font-semibold">{params.get("correct_answers")} / {params.get("questions")}</div>
                        <div className="text-xl font-semibold">{Number(params.get("correct_answers")) / Number(params.get("questions")) > 0.75 ? 'Вы справились с тестом, можно переходить к следующему уроку.' : 'Вы не прошли тест. Попробуйте еще раз!'}</div>
                        {
                            Number(params.get("correct_answers")) / Number(params.get("questions")) < 0.75 &&
                            <button
                                onClick={() => navigate(-1)}
                                className="
                                  mt-6
                                  w-full
                                  flex items-center justify-center
                                  gap-2
                                  rounded-lg
                                  border border-blue-400
                                  px-6 py-3
                                  text-blue-600
                                  font-medium
                                  transition
                                  hover:bg-blue-50
                                  hover:border-blue-500
                                  hover:text-blue-700
                                  active:scale-[0.98]
                                "
                            >
                                Попробовать ещё раз
                            </button>
                        }

                    </div>
                        :
                        <div>
                        <div className="finish_text">Вы справились с тестом, можно переходить к следующему уроку.</div>
                    </div>
                    
                }
                {test &&
                    test.puncts.map((punct, i) => {
                        const userAnswer = testStatistic?.punctsStatistic[i]?.user_answer?.[0];

                        const isCorrect = (j) =>
                            punct.correct_answer?.[0] === j ||
                            punct.correct_answer?.[j] === j;

                        return (
                            <div
                                key={i}
                                className="mt-10 w-full rounded-xl border border-gray-300 bg-white p-5 shadow-sm"
                            >
                                {/* Вопрос */}
                                <h2 className="mb-4 text-left text-lg font-semibold border-b pb-2">
                                    {punct.question}
                                </h2>

                                {/* Ответы */}
                                <ul className="space-y-2">
                                    {punct.answers.map((answer, j) => {
                                        const correct = isCorrect(j);
                                        const isUser = userAnswer === j;

                                        let styles =
                                            "flex items-center justify-between rounded-lg border p-3 transition";

                                        if (correct && isUser) {
                                            styles +=
                                                " bg-green-200 border-green-600 ring-2 ring-green-400";
                                        } else if (correct) {
                                            styles += " bg-green-100 border-green-400";
                                        } else if (isUser) {
                                            styles += " bg-red-100 border-red-400";
                                        } else {
                                            styles += " bg-white border-gray-200 hover:bg-gray-50";
                                        }

                                        return (
                                            <li key={j} className={styles}>
                                                <span className="w-[80%]">{answer}</span>

                                                {/* Метки */}
                                                <div className="ml-4 text-sm font-medium">
                                                    {isUser && correct && (
                                                        <span className="text-green-700">✔ Ваш ответ</span>
                                                    )}
                                                    {isUser && !correct && (
                                                        <span className="text-red-600">✖ Ваш ответ</span>
                                                    )}
                                                    {!isUser && correct && (
                                                        <span className="text-green-600">Правильный</span>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                {
                    Number(params.get("correct_answers")) / Number(params.get("questions")) < 0.75 &&
                    <button
                        onClick={() => navigate(-1)}
                        className="
                                  mt-6
                                  w-full
                                  flex items-center justify-center
                                  gap-2
                                  rounded-lg
                                  border border-blue-400
                                  px-6 py-3
                                  text-blue-600
                                  font-medium
                                  transition
                                  hover:bg-blue-50
                                  hover:border-blue-500
                                  hover:text-blue-700
                                  active:scale-[0.98]
                                "
                    >
                        Попробовать ещё раз
                    </button>
                }
            </div>
            
        </UserContainer>
    );
};

export default FinishTestPage;