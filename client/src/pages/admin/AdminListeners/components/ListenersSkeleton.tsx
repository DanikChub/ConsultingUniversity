import React from "react";

const ListenersSkeleton: React.FC = () => {
    const rows = Array.from({ length: 8 });

    return (
        <div className="w-full animate-pulse rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-[80px_2fr_2fr_2fr_1.4fr_1.2fr_90px] gap-4 border-b border-gray-100 pb-4">
                {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="h-5 rounded bg-gray-200" />
                ))}
            </div>

            {rows.map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid grid-cols-[80px_2fr_2fr_2fr_1.4fr_1.2fr_90px] gap-4 border-b border-gray-50 py-4 last:border-b-0"
                >
                    {Array.from({ length: 7 }).map((__, colIndex) => (
                        <div
                            key={colIndex}
                            className="h-5 rounded bg-gray-200"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ListenersSkeleton;