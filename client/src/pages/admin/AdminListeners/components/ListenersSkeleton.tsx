import React from "react";

const ListenersSkeleton: React.FC = () => {
    // Создаем массив для имитации строк таблицы
    const rows = Array.from({ length: 8 }); // 5 строк скелетона

    return (
        <div className="w-full animate-pulse">
            {/* Шапка */}
            <div
                className="
                    grid 
                    grid-cols-[max-content_2fr_2fr_2fr_2fr_1fr_1fr] 
                    gap-[40px]
                    items-center 
                    font-semibold 
                    pb-2
                "
            >
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                <div className="h-6  bg-gray-300 rounded"></div>
                <div className="h-6  bg-gray-300 rounded"></div>
                <div className="h-6  bg-gray-300 rounded"></div>
                <div className="h-6  bg-gray-300 rounded"></div>
                <div className="h-6  bg-gray-300 rounded"></div>
                <div className="h-6  bg-gray-300 rounded"></div>

            </div>

            {/* Строки */}
            {rows.map((_, index) => (
                <div
                    key={index}
                    className="
                        grid 
                        grid-cols-[max-content_2fr_2fr_2fr_2fr_1fr_1fr] 
                        gap-[40px]
                        items-center 
                        py-2
                    "
                >
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    <div className="h-6  bg-gray-300 rounded"></div>
                    <div className="h-6  bg-gray-300 rounded"></div>
                    <div className="h-6  bg-gray-300 rounded"></div>
                    <div className="h-6  bg-gray-300 rounded"></div>
                    <div className="h-6  bg-gray-300 rounded"></div>
                    <div className="h-6  bg-gray-300 rounded"></div>

                </div>
            ))}
        </div>
    );
};

export default ListenersSkeleton;
