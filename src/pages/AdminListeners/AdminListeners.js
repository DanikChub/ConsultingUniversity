import React, { useEffect, useState } from 'react';
import { deleteUser, getAllUsers, getAllUsersWithPage, searchUsers } from '../../http/userAPI';
import { ADMIN_REGISTRATE_USER } from '../../utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import pencil from '../../assets/imgs/pencil.png'

import "./AdminListeners.css"
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getStatistic } from '../../http/statisticAPI';

import arrow_down from '../../assets/imgs/arrow_down.png'
import arrow_up from '../../assets/imgs/arrow_up.png'
import ListenersSkeleton from '../../components/ListenersSkeleton/ListenersSkeleton';

function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
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



const AdminListeners = () => {
    const [users, setUsers] = useState([]);
    const [countUsers, setCountUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const [sortClasses, setSortClasses] = useState(['', '', 'active']);
    const [sortType, setSortType] = useState(0);
    const [sortDown, setSortDown] = useState(true);
    const [sort_type_variations, setSortTypeVariations] = useState(["statistic", "name", "createdAt"]);

    useEffect(() => {
        let sort_down = Boolean(Number(localStorage.getItem("sort_down")));

        setSortDown(sort_down);

        let sort_type = Number(localStorage.getItem('sort_type'))
        let prev_value = ['', '', ''];

        prev_value[sort_type] = 'active';

        setSortClasses(prev_value);
        setSortType(sort_type);
      
        getAllUsersWithPage(1, sort_type_variations[sort_type], sort_down?'DESC':'ASC').then(data => {
            let arr = []
            for (let i = 0; i < Math.ceil(data.count/10); i++) {
                arr.push({
                    number: i+1,
                    class: i==0?'active':''
                });
            }
            
            setCountUsers(arr)
            let users = data.rows.filter(item => item.role == "USER");
            setUsers(users);
            setFilteredUsers(users);
            setLoading(true);
        })
        
    }, [])

    const destroyUser = (id) => {
        setLoading(false)
        deleteUser(id).then(d => 
            getAllUsersWithPage(1, sort_type_variations[sortType], sortDown?'DESC':'ASC').then(data => {
                setUsers(data.rows.filter(item => item.role == "USER"));
                setFilteredUsers(data.rows.filter(item => item.role == "USER"));
                setLoading(true)
            })
        );
    }

    const handleSearchInput = (value) => {
        let realValue = searchInput;

        if (value.search(/[^а-яА-Яa-zA-Z0-9]/) == -1) {
            setSearchInput(value);
            realValue = value
        }


        
        // let new_users = prev_users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()) || user.organiztion.toLowerCase().includes(value.toLowerCase()))
        
        // new_users.forEach(user => {
        //     user["yellow_value"] = value;
        // })
        

        if (realValue) {
            
            searchUsers(1, realValue)
            .then(data => 
                {
                    let prev_users = data.rows;
                    prev_users.forEach(user => {
                        user["yellow_value"] = value || '';
                    })

                    console.log(prev_users)

                    let arr = []
                    for (let i = 0; i < Math.ceil(data.count/10); i++) {
                        arr.push({
                            number: i+1,
                            class: i==0?'active':''
                        });
                    }
                    setCountUsers(arr)
                    setFilteredUsers(prev_users);
                   
                });
        } else {
            getAllUsersWithPage(1, sort_type_variations[sortType], sortDown?'DESC':'ASC').then(data => {
                let arr = []
                for (let i = 0; i < Math.ceil(data.count/10); i++) {
                    arr.push({
                        number: i+1,
                        class: i==0?'active':''
                    });
                }
                
                setCountUsers(arr)
                let users = data.rows.filter(item => item.role == "USER");
                setUsers(users);
                setFilteredUsers(users);
                
            })
        }
        
        
        

    }

    

    const handleSortButton = (type) => {
        let prev_value = ['', '', ''];

        prev_value[type] = 'active';

        setSortClasses(prev_value);
        setSortType(type);
        localStorage.setItem('sort_type', type)
        setSearchInput('');
        getAllUsersWithPage(1, sort_type_variations[type], sortDown?'DESC':'ASC').then(data => {
            let arr = []
            for (let i = 0; i < Math.ceil(data.count/10); i++) {
                arr.push({
                    number: i+1,
                    class: i==0?'active':''
                });
            }
            
            setCountUsers(arr)
            let users = data.rows.filter(item => item.role == "USER");
            setUsers(users);
            setFilteredUsers(users);
            
        })
    }

    const handleSortDown = () => {
        setSearchInput('');
        setSortDown(type => type = !type);
        localStorage.setItem('sort_down', Number(!sortDown))

        getAllUsersWithPage(1, sort_type_variations[sortType], !sortDown?'DESC':'ASC').then(data => {
            let arr = []
            for (let i = 0; i < Math.ceil(data.count/10); i++) {
                arr.push({
                    number: i+1,
                    class: i==0?'active':''
                });
            }
            
            setCountUsers(arr)
            let users = data.rows.filter(item => item.role == "USER");
            setUsers(users);
            setFilteredUsers(users);
            
        })
    }

    const handleClickPagination = (i) => {
     
        const prev_value = countUsers;

        
        prev_value.forEach(el => el.class = '')
        prev_value[i].class = 'active';

        setLoading(false)
        getAllUsersWithPage(i+1, sort_type_variations[sortType], sortDown?'DESC':'ASC').then(data => {
           
        
            let users = data.rows.filter(item => item.role == "USER");
            setUsers(users);
            setFilteredUsers(users);
            setLoading(true);
        })
        
        setCountUsers([...prev_value]);
    }

    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu active_arr={['', 'active', '', '', '', '', '', '',]}/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Слушатели</b></div>
                    <Link to={ADMIN_REGISTRATE_USER} className="admin_button">Добавить слушателя</Link>
                    <input onChange={(e) => handleSearchInput(e.target.value)} value={searchInput} className='MakeProgramInput' placeholder='Поиск пользователя...'/>
                    <div className='admin_flex'>
                        <div onClick={() => handleSortDown()} className="admin_button">
                            <span>{sortDown?'По убыванию':'По возрастанию'}</span>
                            <img src={sortDown?arrow_down:arrow_up} height={16}/>
                        </div>
                        <div>Сортировка по: </div>
                        <div onClick={() => handleSortButton(0)} className={`admin_button ` + sortClasses[0]}>По проценту завершенности</div>
                        <div onClick={() => handleSortButton(1)} className={`admin_button ` + sortClasses[1]}>По алфавиту</div>
                        <div onClick={() => handleSortButton(2)} className={`admin_button ` + sortClasses[2]}>По дате</div>
                    </div>
                    <div className='admin_table_container'>
                        <table className="admin_table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Фамилия Имя Отчество</th>
                                    <th>Процент  завершенности</th>
                                    <th class='th_orh'>Организация</th>
                                    <th>Дата начала обучения</th>
                                    <th class='th_orh'>Дата окончания обучения</th>
                                    <th>Изменить</th>
                                    <th>Удалить</th>
                                </tr>
                            </thead>
                            {
                                loading?
                            
                            <tbody>
                                {
                                    filteredUsers.map((user, i) => 
                                        
                                        <tr>
                                            <td>#{user.id}</td>
                                            <td>
                                                <Link to={"/admin/listeners/" + user.id}>
                                                    <div dangerouslySetInnerHTML={{__html: user.name.replace(user.yellow_value, "<b class=\"background-yellow\">"+user.yellow_value+"</b>")}}/>
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="progress-bar_container">
                                                    <div className="prorgress-bar" style={{width: `${user.statistic}%`}}></div>
                                                </div>
                                                <span>{user.statistic?user.statistic:'0'}%</span>
                                            </td>
                                            <td  class='th_orh'>{<div dangerouslySetInnerHTML={{__html: user.organiztion.replace(user.yellow_value, "<b class=\"background-yellow\">"+user.yellow_value+"</b>")}}/>}</td>
                                            <td>{dateToString(user.createdAt)}</td>
                                            <td class='th_orh'>{dateToString(user.graduation_date)}</td>
                                            <td className='remakeButton' onClick={() => navigate("/admin/listeners/new_listener/" + user.id)}><img src={pencil} width="22px"/></td>
                                            <td className='deleteButton' onClick={() => destroyUser(user.id)}>x</td>
                                            
                                        </tr>
                                        )
                                }
                                
                            </tbody>
                            : <ListenersSkeleton/>
                            }
                            

                            
                        </table>
                    </div>
                    
                    
                    <ul className='pagination'>
                        {
                            countUsers.map((count, i) => 
                                <li onClick={() => handleClickPagination(i)} className={count.class}>{count.number}</li>
                            )
                        }
                    </ul>
                                        
                    
                    
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default AdminListeners;