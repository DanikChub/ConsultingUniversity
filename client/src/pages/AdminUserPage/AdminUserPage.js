import React, { useEffect, useState } from 'react';

import "./AdminUserPage.css"

import statement from "../../assets/imgs/statement.png"
import learn from "../../assets/imgs/learn.png"
import how from "../../assets/imgs/how.png"
import check from "../../assets/imgs/check.png"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../http/userAPI';
import { getOneProgram } from '../../http/programAPI';
import { getStatistic } from '../../http/statisticAPI';
import Spinner from '../../components/Spinner/Spinner';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { ADMIN_STATEMENT_USER } from '../../utils/consts';

function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}

const AdminUserPage = () => {
    const params = useParams();
    const [user, setUser] = useState();
    const [program, setProgram] = useState();
    const [statistic, setStatistic] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
     
        getUserById(params.id)
        .then(user => {
            setUser(user);
            let load1 = false;
            let load2 = false;
            getOneProgram(user.programs_id[0])
            .then(program => {
                setProgram(program);
                load1 = true;
                setLoading(!(load1 && load2))
            })
            getStatistic(user.id, user.programs_id[0])
            .then(statistic => {
                setStatistic(statistic);
                load2 = true;
                setLoading(!(load1 && load2))
            })
            
        })
      
    }, []) 
    return (
        
        <div className="content">
            
                <div className="container">
                        <div className="admin_inner">
                        <LeftMenu/>  
                        {!loading ?
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
                          
                        <div className="content_inner">
                            <div className="content_welocme">
                                <div className="content_welcome_title">{user.name}</div>
                             
                                <table className='user_table'>
                                  
                                    
                                    <tbody>
                                        
                                           
                                        <tr>
                                            <td>Организация: </td>
                                            <td>{user.organiztion}</td>
                                        </tr>
                                        <tr>
                                            <td>ИНН организации: </td>
                                            <td>{user.inn}</td>
                                        </tr> 
                                        <tr>
                                            <td>Дата регистрации: </td>
                                            <td>{dateToString(user.createdAt)}</td>
                                        </tr>
                                        <tr>
                                            <td>Должность: </td>
                                            <td>Специалист</td>
                                        </tr>
                                        <tr>
                                            <td>Телефон: </td>
                                            <td>{user.number}</td>
                                        </tr>
                                        <tr>
                                            <td>e-mail: </td>
                                            <td>{user.email}</td>
                                        </tr>     
                                        <tr>
                                            <td>Диплом: </td>
                                            <td>{user.diplom?'Заберет сам':'Отправить по адресу: ' + user.address}</td>
                                        </tr> 
                                        
                                    </tbody>
                                    
                                    

                                    
                                </table>
                            </div>
                            <div className="statement">
                                <div className="statement_img">
                                    <img width="164px" src={statement} alt=""/>
                                </div>
                                <div className="statement_description">
                                    <div className="statement_title">Электронная ведомость</div>
                                    <Link to={'/admin/listeners/statement/' + user.id} className="statement_link">Смотреть</Link>
                                </div>
                            </div>
                        </div>
                        <div className="content_program">
                            <div className="content_program_title">Программа пользователя</div>
                            <div className="content_program_inner">
                                <div onClick={() => {
                                    navigate(`/admin/programs/${program.id}`)
                                    localStorage.removeItem('arr_open');
                                }} className="content_program_well">
                                    <div className="content_program_well_description">
                                        <div className="content_program_well_title">{program.title}</div>
                                        <div className="content_program_well_img">
                                            <img width="109px" src={learn} alt=""/>
                                        </div>
                                    </div>
                                    <div className="content_program_well_progressbar_container">
                                        <div className="content_program_well_progressbar">
                                            <div className='content_program_well_progressbar_inner' style={{width: `${(statistic.well_tests)/(statistic.max_tests)*100}%`}}></div>
                                        </div>
                                        <div className="content_program_well_procent">{Math.round((statistic.well_tests)/(statistic.max_tests)*100)}%</div>
                                    </div>
                                </div>
                               
                            </div>
                        </div>
                        </div>
                        :
                        <Spinner/>
                            }
                    </div>
              
                </div>
            </div>
        
    );
};

export default AdminUserPage;