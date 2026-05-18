import React from "react";

interface StatCardProps {
    icon?: React.ReactNode;
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition hover:shadow-sm">
            {icon && (
                <div className="text-xl text-indigo-500">
                    {icon}
                </div>
            )}

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

export default StatCard;