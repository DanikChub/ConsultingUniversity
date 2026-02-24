// modals/ConfirmModal.tsx
import React from "react";

type Props = {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmModal: React.FC<Props> = ({
                                           title = "Подтверждение",
                                           description,
                                           confirmText = "Подтвердить",
                                           cancelText = "Отмена",
                                           variant = "default",
                                           onConfirm,
                                           onCancel
                                       }) => {
    const confirmColor =
        variant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">

                {/* header */}
                <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold max-w-[90%]">
                        {title}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* content */}
                {description && (
                    <div className="mb-4 text-sm text-gray-700">
                        {description}
                    </div>
                )}

                {/* actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                                   text-gray-700 hover:bg-gray-100 transition"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition
                                    ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmModal;
