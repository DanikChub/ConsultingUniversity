import React, { useEffect, useState } from 'react';
import { deleteUser, getAllUsers, getAllUsersGraduation, getAllUsersWithPage, searchUsers } from '../../http/userAPI';
import { ADMIN_REGISTRATE_USER } from '../../utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import pencil from '../../assets/imgs/pencil.png'

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


const AdminDocumentsPage = () => {
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
      
        getAllUsersGraduation(1, sort_type_variations[sort_type], sort_down?'DESC':'ASC').then(users => {
            
            
            setUsers(users);
            setFilteredUsers(users);
            setLoading(true);
        })
        
    }, [])

   
    const copyTextToClipboard = async (text) => {
        console.log(text)
        try {
          await navigator.clipboard.writeText(text);
          console.log('Текст успешно скопирован в буфер обмена!');
        } catch (err) {
          console.error('Ошибка:', err);
        }
      };
   
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu active_arr={['', '', '', '', '', '', '', 'active',]}/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Слушатели</b></div>
                    <Link to={ADMIN_REGISTRATE_USER} className="admin_button">Добавить слушателя</Link>
                    
                    <div className='admin_table_container'>
                        <table className="admin_table">
                            <thead>
                                <tr>
                                    <th style={{width: '20%'}}>Тип документа</th>
                                    <th style={{display: 'table-cell', width: "15%"}}>Номер</th>
                                    <th style={{display: 'table-cell', width: "15%"}}>Дата выдачи</th>
                                    <th style={{display: 'table-cell', width: "28%"}}>ФИО</th>
                                    <th style={{display: 'table-cell', width: "30%"}}>Организация</th>
                                  
                                    
                                </tr>
                            </thead>
                            {
                                loading?
                            
                            <tbody>
                                {
                                    filteredUsers.map((user, i) => 
                                        
                                        <tr>
                                            <td onClick={() => {copyTextToClipboard(user.diplom?'':user.address)}}>{user.diplom?'Диплом':'Удостоверение'}</td>
                                            <td >
                                                <a href={`tel:${user.number}`}>{user.number}</a>
                                            </td>
                                            <td style={{display: 'table-cell', width: "20%"}}>
                                                {dateToString(user.graduation_date)}
                                            </td>
                                            <td class='th_orh'>
                                                
                                                <Link to={"/admin/listeners/" + user.id}>
                                                    <div dangerouslySetInnerHTML={{__html: user.name.replace(user.yellow_value, "<b class=\"background-yellow\">"+user.yellow_value+"</b>")}}/>
                                                </Link>
                                            </td>
                                            <td>
                                                <div>{user.organiztion}</div>
                                               
                                            </td>
                                           
                                            
                                            
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

export default AdminDocumentsPage;