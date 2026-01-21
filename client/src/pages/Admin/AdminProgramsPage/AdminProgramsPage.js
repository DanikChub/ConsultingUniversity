import React, {useEffect, useState} from 'react';
import { ADMIN_LISTENERS_ROUTE, ADMIN_VIEW_PROGRAM, MAKE_PROGRAM_ROUTE } from '../../../utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import "./AdminProgramsPage.css"
import { deleteProgram, getAllPrograms } from '../../../http/programAPI';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import video_play from "../../../assets/imgs/play.png"
import ruble from "../../../assets/imgs/icons/ruble.png"
import man from "../../../assets/imgs/icons/man.png"
import AppContainer from '../../../components/ui/AppContainer';
import Button from '../../../components/ui/Button';

const AdminProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [numberOfPrograms, setNumberOfPrograms] = useState(0);
    const [itemClassDelete, setItemClassDelete] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState({program_id: null, show: '', clientX: 0, clientY: 0});

    useEffect(() => {
       
        getAllPrograms().then(data => {
            setPrograms(data)
            setNumberOfPrograms(data.length);
            setLoading(true);
            console.log(data)
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

    const handleContextManu = (obj, e) => {
        e.preventDefault();
        setContextMenu(obj)
    }
    return (
        <AppContainer>
            <div className="tabs">
                
                <div className="tabs_nav_links">
                    <div className="tabs_nav_link active">Опубликовано ({numberOfPrograms})</div>
                    <a href="#" className='tabs_nav_link'>Черновик (0)</a>
                </div>
                
                <Button to={MAKE_PROGRAM_ROUTE} checkRole='ADMIN' className='mt-4'>Добавить программу</Button>
                <div className="tab active">
                    {loading?
                    
                    
                    <div className="mt-4">
                        {
                            programs.map((program, i) => 
                                <div onClick={() => navigate(`/admin/programs/${program.id}`)}
                                    onContextMenu={(e) => handleContextManu({program_id: program.id, show: 'show', clientX: e.clientX, clientY: e.clientY + window.scrollY}, e)} className="relative p-[10px] w-full h-[60px] flex items-center justify-between border border-[#D9D9D9] rounded-[9px] transition cursor-pointer mt-[15px]">        
                                    <div className='admin_program_item_img'>      
                                        <img src={program.img? `${process.env.REACT_APP_API_URL + program.img}` : ''}/>    
                                    </div>      
                                    <div className="admin_program_item_title">{program.short_title?program.short_title:program.title}</div>
                                    <div className='admin_program_item_info'>
                                        <div className='admin_program_item_info_users'>
                                            <img src={man}/>
                                            <div className='admin_program_item_info_users_text'>{program.users_quantity}</div>
                                        </div>
                                        <div className='admin_program_item_info_price'>
                                            <img src={ruble}/>
                                            <div className='admin_program_item_info_price_text'>{program.price?program.price:'-'}</div>
                                        </div>
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
        </AppContainer>
                    
                
    );
};

export default AdminProgramsPage;