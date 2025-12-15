import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import { createPracticalAnswer, getOnePracticalWork } from '../../../http/practicalWorkAPI';

import download from '../../../assets/imgs/download.png'
import { getUserById } from '../../../http/userAPI';
import { getOneProgram } from '../../../http/programAPI';
import { updatePracticalWorks } from '../../../http/statisticAPI';



const AdminOnePracticalPage = () => {
    const [practicalWork, setPracticalWork] = useState([]);
    const [answerInput, setAnswerInput] = useState('');
    const [test, setTest] = useState(false);
    const [user, setUser] = useState({
        name: ''
    });
    const [program, setProgram] = useState({
        title: ''
    })
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        getOnePracticalWork(params.id).then(data => {
            setPracticalWork(data);

            getUserById(data.users_id).then(user => {
                setUser(user);
                getOneProgram(user.programs_id[0]).then(data => {
                    setProgram(data);
                    setLoading(false)
                })
                
            }).catch(e => {
                alert('Пользователь вероятно был удален!')
                navigate(-1)
            })
        })


        
    }, [])

    const handlerClick = () => {
    
        createPracticalAnswer(practicalWork.id, answerInput, test)
        if (test) {
            console.log(practicalWork)
            updatePracticalWorks(user.id, user.programs_id[0], practicalWork.theme_statistic_id)
        }
        
        navigate(-1);
    }

    const remakeFileName = (url, new_name) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
        var blob = this.response;
        var link = document.createElement("a");
        link.style.display = "none";
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", new_name);
        link.click();
        }
        xhr.send();
    }

    return (
        
        <div className="content">
            <div className="container">
                <div className='admin_inner'> 
                    <LeftMenu/>
                        {!loading &&
                        <div className='admin_container'>
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
                                <b>Практическая работа от {user.name}, "{program.title}"</b>
                            </div>
                            
                            
                            <div className="finish_text" style={{marginTop: '25px'}}>Задание: {practicalWork.task}</div>
                            <div className="finish_text" style={{marginTop: '25px'}}>Прикрепленный пользователем файл:</div>
                            <div style={{marginTop: "20px"}} className='MakeProgram_Punct_Material'>
                                
                                <a onClick={() => remakeFileName(process.env.REACT_APP_API_URL + practicalWork.file_src, practicalWork.practic_title)}  className='MakeProgram_Punct_Material_Plus'>
                                    <img width="22px" src={download}/>
                                </a>
                                <div className='MakeProgram_Punct_Material_Text'>{"Скачать работу \"" + practicalWork.practic_title + "\""}</div>
                            </div>
                            {
                                practicalWork.answer ? 
                                <div>
                                    <div>Ваше сообщение: {practicalWork.answer}</div>
                                    <div>Ваша оценка: {practicalWork.test? 'зачет' : "не зачет"}</div>
                                </div>
                                
                                :
                                <div>
                                    <select onChange={(e) => {setTest(Boolean(Number(e.target.value)))}} name="select">
                                        <option value={0} {...test ? "" : "selected"}>Не зачет</option>
                                        <option value={1} {...test ? "selected" : ""}>Зачет</option>
                                        
                                    </select>
                                    <input onChange={(e) => setAnswerInput(e.target.value)} value={answerInput} className='MakeProgramInput' placeholder='Ответ пользователю'/>
                                    <button onClick={() => handlerClick()}>Отправить</button>
                                </div>
                            }
                            
                        </div>
                        }
                    </div>
            
                
            </div>
        </div>
        
    );
};

export default AdminOnePracticalPage;