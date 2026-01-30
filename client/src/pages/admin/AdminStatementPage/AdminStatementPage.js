import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneProgram } from '../../../entities/program/api/program.api';
import { getStatistic } from '../../../entities/statistic/api/statistic.api';
import { getUserById } from '../../../entities/user/api/user.api';

import { Context } from '../../../index';

import './AdminStatementPage.css'
import AppContainer from "../../../components/ui/AppContainer";

const AdminStatementPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [courseTitle, setCourseTitle] = useState('');
    const [statistic, setStatistic] = useState({
        id: 0,
        users_id: 7,
        programs_id: 7,
        well_videos: 1,
        well_tests: 0,
        well_practical_works: 0,
        max_videos: 1,
        max_tests: 0,
        max_practical_works: 0,
        userId: null,
        programId: null,
        themesStatistic: []
    });
    const [userName, setUserName] = useState('')


    useEffect(() => {
        getUserById(params.id).then(user => {
            setUserName(user.name)
            async function getProgram(id) {
                let program = await getOneProgram(id)
                setCourseTitle(program.title);
           
            }
            getProgram(user.programs_id[0])
           
            getStatistic(user.id, user.programs_id[0]).then(data => {
                setStatistic(data);
               
            })
        })
         
        
         
     }, [])
    return (
        <AppContainer>
            <div className="back_button">
                <a onClick={() => navigate(-1)}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#DCDCDC"/>
                        <path d="M15.2954 29.2433C14.9036 29.6325 14.9015 30.2657 15.2907 30.6575L21.6331 37.0429C22.0223 37.4348 22.6555 37.4369 23.0473 37.0477C23.4392 36.6585 23.4413 36.0253 23.0521 35.6335L17.4144 29.9576L23.0903 24.3198C23.4821 23.9306 23.4842 23.2975 23.095 22.9056C22.7058 22.5138 22.0727 22.5117 21.6808 22.9009L15.2954 29.2433ZM44.0034 29.0472L16.0035 28.9528L15.9968 30.9528L43.9966 31.0472L44.0034 29.0472Z" fill="#898989"/>
                    </svg>
                </a>
                
                <span>Назад</span>
            </div>
            <h3>Ведомость</h3>
            <h3>{userName}</h3>
            <h3 style={{marginTop: '50px'}}>Курс: <span style={{fontWeight: 'normal'}}>“{courseTitle}”</span></h3>
            <div>
                <div className='block_table_inner'>
                    <table className='block_table'>
                        <thead>
                            <tr>
                                {
                                    statistic.themesStatistic.map((el, i) => 
                                        <th className='block_table_th'>Модуль {i+1}</th>
                                    )
                                }
                                
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr>
                                {
                                    statistic.themesStatistic.map((el) => 
                                    <td className={ el.well?'block_table_td green':'block_table_td'}>{el.well?'Зачет':'-'}</td>
                                    )
                                }
                               
                            </tr>
                        </tbody>
                        
                    </table>
                </div>
            </div>
            {/*<div style={{marginTop: '20px'}}><b>Выдан</b> Диплом №{statistic.id}</div>*/}
            </AppContainer>
    );
};

export default AdminStatementPage;