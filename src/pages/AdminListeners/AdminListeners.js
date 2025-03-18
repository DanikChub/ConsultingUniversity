import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../http/userAPI';
import { ADMIN_REGISTRATE_USER } from '../../utils/consts';

import { Link } from 'react-router-dom';

import "./AdminListeners.css"
import LeftMenu from '../../components/LeftMenu/LeftMenu';

function dateToString(date) {
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    return dateSrc;
}

const AdminListeners = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then(data => {
                setUsers(data.filter(item => item.role == "USER"));
                
                console.log(data);
            });
        
    }, [])

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
                                                <div className="prorgress-bar" style={{width: "48%"}}></div>
                                            </div>
                                            <span>48%</span>
                                        </td>
                                        <td>Администрация Ивановского ...</td>
                                        <td>{dateToString(user.createdAt)}</td>
                                        <td>-</td>
                                        
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