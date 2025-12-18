import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import FooterNavBar from '../../../components/FooterNavBar/FooterNavBar';
import NavBar from '../../../components/NavBar/NavBar';
import {COURSE_ROUTE, STATEMENT_ROUTE, USER_CHAT_ROUTE} from '../../../utils/consts';


import statement from "../../../assets/imgs/statement.png"
import learn from "../../../assets/imgs/learn.png"
import how from "../../../assets/imgs/how.png"
import check from "../../../assets/imgs/check.png"
import user_img from "../../../assets/imgs/user.png"
import mail_img from "../../../assets/imgs/mail.png"

import "./UserPage.css"
import {Context} from '../../../index';
import {getOneProgram} from '../../../http/programAPI';
import {setUserProfileImg} from "../../../http/userAPI";
import Spinner from '../../../components/Spinner/Spinner';


import {getStatistic} from '../../../http/statisticAPI';
import {observer} from "mobx-react-lite";
import LoadingAlert from "../../../components/ui/LoadingAlert";
import UserContainer from "../../../components/ui/UserContainer";
import {getUnreadCount} from "../../../http/chatAPI";




const UserPage = observer(() => {
    const userContext = useContext(Context);
    const [program, setProgram] = useState({});
    const [loading, setLoading] = useState(false);
    const [statistic, setStatistic] = useState({
        id: 2,
        users_id: 7,
        programs_id: 7,
        well_videos: 1,
        well_tests: 0,
        well_practical_works: 0,
        max_videos: 1,
        max_tests: 0,
        max_practical_works: 0,
        userId: null,
        programId: null,
        themesStatistic: []
    });

    const [unreadMessages, setUnreadMessages] = useState(null)

    const [alertLoading, setAlertLoading] = useState(false);


    useEffect(() => {
        console.log('asd')
        if (userContext.user.user.programs_id) {
            let program_id = userContext.user.user.programs_id[0]

            async function getProgram(id) {
                let program = await getOneProgram(id)
                setProgram(program);

            }

            getProgram(program_id)
            getStatistic(userContext.user.user.id, userContext.user.user.programs_id[0]).then(data => {
                setStatistic(data);
                setLoading(true)
            })
            getUnreadCount(userContext.user.user.id, 'USER')
                .then(data => setUnreadMessages(data.unreadCount))
                .catch(e => alert(e))
        }

    }, [])

    const handleProfileImgCLick = (e) => {
        const formdata = new FormData()

        formdata.append("id", userContext.user.user.id)
        formdata.append("img", e.target.files[0])

        const localImg = URL.createObjectURL(e.target.files[0])

        userContext.user.setUserImage(localImg)

        setAlertLoading(true)
        setUserProfileImg(formdata)
            .then(() => setAlertLoading(false))
            .catch((e) => setAlertLoading(false))
    }

    const imgSrc = userContext.user.user.img
        ? userContext.user.user.img.includes("http") ||
        userContext.user.user.img.startsWith("blob:")
            ? userContext.user.user.img
            : process.env.REACT_APP_API_URL + userContext.user.user.img
        : user_img;

    return (

        <UserContainer loading={loading}>
            <LoadingAlert show={alertLoading} text="Загружаем картинку профиля..." />
            <div className="flex items-end justify-between">
                <div className="flex items-center">
                    <input onChange={(e) => handleProfileImgCLick(e)} className="hidden" id="userProfileImgId" type='file' accept="image/*"/>
                    <label
                        htmlFor="userProfileImgId"

                        className="relative rounded-full w-[115px] h-[115px] overflow-hidden group cursor-pointer bg-[#C7C7C7]">
                        <img
                            className="w-full h-full object-cover"
                            src={imgSrc}
                            alt=""
                        />

                        {/* Overlay */}
                        <div className="
                            absolute inset-0
                            bg-white/70
                            flex items-center justify-center
                            text-sm font-medium text-gray-800
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                        ">
                            <i className="text-[#2C3E50] text-center">Изменить <br/> фото</i>

                        </div>
                    </label>
                    <div className="ml-[50px]">
                        <div
                            className="text-3xl font-bold text-[#2C3E50]">{userContext.user.user.name.split(' ')[1]},
                            привет!
                        </div>
                        <div className="font-light text-[#2C3E50] text-xl mt-[21px]">Сегодня отличный
                            день, <br/>чтобы узнать
                            что-то новое.
                        </div>
                    </div>

                </div>
                <div className="flex items-start ml-[50px]">
                    <div className="relative">
                        <svg width="100" height="69" viewBox="0 0 100 69" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_0_1)">
                                <rect x="5" y="1" width="90" height="59" rx="10" stroke="#2980B9" stroke-width="2"
                                      shape-rendering="crispEdges"/>
                            </g>
                            <line x1="5.50028" y1="8.13413" x2="50.5003" y2="34.1341" stroke="#2980B9"
                                  stroke-width="2"/>
                            <line x1="49.4997" y1="34.1341" x2="94.4997" y2="8.13414" stroke="#2980B9"
                                  stroke-width="2"/>
                            <line x1="38.7071" y1="27.7071" x2="8.7071" y2="57.7071" stroke="#2980B9" stroke-width="2"/>
                            <line x1="62.719" y1="27.305" x2="91.719" y2="57.305" stroke="#2980B9" stroke-width="2"/>
                            <defs>
                                <filter id="filter0_d_0_1" x="0" y="0" width="100" height="69"
                                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                                   values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                   result="hardAlpha"/>
                                    <feOffset dy="4"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1"
                                             result="shape"/>
                                </filter>
                            </defs>
                        </svg>
                        {unreadMessages != '0' &&
                            <div
                                className="absolute right-[-10px] bottom-[-10px] w-[44px] h-[44px] flex justify-center items-center bg-[#FF0000] rounded-full">
                                <span className="text-[#fff] font-bold text-2xl">{unreadMessages}</span>
                            </div>
                        }

                    </div>


                    <Link to={USER_CHAT_ROUTE} className="font-medium text-xl text-[#2C3E50] ml-[30px]">Написать<br/>
                        преподавателю</Link>
                </div>
                <div className="flex items-center mr-[50px]">
                    <div className="statement_img">
                        <img width="164px" src={statement} alt=""/>
                    </div>
                    <div className="statement_description">
                        <Link to={STATEMENT_ROUTE}
                              className="font-medium text-[20px] text-[#2C3E50] mt-[50px]">Электронная <br/> ведомость</Link>

                    </div>
                </div>
            </div>
            <div className="content_program">
                <div className="font-semibold text-2xl text-[#2C3E50]">Ваша программа</div>
                <div className="mt-[30px] flex justify-between">
                    <Link className="content_program_well" onClick={() => localStorage.removeItem('arr_open')}
                          to={COURSE_ROUTE}>
                        <div className="content_program_well_description">
                            <div className="content_program_well_title">{program.title}</div>
                            <div className="content_program_well_img">
                                <img width="109px" src={learn} alt=""/>
                            </div>
                        </div>
                        <div className="content_program_well_progressbar_container">
                            <div className="content_program_well_progressbar">
                                <div className='content_program_well_progressbar_inner'
                                     style={{width: `${(statistic.well_tests) / (statistic.max_tests) * 100}%`}}></div>
                            </div>
                            <div
                                className="text-[20px] font-light text-[#2C3E50] ml-[15px]">{Math.round((statistic.well_tests) / (statistic.max_tests) * 100)}%
                            </div>
                        </div>
                    </Link>
                    <div className="content_program_well how">
                        <div className="content_program_well_description">
                            <div className="content_program_well_title">Как учиться с Консалтинг-Университет
                            </div>
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
        </UserContainer>

    );
});

export default UserPage;