import { FC } from "react";
import { useModals } from "../../../providers/ModalProvider"; // твой провайдер
import type { Program, Theme, File } from "../../../entities/program/model/type";
import type { ProgramProgress, ContentProgress } from "../../../entities/progress/model/type";
import { FiCheckCircle } from "react-icons/fi";

interface Props {
    program: Program;
    progress: ProgramProgress;
    onClose: () => void;
}

interface ThemeWithCompletion {
    theme: Theme;
    completed: boolean;
}

const GradeBookModal: FC<Props> = ({ program, progress, onClose }) => {
    // считаем для каждой темы: полностью ли пройдена
    const themesWithCompletion: ThemeWithCompletion[] = program.themes?.map(theme => {
        let allContentCompleted = true;

        theme.puncts?.forEach(punct => {


            punct.tests?.forEach(test => {
                const key = `test-${test.id}`;
                const status = progress.byContent[key]?.status;
                if (status !== "completed") allContentCompleted = false;
            });
        });

        return {
            theme,
            completed: allContentCompleted,
        };
    }) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl relative">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Зачётная книжка: {program.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                {/* CONTENT */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">

                    {themesWithCompletion.map(({ theme, completed }) => (
                        <div
                            key={theme.id}
                            className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-gray-50"
                        >
                            <span className="font-medium text-gray-700">{theme.title}</span>
                            {completed && (
                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                    <FiCheckCircle /> Зачёт
                                </div>
                            )}
                        </div>
                    ))}

                    {themesWithCompletion.every(t => !t.completed) && (
                        <div className="text-center text-gray-500 py-10">
                            Пока нет пройденных тем
                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                    >
                        Закрыть
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GradeBookModal;
