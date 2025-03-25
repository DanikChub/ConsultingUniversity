import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllPrograms } from '../../http/programAPI';
import { getAllUsers } from '../../http/userAPI';
import { ADMIN_LISTENERS_ROUTE, ADMIN_PROGRAMS_ROUTE } from '../../utils/consts';
import './AdminPage.css';

const AdminPage = () => {

    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const [numberOfTests, setNumberOfTests] = useState(0);
    const [programs, setPrograms] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then(data => {
            setUsers(data);
            console.log(data);
            let users = 0;
            let tests = 0;
            data.forEach(user => {
                if (user.role != "ADMIN") {
                    users++;
                    tests += user.well_tests;
                }
            })

            setNumberOfUsers(users);
            setNumberOfTests(tests)
        })
        let new_programs = [];
        getAllPrograms().then(data => {
            new_programs = data;
            new_programs.forEach(program => {
                program["listeners"] = 0;
            }) 
    
            users.forEach(user => {
                new_programs.forEach(program => {
                    if (user.programs_id[0] == program.id) {
                        program.listeners += 1;
                    }
                })
            })
            console.log(new_programs);
            setPrograms(new_programs);
        }) 

      
        
    }, [])
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_statisitcs_items">
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">{numberOfUsers}</div>
                            <div className="admin_statisitcs_item_title">Активные слушатели</div>
                        </div>
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">{numberOfTests}</div>
                            <div className="admin_statisitcs_item_title">Пройдено тестов</div>
                        </div>
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">0</div>
                            <div className="admin_statisitcs_item_title">Завершено курсов</div>
                        </div>
                    </div>
                    <div className="admin_title title">
                        <b>Программы</b>
                    </div>
                    <div className="admin_programs">
                        {
                            programs.map(program => 
                                
                                <div className="admin_program">
                                    <img src={null} alt="" className="admin_program_img"/>
                                    <div className="admin_program_content">
                                        <div className="admin_program_title">{program.title}</div>
                                        <div className="admin_program_listeners">Слушатели: <b>{program.listeners}</b></div>
                                    </div>
                                </div>
                            )
                        }
                        
                        
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default AdminPage;