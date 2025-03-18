import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./CoursePage.css";

import learn from "../../assets/imgs/learn.png"
import word from "../../assets/imgs/word.png"
import video_play from "../../assets/imgs/video_play.png"
import presentation from "../../assets/imgs/presentation.png"
import check from "../../assets/imgs/check.png"
import test_src from "../../assets/imgs/test.png"
import { Context } from '../../index';
import { getOneProgram } from '../../http/programAPI';
import { TEST_ROUTE, VIDEO_ROUTE } from '../../utils/consts';
import { setWellPracticalWorks, setWellTest, setWellVideos } from '../../http/userAPI';
import { observer } from 'mobx-react-lite';

const CoursePage = observer(() => {
    const userContext = useContext(Context);
    const [courseItems, setCourseItems] = useState([]);
    const [program, setProgram] = useState([]);
    const [user, setUser] = useState({});
    const [courseActives, setCourseActives] = useState([]);
    

    useEffect(() => {
        let program_id = userContext.user.user.programs_id[0]

      
        getOneProgram(program_id).then(program => {
            setCourseItems(program.themes);
            setProgram(program)
            setUser(userContext.user.user)
        })
        
       
    }, [])

    useEffect(() => {
        let arr = []

        if (program.themes) {
            for (let i = 0; i < program.themes.length; i++) {
                arr.push('');
            }
        }

        
        
        setCourseActives(arr);

    }, [program])

    const accordeon_item_click = (i) => {
        
        
        setCourseActives(courseActives => courseActives.map((item, j) =>  
            i == j
            ?
               item == 'active' ? '': 'active'
            :
               item
            
           
        ));
       
    }  

    const navigate = useNavigate();
    return (
        <div className="content">
        <div className="container">
            <div className="back_button">
                <a onClick={() => navigate(-1)}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#DCDCDC"/>
                        <path d="M15.2954 29.2433C14.9036 29.6325 14.9015 30.2657 15.2907 30.6575L21.6331 37.0429C22.0223 37.4348 22.6555 37.4369 23.0473 37.0477C23.4392 36.6585 23.4413 36.0253 23.0521 35.6335L17.4144 29.9576L23.0903 24.3198C23.4821 23.9306 23.4842 23.2975 23.095 22.9056C22.7058 22.5138 22.0727 22.5117 21.6808 22.9009L15.2954 29.2433ZM44.0034 29.0472L16.0035 28.9528L15.9968 30.9528L43.9966 31.0472L44.0034 29.0472Z" fill="#898989"/>
                    </svg>
                </a>
                
                <span>Назад</span>
            </div>
            <div className="block">
                <div className="block_inner">
                    <div className="block_description">
                        <div className="block_title">{program.title}</div>
                        <div className="block_statistic">
                            <div className="block_statistic_item">
                                <span className="block_statistic_item_value">{user.well_videos + '/' + program.number_of_videos}</span>
                                <span> видео</span>
                            </div>
                            <div className="block_statistic_item">
                                <span className="block_statistic_item_value">{user.well_tests + '/' + program.number_of_test}</span>
                                <span> тестов</span>
                            </div>
                            <div className="block_statistic_item">
                                <span className="block_statistic_item_value">{user.well_practical_works + '/' + program.number_of_practical_work}</span>
                                <span> практических работ</span>
                            </div>
                        </div>
                        <div className="content_program_well_progressbar_container">
                            <div className="content_program_well_progressbar">
                                <div className='content_program_well_progressbar_inner' style={{width: `${(user.well_videos+user.well_tests+user.well_practical_works)/(program.number_of_videos+program.number_of_test+program.number_of_practical_work)*100}%`}}></div>
                            </div>
                            <div className="content_program_well_procent">{Math.round((user.well_videos+user.well_tests+user.well_practical_works)/(program.number_of_videos+program.number_of_test+program.number_of_practical_work)*100)}%</div>
                        </div>
                    </div>
                    <div className="content_program_well_img">
                        <img width="172px" src={learn} alt=""/>
                    </div>
                </div>
            </div>
            <div className="course">
                {courseItems.map(({title, puncts}, i) => 
                    <div className={"course_item " + courseActives[i]}>
                    <div onClick={() => accordeon_item_click(i)} className="course_item_main">
                        <div className="course_item_description">
                            <div className="course_item_marker">{i+1}.</div>
                            <div className="course_item_title">{title}</div>
                        </div>
                        <div className="course_item_panel">
                            <a href="#" className="course_item_download">
                                <img src={presentation} alt=""/>
                                <div>Презентация</div>
                            </a>
                            <div className="course_item_completed">
                                <img src={check} alt=""/>
                            </div>
                            <svg classNameName='course_item_svg' width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.9854 1L8.24196 9.79687" stroke="#898989" stroke-opacity="0.78" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M1.16919 1.36328L7.97597 9.6843" stroke="#898989" stroke-opacity="0.78" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                                
                        </div>
                    </div>
                    <div className="course_item_hide">
                        {puncts.map(({title, video_src, lection_src, test_id}, j) => 
                            <div className="course_item_hide_punct">
                                <div className="course_item_hide_title">{i+1}.{j+1} {title}</div>
                                <div className="course_item_hide_materials">
                                    {lection_src && 
                                    <a onClick={() => setWellPracticalWorks(user.id)} href={process.env.REACT_APP_API_URL + lection_src} className="course_item_download">
                                        <img src={word} alt=""/>
                                        <div>Лекция</div>
                                    </a>
                                    }
                                    {video_src && 
                                    <Link  to={VIDEO_ROUTE + '?link=' + video_src} className="course_item_download">
                                        <img src={video_play} alt=""/>
                                        <div>Видео</div>
                                    </Link>
                                    }
                                    {test_id && 
                                    <Link to={'/user/course/test/' + test_id} className="course_item_download">
                                        <img src={test_src} alt=""/>
                                        <div>Тест</div>
                                    </Link>
                                    }
                                </div>
                            </div>
                        )}
                        
                    </div>

                </div>
                )}
                
            </div>
        </div>
    </div>
    );
});

export default CoursePage;