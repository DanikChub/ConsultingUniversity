import React, { useEffect, useState } from "react";

interface LoadingAlertProps {

    show: boolean;
    text?: string;
    duration?: number; // время авто-скрытия
}

const LoadingAlert: React.FC<LoadingAlertProps> = ({ show, text="Программа обрабатывается...", duration = 3000 }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
    }, [show, duration]);

    if (!visible) return null;

    return (
        <div className="fixed top-5 right-5 z-50 animate-fadeIn">
            <div className="bg-blue-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3">
                {/* Иконка загрузки */}
                <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <span>{text}</span>
            </div>
        </div>
    );
};

export default LoadingAlert;