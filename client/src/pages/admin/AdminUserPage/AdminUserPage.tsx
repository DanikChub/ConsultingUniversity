import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContainer from "../../../components/ui/AppContainer";
import { FiEdit, FiBookOpen, FiCheckCircle, FiTrendingUp, FiBarChart2, FiAward, FiMail, FiPhone, FiCalendar, FiUser, FiFileText, FiCreditCard, FiImage } from "react-icons/fi";
import { getUserById } from "../../../entities/user/api/user.api";
import { getEnrollmentProgress } from "../../../entities/progress/api/progress.api";
import { getAllTestAttempts } from "../../../entities/test/api/test.api";

import type { User } from "../../../entities/user/model/type";
import type { ProgramProgress } from "../../../entities/progress/model/type";
import type { Test, TestAttempt } from "../../../entities/test/model/type";

import type { Program } from "../../../entities/program/model/type";
import { getOneProgram } from "../../../entities/program/api/program.api";
import { useModals } from "../../../hooks/useModals";
import Button from "../../../shared/ui/buttons/Button";
import { CHAT_USERS_PAGE_ROUTE } from "../../../shared/utils/consts";
import { createChat } from "../../../entities/chat/api/chat.api";

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

type ExistingDocument = {
    id: number;
    original_name: string;
    file_name: string;
    file_path: string;
    mime_type?: string | null;
    size?: number | null;
    document_type?: string | null;
};

/* ================= HELPERS ================= */

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

        return themeAcc + punctsTotal + (theme.files?.length ?? 0);
    }, 0);
}

const isImageFile = (name?: string, mime?: string | null) => {
    if (mime?.startsWith("image/")) return true;
    if (!name) return false;

    const lower = name.toLowerCase();
    return (
        lower.endsWith(".png") ||
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".webp")
    );
};

const isPdfFile = (name?: string, mime?: string | null) => {
    if (mime === "application/pdf") return true;
    if (!name) return false;
    return name.toLowerCase().endsWith(".pdf");
};

/* ================= COMPONENT ================= */

const AdminUserPage = () => {
    const { id } = useParams();

    const [user, setUser] = useState<User | null>(null);
    const [programs, setPrograms] = useState<ProgramWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalContent, setTotalContent] = useState<number>(0);

    const [progress, setProgress] = useState<ProgramProgress | null>(null);
    const [program, setProgram] = useState<Program | null>(null);
    const { openModal } = useModals();

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        async function load() {
            try {
                setLoading(true);

                const userData = await getUserById(Number(id));
                setUser(userData);

                const enrichedPrograms: ProgramWithStats[] = [];

                if (userData.programs) {
                    for (const program of userData.programs) {
                        if (!program.enrollment) continue;

                        const enrollmentId = program.enrollment.id;

                        const fullProgram = await getOneProgram(program.id);
                        setProgram(fullProgram);

                        const totalContentFromF = getTotalContent(fullProgram);
                        setTotalContent(totalContentFromF);

                        const tests = extractAllTests(fullProgram);

                        const progress = await getEnrollmentProgress(enrollmentId);
                        setProgress(progress);

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

    const handleSendClick = async () => {
        if (!user) return;
        const chat = await createChat(user.id);
        navigate(CHAT_USERS_PAGE_ROUTE + `?chatId=${chat.id}`);
    };

    const documents = useMemo(
        () => (user?.documents as ExistingDocument[] | undefined) || [],
        [user]
    );

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

    const imgSrc = user.img ? process.env.REACT_APP_API_URL + user.img : "";

    return (
        <AppContainer>
            <div className="space-y-12">
                {/* ================= USER HEADER ================= */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* ---------------- AVATAR ---------------- */}
                        <div className="relative h-28 w-28 flex-shrink-0">
                            {user.img ? (
                                <div className="group relative h-28 w-28 overflow-hidden rounded-full">
                                    <img
                                        src={imgSrc}
                                        alt={user.name}
                                        className="absolute left-[50%] top-[50%] h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl font-bold text-indigo-400">
                                    {user.name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* ---------------- USER INFO ---------------- */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-left text-3xl font-bold text-gray-800">
                                        {user.name}
                                    </h1>
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                        <FiUser/>
                                        <span>{user.role}</span>
                                    </div>
                                </div>

                                <Button className="ml-4" onClick={handleSendClick}>
                                    <FiEdit/>
                                    <span>Написать</span>
                                </Button>
                            </div>

                            {/* Основная информация */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="space-y-4">

                                    {user.email && (
                                        <div
                                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <FiMail className="shrink-0 text-gray-400"/>
                                            <span className="break-all">{user.email}</span>
                                        </div>
                                    )}

                                    {user.number && (
                                        <div
                                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <FiPhone className="shrink-0 text-gray-400"/>
                                            <span>{user.number}</span>
                                        </div>
                                    )}

                                    {user.createdAt && (
                                        <div
                                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <FiCalendar className="shrink-0 text-gray-400"/>
                                            <span>
                    Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
                </span>
                                        </div>
                                    )}

                                    {user.graduation_date && (
                                        <div
                                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <FiCalendar className="shrink-0 text-gray-400"/>
                                            <span>
                    Дата выпуска: {new Date(user.graduation_date).toLocaleDateString()}
                </span>
                                        </div>
                                    )}

                                    {user.organization && (
                                        <div
                                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <FiAward className="shrink-0 text-gray-400"/>
                                            <span className="break-words">{user.organization}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {user.login && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiFileText className="text-gray-400"/>
                                                Логин пользователя
                                            </div>
                                            <div className="break-all text-gray-800">{user.login}</div>
                                        </div>
                                    )}
                                    {user.temporary_password_plain && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiFileText className="text-gray-400"/>
                                                <span>Временный пароль</span>
                                                {user.must_change_password &&
                                                    <span>Не актуален</span>
                                                }

                                            </div>
                                            <div className="break-all text-gray-800">{user.temporary_password_plain}</div>
                                        </div>
                                    )}
                                    {user.inn && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiFileText className="text-gray-400"/>
                                                ИНН
                                            </div>
                                            <div className="break-all text-gray-800">{user.inn}</div>
                                        </div>
                                    )}

                                    {user.snils && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiFileText className="text-gray-400"/>
                                                СНИЛС
                                            </div>
                                            <div className="break-all text-gray-800">{user.snils}</div>
                                        </div>
                                    )}

                                    {user.passport && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiCreditCard className="text-gray-400"/>
                                                Паспорт
                                            </div>
                                            <div className="break-words text-gray-800">{user.passport}</div>
                                        </div>
                                    )}

                                    {user.education_document && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiBookOpen className="text-gray-400"/>
                                                Документ об образовании
                                            </div>
                                            <div className="break-words text-gray-800">{user.education_document}</div>
                                        </div>
                                    )}

                                    {user.address && (
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <div
                                                className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                <FiFileText className="text-gray-400"/>
                                                Адрес
                                            </div>
                                            <div className="break-words text-gray-800">{user.address}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Документы */}
                            {documents.length > 0 && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                                        <FiImage/>
                                        Документы
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {documents.map((doc) => {
                                            const fileUrl = `${process.env.REACT_APP_API_URL}${doc.file_path}`;
                                            const isImage = isImageFile(doc.file_name || doc.original_name, doc.mime_type);
                                            const isPdf = isPdfFile(doc.file_name || doc.original_name, doc.mime_type);

                                            return (
                                                <a
                                                    key={doc.id}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                                    title={doc.original_name}
                                                >
                                                    <div
                                                        className="flex h-[180px] w-[140px] items-center justify-center bg-gray-50">
                                                        {isImage ? (
                                                            <img
                                                                src={fileUrl}
                                                                alt={doc.original_name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500">
                                                                <FiFileText className="text-3xl"/>
                                                                <span className="text-sm font-semibold">
                                                                    {isPdf ? "PDF" : "FILE"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="w-[140px] border-t border-gray-100 px-3 py-2">
                                                        <div className="truncate text-xs font-medium text-gray-700">
                                                            {doc.original_name}
                                                        </div>
                                                        {doc.document_type && (
                                                            <div className="mt-1 truncate text-[11px] text-gray-400">
                                                                {doc.document_type}
                                                            </div>
                                                        )}
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================= PROGRAMS ================= */}
                {programs.map((program) => {
                    const completedCount = Object.values(program.progress.byContent)
                        .filter((item) => item.status === "completed").length;
                    const inProgressCount = Object.values(program.progress.byContent)
                        .filter((item) => item.status === "in_progress").length;

                    return (
                        <div
                            key={program.programId}
                            className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-md"
                        >
                            {/* TITLE */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {program.title}
                                </h2>

                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-500">
                                        {program.progress.percent}% завершено
                                    </div>

                                    <button
                                        onClick={handleOpenGradeBook}
                                        className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
                                    >
                                        <span>Зачетная книжка</span>
                                        <svg
                                            className="h-4 w-4"
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
                            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                                    style={{width: `${program.progress.percent}%`}}
                                />
                            </div>

                            {/* CONTENT STATS */}
                            <div className="grid gap-6 md:grid-cols-3">
                                <StatCard icon={<FiBookOpen/>} label="Материалов" value={totalContent}/>
                                <StatCard icon={<FiCheckCircle/>} label="Завершено" value={completedCount}/>
                                <StatCard icon={<FiTrendingUp/>} label="В процессе" value={inProgressCount}/>
                            </div>

                            {/* TEST STATS */}
                            <div className="space-y-6 border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                                    <FiBarChart2/> Статистика тестов
                                </div>

                                {program.testStats.length === 0 && (
                                    <div className="text-sm text-gray-500">
                                        В программе нет тестов
                                    </div>
                                )}

                                <div className="grid gap-4">
                                    {program.testStats.map((test) => (
                                        <div
                                            key={test.testId}
                                            className="flex items-center justify-between rounded-2xl bg-gray-50 p-5 transition hover:shadow-sm"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {test.title}
                                                </div>

                                                <div className="mt-1 text-xs text-gray-500">
                                                    Попыток: {test.attemptsCount} • Успешных: {test.passedCount}
                                                </div>

                                                {test.lastAttemptDate && (
                                                    <div className="mt-1 text-xs text-gray-400">
                                                        Последняя попытка:{" "}
                                                        {new Date(test.lastAttemptDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-lg font-semibold text-indigo-600">
                                                {test.bestScore !== null ? `${test.bestScore}%` : "-"}
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
        <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition hover:shadow-sm">
            {icon && (
                <div className="text-xl text-indigo-500">
                    {icon}
                </div>
            )}
            <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                    {label}
                </div>
                <div className="text-lg font-semibold text-gray-800">
                    {value}
                </div>
            </div>
        </div>
    );
};