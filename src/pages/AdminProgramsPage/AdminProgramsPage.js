import React, {useEffect, useState} from 'react';
import { ADMIN_LISTENERS_ROUTE, ADMIN_VIEW_PROGRAM, MAKE_PROGRAM_ROUTE } from '../../utils/consts';
import { Link, useNavigate } from 'react-router-dom';

import "./AdminProgramsPage.css"
import { deleteProgram, getAllPrograms } from '../../http/programAPI';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import video_play from "../../assets/imgs/video_play.png"
const AdminProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [numberOfPrograms, setNumberOfPrograms] = useState(0);
    const [itemClassDelete, setItemClassDelete] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
       
        getAllPrograms().then(data => {
            setPrograms(data)
            setNumberOfPrograms(data.length);
            setLoading(true);
        })
    }, [])

    const deleteProgramClick = (program_id) => {
        setItemClassDelete('delete');
        deleteProgram(program_id)
        .then(d => 
            getAllPrograms().then(data =>
                setPrograms(data)
            )
            
        )
        .catch(e => {
            alert(e.response.data.message);
        })
    }
    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu active_arr={['', '', '', '', 'active', '', '', '',]}/>
                <div className="admin_container">
                    <div className="admin_path">Главная/<b>Программы</b></div>
                    

                    <div className="tabs">
                        
                        <div className="tabs_nav_links">
                            <div className="tabs_nav_link active">Опубликовано ({numberOfPrograms})</div>
                            <Link to={MAKE_PROGRAM_ROUTE} className='tabs_nav_link'>Создать программу</Link>
                        </div>
                        
                        <div className="tab active">
                            {loading?
                            
                            
                            <div className="admin_program_items">
                                {
                                    programs.map(program => 
                                        <div className={"admin_program_item"}>                          
                                            <div className="admin_program_item_title">{program.title}</div>
                                            <div className='admin_program_item_button_group'>
                                            <div onClick={() => {
                                                navigate(`/admin/programs/${program.id}`)
                                                localStorage.removeItem('arr_open');
                                            }} className="MakeProgram_Theme_Button">
                                                <img width="50" src={video_play}/>
                                            </div>
                                            <div onClick={() => navigate(`${MAKE_PROGRAM_ROUTE}/${program.id}`)} className="MakeProgram_Theme_Button"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                            <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                                            </svg></div>
                                            <div onClick={() => deleteProgramClick(program.id)} className="MakeProgram_Theme_Button red"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                            <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                                            </svg></div>
                                            </div>
                                            
                                        </div>
                                        )
                                }
                                
                            </div>
                            :
                            <div className="admin_program_items admin_program_items_skelet">                          
                                <div className='admin_program_item admin_program_item_skelet'>
                                    <div className="admin_program_item_title admin_program_item_title_skelet"></div>
                                    <div className='admin_program_item_button_group'>
                                            <div className='MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet'></div>
                                          
                                            <div  className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                            <div className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                        </div>
                                </div>
                                <div className='admin_program_item admin_program_item_skelet'>
                                    <div className="admin_program_item_title admin_program_item_title_skelet"></div>
                                    <div className='admin_program_item_button_group'>
                                            <div className='MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet'></div>
                                          
                                            <div  className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                            <div className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                        </div>
                                </div>
                                <div className='admin_program_item admin_program_item_skelet'>
                                    <div className="admin_program_item_title admin_program_item_title_skelet"></div>
                                    <div className='admin_program_item_button_group'>
                                            <div className='MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet'></div>
                                          
                                            <div  className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                            <div className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                        </div>
                                </div>
                                <div className='admin_program_item admin_program_item_skelet'>
                                    <div className="admin_program_item_title admin_program_item_title_skelet"></div>
                                    <div className='admin_program_item_button_group'>
                                            <div className='MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet'></div>
                                          
                                            <div  className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                            <div className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                        </div>
                                </div>
                                <div className='admin_program_item admin_program_item_skelet'>
                                    <div className="admin_program_item_title admin_program_item_title_skelet"></div>
                                    <div className='admin_program_item_button_group'>
                                            <div className='MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet'></div>
                                          
                                            <div  className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                            <div className="MakeProgram_Theme_Button MakeProgram_Theme_Button_skelet"></div>
                                        </div>
                                </div>
                            </div>
                            }
                        </div>
                       
                    </div>

                    
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default AdminProgramsPage;