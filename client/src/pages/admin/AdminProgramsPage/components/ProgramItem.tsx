import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Program } from '../../../../entities/program/model/type';
import {FaRubleSign, FaUserAlt, FaVideo} from 'react-icons/fa';
import { MdChecklist } from 'react-icons/md';
import { FiCopy } from 'react-icons/fi';
import { duplicateProgram } from '../../../../entities/program/api/program.api';

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
    const [duplicating, setDuplicating] = useState(false);

    const handleDuplicate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (duplicating) return;

        try {
            setDuplicating(true);
            const newProgram = await duplicateProgram(program.id);

            if (!newProgram?.id) {
                throw new Error('Не удалось получить id копии программы');
            }

            navigate(`/admin/programs/${newProgram.id}`);
        } catch (e) {
            console.error(e);
            alert('Не удалось скопировать программу');
        } finally {
            setDuplicating(false);
        }
    };

    return (
        <div
            onClick={() => navigate(`/admin/programs/${program.id}`)}
            className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white transition hover:shadow-lg cursor-pointer"
        >
            {/* Иконка/Картинка */}
            <div className="flex-shrink-0 w-[260px] h-[150px] bg-gray-100 rounded-lg flex items-center justify-center text-blue-500 text-4xl overflow-hidden">
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

            <div className="flex flex-1 flex-col justify-between p-4 min-h-[150px]">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                        {/* Название */}
                        <div className="flex flex-col min-w-0">
                            {program.short_title && (
                                <span className="truncate text-sm sm:text-base font-semibold text-gray-800">
                                    {program.short_title}
                                </span>
                            )}

                            {program.title && program.title !== program.short_title && (
                                <span className="truncate text-xs sm:text-sm text-gray-500 mt-0.5">
                                    {program.title}
                                </span>
                            )}

                            {!program.short_title && !program.title && (
                                <span className="text-sm text-gray-800">Без названия</span>
                            )}
                        </div>

                        {/* Статус */}
                        <div className="flex gap-2 items-center text-xs sm:text-sm text-gray-500 mt-1">
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                                {statusTranslate[program.status]}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDuplicate}
                        disabled={duplicating}
                        className="shrink-0 inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                        title="Скопировать программу"
                    >
                        <FiCopy className="w-4 h-4" />
                        <span>{duplicating ? 'Копирование...' : 'Скопировать'}</span>
                    </button>
                </div>

                {/* Основные показатели */}
                <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
                    <div className="flex items-center gap-1">
                        <FaUserAlt className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                            {program.users_quantity ?? 0} пользователей
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaRubleSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{program.price ?? '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramItem;