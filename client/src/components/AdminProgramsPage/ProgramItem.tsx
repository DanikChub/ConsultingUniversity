import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Program } from '../../types/program';
import { FaUserAlt, FaRubleSign, FaVideo, FaFileAlt } from 'react-icons/fa';
import { MdChecklist } from 'react-icons/md';

type Props = {
    program: Program;
};

const statusTranslate: Record<Program['status'], string> = {
    draft: 'Черновик',
    published: 'Опубликовано',
    archived: 'Архив',
};

const ProgramItem: React.FC<Props> = ({ program }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/admin/programs/${program.id}`)}
            className="flex  items-start  rounded-lg border border-gray-200 hover:shadow-lg transition cursor-pointer gap-4 bg-white"
        >
            {/* Иконка/Картинка */}
            <div className="flex-shrink-0 w-[260px] h-[150px] bg-gray-100 rounded-lg flex items-center justify-center text-blue-500 text-4xl">
                {program.img ? (
                    <img
                        src={`${process.env.REACT_APP_API_URL}${program.img}`}
                        alt={program.title ?? 'program'}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <FaVideo />
                )}
            </div>
            <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                <div className="flex-1 flex flex-col gap-1 w-full">
                    {/* Название */}
                    <div className="flex flex-col">
                        {program.short_title && (
                            <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                            {program.short_title}
                        </span>
                        )}
                        {program.title && program.title !== program.short_title && (
                            <span className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                            {program.title}
                        </span>
                        )}
                        {!program.short_title && !program.title && (
                            <span className="text-sm text-gray-800">Без названия</span>
                        )}
                    </div>

                    {/* Статус программы */}
                    <div className="flex gap-2 items-center text-xs sm:text-sm text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{statusTranslate[program.status]}</span>
                    </div>

                    {/* Основные показатели */}
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600">


                        {/* Тесты */}
                        <div className="flex items-center gap-1">
                            <MdChecklist className="w-4 h-4 text-gray-500"/>
                            <span className="text-sm">{program.number_of_test} тестов</span>
                        </div>



                        {/* Цена */}
                        <div className="flex items-center gap-1">
                            <FaRubleSign className="w-4 h-4 text-gray-500"/>
                            <span className="text-sm">{program.price ?? '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Основная информация */}

        </div>
    );
};

export default ProgramItem;
