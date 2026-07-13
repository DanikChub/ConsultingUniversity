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

import statement from '../../../assets/imgs/statement.png';
import learn from '../../../assets/imgs/learn.png';
import how from '../../../assets/imgs/how.png';
import check from '../../../assets/imgs/check.png';
import how_learn from '../../../assets/files/how_learn.pdf';
import user_img from '../../../assets/imgs/user.png';
import {COURSE_ROUTE, STATEMENT_ROUTE, USER_CHAT_ROUTE, USER_PROFILE_ROUTE} from '../../../shared/utils/consts';
import {FiArchive, FiCheckCircle, FiClock} from "react-icons/fi";
import UserPageSkeleton from "./components/UserPageSkeleton";
import {useSocket} from "../../../hooks/useSocket";

const UserPage = observer(() => {
    const userContext = useContext(Context);
    const [program, setProgram] = useState<any>({});
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [unreadMessages, setUnreadMessages] = useState<number | null>(null);
    const [alertLoading, setAlertLoading] = useState(false);

    const socket = useSocket()



    useEffect(() => {
        const user = userContext.user.user;

        if (!user) {
            setLoading(false);
            return;
        }

        const programs = user.programs;

        if (!programs || programs.length === 0) {
            setProgram(null);
            setProgress(0);
            setLoading(true);
            return;
        }



        setPrograms(programs);


        setLoading(true);
    }, [userContext.user.user]);

    useEffect(() => {
        if (!socket) return

        const handleChatUpdated = (payload: any) => {
            console.log("chat_updated:", payload.unreadCount)
            setUnreadMessages(payload.unreadCount)
        }

        const handleUnreadCount = (payload: any) => {
            console.log("initial unread:", payload.unreadCount)
            setUnreadMessages(payload.unreadCount)
        }

        socket.emit("get_unread_count")

        socket.on("chat_updated", handleChatUpdated)
        socket.on("chat_unread_count", handleUnreadCount)

        return () => {
            socket.off("chat_updated", handleChatUpdated)
            socket.off("chat_unread_count", handleUnreadCount)
        }

    }, [socket])

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
                    <div className="relative flex flex-col justify-center">
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
                            <img src={imgSrc} alt=""
                                 className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"/>
                            <div
                                className="absolute inset-0 bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-center text-gray-800 text-sm">
                                Изменить <br/> фото
                            </div>
                        </label>
                        <Link
                            to={USER_PROFILE_ROUTE}
                            className="font-medium  text-center text-gray-800 block hover:underline"
                        >
                            Мой профиль
                        </Link>
                    </div>

                    <div className="ml-12">
                        <div className="text-3xl font-bold text-gray-800">
                            {userContext.user.user.name.split(' ')[1]}, привет!
                        </div>
                        <div className="mt-5 text-xl font-light text-gray-800">
                            Сегодня отличный день, <br/> чтобы узнать что-то новое.
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-0 md:ml-12">
                    {/* Написать преподавателю */}
                    <Link
                        to={USER_CHAT_ROUTE}
                        className="
                            relative
                            w-[130px]
                            h-[110px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-300
                            bg-gray-50
                            hover:bg-gray-100
                            transition
                        "
                    >
                        <div className="relative">
                            <svg
                                width="65"
                                height="48"
                                viewBox="0 0 100 69"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g filter="url(#filter0_d_0_1)">
                                    <rect
                                        x="5"
                                        y="1"
                                        width="90"
                                        height="59"
                                        rx="10"
                                        stroke="#2980B9"
                                        strokeWidth="2"
                                    />
                                </g>

                                <line x1="5.5" y1="8.134" x2="50.5" y2="34.134" stroke="#2980B9" strokeWidth="2"/>
                                <line x1="49.5" y1="34.134" x2="94.5" y2="8.134" stroke="#2980B9" strokeWidth="2"/>
                                <line x1="38.707" y1="27.707" x2="8.707" y2="57.707" stroke="#2980B9" strokeWidth="2"/>
                                <line x1="62.719" y1="27.305" x2="91.719" y2="57.305" stroke="#2980B9" strokeWidth="2"/>

                                <defs>
                                    <filter
                                        id="filter0_d_0_1"
                                        x="0"
                                        y="0"
                                        width="100"
                                        height="69"
                                        filterUnits="userSpaceOnUse"
                                    >
                                        <feFlood floodOpacity="0"/>
                                        <feOffset dy="4"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                    </filter>
                                </defs>
                            </svg>

                            {unreadMessages > 0 && (
                                <div
                                    className="
                        absolute
                        -top-3
                        -right-3
                        w-7
                        h-7
                        bg-red-600
                        rounded-full
                        flex
                        items-center
                        justify-center
                    "
                                >
                    <span className="text-white font-bold text-sm">
                        {unreadMessages}
                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-1 text-center font-medium text-sm text-gray-800 leading-tight">
                            {unreadMessages > 0 ? (
                                <>
                                    Прочитать
                                    <br/>
                                    сообщение
                                </>
                            ) : (
                                <>
                                    Написать
                                    <br/>
                                    преподавателю
                                </>
                            )}
                        </div>
                    </Link>

                    {/* Электронная ведомость */}
                    <Link
                        to={STATEMENT_ROUTE}
                        className="
                            w-[130px]
                            h-[110px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-300
                            bg-gray-50
                            hover:bg-gray-100
                            transition
                        "
                    >
                        <img
                            src={statement}
                            alt=""
                            className="w-[65px] h-[55px] object-contain"
                        />

                        <div className="mt-1 text-center font-medium text-sm text-gray-800 leading-tight">
                            Электронная
                            <br/>
                            ведомость
                        </div>
                    </Link>
                    <a href={how_learn}
                       className="relative
                            w-[130px]
                            h-[110px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-300
                            bg-gray-50
                            hover:bg-gray-100
                            transition">
                        <div className="flex items-center gap-4">

                            <div className="mt-1 text-center font-medium text-sm text-gray-800 leading-tight">
                                Как учиться с Консалтинг-Университет
                            </div>
                        </div>

                    </a>
                </div>

            </div>


            {/* Программа пользователя */}
            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">Ваша программа</h2>
                <div className="flex justify-between gap-4">


                    {programs.length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                            {programs.map((program) => {
                                const progress = program?.enrollment?.progress_percent ?? 0;

                                return (
                                    <Link
                                        key={program.id}
                                        to={COURSE_ROUTE.replace(":id", String(program.id))}
                                        onClick={() => localStorage.removeItem("arr_open")}
                                        className="block relative rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-gray-100 shadow-md overflow-hidden"
                                    >
                                        <div className="flex flex-col lg:flex-row items-center lg:items-stretch">

                                            {/* 🖼 Cover */}
                                            <div className="relative lg:w-[320px] w-full max-h-[200px] flex-shrink-0">

                                                {program.img ? (
                                                    <img
                                                        src={process.env.REACT_APP_API_URL + program.img}
                                                        alt={program.title ?? "Course cover"}
                                                        className="w-full h-full object-cover lg:rounded-l-3xl"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-full h-full min-h-[170px] flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 lg:rounded-l-3xl">
                                                    <span className="text-4xl font-bold text-indigo-300">
                                                        {program.title?.charAt(0)}
                                                    </span>
                                                    </div>
                                                )}

                                                {/* subtle overlay */}
                                                <div className="absolute inset-0 bg-black/5 lg:rounded-l-3xl"/>
                                            </div>

                                            {/* 📝 Content */}
                                            <div className="flex-1 px-10 py-7 space-y-6">

                                                {/* Title + badges */}
                                                <div className="space-y-4">

                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <h1 className="text-3xl font-bold text-[#2C3E50] text-left">
                                                            {program.title}
                                                        </h1>


                                                    </div>


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
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl bg-white border border-gray-100 shadow-md p-10 text-gray-500">
                                У вас пока нет назначенной программы обучения.
                            </div>
                        )}


                </div>
            </div>



            {
                progress === 100 &&
                    <div className="flex justify-end mt-5">
                        <div className="w-[70%]">
                            <div className="text-xl font-semibold">Поздравляем!</div>
                            <div className="text-lg mt-2">Вы справились со всеми тестами программы. Документы об образовании будут выданы согласно выбранному Вами способу!</div>
                        </div>
                    </div>

            }

        </UserContainer>
    )
        ;
});

export default UserPage;
