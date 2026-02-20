import React from "react";
import UserContainer from "../../../../components/ui/UserContainer";

const PdfPageLoader = () => {
    return (
        <UserContainer>
            <div className="min-h-screen space-y-8 py-6 animate-pulse">
                {/* Заголовок */}
                <div className="flex items-center justify-between">
                    <div className="h-8 w-64 bg-gray-300 rounded"></div>
                    <div className="h-6 w-32 bg-gray-300 rounded"></div>
                </div>

                {/* Описание */}
                <div className="space-y-2">
                    <div className="h-4 w-full max-w-xl bg-gray-300 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                </div>

                {/* Статистика */}
                <div className="bg-gray-100 p-4 rounded-lg flex flex-wrap gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <div className="h-3 w-20 bg-gray-300 rounded"></div>
                            <div className="h-5 w-12 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Кнопка */}
                <div className="h-10 w-48 bg-blue-300 rounded-lg"></div>

                {/* Таблица попыток */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                        <tr>
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <th key={idx} className="px-4 py-2">
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {Array.from({ length: 3 }).map((_, rowIdx) => (
                            <tr key={rowIdx} className="border-b">
                                {Array.from({ length: 5 }).map((_, colIdx) => (
                                    <td key={colIdx} className="px-4 py-2">
                                        <div className="h-4 w-12 bg-gray-300 rounded"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserContainer>
    );
};

export default PdfPageLoader;
