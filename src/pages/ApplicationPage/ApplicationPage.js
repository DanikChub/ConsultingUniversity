import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllApplications } from '../../http/applicationAPI';

import "./ApplicationPage.css"

function dateToString(date) {
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    return dateSrc;
}

const ApplicationPage = () => {

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getAllApplications().then(data => setApplications(data));
    }, [])
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Слушатели</b></div>
              

                    <table className="admin_table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Имя</th>
                                <th>Почта</th>
                                <th>Телефон</th>
                                <th>Заявка создана:</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {
                                applications.map((application, i) => 
                                    <tr>
                                        <td>{i+1}.</td>
                                        <td><a href="./listener_page.html">{application.name}</a></td>
                                        <td>{application.email}</td>
                                        <td>{application.number}</td>
                                        <td>{dateToString(application.createdAt)}</td>
                                       
                                        
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

export default ApplicationPage;