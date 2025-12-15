import React, { useContext, useEffect, useState } from 'react';
import { deleteUser, getAllAdmins, getAllUsersWithPage,  } from '../../../http/userAPI';
import { ADMIN_REGISTRATE_USER } from '../../../utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import pencil from '../../../assets/imgs/pencil.png'

import "./AdministratorsPage.css"
import LeftMenu from '../../../components/LeftMenu/LeftMenu';

import ListenersSkeleton from '../../../components/ListenersSkeleton/ListenersSkeleton';
import { Context } from '../../../index';

function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}


const AdministratorsPage = () => {
    const userContext = useContext(Context);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllAdmins().then(users => {
            let you = users.filter(user => user.id == userContext.user.user.id)
            users = users.filter(user => user.id != userContext.user.user.id)
            
            users.unshift(you[0])

            setUsers(users);
            setFilteredUsers(users);
            setLoading(true);
        })
        
    }, [])

    const destroyUser = (id) => {
        deleteUser(id).then(d => 
            getAllAdmins().then(users => {
                let you = users.filter(user => user.id == userContext.user.user.id)

                users = users.filter(user => user.id != userContext.user.user.id)
                
                users.unshift(you[0])
                setUsers(users);
                setFilteredUsers(users);
                setLoading(true);
            })
        );
    }
    
    return (
        <div className="content">
            <div className="container">

                <div className="admin_inner">
                    <LeftMenu/>
                    <div className="admin_container">
                        <div className="admin_path">Главная / <b>Администраторы</b></div>
                        <Link to={ADMIN_REGISTRATE_USER + '?admin=true'} className="admin_button">Добавить администратора</Link>
                        
                        <div className='admin_table_container'>
                            <table className="admin_table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ФИО</th>
                                        <th>EMAIL</th>
                                        <th>Роль</th>
                                        <th>Дата создания</th>
                                        
                                        <th>Сеанс</th>
                                        <th>Изменить</th>
                                        <th>Удалить</th>

                                     
                                    </tr>
                                </thead>
                                {
                                    loading?
                                
                                <tbody>
                                    {
                                        filteredUsers.map((user, i) => 
                                            
                                            <tr className={i==0?'active':''}>
                                                <td>#{user.id}</td>
                                                <td><div>{user.name}</div></td>
                                                <td style={{display: 'table-cell', width: 'auto'}}>{user.email}</td>
                                                <td>Администратор</td>
                                                <td>{dateToString(user.createdAt)}</td>
                                                
                                                <td>{i==0?`(Текущий)`:''}</td>
                                                <td className='remakeButton' onClick={() => navigate("/admin/listeners/new_listener/" + user.id + "?admin=true")}><img src={pencil} width="22px"/></td>
                                                <td className='deleteButton' onClick={() => destroyUser(user.id)}>x</td>
                                                
                                            </tr>
                                            )
                                    }
                                    
                                </tbody>
                                : <ListenersSkeleton/>
                                }
                                

                                
                            </table>
                        </div>
                        
                        
                                            
                        
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AdministratorsPage;