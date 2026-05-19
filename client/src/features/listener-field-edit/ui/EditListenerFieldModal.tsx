import React from "react";

interface EditListenerFieldModalProps {
    opened: boolean;
    label: string;
    value: string;
    multiline?: boolean;
    loading?: boolean;
    error?: string;
    onChange: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

const EditListenerFieldModal: React.FC<EditListenerFieldModalProps> = ({
                                                                           opened,
                                                                           label,
                                                                           value,
                                                                           multiline,
                                                                           loading,
                                                                           error,
                                                                           onChange,
                                                                           onClose,
                                                                           onSubmit,
                                                                       }) => {
    if (!opened) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-xl">
                <div className="text-xl font-semibold text-gray-800">
                    Изменить поле
                </div>

                <div className="mt-1 text-sm text-gray-500">
                    {label}
                </div>

                <div className="mt-5">
                    {multiline ? (
                        <textarea
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            rows={5}
                            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                            autoFocus
                        />
                    ) : (
                        <input
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                            autoFocus
                        />
                    )}
                </div>

                {error && (
                    <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                        className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2474a5] disabled:opacity-60"
                    >
                        {loading ? "Сохранение..." : "Сохранить"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditListenerFieldModal;