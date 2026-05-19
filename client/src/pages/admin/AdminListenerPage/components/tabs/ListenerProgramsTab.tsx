import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

import type { Program } from "../../../../../entities/program/model/type";
import { getAllPublishedPrograms } from "../../../../../entities/program/api/program.api";
import { createEnrollment } from "../../../../../entities/enrollment/api/enrollment.api";
import type { ProgramWithStats } from "../../../../../features/listener-profile/model/types";

import ListenerProgramsSection from "../ListenerProgramsSection";

interface ListenerProgramsTabProps {
    userId: number;
    programs: ProgramWithStats[];
    onOpenGradeBook: (program: ProgramWithStats) => void;
    onChanged: () => void;
}

const ListenerProgramsTab: React.FC<ListenerProgramsTabProps> = ({
                                                                     userId,
                                                                     programs,
                                                                     onOpenGradeBook,
                                                                     onChanged,
                                                                 }) => {
    const [assignModalOpened, setAssignModalOpened] = useState(false);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-left text-lg font-semibold text-gray-800">
                            Программы и доступы
                        </h2>

                        <p className="mt-1 text-left text-sm text-gray-500">
                            Выдача программ, просмотр прогресса и управление доступом слушателя.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAssignModalOpened(true)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <FiPlus />
                        Выдать программу
                    </button>
                </div>
            </div>

            <ListenerProgramsSection
                userId={userId}
                programs={programs}
                onOpenGradeBook={onOpenGradeBook}
                onChanged={onChanged}
            />

            {assignModalOpened && (
                <AssignProgramModal
                    userId={userId}
                    currentPrograms={programs}
                    onClose={() => setAssignModalOpened(false)}
                    onAssigned={() => {
                        setAssignModalOpened(false);
                        onChanged();
                    }}
                />
            )}
        </div>
    );
};

interface AssignProgramModalProps {
    userId: number;
    currentPrograms: ProgramWithStats[];
    onClose: () => void;
    onAssigned: () => void;
}

const AssignProgramModal: React.FC<AssignProgramModalProps> = ({
                                                                   userId,
                                                                   currentPrograms,
                                                                   onClose,
                                                                   onAssigned,
                                                               }) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllPublishedPrograms();
                setPrograms(data);
            } catch (e: any) {
                setError(
                    e?.response?.data?.message ||
                    e?.message ||
                    "Ошибка загрузки программ"
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const currentProgramIds = useMemo(() => {
        return new Set(currentPrograms.map(program => program.programId));
    }, [currentPrograms]);

    const availablePrograms = useMemo(() => {
        const q = search.trim().toLowerCase();

        return programs
            .filter(program => !currentProgramIds.has(program.id))
            .filter(program => {
                if (!q) return true;

                return (
                    program.title?.toLowerCase().includes(q) ||
                    program.short_title?.toLowerCase().includes(q)
                );
            });
    }, [programs, currentProgramIds, search]);

    const selectedProgram = availablePrograms.find(
        program => program.id === selectedProgramId
    );

    const handleSubmit = async () => {
        if (!selectedProgramId) return;

        try {
            setSubmitting(true);
            setError("");

            await createEnrollment(userId, selectedProgramId);

            onAssigned();
        } catch (e: any) {
            setError(
                e?.response?.data?.message ||
                e?.message ||
                "Ошибка выдачи программы"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-left text-lg font-semibold text-gray-900">
                            Выдать программу
                        </h3>

                        <p className="mt-1 text-left text-sm text-gray-500">
                            Выберите опубликованную программу, которую нужно выдать слушателю.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="relative mb-4">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Поиск по названию программы..."
                        className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="max-h-[420px] overflow-auto rounded-2xl border border-gray-100">
                    {loading ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                            Загрузка программ...
                        </div>
                    ) : availablePrograms.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                            Нет доступных программ для выдачи
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {availablePrograms.map(program => {
                                const active = selectedProgramId === program.id;

                                return (
                                    <button
                                        key={program.id}
                                        type="button"
                                        onClick={() => setSelectedProgramId(program.id)}
                                        className={[
                                            "flex w-full items-center gap-4 p-4 text-left transition",
                                            active
                                                ? "bg-blue-50"
                                                : "bg-white hover:bg-gray-50",
                                        ].join(" ")}
                                    >
                                        <ProgramImage program={program} />

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-semibold text-gray-800">
                                                {program.title}
                                            </div>

                                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                                                <span>
                                                    {program.short_title || "Без короткого названия"}
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {program.price
                                                        ? `${program.price} ₽`
                                                        : "Цена не указана"}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={[
                                                "h-5 w-5 rounded-full border transition",
                                                active
                                                    ? "border-blue-600 bg-blue-600"
                                                    : "border-gray-300 bg-white",
                                            ].join(" ")}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="min-w-0 text-sm text-gray-500">
                        {selectedProgram ? (
                            <>
                                Выбрано:{" "}
                                <span className="font-medium text-gray-800">
                                    {selectedProgram.short_title || selectedProgram.title}
                                </span>
                            </>
                        ) : (
                            "Программа не выбрана"
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-xl border border-gray-200 px-5 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                        >
                            Отмена
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selectedProgramId || submitting}
                            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {submitting ? "Выдача..." : "Выдать"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgramImage = ({ program }: { program: Program }) => {
    if (!program.img) {
        return (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-sm font-semibold text-gray-400">
                {program.short_title?.charAt(0) || "П"}
            </div>
        );
    }

    return (
        <img
            src={`${process.env.REACT_APP_API_URL}${program.img}`}
            alt={program.title}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />
    );
};

export default ListenerProgramsTab;