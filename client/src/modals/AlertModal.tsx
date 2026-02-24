// modals/AlertModal.tsx
import React from "react";

type Props = {
    title?: string;
    description?: string;
    buttonText?: string;
    onClose: () => void;
};

const AlertModal: React.FC<Props> = ({
                                         title = "Уведомление",
                                         description,
                                         buttonText = "Ок",
                                         onClose
                                     }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                {/* header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* content */}
                {description && (
                    <div className="mb-6 text-sm text-gray-700">
                        {description}
                    </div>
                )}

                {/* action */}
                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white
                               hover:bg-blue-700 transition"
                >
                    {buttonText}
                </button>

            </div>
        </div>
    );
};

export default AlertModal;
