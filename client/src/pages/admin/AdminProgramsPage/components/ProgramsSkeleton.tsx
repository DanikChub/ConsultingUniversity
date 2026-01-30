import React from 'react';

const ProgramsSkeleton = () => {
    return (
        <>
            {
                Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-200 animate-pulse">
                    <div className="w-[60px] h-[60px] bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-6"></div>
                        </div>
                    </div>
                </div>
                ))
            }
        </>
    );
};

export default ProgramsSkeleton;