import React, { useEffect, useState } from 'react';
import { deleteUser, getAllUsers } from '../../http/userAPI';
import { ADMIN_REGISTRATE_USER } from '../../utils/consts';

import { Link } from 'react-router-dom';

import "./AdminListeners.css"
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getStatistic } from '../../http/statisticAPI';

function dateToString(date) {
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    return dateSrc;
}

const AdminListeners = () => {
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        getAllUsers().then(data => {
                let users = data.filter(item => item.role == "USER");
                users.forEach(user => {
                  
                    getStatistic(user.id, user.programs_id[0]).then(statistic => {
                        user["statistic"] = statistic
                    })
                    
                })
                setTimeout(() => {
                    console.log(users);
                    setUsers(users);
                }, 1000)
                
                
                console.log(data);
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
                <LeftMenu/>
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
                                                <div className="prorgress-bar" style={{width: `${user.statistic?(user.statistic.well_videos+user.statistic.well_tests+user.statistic.well_practical_works)/(user.statistic.max_videos+user.statistic.max_tests+user.statistic.max_practical_works)*100:''}%`}}></div>
                                            </div>
                                            <span>{user.statistic?Math.round((user.statistic.well_videos+user.statistic.well_tests+user.statistic.well_practical_works)/(user.statistic.max_videos+user.statistic.max_tests+user.statistic.max_practical_works)*100): ''}%</span>
                                        </td>
                                        <td>Администрация Ивановского ...</td>
                                        <td>{dateToString(user.createdAt)}</td>
                                        <td>-</td>
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