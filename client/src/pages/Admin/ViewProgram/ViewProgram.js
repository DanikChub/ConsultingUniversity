import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';


import arrow from "../../../assets/imgs/UI/arrow.svg"

import { Context } from '../../../index';
import { deleteProgram, getOneProgram } from '../../../http/programAPI';
import { ADMIN_VIEW_VIDEO, TEST_ROUTE, VIDEO_ROUTE, LECTION_ROUTE, PRACTICAL_WORK_ROUTE, ADMIN_VIEW_PRACTICAL_WORKS_ROUTE, MAKE_PROGRAM_ROUTE, ADMIN_PROGRAMS_ROUTE } from '../../../utils/consts';
import { setWellPracticalWorks, setWellTest, setWellVideos } from '../../../http/userAPI';
import { observer } from 'mobx-react-lite';
import { getStatistic, updatePracticalWorks, updateVideos } from '../../../http/statisticAPI';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';

import './ViewProgram.css'


import ruble from "../../../assets/imgs/icons/ruble.png"
import man from "../../../assets/imgs/icons/man.png"
import AppContainer from '../../../components/ui/AppContainer';
import Button from "../../../components/ui/Button";


const ViewProgram = observer(() => {
    const [courseItems, setCourseItems] = useState([]);
    const [program, setProgram] = useState([]);
    const [loaded, setLoaded] = useState(false);
    
    const params = useParams();

    useEffect(() => {
        let program_id = params.id;

      
        getOneProgram(program_id).then(program => {
            
            setProgram(program)
            
            let themes = program.themes

            program.themes.forEach((el, i) => {
                el['open'] = false
            })
          
            setCourseItems(program.themes.sort((a, b) => a.theme_id - b.theme_id));
            setLoaded(true)
        }) 
    }, [])



    // const remakeFileName = (url, new_name, lection_html) => {
     


    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', url, true);
    //     xhr.responseType = 'blob';
    //     xhr.onload = function(e) {
    //         var blob = this.response;
    //         var link = document.createElement("a");
    //         link.style.display = "none";
    //         link.href = window.URL.createObjectURL(blob);
    //         link.setAttribute("download", new_name);
    //         link.click(); 
    //     }
    //     xhr.send();
    // }

    const accordeon_item_click = (i) => {
        
        setCourseItems(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, open: !item.open } : item
            )
        );
    }  

    // const makePracticalURL = (practical_work, practical_work_task, courseItems_id, themesStatistic_id, puncts_id) => {

        
    //     practical_work = encodeURIComponent(practical_work)
    //     practical_work_task = encodeURIComponent(practical_work_task)
       
        
    //     return `${ADMIN_VIEW_PRACTICAL_WORKS_ROUTE}?title=${practical_work}&task=${practical_work_task}&theme_id=${courseItems_id}&theme_statistic_id=${themesStatistic_id}&punct_id=${puncts_id}`
    // }

    const navigate = useNavigate();

    const deleteProgramClick = (program_id) => {
        
        deleteProgram(program_id)
        .then(d => 
            
            navigate(ADMIN_PROGRAMS_ROUTE)
            
            
        )
        .catch(e => {
            alert(e.response?.data?.message);
        })
    }
    return (
        
        <AppContainer>
          
            <div className="admin_program_item">        
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
            <div className='flex start mt-4'>
            
                <Button onClick={() => navigate(`${MAKE_PROGRAM_ROUTE}/${program.id}`)} checkRole='ADMIN'>Редактировать</Button>
                <Button className='admin_button red ml-2' onClick={() => deleteProgramClick(program.id)}  checkRole='ADMIN'>Удалить</Button>
            </div>
            <div className='course_title'><b>Название:</b> {program.title}</div>
            <div className="course">
                {courseItems.map(({title, puncts, presentation_src, lection_src, id, open}, i) => 
                    <div className="mt-[10px]" key={i}>
                        <div className={`flex items-center ${open ? 'open' : ''}`} onClick={() => accordeon_item_click(i)}>
                            <svg className={`${open ? '' : '-rotate-90'}`} width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.8633 0.952148L8.11989 9.74902" stroke="#898989" stroke-opacity="0.78" stroke-width="2" stroke-linecap="round"/>
                            <path d="M1.04688 1.31543L7.85366 9.63645" stroke="#898989" stroke-opacity="0.78" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <b className="text-[#2C3E50] ml-[10px]">Модуль {i+1}: </b> <span className="text-[#2C3E50] ml-[5px]">{title}</span>
                        </div>
                        <div className={`ml-[65px] ${open ? '' : 'hidden'}`}>
                            {puncts.map((punct, j) => 
                                <div className='mt-[5px] text-[#2C3E50]'><b>{punct.test_id ? `Тест` : `Тема ${j+1}`}:</b> {punct.title}</div>
                            )}
                        </div>
                        
                    </div>
                )}
                
            </div>
        </AppContainer>
    );
});

export default ViewProgram;