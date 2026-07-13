import React, { useMemo, useState } from "react";
import {
    FiArchive,
    FiBookOpen,
    FiCheckCircle,
    FiChevronDown,
    FiExternalLink,
    FiRefreshCcw,
    FiTrendingUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import type { ProgramWithStats } from "../../../../features/listener-profile/model/types";
import {
    archiveEnrollment,
    restoreEnrollment,
    updateEnrollmentStatus,
} from "../../../../entities/enrollment/api/enrollment.api";

interface ListenerProgramCardProps {
    userId: number;
    program: ProgramWithStats;
    onOpenGradeBook: () => void;
    onChanged: () => void;
}

const ListenerProgramCard: React.FC<ListenerProgramCardProps> = ({
                                                                     program,
                                                                     onOpenGradeBook,
                                                                     onChanged,
                                                                 }) => {
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const status = program.status;


    const completedCount = useMemo(() => {
        return Object.values(program.progress.byContent).filter(
            item => item.status === "completed"
        ).length;
    }, [program.progress.byContent]);

    const inProgressCount = useMemo(() => {
        return Object.values(program.progress.byContent).filter(
            item => item.status === "in_progress"
        ).length;
    }, [program.progress.byContent]);

    const handleArchive = async () => {
        const ok = window.confirm("Архивировать доступ к программе?");
        if (!ok) return;

        try {
            setLoading(true);
            await archiveEnrollment(program.enrollmentId);
            onChanged();
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        try {
            setLoading(true);
            await restoreEnrollment(program.enrollmentId);
            onChanged();
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        const ok = window.confirm(
            "Вручную завершить программу? Прогресс станет 100%, доступ получит статус completed."
        );

        if (!ok) return;

        try {
            setLoading(true);
            await updateEnrollmentStatus(program.enrollmentId, "completed");
            onChanged();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-left text-xl font-semibold text-gray-800">
                            {program.title}
                        </h3>

                        <StatusBadge status={status}/>
                    </div>

                    <div className="mt-2 text-left text-sm text-gray-500">
                        Прогресс: {program.progress.percent}% · Материалов:{" "}
                        {program.totalContent}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link
                        to={`/admin/programs/${program.programId}`}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                    >
                        <FiExternalLink/>
                        Открыть
                    </Link>

                    <button
                        type="button"
                        onClick={onOpenGradeBook}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                    >
                        <FiBookOpen/>
                        Зачетка
                    </button>

                    {status === "archived" ? (
                        <button
                            type="button"
                            onClick={handleRestore}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm text-white transition hover:bg-green-700 disabled:bg-gray-300"
                        >
                            <FiRefreshCcw/>
                            Восстановить
                        </button>
                    ) : status === "completed" ? (
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-500"
                            disabled
                        >
                            <FiCheckCircle/>
                            Завершено
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleComplete}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:bg-gray-300"
                            >
                                <FiCheckCircle/>
                                Завершить
                            </button>

                            <button
                                type="button"
                                onClick={handleArchive}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-200 disabled:bg-gray-200"
                            >
                                <FiArchive/>
                                Архивировать
                            </button>
                        </>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className="mt-5 flex w-full items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
                <span>
                    {expanded ? "Скрыть подробности" : "Подробнее о прогрессе"}
                </span>

                <FiChevronDown
                    className={[
                        "text-lg transition-transform duration-300",
                        expanded ? "rotate-180" : "",
                    ].join(" ")}
                />
            </button>
            <div
                className={[
                    "grid transition-all duration-300 ease-in-out",
                    expanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
            >
                <div className="overflow-hidden">
                    <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Завершенность</span>

                            <span className="font-medium text-gray-700">
                    {program.progress.percent}%
                </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                                style={{width: `${program.progress.percent}%`}}
                            />
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <StatCard
                            icon={<FiBookOpen/>}
                            label="Материалов"
                            value={program.totalContent}
                        />

                        <StatCard
                            icon={<FiCheckCircle/>}
                            label="Завершено"
                            value={completedCount}
                        />

                        <StatCard
                            icon={<FiTrendingUp/>}
                            label="В процессе"
                            value={inProgressCount}
                        />
                    </div>

                    {program.testStats.length > 0 && (
                        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                            <div className="mb-3 text-left text-sm font-semibold text-gray-700">
                                Тесты
                            </div>

                            <div className="space-y-2">
                                {program.testStats.map(test => (
                                    <div
                                        key={test.testId}
                                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-gray-700">
                                                {test.title || `Тест #${test.testId}`}
                                            </div>

                                            <div className="mt-0.5 text-xs text-gray-400">
                                                Попыток: {test.attemptsCount} · Успешных:{" "}
                                                {test.passedCount}
                                            </div>
                                        </div>

                                        <div className="shrink-0 font-semibold text-indigo-600">
                                            {test.bestScore !== null
                                                ? `${test.bestScore}%`
                                                : "—"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
    const map: Record<string, string> = {
        active: "Обучается",
        paused: "Пауза",
        completed: "Завершено",
        archived: "Архив",
    };

    const classMap: Record<string, string> = {
        active: "bg-blue-50 text-blue-700",
        paused: "bg-yellow-50 text-yellow-700",
        completed: "bg-green-50 text-green-700",
        archived: "bg-gray-100 text-gray-600",
    };

    return (
        <span
            className={[
                "rounded-full px-3 py-1 text-xs font-medium",
                classMap[status] || "bg-gray-100 text-gray-600",
            ].join(" ")}
        >
            {map[status] || status}
        </span>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({icon, label, value}) => {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <div className="text-lg text-indigo-500">{icon}</div>

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

export default ListenerProgramCard;