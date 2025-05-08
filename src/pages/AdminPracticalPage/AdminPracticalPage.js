import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllPracticalWork } from '../../http/practicalWorkAPI';
import { getUserById } from '../../http/userAPI';

const AdminPracticalPage = () => {
    const [practicalWorks, setPracticalWorks] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        getAllPracticalWork().then(data => {
            const practics_copy = data;
            practics_copy.forEach((practic, i) => {
                getUserById(practic.users_id).then(user => {
                    practic['user_name'] = user.name;
                    if (i+1 == practics_copy.length) {
                        setPracticalWorks(practics_copy)
                    }
                })

                
            })

            
         
        })
    }, [])
    return (

        <div className='content'>

            <div className='container'>
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
                    <table className="admin_table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Фамилия Имя Отчество</th>
                                <th>Название практической работы</th>
                                <th>Статус</th>
                                
                            </tr>
                        </thead>
                        
                        <tbody>
                            {
                                practicalWorks.map((practic, i) => 
                                    <tr>
                                        <td>{i+1}.</td>
                                        <td>{practic.user_name}</td>
                                        <td><Link style={{display: 'block'}} to={`http://localhost:3000/admin/practical_works/${practic.id}`}>{practic.task}</Link></td>
                                        <td>{practic.answer? 'Проверено' : 'Ждет проверки'}</td>
                                 
                                       
                                    </tr>
                                    )
                            }
                            
                        </tbody>
                        
                        

                        
                    </table>
                    
                    
                </div>
                
            </div>
        </div>
        
    );
};

export default AdminPracticalPage;