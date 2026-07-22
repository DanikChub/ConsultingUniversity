import React, { useMemo, useState } from "react";

type BlockPeriod = "1" | "7" | "30" | "custom" | "forever";

type Props = {
    userName: string;
    onClose: () => void;
    onSubmit: (payload: {
        reason: string;
        durationMinutes: number | null;
    }) => void;
};

const reasons = [
    "Спам",
    "Нарушение правил",
    "Проблема с оплатой",
    "Подозрительная активность",
    "Другое",
];

const BlockUserModal: React.FC<Props> = ({
                                             userName,
                                             onClose,
                                             onSubmit,
                                         }) => {
    const [reasonType, setReasonType] = useState(reasons[0]);
    const [customReason, setCustomReason] = useState("");
    const [period, setPeriod] = useState<BlockPeriod>("7");
    const [customDate, setCustomDate] = useState("");

    const reason = useMemo(() => {
        return reasonType === "Другое" ? customReason.trim() : reasonType;
    }, [reasonType, customReason]);

    const getDurationMinutes = (): number | null | undefined => {
        if (period === "forever") {
            return null;
        }

        if (period !== "custom") {
            return Number(period) * 24 * 60;
        }

        if (!customDate) {
            return undefined;
        }

        const endDate = new Date(`${customDate}T23:59:59`);
        const differenceMs = endDate.getTime() - Date.now();

        if (differenceMs <= 0) {
            return undefined;
        }

        return Math.ceil(differenceMs / (60 * 1000));
    };

    const handleSubmit = () => {
        if (!reason) return;

        const durationMinutes = getDurationMinutes();

        if (durationMinutes === undefined) {
            return;
        }

        onSubmit({
            reason,
            durationMinutes,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Заблокировать пользователя
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {userName}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 transition hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="block">
                        <div className="mb-1 text-sm font-medium text-gray-700">
                            Причина
                        </div>

                        <select
                            value={reasonType}
                            onChange={e => setReasonType(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                            {reasons.map(reason => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </label>

                    {reasonType === "Другое" && (
                        <label className="block">
                            <div className="mb-1 text-sm font-medium text-gray-700">
                                Укажите причину
                            </div>

                            <textarea
                                value={customReason}
                                onChange={e => setCustomReason(e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                        </label>
                    )}

                    <label className="block">
                        <div className="mb-1 text-sm font-medium text-gray-700">
                            Срок блокировки
                        </div>

                        <select
                            value={period}
                            onChange={e => setPeriod(e.target.value as BlockPeriod)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="1">1 день</option>
                            <option value="7">7 дней</option>
                            <option value="30">30 дней</option>
                            <option value="custom">До даты</option>
                            <option value="forever">Навсегда</option>
                        </select>
                    </label>

                    {period === "custom" && (
                        <label className="block">
                            <div className="mb-1 text-sm font-medium text-gray-700">
                                Дата окончания блокировки
                            </div>

                            <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={customDate}
                                onChange={e => setCustomDate(e.target.value)}
                            />
                        </label>
                    )}
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-gray-200 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!reason || (period === "custom" && !customDate)}
                        className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        Заблокировать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockUserModal;