import React, { useEffect, useState } from 'react';
import { deleteUser, getAllUsers } from '../../http/userAPI';
import { ADMIN_REGISTRATE_USER } from '../../utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import pencil from '../../assets/imgs/pencil.png'

import "./AdminListeners.css"
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getStatistic } from '../../http/statisticAPI';

function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}

const AdminListeners = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        getAllUsers().then(data => {
                let users = data.filter(item => item.role == "USER");
                users.forEach(async (user, i) => {
                  
                    await getStatistic(user.id, user.programs_id[0]).then(statistic => {
                        user["statistic"] = Math.round((statistic.well_tests)/(statistic.max_tests)*100)
                    }).then(data => {
                        if (i+1 == users.length) {
                            setUsers(users);
                            console.log(users);
                        }
                    })

                    
                    
                })
                
              
                
               
                
               
                
                
            });
        
    }, [])

    const destroyUser = (id) => {
        deleteUser(id).then(d => 
            getAllUsers().then(data => {
                setUsers(data.filter(item => item.role == "USER"));
               
            })
        );
    }

    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu active_arr={['', 'active', '', '', '', '', '', '',]}/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Слушатели</b></div>
                    <Link to={ADMIN_REGISTRATE_USER} className="admin_button">Добавить слушателя</Link>

                    <table className="admin_table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Фамилия Имя Отчество</th>
                                <th>Процент  завершенности</th>
                                <th>Организация</th>
                                <th>Дата начала обучения</th>
                                <th>Дата окончания обучения</th>
                                <th>Изменить</th>
                                <th>Удалить</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {
                                users.map((user, i) => 
                                    <tr>
                                        <td>{i+1}.</td>
                                        <td><a href={"/admin/listeners/new_listener/" + user.id}>{user.name}</a></td>
                                        <td>
                                            <div className="progress-bar_container">
                                                <div className="prorgress-bar" style={{width: `${user.statistic}%`}}></div>
                                            </div>
                                            <span>{user.statistic}%</span>
                                        </td>
                                        <td>{user.organiztion}</td>
                                        <td>{dateToString(user.createdAt)}</td>
                                        <td>{dateToString(user.graduation_date)}</td>
                                        <td className='remakeButton' onClick={() => navigate("/admin/listeners/new_listener/" + user.id)}><img src={pencil} width="22px"/></td>
                                        <td className='deleteButton' onClick={() => destroyUser(user.id)}>x</td>
                                        
                                    </tr>
                                    )
                            }
                            
                        </tbody>
                        
                        

                        
                    </table>
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default AdminListeners;