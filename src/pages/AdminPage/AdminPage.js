import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllPrograms } from '../../http/programAPI';
import { getStatistic } from '../../http/statisticAPI';
import { getAllUsers } from '../../http/userAPI';
import { ADMIN_LISTENERS_ROUTE, ADMIN_PROGRAMS_ROUTE } from '../../utils/consts';
import './AdminPage.css';

const AdminPage = () => {

    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const [numberOfTests, setNumberOfTests] = useState(0);
    const [numberOfEnd, setNumberOfEnd] = useState(0);
    const [programs, setPrograms] = useState([]);
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers().then(data => {
            setUsers(data);
     
            let users_count = 0;
            let ends = 0;
            let tests = 0;
            data.forEach(user => {
                if (user.role != "ADMIN") {
                    users_count++;
            
                    if (user.graduation_date) {
                        ends++;
                    }
                    getStatistic(user.id, user.programs_id[0]).then(user_statistic => {
                        tests += user_statistic.well_tests;
                        setNumberOfTests(tests);
                    })
                }
            })

            setNumberOfUsers(users_count);
            setNumberOfEnd(ends)



            
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
                
                setPrograms(new_programs);
            }) 
        })
      
        
    
        
        
        
      
        
    }, [])
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu active_arr={['active', '', '', '', '', '', '', '', '']}/>
                <div className="admin_container">
                    <div className="admin_statisitcs_items">
                        <Link to={ADMIN_LISTENERS_ROUTE} className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">{numberOfUsers}</div>
                            <div className="admin_statisitcs_item_title">Активные слушатели</div>
                        </Link>
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">{numberOfTests}</div>
                            <div className="admin_statisitcs_item_title">Пройдено тестов</div>
                        </div>
                        <div className="admin_statisitcs_item">
                            <img src={null} className="admin_statisitcs_item_img" alt=""/>
                            <div className="admin_statisitcs_item_value">{numberOfEnd}</div>
                            <div className="admin_statisitcs_item_title">Завершено курсов</div>
                        </div>
                    </div>
                    <div className="admin_title title">
                        <b>Программы</b>
                    </div>
                    <div className="admin_programs">
                        {
                            programs.map(program => 
                                
                                <Link to={`/admin/programs/${program.id}`} className="admin_program">
                                    <img src={null} alt="" className="admin_program_img"/>
                                    <div className="admin_program_content">
                                        <div className="admin_program_title">{program.title}</div>
                                        <div className="admin_program_listeners">Слушатели: <b>{program.listeners}</b></div>
                                    </div>
                                </Link>
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