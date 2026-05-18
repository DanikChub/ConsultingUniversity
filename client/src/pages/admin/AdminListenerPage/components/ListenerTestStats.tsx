import React from "react";
import { FiBarChart2 } from "react-icons/fi";

import type { TestStat } from "../../../../features/listener-profile/model/types";

interface ListenerTestStatsProps {
    tests: TestStat[];
}

const ListenerTestStats: React.FC<ListenerTestStatsProps> = ({ tests }) => {
    return (
        <div className="space-y-6 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                <FiBarChart2 />
                Статистика тестов
            </div>

            {tests.length === 0 && (
                <div className="text-sm text-gray-500">
                    В программе нет тестов
                </div>
            )}

            <div className="grid gap-4">
                {tests.map(test => (
                    <div
                        key={test.testId}
                        className="flex items-center justify-between rounded-2xl bg-gray-50 p-5 transition hover:shadow-sm"
                    >
                        <div>
                            <div className="font-medium text-gray-800">
                                {test.title}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                                Попыток: {test.attemptsCount} • Успешных:{" "}
                                {test.passedCount}
                            </div>

                            {test.lastAttemptDate && (
                                <div className="mt-1 text-xs text-gray-400">
                                    Последняя попытка:{" "}
                                    {new Date(
                                        test.lastAttemptDate
                                    ).toLocaleDateString()}
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
    );
};

export default ListenerTestStats;