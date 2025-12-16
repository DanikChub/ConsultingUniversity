import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import FooterNavBar from '../../../components/FooterNavBar/FooterNavBar';
import NavBar from '../../../components/NavBar/NavBar';
import {COURSE_ROUTE, STATEMENT_ROUTE} from '../../../utils/consts';


import statement from "../../../assets/imgs/statement.png"
import learn from "../../../assets/imgs/learn.png"
import how from "../../../assets/imgs/how.png"
import check from "../../../assets/imgs/check.png"
import user_img from "../../../assets/imgs/user.png"

import "./UserPage.css"
import {Context} from '../../../index';
import {getOneProgram} from '../../../http/programAPI';
import {setUserProfileImg} from "../../../http/userAPI";
import Spinner from '../../../components/Spinner/Spinner';


import {getStatistic} from '../../../http/statisticAPI';
import {observer} from "mobx-react-lite";
import LoadingAlert from "../../../components/ui/LoadingAlert";
import UserContainer from "../../../components/ui/UserContainer";




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
        }

    }, [])

    const handleProfileImgCLick = (e) => {
        const formdata = new FormData()

        formdata.append("id", userContext.user.user.id)
        formdata.append("img", e.target.files[0])

        const localImg = URL.createObjectURL(e.target.files[0])

        userContext.user.setUserImage(localImg)


        setUserProfileImg(formdata)
            .then(() => setLoading(false))
            .catch((e) => setLoading(false))
    }

    const imgSrc = userContext.user.user.img
        ? userContext.user.user.img.includes("http") ||
        userContext.user.user.img.startsWith("blob:")
            ? userContext.user.user.img
            : process.env.REACT_APP_API_URL + userContext.user.user.img
        : user_img;

    return (

        <UserContainer loading={loading}>
            <div className="flex items-start justify-between">
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
                            className="text-3xl font-bold text-[#2C3E50]">{userContext.user.user.name.split(' ')[0]},
                            привет!
                        </div>
                        <div className="font-light text-[#2C3E50] text-xl mt-[21px]">Сегодня отличный
                            день, <br/>чтобы узнать
                            что-то новое.
                        </div>
                    </div>

                </div>
                <div className="statement mt-[20px] flex items-center mr-[50px]">
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