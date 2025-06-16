import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllPracticalWork } from '../../http/practicalWorkAPI';
import { getUserById } from '../../http/userAPI';

import arrow_down from '../../assets/imgs/arrow_down.png'
import arrow_up from '../../assets/imgs/arrow_up.png'

import "./AdminPracticalPage.css"
import ListenersSkeleton from '../../components/ListenersSkeleton/ListenersSkeleton';

function dateToString(date) {
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    return dateSrc;
}



const AdminPracticalPage = () => {
    const [practicalWorks, setPracticalWorks] = useState([]);
    const [filteredPractical, setFilteredPractical] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
 

    useEffect(() => {
        getAllPracticalWork().then(data => {
            const practics_copy = data;
            
            console.log(practics_copy)
            practics_copy.sort((a, b) =>  new Date(a.createdAt) - new Date(b.createdAt))
            setPracticalWorks(practics_copy)
            setFilteredPractical(practics_copy)
           
            setLoading(true);
            
         
        })
    }, [])

    const handleOption = (type) => {
        const prev_value = practicalWorks;
        let filtered;
        console.log(type);
        switch (type) {
            case "3":
                
                setFilteredPractical(practicalWorks);
                break;
            case "2":
                filtered = prev_value.filter(practic => typeof practic.test == 'object')
                setFilteredPractical(filtered);
                break;
            case "1":
                filtered = prev_value.filter(practic => typeof practic.test != 'object' && practic.test)
                setFilteredPractical(filtered);
                break;
            case "0":
                filtered = prev_value.filter(practic => typeof practic.test != 'object' && !practic.test)
                setFilteredPractical(filtered);
                break;
        }
    }   

    
    return (

        <div className='content'>

            <div className='container'>
                <div className='admin_inner'>

                
                <LeftMenu active_arr={['', '', '', '', '', 'active', '', '',]}/>
                
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
                    <div className='admin_flex'>
                       
                        <div>Фильтр по: </div>
                        <select onChange={(e) => handleOption(e.target.value)} className='select'>
                            <option value={3}  selected>Показать все</option>
                            <option value={2} className='test_button gray'>Не проверено</option>
                            <option value={1} className='test_button'>Зачет</option>
                            <option value={0} className='test_button red'>Не зачет</option>
                        </select>
                        
                    </div>
                    <table className="admin_table big">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Фамилия Имя Отчество</th>
                                <th>Название практической работы</th>
                                <th>Статус</th>
                                <th>Оценка</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        {
                            loading?
                        
                        <tbody>
                            {
                                filteredPractical.map((practic, i) => 
                                    <tr>
                                        <td>{i+1}.</td>
                                        <td>{practic.user_name}</td>
                                        <td><Link style={{display: 'block'}} to={`http://localhost:3000/admin/practical_works/${practic.id}`}>{practic.task}</Link></td>
                                        <td>{practic.answer? 'Проверено' : 'Ждет проверки'}</td>
                                        <td><div className={`test_button ${typeof practic.test == "object" ? 'gray':practic.test? '' : 'red'}`}>{typeof practic.test == "object" ? 'Не проверено':practic.test? 'Зачет' : 'Не зачет'}</div></td>
                                        <td>{dateToString(practic.createdAt)}</td>
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

export default AdminPracticalPage;