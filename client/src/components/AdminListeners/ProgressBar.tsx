import React from "react";

interface Props {
    value: number;
}

const ProgressBar: React.FC<Props> = ({ value }) => {
    const percent = value ?? 0;

    return (
        <div className="flex items-center gap-2 w-full">
            {/* Полоса прогресса */}
            <div className="relative w-full h-2.5 border-[1px] border-[#2980B9] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#2980B9] *:transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Проценты справа */}
            <span className="text-sm font-medium whitespace-nowrap">
                {percent}%
            </span>
        </div>
    );
};

export default ProgressBar;