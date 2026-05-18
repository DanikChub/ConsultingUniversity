import React from "react";

interface Props {
    value: number;
}

const ProgressBar: React.FC<Props> = ({ value }) => {
    const percent = Math.max(0, Math.min(value ?? 0, 100));

    return (
        <div className="flex w-full min-w-[90px] items-center gap-2">
            <div className="relative h-2 w-full overflow-hidden rounded-full border border-[#2980B9]">
                <div
                    className="h-full bg-[#2980B9] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <span className="w-[36px] text-xs font-medium text-gray-600">
                {percent}%
            </span>
        </div>
    );
};

export default ProgressBar;