import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContainer from "../../../components/ui/AppContainer";

import { getUserById } from "../../../entities/user/api/user.api";
import { getEnrollmentProgress } from "../../../entities/progress/api/progress.api";
import { getAllTestAttempts } from "../../../entities/test/api/test.api";

import type { User } from "../../../entities/user/model/type";
import type { ProgramProgress } from "../../../entities/progress/model/type";
import type {Test, TestAttempt} from "../../../entities/test/model/type";

import {
    FiMail,
    FiPhone,
    FiCalendar,
    FiUser,
    FiBookOpen,
    FiCheckCircle,
    FiTrendingUp,
    FiBarChart2, FiAward
} from "react-icons/fi";
import type {Program} from "../../../entities/program/model/type";
import {getOneProgram} from "../../../entities/program/api/program.api";
import {useModals} from "../../../hooks/useModals";
import type {File as FileType} from "../../../entities/file/model/type";
import {downloadFile} from "../../../shared/lib/download/downloadFile";

/* ================= TYPES ================= */

interface TestStat {
    testId: number;
    title?: string;
    attemptsCount: number;
    passedCount: number;
    bestScore: number | null;
    lastAttemptDate: string | null;
}

interface ProgramWithStats {
    programId: number;
    title?: string;
    enrollmentId: number;
    progress: ProgramProgress;
    testStats: TestStat[];
}

/* ================= COMPONENT ================= */

function extractAllTests(program: Program): Test[] {
    if (!program.themes) return [];

    return program.themes.flatMap(theme =>
        theme.puncts?.flatMap(punct =>
            punct.tests ?? []
        ) ?? []
    );
}

function getTotalContent(program: Program): number {
    if (!program.themes) return 0;

    return program.themes.reduce((themeAcc, theme) => {
        if (!theme.puncts) return themeAcc;

        const punctsTotal = theme.puncts.reduce((punctAcc, punct) => {
            const filesCount = punct.files?.length ?? 0;
            const testsCount = punct.tests?.length ?? 0;

            return punctAcc + filesCount + testsCount;
        }, 0);

        return themeAcc + punctsTotal + theme.files?.length ?? 0;
    }, 0);
}

const AdminUserPage = () => {
    const { id } = useParams();

    const [user, setUser] = useState<User | null>(null);
    const [programs, setPrograms] = useState<ProgramWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalContent, setTotalContent] = useState<number>(0)

    const [progress, setProgress] = useState<ProgramProgress | null>(null)
    const [program, setProgram] = useState<Program | null>(null)
    const { openModal } = useModals();

    useEffect(() => {
        if (!id) return;

        async function load() {
            try {
                setLoading(true);

                // --- GET USER ---
                const userData = await getUserById(Number(id));
                setUser(userData);

                const enrichedPrograms: ProgramWithStats[] = [];

                if (userData.programs) {
                    for (const program of userData.programs) {
                        if (!program.enrollment) continue;

                        const enrollmentId = program.enrollment.id;

                        // --- GET FULL PROGRAM WITH THEMES & TESTS ---
                        const fullProgram = await getOneProgram(program.id);
                        setProgram(fullProgram)
                        const totalContentFromF = getTotalContent(fullProgram)

                        setTotalContent(totalContentFromF)
                        // --- EXTRACT ALL TESTS ---
                        const tests = extractAllTests(fullProgram);

                        // --- GET PROGRESS ---
                        const progress = await getEnrollmentProgress(enrollmentId);
                        setProgress(progress)
                        // --- GET TEST ATTEMPTS IN PARALLEL ---
                        const testStats: TestStat[] = await Promise.all(
                            tests.map(async (test) => {
                                const attempts: TestAttempt[] =
                                    await getAllTestAttempts(test.id, enrollmentId);

                                if (attempts.length === 0) {
                                    return {
                                        testId: test.id,
                                        title: test.title,
                                        attemptsCount: 0,
                                        passedCount: 0,
                                        bestScore: null,
                                        lastAttemptDate: null
                                    };
                                }

                                const bestAttempt = attempts.reduce((max, current) =>
                                    current.score > max.score ? current : max
                                );

                                const passedCount = attempts.filter(a => a.passed).length;

                                const lastAttempt = attempts.reduce((latest, current) =>
                                    new Date(current.createdAt) > new Date(latest.createdAt)
                                        ? current
                                        : latest
                                );

                                return {
                                    testId: test.id,
                                    title: test.title,
                                    attemptsCount: attempts.length,
                                    passedCount,
                                    bestScore: bestAttempt.score,
                                    lastAttemptDate: lastAttempt.createdAt
                                };
                            })
                        );

                        enrichedPrograms.push({
                            programId: program.id,
                            title: program.title,
                            enrollmentId,
                            progress,
                            testStats
                        });
                    }
                }

                setPrograms(enrichedPrograms);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);






    const handleOpenGradeBook = () => {
        openModal("viewGradeBook", {
            program,
            progress,
        });
    };




    if (loading) {
        return (
            <AppContainer>
                <div className="py-20 text-gray-500">Загрузка...</div>
            </AppContainer>
        );
    }

    if (!user) {
        return (
            <AppContainer>
                <div className="py-20 text-red-500">Пользователь не найден</div>
            </AppContainer>
        );
    }
    const imgSrc = process.env.REACT_APP_API_URL + user.img;
    return (
        <AppContainer>
            <div className="space-y-12">

                {/* ================= USER HEADER ================= */}
                <div
                    className="bg-white rounded-3xl shadow-md p-8 border border-gray-100 flex flex-col md:flex-row gap-8">

                    {/* ---------------- AVATAR ---------------- */}
                    <div className="flex-shrink-0 relative w-28 h-28">
                        {user.img ? (
                            <div className="relative rounded-full w-28 h-28 overflow-hidden group">
                                <img
                                    src={imgSrc}
                                    alt={user.name}
                                    className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-center text-gray-800 text-sm">
                                    Изменить <br/> фото
                                </div>
                            </div>
                        ) : (
                            <div
                                className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-400">
                                {user.name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* ---------------- USER INFO ---------------- */}
                    <div className="flex-1 space-y-4">

                        {/* Имя и роль */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 text-left">{user.name}</h1>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-3">
                                <FiUser/> <span>{user.role}</span>
                            </div>
                        </div>

                        {/* Основная информация */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">

                            {user.email && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    <FiMail className="text-gray-400"/> {user.email}
                                </div>
                            )}

                            {user.number && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    <FiPhone className="text-gray-400"/> {user.number}
                                </div>
                            )}

                            {user.createdAt && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    <FiCalendar className="text-gray-400"/>
                                    Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            )}

                            {user.organization && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    <FiAward className="text-gray-400"/> {user.organization}
                                </div>
                            )}

                            {user.inn && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    ИНН: {user.inn}
                                </div>
                            )}

                            {user.address && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    Адрес: {user.address}
                                </div>
                            )}

                            {user.graduation_date && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                                    Дата выпуска: {new Date(user.graduation_date).toLocaleDateString()}
                                </div>
                            )}

                        </div>
                    </div>
                </div>


                {/* ================= PROGRAMS ================= */}
                {programs.map(program => {

                    const completedCount = Object.values(program.progress.byContent)
                        .filter(item => item.status === "completed").length;
                    const inProgressCount = Object.values(program.progress.byContent)
                        .filter(item => item.status === "in_progress").length;

                    return (
                        <div
                            key={program.programId}
                            className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 space-y-8"
                        >
                            {/* TITLE */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {program.title}
                                </h2>

                                <div className="flex items-center gap-4">
                                    {/* Прогресс */}
                                    <div className="text-sm text-gray-500">
                                        {program.progress.percent}% завершено
                                    </div>

                                    {/* Ссылка на зачетную книжку */}
                                    <button
                                        onClick={handleOpenGradeBook}
                                        className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline transition"
                                    >
                                        {/* Можно добавить иконку, например FiBook */}
                                        <span>Зачетная книжка</span>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                                    style={{width: `${program.progress.percent}%`}}
                                />
                            </div>

                            {/* CONTENT STATS */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <StatCard icon={<FiBookOpen/>} label="Материалов" value={totalContent}/>
                                <StatCard icon={<FiCheckCircle/>} label="Завершено" value={completedCount}/>
                                <StatCard icon={<FiTrendingUp/>} label="В процессе" value={inProgressCount}/>
                            </div>

                            {/* TEST STATS */}
                            <div className="pt-6 border-t border-gray-100 space-y-6">
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                                    <FiBarChart2/> Статистика тестов
                                </div>

                                {program.testStats.length === 0 && (
                                    <div className="text-sm text-gray-500">
                                        В программе нет тестов
                                    </div>
                                )}

                                <div className="grid gap-4">
                                    {program.testStats.map(test => (
                                        <div
                                            key={test.testId}
                                            className="bg-gray-50 rounded-2xl p-5 flex justify-between items-center hover:shadow-sm transition"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {test.title}
                                                </div>

                                                <div className="text-xs text-gray-500 mt-1">
                                                    Попыток: {test.attemptsCount} •
                                                    Успешных: {test.passedCount}
                                                </div>

                                                {test.lastAttemptDate && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Последняя попытка:{" "}
                                                        {new Date(test.lastAttemptDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-lg font-semibold text-indigo-600">
                                                {test.bestScore !== null
                                                    ? `${test.bestScore}%`
                                                    : "-"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppContainer>
    );
};

export default AdminUserPage;

/* ================= STAT CARD ================= */

interface StatCardProps {
    icon?: React.ReactNode;
    label: string;
    value: string | number;
}

const StatCard = ({ icon, label, value }: StatCardProps) => {
    return (
        <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition">
            {icon && (
                <div className="text-indigo-500 text-xl">
                    {icon}
                </div>
            )}
            <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                    {label}
                </div>
                <div className="text-lg font-semibold text-gray-800">
                    {value}
                </div>
            </div>
        </div>
    );
};
