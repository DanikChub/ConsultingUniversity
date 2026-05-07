import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiArchive,
    FiBookOpen,
    FiCheckCircle,
    FiClock,
    FiPauseCircle,
    FiRefreshCcw,
    FiSliders,
    FiTrash2,
    FiUser,
} from "react-icons/fi";

import UserContainer from "../../../components/ui/UserContainer";
import LoadingAlert from "../../../components/ui/LoadingAlert";

import {
    deleteEnrollment,
    getEnrollmentsByUser,
    type Enrollment,
    type EnrollmentStatus,
    updateEnrollmentProgress,
    updateEnrollmentStatus,
} from "../../../entities/enrollment/api/enrollment.api";
import AppContainer from "../../../components/ui/AppContainer";

const statusLabels: Record<EnrollmentStatus, string> = {
    active: "Выдана",
    paused: "Приостановлена",
    completed: "Завершена",
    archived: "В архиве",
};

const statusStyles: Record<EnrollmentStatus, string> = {
    active: "bg-blue-100 text-blue-700",
    paused: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    archived: "bg-gray-100 text-gray-700",
};

const statusIcons: Record<EnrollmentStatus, React.ReactNode> = {
    active: <FiCheckCircle size={16} />,
    paused: <FiPauseCircle size={16} />,
    completed: <FiCheckCircle size={16} />,
    archived: <FiArchive size={16} />,
};

const UserEnrollmentManagePage = () => {
    const { userId } = useParams();

    const numericUserId = Number(userId);

    const [loading, setLoading] = useState(true);
    const [alertLoading, setAlertLoading] = useState(false);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

    useEffect(() => {
        if (!numericUserId) return;

        loadEnrollments();
    }, [numericUserId]);

    const loadEnrollments = async () => {
        try {
            setLoading(false);

            const data = await getEnrollmentsByUser(numericUserId);
            setEnrollments(data || []);
        } catch (e) {
            console.error("Ошибка загрузки программ пользователя", e);
        } finally {
            setLoading(true);
        }
    };

    const handleStatusChange = async (
        enrollmentId: number,
        status: EnrollmentStatus
    ) => {
        try {
            setAlertLoading(true);

            const updated = await updateEnrollmentStatus(enrollmentId, status);

            setEnrollments((prev) =>
                prev.map((item) => (item.id === enrollmentId ? updated : item))
            );
        } catch (e) {
            console.error("Ошибка изменения статуса", e);
        } finally {
            setAlertLoading(false);
        }
    };

    const handleProgressChange = (
        enrollmentId: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value) || value < 0 || value > 100) return;

        setEnrollments((prev) =>
            prev.map((item) =>
                item.id === enrollmentId
                    ? { ...item, progress_percent: value }
                    : item
            )
        );
    };

    const handleProgressSave = async (
        enrollmentId: number,
        progress: number
    ) => {
        try {
            setAlertLoading(true);

            const updated = await updateEnrollmentProgress(enrollmentId, progress);

            setEnrollments((prev) =>
                prev.map((item) => (item.id === enrollmentId ? updated : item))
            );
        } catch (e) {
            console.error("Ошибка изменения прогресса", e);
        } finally {
            setAlertLoading(false);
        }
    };

    const handleDelete = async (enrollmentId: number) => {
        const isConfirmed = window.confirm(
            "Удалить выдачу программы у пользователя?"
        );

        if (!isConfirmed) return;

        try {
            setAlertLoading(true);

            await deleteEnrollment(enrollmentId);

            setEnrollments((prev) =>
                prev.filter((item) => item.id !== enrollmentId)
            );
        } catch (e) {
            console.error("Ошибка удаления программы у пользователя", e);
        } finally {
            setAlertLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: enrollments.length,
            active: enrollments.filter((item) => item.status === "active").length,
            paused: enrollments.filter((item) => item.status === "paused").length,
            completed: enrollments.filter((item) => item.status === "completed").length,
            archived: enrollments.filter((item) => item.status === "archived").length,
        };
    }, [enrollments]);

    const formatDate = (value?: string | null) => {
        if (!value) return "—";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <AppContainer>
            <LoadingAlert show={alertLoading} text="Сохраняем изменения..." />

            <div className="space-y-8">
                <Link
                    to={-1 as any}
                    className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
                >
                    <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                        <FiArrowLeft size={20} />
                    </div>
                    <span className="text-lg font-medium">Назад</span>
                </Link>

                <div className="relative rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-gray-100 shadow-md overflow-hidden">
                    <div className="p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
                                    Управление обучением
                                </div>

                                <h1 className="text-3xl text-left font-bold text-[#2C3E50] mt-2">
                                    Программы пользователя #{numericUserId}
                                </h1>

                                <p className="text-gray-600 text-lg max-w-2xl mt-4">
                                    Здесь администратор управляет программами,
                                    которые выданы конкретному слушателю.
                                </p>
                            </div>

                            <button
                                onClick={loadEnrollments}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                <FiRefreshCcw size={18} />
                                Обновить
                            </button>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    <StatCard title="Всего" value={stats.total} icon={<FiUser />} />
                    <StatCard title="Выдана" value={stats.active} icon={<FiCheckCircle />} />
                    <StatCard title="Пауза" value={stats.paused} icon={<FiPauseCircle />} />
                    <StatCard title="Завершена" value={stats.completed} icon={<FiBookOpen />} />
                    <StatCard title="Архив" value={stats.archived} icon={<FiArchive />} />
                </div>

                <div className="rounded-3xl bg-white border border-gray-100 shadow-md p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FiSliders size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#2C3E50] text-left">
                                Выданные программы
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Список программ, доступных этому слушателю
                            </p>
                        </div>
                    </div>

                    {enrollments.length > 0 ? (
                        <div className="space-y-4">
                            {enrollments.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5"
                                >
                                    <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center shrink-0">
                                                    <FiBookOpen size={20} />
                                                </div>

                                                <div>
                                                    <div className="text-lg font-bold text-[#2C3E50]">
                                                        Программа #{enrollment.programId}
                                                    </div>

                                                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                        <FiClock size={14} />
                                                        Выдана: {formatDate(enrollment.started_at)}
                                                    </div>
                                                </div>

                                                <div
                                                    className={[
                                                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
                                                        statusStyles[enrollment.status],
                                                    ].join(" ")}
                                                >
                                                    {statusIcons[enrollment.status]}
                                                    {statusLabels[enrollment.status]}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full xl:w-[220px]">
                                            <label className="text-sm text-gray-500 mb-2 block">
                                                Статус
                                            </label>

                                            <select
                                                value={enrollment.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        enrollment.id,
                                                        e.target.value as EnrollmentStatus
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 outline-none focus:border-blue-400 transition"
                                            >
                                                <option value="active">Выдана</option>
                                                <option value="paused">Приостановлена</option>
                                                <option value="completed">Завершена</option>
                                                <option value="archived">В архиве</option>
                                            </select>
                                        </div>

                                        <div className="w-full xl:w-[260px]">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm text-gray-500">
                                                    Прогресс
                                                </label>

                                                <span className="text-sm font-semibold text-gray-700">
                                                    {enrollment.progress_percent || 0}%
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={enrollment.progress_percent || 0}
                                                    onChange={(e) =>
                                                        handleProgressChange(enrollment.id, e)
                                                    }
                                                    className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 outline-none focus:border-blue-400 transition"
                                                />

                                                <button
                                                    onClick={() =>
                                                        handleProgressSave(
                                                            enrollment.id,
                                                            enrollment.progress_percent || 0
                                                        )
                                                    }
                                                    className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                                                >
                                                    OK
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(enrollment.id)}
                                            className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        >
                                            <FiTrash2 size={18} />
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                            Этому пользователю пока не выданы программы
                        </div>
                    )}
                </div>
            </div>
        </AppContainer>
    );
};

type StatCardProps = {
    title: string;
    value: number;
    icon: React.ReactNode;
};

const StatCard = ({ title, value, icon }: StatCardProps) => {
    return (
        <div className="rounded-3xl bg-white border border-gray-100 shadow-md p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="text-sm text-gray-500">{title}</div>
                    <div className="text-3xl font-bold text-[#2C3E50] mt-1">
                        {value}
                    </div>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default UserEnrollmentManagePage;