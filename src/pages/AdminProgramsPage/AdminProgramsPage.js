import React, {useEffect, useState} from 'react';
import { ADMIN_LISTENERS_ROUTE, MAKE_PROGRAM_ROUTE } from '../../utils/consts';
import { Link } from 'react-router-dom';

import "./AdminProgramsPage.css"
import { deleteProgram, getAllPrograms } from '../../http/programAPI';
import LeftMenu from '../../components/LeftMenu/LeftMenu';

const AdminProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [numberOfPrograms, setNumberOfPrograms] = useState(0);
    const [itemClassDelete, setItemClassDelete] = useState('');

    useEffect(() => {
       
        getAllPrograms().then(data => {
            setPrograms(data)
            setNumberOfPrograms(data.length);
        })
    }, [])

    const deleteProgramClick = (program_id) => {
        setItemClassDelete('delete');
        deleteProgram(program_id).then(d => 
            getAllPrograms().then(data =>
                setPrograms(data)
            )
            
        );
    }
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Программы</b></div>
                    

                    <div className="tabs">
                        
                        <div className="tabs_nav_links">
                            <div className="tabs_nav_link active">Опубликовано ({numberOfPrograms})</div>
                            <Link to={MAKE_PROGRAM_ROUTE} className='tabs_nav_link'>Создать программу</Link>
                        </div>
                        
                        <div className="tab active">
                            <div className="admin_program_items">
                                {
                                    programs.map(program => 
                                        <div className={"admin_program_item"}>                          
                                            <div className="admin_program_item_title">{program.title}</div>
                                            <div onClick={() => deleteProgramClick(program.id)} className="MakeProgram_Theme_Button red">х</div>
                                        </div>
                                        )
                                }
                                
                            </div>
                        </div>
                       
                    </div>

                    
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default AdminProgramsPage;