import React, { useContext, useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import FooterNavBar from '../../../shared/ui/layot/FooterNavBar';
import NavBar from '../../../shared/ui/layot/NavBar';
import UserContainer from '../../../components/ui/UserContainer';
import LoadingAlert from '../../../components/ui/LoadingAlert';
import { Context } from '../../../index';
import { getOneProgram } from '../../../entities/program/api/program.api';
import { setUserProfileImg } from '../../../entities/user/api/user.api';
import { getUnreadCount } from '../../../entities/chat/api/chat.api';
import statement from '../../../assets/imgs/statement.png';
import learn from '../../../assets/imgs/learn.png';
import how from '../../../assets/imgs/how.png';
import check from '../../../assets/imgs/check.png';
import user_img from '../../../assets/imgs/user.png';
import { COURSE_ROUTE, STATEMENT_ROUTE, USER_CHAT_ROUTE } from '../../../shared/utils/consts';
import {FiArchive, FiCheckCircle, FiClock} from "react-icons/fi";
import UserPageSkeleton from "./components/UserPageSkeleton";

const UserPage = observer(() => {
    const userContext = useContext(Context);
    const [program, setProgram] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [unreadMessages, setUnreadMessages] = useState<number | null>(null);
    const [alertLoading, setAlertLoading] = useState(false);

    useEffect(() => {
        setLoading(false)
        const userProgram = userContext.user.user.programs[0];
        setProgram(userProgram);
        setProgress(userProgram.enrollment.progress_percent ?? 0);


        getUnreadCount(userContext.user.user.id, 'USER')
            .then((data) => setUnreadMessages(data.unreadCount))
            .catch((e) => console.error(e))
            .finally(() => setLoading(true))
    }, []);

    const handleProfileImgClick = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formdata = new FormData();
        formdata.append('id', userContext.user.user.id);
        formdata.append('img', file);

        const localImg = URL.createObjectURL(file);
        userContext.user.setUserImage(localImg);

        setAlertLoading(true);
        setUserProfileImg(formdata)
            .finally(() => setAlertLoading(false));
    };

    const imgSrc = userContext.user.user.img
        ? userContext.user.user.img.startsWith('http') || userContext.user.user.img.startsWith('blob:')
            ? userContext.user.user.img
            : process.env.REACT_APP_API_URL + userContext.user.user.img
        : user_img;

    const statusStyles = {
        published: {
            label: "Опубликован",
            color: "bg-green-100 text-green-600",
            icon: <FiCheckCircle />
        },
        draft: {
            label: "Черновик",
            color: "bg-yellow-100 text-yellow-600",
            icon: <FiClock />
        },
        archived: {
            label: "Архив",
            color: "bg-gray-200 text-gray-600",
            icon: <FiArchive />
        }
    }

    const status = statusStyles['published']

    return (
        <UserContainer loading={loading} skeleton={<UserPageSkeleton/>}>
            <LoadingAlert show={alertLoading} text="Загружаем картинку профиля..." />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Профиль и приветствие */}
                <div className="flex items-center mb-8 md:mb-0">
                    <div className="relative">
                        <input
                            id="userProfileImgId"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImgClick}
                        />
                        <label
                            htmlFor="userProfileImgId"
                            className="block relative rounded-full w-[130px] h-[130px] overflow-hidden cursor-pointer bg-gray-300 group"
                        >
                            <img src={imgSrc} alt="" className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"/>
                            <div
                                className="absolute inset-0 bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-center text-gray-800 text-sm">
                                Изменить <br/> фото
                            </div>
                        </label>

                    </div>

                    <div className="ml-12">
                        <div className="text-3xl font-bold text-gray-800">
                            {userContext.user.user.name.split(' ')[0]}, привет!
                        </div>
                        <div className="mt-5 text-xl font-light text-gray-800">
                            Сегодня отличный день, <br/> чтобы узнать что-то новое.
                        </div>
                    </div>
                </div>

                {/* Написать преподавателю */}
                <div className="flex items-start ml-0 md:ml-12 mb-8 md:mb-0 relative">
                    <div className="relative">
                        <svg width="100" height="69" viewBox="0 0 100 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_0_1)">
                                <rect x="5" y="1" width="90" height="59" rx="10" stroke="#2980B9" strokeWidth="2" />
                            </g>
                            <line x1="5.5" y1="8.134" x2="50.5" y2="34.134" stroke="#2980B9" strokeWidth="2" />
                            <line x1="49.5" y1="34.134" x2="94.5" y2="8.134" stroke="#2980B9" strokeWidth="2" />
                            <line x1="38.707" y1="27.707" x2="8.707" y2="57.707" stroke="#2980B9" strokeWidth="2" />
                            <line x1="62.719" y1="27.305" x2="91.719" y2="57.305" stroke="#2980B9" strokeWidth="2" />
                            <defs>
                                <filter
                                    id="filter0_d_0_1"
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="69"
                                    filterUnits="userSpaceOnUse"
                                    colorInterpolationFilters="sRGB"
                                >
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix
                                        in="SourceAlpha"
                                        type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                        result="hardAlpha"
                                    />
                                    <feOffset dy="4" />
                                    <feGaussianBlur stdDeviation="2" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
                                </filter>
                            </defs>
                        </svg>

                        {unreadMessages !== 0 && (
                            <div className="absolute -right-2.5 -bottom-2.5 w-11 h-11 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">{unreadMessages}</span>
                            </div>
                        )}
                    </div>

                    <Link to={USER_CHAT_ROUTE} className="ml-8 font-medium text-xl text-gray-800">
                        Написать <br /> преподавателю
                    </Link>
                </div>

                {/* Ведомость */}
                <div className="flex items-center ml-0 md:ml-12">
                    <div className="w-40">
                        <img src={statement} alt="" />
                    </div>
                    <div className="ml-4">
                        <Link to={STATEMENT_ROUTE} className="font-medium text-lg text-gray-800 block">
                            Электронная <br /> ведомость
                        </Link>
                    </div>
                </div>
            </div>

            {/* Программа пользователя */}
            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">Ваша программа</h2>

                    {/* Основной курс */}
                    <Link
                        to={COURSE_ROUTE.replace(':id', program.id)}
                        onClick={() => localStorage.removeItem('arr_open')}
                        className="block relative rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-gray-100 shadow-md overflow-hidden"
                    >
                        <div className="flex flex-col lg:flex-row items-center lg:items-stretch">

                            {/* 🖼 Cover */}
                            <div className="relative lg:w-[320px] w-full max-h-[250px] flex-shrink-0">

                                {program.img ? (
                                    <img
                                        src={process.env.REACT_APP_API_URL + program.img}
                                        alt={program.title ?? "Course cover"}
                                        className="w-full h-full object-cover lg:rounded-l-3xl"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full min-h-[220px] flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 lg:rounded-l-3xl">
                            <span className="text-4xl font-bold text-indigo-300">
                                {program.title?.charAt(0)}
                            </span>
                                    </div>
                                )}

                                {/* subtle overlay */}
                                <div className="absolute inset-0 bg-black/5 lg:rounded-l-3xl"/>
                            </div>

                            {/* 📝 Content */}
                            <div className="flex-1 p-10 space-y-6">

                                {/* Title + badges */}
                                <div className="space-y-4">

                                    <div className="flex flex-wrap items-center gap-4">
                                        <h1 className="text-3xl font-bold text-[#2C3E50] text-left">
                                            {program.title}
                                        </h1>

                                        <div
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                            {status.icon}
                                            {status.label}
                                        </div>


                                    </div>

                                    {program.short_title && (
                                        <div className="text-sm text-gray-400">
                                            Внутреннее название: {program.short_title}
                                        </div>
                                    )}
                                </div>

                                {/* 📊 Progress */}
                                <div className="max-w-xl space-y-2">

                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Прогресс обучения</span>
                                        <span className="font-semibold text-gray-700">
                                {progress}%
                            </span>
                                    </div>

                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                                            style={{width: `${progress}%`}}
                                        />
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {progress === 100
                                            ? "Курс завершён 🎉"
                                            : "Продолжайте обучение"}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* decoration */}
                        <div
                            className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-40"/>

                    </Link>

            {/*/!* Как учиться *!/*/}
            {/*<div className="bg-gray-300 rounded-xl p-6 w-full md:w-1/3 flex flex-col items-start gap-4">*/}
            {/*    <div className="flex items-center gap-4">*/}
            {/*        <div className="w-28">*/}
            {/*            <img src={how} alt=""/>*/}
            {/*        </div>*/}
            {/*        <div className="text-lg font-semibold text-gray-800">Как учиться с Консалтинг-Университет</div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-2">*/}
            {/*        <div className="w-6">*/}
            {/*            <img src={check} alt=""/>*/}
            {/*        </div>*/}
            {/*        <div className="text-gray-600 text-base">Просмотрено</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>

</UserContainer>
)
    ;
});

export default UserPage;
