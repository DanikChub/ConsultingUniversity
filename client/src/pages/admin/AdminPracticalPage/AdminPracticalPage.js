import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import { deletePracticalWork, getAllPracticalWork } from '../../../entities/practical_work/api/practical_work.api';
import { getUserById } from '../../../entities/user/api/user.api';

import arrow_down from '../../../assets/imgs/arrow_down.png'
import arrow_up from '../../../assets/imgs/arrow_up.png'
import update from '../../../assets/imgs/update.png'

import "./AdminPracticalPage.css"
import ListenersSkeleton from '../AdminListeners/components/ListenersSkeleton';


function dateToString(date) {
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    return dateSrc;
}



const AdminPracticalPage = () => {
    const [practicalWorks, setPracticalWorks] = useState([]);
    const [filteredPractical, setFilteredPractical] = useState([]);
    const [loading, setLoading] = useState(false);
    const [option, setOption] = useState("2")

    const navigate = useNavigate();
 

    useEffect(() => {
        getAllPracticalWork().then(data => {
            const practics_copy = data;
            
          
            practics_copy.sort((a, b) =>  new Date(a.createdAt) - new Date(b.createdAt))
            setPracticalWorks(practics_copy)

            
            setFilteredPractical(practics_copy.filter(practic => typeof practic.test == 'object'))
           
            setLoading(true);
            
         
        }).catch(e => {
            alert('Практических работ еще нет', e.response.data.message)
            setLoading(true);
        }) 
    }, [])

    const handleOption = (type) => {
        const prev_value = practicalWorks;
        let filtered;
        
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

    const update_data = () => {
        setLoading(false)
        getAllPracticalWork().then(data => {
            const practics_copy = data;
            
          
            practics_copy.sort((a, b) =>  new Date(a.createdAt) - new Date(b.createdAt))
            setPracticalWorks(practics_copy)
            handleOption(handleOption)
           
            setLoading(true);
            
         
        }).catch(e => {
            alert('Практических работ еще нет', e.response.data.message)
            setLoading(true);
        }) 
    }

    const deletePractical = (id) => {
        deletePracticalWork(id).then(d => {
            setLoading(false)
            getAllPracticalWork().then(data => {
                const practics_copy = data;
                
            
                practics_copy.sort((a, b) =>  new Date(a.createdAt) - new Date(b.createdAt))
                setPracticalWorks(practics_copy)
                handleOption(handleOption)
            
                setLoading(true);
                
            
            })
        }) 
    }

    
    return (

        <div className='content'>

            <div className='container'>
                <div className='admin_inner'>

                
                <LeftMenu/>
                
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
                    <div className='admin_between'>
                        <button onClick={() => update_data()} className='update_button'>
                            <span>Обновить </span> 
                            <img width="16px" height="16px" src={update}/>
                        </button>
                        <div className='flex'>
                        
                            <div>Фильтр по: </div>
                            <select onChange={(e) => handleOption(e.target.value)} className='select'>
                                <option value={2} selected className='test_button gray'>Не проверено </option>
                                <option value={3} >Показать все</option>
                                <option value={1} className='test_button'>Зачет</option>
                                <option value={0} className='test_button red'>Не зачет</option>
                            </select>
                            
                        </div>
                    </div>
                    
                    <table className="admin_table big">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Фамилия Имя Отчество </th>
                                <th>Название практической работы</th>
                                <th>Статус</th>
                                <th>Оценка</th>
                                <th>Дата</th>
                                <th>Удалить</th>
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
                                        <td><Link style={{display: 'block'}} to={`/admin/practical_works/${practic.id}`}>{practic.task}</Link></td>
                                        <td>{practic.answer? 'Проверено' : 'Ждет проверки'}</td>
                                        <td><div className={`test_button ${typeof practic.test == "object" ? 'gray':practic.test? '' : 'red'}`}>{typeof practic.test == "object" ? 'Не проверено':practic.test? 'Зачет' : 'Не зачет'}</div></td>
                                        <td>{dateToString(practic.createdAt)}</td>
                                        <td onClick={() => deletePractical(practic.id)} class="deleteButton">x</td>
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