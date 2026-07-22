import React from "react";
import { FiLock } from "react-icons/fi";

type Props = {
    reason: string | null;
    blockedUntil: string | null;
    permanent: boolean;
    onRetry: () => void;
    onLogout: () => void;
};

const BlockedAccountPage: React.FC<Props> = ({
                                                 reason,
                                                 blockedUntil,
                                                 permanent,
                                                 onRetry,
                                                 onLogout,
                                             }) => {
    return (
        <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
                    <FiLock />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-gray-900">
                    Аккаунт заблокирован
                </h1>

                <p className="mt-3 text-gray-600">
                    Доступ к личному кабинету временно ограничен.
                </p>

                <div className="mt-6 space-y-3 rounded-2xl bg-gray-50 p-5 text-left">
                    <div>
                        <div className="text-xs font-medium uppercase text-gray-400">
                            Причина
                        </div>

                        <div className="mt-1 text-sm text-gray-800">
                            {reason || "Причина не указана"}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-medium uppercase text-gray-400">
                            Срок блокировки
                        </div>

                        <div className="mt-1 text-sm text-gray-800">
                            {permanent || !blockedUntil
                                ? "Бессрочно"
                                : `До ${new Date(blockedUntil).toLocaleString(
                                    "ru-RU"
                                )}`}
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-sm text-gray-500">
                    Для уточнения информации обратитесь к администрации.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {!permanent && (
                        <button
                            onClick={onRetry}
                            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Проверить доступ
                        </button>
                    )}

                    <button
                        onClick={onLogout}
                        className="flex-1 rounded-xl bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </main>
    );
};

export default BlockedAccountPage;