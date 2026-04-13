// CoursePage.tsx
import learn from "../../../assets/imgs/learn.png"
import React, {useContext, useEffect, useMemo, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import { FiArrowLeft, FiCheckCircle, FiClock, FiArchive } from "react-icons/fi"

import ThemeBlock from "./components/ThemeBlock"
import type { Program } from "../../../entities/program/model/type"
import { getOneProgram } from "../../../entities/program/api/program.api"

import {Context} from '../../../index';

import UserContainer from "../../../components/ui/UserContainer"
import type {ProgramProgress} from "../../../entities/progress/model/type";
import {getEnrollmentProgress} from "../../../entities/progress/api/progress.api";
import {getEnrollmentByProgram} from "../../../entities/enrollment/api/enrollment.api";
import CustomAudioPlayer from "../../../components/CustomAudioPlayer/CustomAudioPlayer";
import type {File} from "../../../entities/file/model/type";


import {USER_ROUTE} from "../../../shared/utils/consts";
import ProgramSkeleton from "./components/ProgramSkeleton";
import {getProgramFileStats, type ProgramFileStats} from "./hooks/getProgramFileStats";
import TestBlock from "./components/TestBlock";
import {isContentCompleted} from "../../../entities/progress/model/selectors";

export default function CoursePage() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [program, setProgram] = useState<Program | null>(null)
    const [loading, setLoading] = useState(true)
    const [openThemes, setOpenThemes] = useState<number[]>([])
    const [progress, setProgress] = useState<ProgramProgress | null>(null)
    const [stats, setStats] = useState<ProgramFileStats | null>(null)


    const [playerActive, setPlayerActive] = useState(false)
    const [activeAudio, setActiveAudio] = useState<File | null>(null)
    const [animatedPercent, setAnimatedPercent] = useState(0);
    const userContext = useContext(Context);


    useEffect(() => {
        if (!Number(id)) return;

        async function load() {
            try {
                setLoading(false);

                const programData = await getOneProgram(Number(id));
                programData.themes?.forEach(theme => {
                    theme.puncts?.forEach(punct => {

                        punct.files?.forEach(file => {
                            file.themeId = theme.id
                            file.punctId = punct.id
                        })

                        punct.tests?.forEach(test => {
                            test.themeId = theme.id
                            test.punctId = punct.id
                        })

                    })

                    theme.files?.forEach(file => {
                        file.themeId = theme.id
                        file.punctId = null
                    })
                })
                setProgram(programData);

                const enrollment = await getEnrollmentByProgram(programData.id, userContext.user.user.id);
                userContext.user.setEnrollmentId(enrollment.id);

                const freshProgress = await getEnrollmentProgress(enrollment.id);
                const stats = getProgramFileStats(programData, freshProgress)
                setStats(stats)
                // --- Сравниваем со старым прогрессом ---
                const oldProgress = userContext.user.getEnrollmentProgress(enrollment.id);
                let changedItems: string[] = [];

                Object.keys(freshProgress.byContent).forEach(key => {
                    const oldItem = oldProgress?.byContent?.[key];
                    const newItem = freshProgress.byContent[key];

                    if (!oldItem || oldItem.status !== newItem.status) {
                        changedItems.push(key);
                    }
                });

                if (changedItems.length > 1) {
                    changedItems = []
                }

                // Сохраняем анимационные изменения
                userContext.user.setProgressChanges(enrollment.id, changedItems);

                // Обновляем прогресс
                userContext.user.setEnrollmentProgress(enrollment.id, freshProgress);
                setProgress(freshProgress);




            } catch (e) {
                alert(e.response.data.message);
            } finally {
                setLoading(true);
            }
        }

        load();
    }, [id]);

    useEffect(() => {
        if (!program || !progress) return;

        const lastOpened = userContext.user.getLastOpened(userContext.user.enrollmentId);
        console.log(lastOpened)
        if (lastOpened) {
            // 1️⃣ Открываем нужную тему
            setOpenThemes([lastOpened.themeId]);

            // 2️⃣ Скроллим к нужному элементу
            setTimeout(() => {
                const elementId = `${lastOpened.type}-${lastOpened.id}`;
                const el = document.getElementById(elementId);

                if (el) {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }, 300);
        }
    }, [program, progress]);


    useEffect(() => {
        if (progress?.percent !== undefined) {
            const target = Math.round(progress.percent);

            // маленькая задержка, чтобы DOM успел отрисоваться
            setTimeout(() => {
                setAnimatedPercent(target);
            }, 100);
        }
    }, [progress?.percent]);

    const toggleTheme = (themeId: number) => {
        setOpenThemes(prev =>
            prev.includes(themeId)
                ? prev.filter(id => id !== themeId)
                : [...prev, themeId]
        )
    }



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
    const percent = Math.round(progress?.percent ?? 0)


    const traslatorFileType = {
        docx: 'Лекции',
        pdf: 'Презентации',
        video: 'Видео',
        audio: 'Аудио',
        tests: 'Тесты'
    }

    const finalLocked = useMemo(() => {
        if (!program || !progress) return true

        const tests =
            program.themes
                ?.flatMap(t => t.puncts ?? [])
                .flatMap(p => p.tests ?? [])
                .filter(t => !t.final_test) ?? []

        return tests.some(t => !isContentCompleted(progress, "test", t.id))
    }, [program, progress])



    if (!loading) return <ProgramSkeleton/>
    if (!program) return <UserContainer loading={true}>
        Программа не найдена
    </UserContainer>

    return (


        <UserContainer loading={loading}>
            <div className="space-y-6">

                {/* 🔙 Back */}
                <button
                    onClick={() => navigate(USER_ROUTE)}
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
                >
                    <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                        <FiArrowLeft size={20}/>
                    </div>
                    <span className="text-lg font-medium">Назад</span>
                </button>

                {/* 🎓 Header */}
                <div
                    className="relative rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-gray-100 shadow-md overflow-hidden">

                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch">

                        {/* 🖼 Cover */}
                        <div className="relative lg:w-[320px] w-full max-h-[350px] flex-shrink-0">

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
                                    <h1 className="text-3xl font-bold text-[#2C3E50]">
                                        {program.title}
                                    </h1>


                                </div>


                            </div>

                            <div className="space-y-4">

                                {/* 🎯 Главный блок — тесты */}


                                {/* 📚 Материалы — компактная строка */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 px-2">
                                    {stats.tests.total > 0 && (
                                        <span>{stats.tests.completed}/{stats.tests.total} Тестов</span>
                                    )}

                                    {stats.video.total > 0 && (
                                        <span>{stats.video.completed}/{stats.video.total} Видео</span>
                                    )}

                                    {stats.audio.total > 0 && (
                                        <span>{stats.audio.completed}/{stats.audio.total} Аудио</span>
                                    )}

                                    {stats.pdf.total > 0 && (
                                        <span>{stats.pdf.completed}/{stats.pdf.total} Презентации</span>
                                    )}

                                    {stats.docx.total > 0 && (
                                        <span>{stats.docx.completed}/{stats.docx.total} Лекции</span>
                                    )}

                                </div>

                            </div>


                            {/* 📊 Progress */}
                            <div className="max-w-xl space-y-2">

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Прогресс обучения</span>
                                    <span className="font-semibold text-gray-700">
                                    {percent}%
                                </span>
                                </div>

                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out"
                                        style={{width: `${animatedPercent}%`}}
                                    />
                                </div>

                                <div className="text-sm text-gray-500">
                                    {percent === 100
                                        ? "Курс завершён 🎉"
                                        : "Продолжайте обучение"}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* decoration */}
                    <div
                        className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-40"/>
                </div>
            </div>


            {/* Themes */}
            <div className="space-y-4 mt-[50px]">
                {program.themes?.map((theme, i) => (
                    <ThemeBlock
                        map_order_index={i+1}
                        key={theme.id}
                        theme={theme}
                        open={openThemes.includes(theme.id)}
                        toggle={() => toggleTheme(theme.id)}
                        progress={progress}
                        setPlayerActive={setPlayerActive}
                        setActiveAudio={setActiveAudio}
                    />
                ))}
                {
                    program?.test &&
                    <TestBlock
                        test={program.test}
                        progress={progress}
                        locked={finalLocked}
                    />
                }

            </div>

            {playerActive && activeAudio && (
                <CustomAudioPlayer
                    track={activeAudio}
                    setPlayerActive={setPlayerActive}
                    setActiveTrack={() => {}}
                    className=""
                    setProgress={setProgress}
                    progress={progress}
                />
            )}


        </UserContainer>
    )
}
