import React from "react";
import {
    FiBookOpen,
    FiCheckCircle,
    FiTrendingUp,
} from "react-icons/fi";

import type { ProgramWithStats } from "../../../../features/listener-profile/model/types";
import StatCard from "./StatCard";
import ListenerTestStats from "./ListenerTestStats";

interface ListenerProgramCardProps {
    program: ProgramWithStats;
    onOpenGradeBook: () => void;
}

const ListenerProgramCard: React.FC<ListenerProgramCardProps> = ({
                                                                     program,
                                                                     onOpenGradeBook,
                                                                 }) => {
    const completedCount = Object.values(program.progress.byContent).filter(
        item => item.status === "completed"
    ).length;

    const inProgressCount = Object.values(program.progress.byContent).filter(
        item => item.status === "in_progress"
    ).length;

    return (
        <div className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                    {program.title}
                </h2>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {program.progress.percent}% завершено
                    </div>

                    <button
                        onClick={onOpenGradeBook}
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${program.progress.percent}%` }}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    icon={<FiBookOpen />}
                    label="Материалов"
                    value={program.totalContent}
                />

                <StatCard
                    icon={<FiCheckCircle />}
                    label="Завершено"
                    value={completedCount}
                />

                <StatCard
                    icon={<FiTrendingUp />}
                    label="В процессе"
                    value={inProgressCount}
                />
            </div>

            <ListenerTestStats tests={program.testStats} />
        </div>
    );
};

export default ListenerProgramCard;