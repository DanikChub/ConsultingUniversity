import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import { destroyApplication, getAllApplications } from '../../../http/applicationAPI';

import "./ApplicationPage.css"
import pencil from '../../../assets/imgs/pencil.png'
import arrow_down from '../../../assets/imgs/arrow_down.png'
import arrow_up from '../../../assets/imgs/arrow_up.png'
import update from '../../../assets/imgs/update.png'
import ListenersSkeleton from '../../../components/ListenersSkeleton/ListenersSkeleton';


function dateToString(date) {
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    return dateSrc;
}


function sortArrayBy(array, type, down) {
   
    switch (type) {
        case 0:
            return down?array.sort((a, b) =>  b.statistic - a.statistic):array.sort((a, b) =>  a.statistic - b.statistic)
            break;
        case 1:
            return down?array.sort((a, b) => a.name.localeCompare(b.name)):array.sort((a, b) => b.name.localeCompare(a.name))
            break;
        case 2:
            
            return down?array.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)):array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            break;

    }
}

const ApplicationPage = () => {
    const navigate = useNavigate();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortClasses, setSortClasses] = useState(['', '', 'active']);
    const [sortType, setSortType] = useState(2);
    const [sortDown, setSortDown] = useState(true);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllApplications().then(data => {
            setApplications(data)
            setFilteredUsers(data);
            setLoading(true);
        });
    }, [])

    const destroyUser = (id) => {

        destroyApplication(id).then(d => 
            getAllApplications().then(data => {
                setApplications(data)
                setFilteredUsers(data);
                
            })
        )
        .catch(e => console.log(e))
    }

    const handleSortButton = (type) => {
        let prev_value = ['', '', ''];

        prev_value[type] = 'active';

        setSortClasses(prev_value);
        setSortType(type);
        

        let prev_users = filteredUsers;

        setFilteredUsers(sortArrayBy(prev_users, type, sortDown));
    }

    const handleSortDown = () => {
        
        setFilteredUsers(sortArrayBy(filteredUsers, sortType, !sortDown));
        setSortDown(type => type = !type);
        

        
    }

    const update_data = () => {
        setLoading(false)
        getAllApplications().then(data => {
            setApplications(data)
            setFilteredUsers(data);
            setLoading(true);
        });
    }
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Заявки</b></div>
                    <div className='admin_between'>
                        <button onClick={() => update_data()} className='update_button'>
                            <span>Обновить </span> 
                            <img width="16px" height="16px" src={update}/>
                        </button>
                        <div className='flex'>
                            <div onClick={() => handleSortDown()} className="admin_button">
                                <span>{sortDown?'По убыванию':'По возрастанию'}</span>
                                <img src={sortDown?arrow_down:arrow_up} height={16}/>
                            </div>
                            <div>Сортировка по: </div>
                        
                            <div onClick={() => handleSortButton(1)} className={`admin_button ` + sortClasses[1]}>По алфавиту</div>
                            <div onClick={() => handleSortButton(2)} className={`admin_button ` + sortClasses[2]}>По дате</div>
                        </div>
                    </div>

                    <table className="admin_table big">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Имя</th>
                                <th>Почта</th>
                                <th>Телефон</th>
                                <th>Заявка создана:</th>
                                <th>Создать пользователя по заявке</th>
                                <th>Удалить</th>
                            </tr>
                        </thead>
                        {
                            loading ?
                        
                        <tbody>
                            {
                                applications.map((application, i) => 
                                    <tr>
                                        <td>{i+1}.</td>
                                        <td><a href="./listener_page.html">{application.name}</a></td>
                                        <td style={{display: 'table-cell', width: 'auto'}}>{application.email}</td>
                                        <td>{application.number}</td>
                                        <td>{dateToString(application.createdAt)}</td>
                                        
                                        <td className='remakeButton' onClick={() => navigate(`/admin/listeners/new_listener?name=${application.name}&email=${application.email}&number=${application.number}`)}>+</td>
                                        <td className='deleteButton' onClick={() => destroyUser(application.id)}>x</td>
                                        
                                    </tr>
                                    )
                            }
                            
                        </tbody>
                        :
                        <ListenersSkeleton/>
                        }

                        
                    </table>
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default ApplicationPage;