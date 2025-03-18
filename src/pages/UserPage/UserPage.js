import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FooterNavBar from '../../components/FooterNavBar/FooterNavBar';
import NavBar from '../../components/NavBar/NavBar';
import { COURSE_ROUTE } from '../../utils/consts';


import statement from "../../assets/imgs/statement.png"
import learn from "../../assets/imgs/learn.png"
import how from "../../assets/imgs/how.png"
import check from "../../assets/imgs/check.png"

import "./UserPage.css"
import { Context } from '../../index';
import { getOneProgram } from '../../http/programAPI';
import Spinner from '../../components/Spinner/Spinner';

const UserPage = () => {
    const userContext = useContext(Context);
    const [program, setProgram] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       if (userContext.user.user.programs_id) {
        let program_id = userContext.user.user.programs_id[0]
        async function getProgram(id) {
            let program = await getOneProgram(id)
            setProgram(program);
            setLoading(false);
        }
        getProgram(program_id)
       }
        
    }, [])

    return (
        !loading ?
            <div>
                <div className="content">
                    <div className="container">
                        <div className="content_inner">
                            <div className="content_welocme">
                                <div className="content_welcome_title">{userContext.user.user.name}, привет!</div>
                                <div className="content_welcome_text">Сегодня отличный день,<br/> чтобы узнать что-то новое.</div>
                            </div>
                            <div className="statement">
                                <div className="statement_img">
                                    <img width="164px" src={statement} alt=""/>
                                </div>
                                <div className="statement_description">
                                    <div className="statement_title">Электронная ведомость</div>
                                    <div className="statement_link">Смотреть</div>
                                </div>
                            </div>
                        </div>
                        <div className="content_program">
                            <div className="content_program_title">Ваша программа</div>
                            <div className="content_program_inner">
                                <Link to={COURSE_ROUTE} className="content_program_well">
                                    <div className="content_program_well_description">
                                        <div className="content_program_well_title">{program.title}</div>
                                        <div className="content_program_well_img">
                                            <img width="109px" src={learn} alt=""/>
                                        </div>
                                    </div>
                                    <div className="content_program_well_progressbar_container">
                                        <div className="content_program_well_progressbar"></div>
                                        <div className="content_program_well_procent">48%</div>
                                    </div>
                                </Link>
                                <div className="content_program_well how">
                                    <div className="content_program_well_description">
                                        <div className="content_program_well_title">Как учиться с Консалтинг-Университет</div>
                                        <div className="content_program_well_img">
                                            <img width="109px" src={how} alt=""/>
                                        </div>
                                    </div>
                                    <div className="how_check_container">
                                        <div className="how_check">
                                            <img width="25px" src={check} alt=""/>
                                        </div>
                                        <div className="how_check_text">Просмотрено</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
        <Spinner/>
        
    );
};

export default UserPage;