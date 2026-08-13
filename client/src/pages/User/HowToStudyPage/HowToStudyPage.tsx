import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import howReadIcon from "../../../assets/imgs/how_learn_read.jpg";
import howWatchIcon from "../../../assets/imgs/how_learn_watch.jpg";

import programOverviewPdf from "../../../assets/files/program_overview.pdf";
import programStructurePdf from "../../../assets/files/program_structure.pdf";
import testingPdf from "../../../assets/files/testing.pdf";
import generalQuestionsPdf from "../../../assets/files/general_questions.pdf";

const USER_ROUTE = "/";

type LessonRow = {
    id: number;
    title: string;
    toRead: string;
    toWatch: string;
};

const lessons: LessonRow[] = [
    {
        id: 1,
        title: "Как устроена СДО «Квалитет»",
        toRead: programOverviewPdf,
        toWatch: programOverviewPdf,
    },
    {
        id: 2,
        title: "Структура программы",
        toRead: programStructurePdf,
        toWatch: programStructurePdf,
    },
    {
        id: 3,
        title: "Тестирование",
        toRead: testingPdf,
        toWatch: testingPdf,
    },
    {
        id: 4,
        title: "Общие вопросы",
        toRead: generalQuestionsPdf,
        toWatch: generalQuestionsPdf,
    },
];

export const HowToStudyPage = () => {
    const navigate = useNavigate();

    const handleRead = (lesson: LessonRow) => {
        window.open(lesson.toRead, "_blank", "noopener,noreferrer");
    };

    const handleWatch = (lesson: LessonRow) => {
        window.open(lesson.toWatch, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="bg-[#f5f8f9]">
            <div className="w-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 py-6 lg:py-10">

                {/* 🔙 Back */}
                <button
                    onClick={() => navigate(USER_ROUTE)}
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
                >
                    <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                        <FiArrowLeft size={20}/>
                    </div>

                    <span className="text-lg font-medium">
                        Назад
                    </span>
                </button>

                {/* Title */}
                <h1 className="mt-10 text-left lg:mt-14 text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-slate-700">
                    Как учиться в системе дистанционного обучения “Квалитет”
                </h1>

                {/* Content */}
                <div className="mt-10 border-t border-slate-300/80">

                    {lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="
                                min-h-[110px]
                                border-b border-slate-300/80
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                justify-between
                                gap-6
                                py-2
                            "
                        >
                            {/* Lesson title */}
                            <div className="text-[16px] sm:text-[17px] text-slate-600">
                                {lesson.id}. {lesson.title}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-5 sm:pr-5 lg:pr-10">

                                {/* Read */}
                                <button
                                    onClick={() => handleRead(lesson)}
                                    className="
                                        w-[112px]
                                        min-h-[108px]
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        shadow-[0_3px_7px_rgba(0,0,0,0.16)]
                                        hover:-translate-y-0.5
                                        hover:shadow-[0_5px_12px_rgba(0,0,0,0.18)]
                                        transition
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >
                                    <img
                                        src={howReadIcon}
                                        alt="Читать"
                                        className="w-[58px] h-[58px] object-contain"
                                    />

                                    <span className="text-[15px] text-slate-600">
                                        Читать
                                    </span>
                                </button>

                                {/* Watch */}
                                <button
                                    onClick={() => handleWatch(lesson)}
                                    className="
                                        w-[112px]
                                        min-h-[108px]
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        shadow-[0_3px_7px_rgba(0,0,0,0.16)]
                                        hover:-translate-y-0.5
                                        hover:shadow-[0_5px_12px_rgba(0,0,0,0.18)]
                                        transition
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >
                                    <img
                                        src={howWatchIcon}
                                        alt="Смотреть"
                                        className="w-[58px] h-[58px] object-contain"
                                    />

                                    <span className="text-[15px] text-slate-600">
                                        Смотреть
                                    </span>
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};