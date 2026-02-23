import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { FiChevronDown, FiCheck, FiClock, FiXCircle, FiHeadphones, FiFileText } from "react-icons/fi";
import { AiFillFilePdf } from "react-icons/ai";
import type { Program } from "../../entities/program/model/type";
import type { ProgramProgress } from "../../entities/progress/model/type";
import { getContentStatus, isContentCompleted } from "../../entities/progress/model/selectors";
import { LECTION_ROUTE, PDF_ROUTE } from "../../shared/utils/consts";
import {getOneProgram} from "../../entities/program/api/program.api";
import {getEnrollmentByProgram} from "../../entities/enrollment/api/enrollment.api";
import {getEnrollmentProgress} from "../../entities/progress/api/progress.api";
import {Context} from "../../index";

interface SidebarProps {

}

const CourseSidebar: React.FC<SidebarProps> = () => {
    const [openThemes, setOpenThemes] = useState<number[]>([]);
    const [program, setProgram] = useState<Program | null>(null)
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState<ProgramProgress | null>(null)
    const navigate = useNavigate()
    const userContext = useContext(Context);

    useEffect(() => {


        async function load() {
            try {
                setLoading(false)

                const programData = await getOneProgram(Number(localStorage.getItem('programId')))
                console.log(programData)
                setProgram(programData)

                const enrollmentId = userContext.user.enrollmentId;


                const progressData = await getEnrollmentProgress(enrollmentId)

                setProgress(progressData)

            } catch (e) {
                console.error(e)
            } finally {
                setLoading(true)
            }
        }

        load()
    }, [])


    const toggleTheme = (themeId: number) => {
        setOpenThemes(prev =>
            prev.includes(themeId) ? prev.filter(id => id !== themeId) : [...prev, themeId]
        );
    };

    if (!program) return <div>Загрузка...</div>

    return (
        <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-y-auto space-y-4">


            {/* Темы */}
            {program.themes?.map(theme => {
                const completedPunctsCount = theme.puncts?.reduce((acc, punct) => {
                    const total = (punct.files?.length || 0) + (punct.tests?.length || 0);
                    let completed = 0;
                    punct.files?.forEach(file => {
                        if (isContentCompleted(progress, "file", file.id)) completed++;
                    });
                    punct.tests?.forEach(test => {
                        if (isContentCompleted(progress, "test", test.id)) completed++;
                    });
                    return acc + (total > 0 && completed === total ? 1 : 0);
                }, 0) || 0;

                const totalPuncts = theme.puncts?.length || 0;
                const themeProgress = totalPuncts > 0 ? Math.round((completedPunctsCount / totalPuncts) * 100) : 0;
                const isThemeCompleted = totalPuncts > 0 && completedPunctsCount === totalPuncts;

                const isOpen = openThemes.includes(theme.id);

                return (
                    <div key={theme.id} className="border border-gray-100 rounded-xl overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => toggleTheme(theme.id)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800">{theme.title}</span>
                                {isThemeCompleted && <FiCheck className="text-green-500" />}
                            </div>
                            <FiChevronDown
                                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                        </div>

                        {/* Прогресс темы */}
                        <div className="px-4 pb-2">
                            <div className="h-2 bg-gray-100 rounded-full mb-2">
                                <div
                                    className="h-2 bg-green-300 rounded-full transition-all duration-300"
                                    style={{ width: `${themeProgress}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500">{themeProgress}% пройдено</div>
                        </div>

                        {/* Пункты и файлы */}
                        {isOpen && (
                            <div className="px-4 pb-4 space-y-2">
                                {theme.puncts?.map(punct => {
                                    const totalItems = (punct.files?.length || 0) + (punct.tests?.length || 0);
                                    let completedCount = 0;
                                    punct.files?.forEach(file => {
                                        if (isContentCompleted(progress, "file", file.id)) completedCount++;
                                    });
                                    punct.tests?.forEach(test => {
                                        if (isContentCompleted(progress, "test", test.id)) completedCount++;
                                    });
                                    const isPunctCompleted = totalItems > 0 && completedCount === totalItems;

                                    return (
                                        <div key={punct.id} className="space-y-1">
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                                <span>{punct.title}</span>
                                                <span className="text-gray-500 text-xs">
                                                  {completedCount}/{totalItems} {isPunctCompleted && <FiCheck className="inline text-green-500" />}
                                                </span>
                                            </div>

                                            {/* Файлы */}
                                            <div className="pl-4 space-y-1">
                                                {punct.files?.map(file => {
                                                    const status = getContentStatus(progress, "file", file.id);

                                                    const handleClick = async () => {
                                                        if (file.type === "audio") {
                                                            alert('Прослушивать на странице курса')
                                                        }

                                                        if (file.type === 'docx') {
                                                            navigate(LECTION_ROUTE.replace(':id', `${file.id}`))
                                                        }

                                                        if (file.type === 'pdf') {
                                                            navigate(PDF_ROUTE.replace(':id', `${file.id}`))
                                                        }

                                                    };



                                                    return (
                                                        <div
                                                            key={file.id}
                                                            onClick={handleClick}
                                                            className={`flex items-center justify-between p-2 rounded-xl text-sm cursor-pointer transition hover:bg-gray-50 ${
                                                                status === "completed"
                                                                    ? "bg-green-50 border border-green-100"
                                                                    : status === "in_progress"
                                                                        ? "bg-blue-50 border border-blue-100"
                                                                        : "bg-white border border-gray-100"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2 text-gray-700">

                                                                <span>{file.original_name}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {status === "completed"
                                                                    ? <FiCheck className="inline text-green-500" />
                                                                    : status === "in_progress"
                                                                        ? <FiClock className="inline text-blue-500"/>
                                                                        : ""}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Тесты */}
                                                {punct.tests?.map(test => {
                                                    const status = getContentStatus(progress, "test", test.id);
                                                    return (
                                                        <div
                                                            key={test.id}
                                                            className={`flex items-center justify-between p-2 rounded-xl text-sm cursor-pointer transition hover:bg-gray-50 ${
                                                                status === "completed"
                                                                    ? "bg-green-50 border border-green-100"
                                                                    : status === "in_progress"
                                                                        ? "bg-blue-50 border border-blue-100"
                                                                        : "bg-white border border-gray-100"
                                                            }`}
                                                        >
                                                            <span>🧪 Тест</span>
                                                            <span className="text-xs text-gray-500">
                                {status === "completed"
                                    ? "Пройден"
                                    : status === "in_progress"
                                        ? "В процессе"
                                        : ""}
                              </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CourseSidebar;
