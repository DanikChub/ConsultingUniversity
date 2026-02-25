import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneProgram, deleteProgram } from '../../../entities/program/api/program.api';
import AppContainer from '../../../components/ui/AppContainer';
import Button from '../../../shared/ui/buttons/Button';
import { FaFilePdf, FaFileWord, FaFileAudio, FaVideo, FaUserAlt, FaRubleSign, FaCheck } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { MAKE_PROGRAM_ROUTE, ADMIN_PROGRAMS_ROUTE } from '../../../shared/utils/consts';
import type {Program} from "../../../entities/program/model/type";
import {useModals} from "../../../hooks/useModals";
import type {File} from "../../../entities/file/model/type";
import {downloadFile} from "../../../shared/lib/download/downloadFile";
import type {Test} from "../../../entities/test/model/type";
import {type Enrollment, getAllEnrollmentsByProgram} from "../../../entities/enrollment/api/enrollment.api";
import {FiChevronRight, FiClipboard, FiFileText, FiHeadphones, FiPlay} from "react-icons/fi";
import {AiFillFilePdf} from "react-icons/ai";

const statusTranslate: Record<string, string> = {
    draft: 'Черновик',
    published: 'Опубликовано',
    archived: 'Архив',
};

const fileIcon = (type: string) => {
    switch (type) {
        case "audio":
            return <FiHeadphones className="w-6 h-6 text-blue-500" />
        case "docx":
            return <FiFileText className="w-6 h-6 text-green-500" />
        case "pdf":
            return <AiFillFilePdf className="w-6 h-6 text-red-500" />
        case 'video':
            return <FaVideo className="w-6 h-6 text-blue-500" />;
        default:
            return <FiFileText className="w-6 h-6 text-gray-500" />
    }
};

const ViewProgram: React.FC = () => {
    const [program, setProgram] = useState<Program | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null)
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();

    const {openModal} = useModals()

    useEffect(() => {
        const program_id = Number(params.id);

        if (!program_id) return;



        (async () => {
            try {
                const data = await getOneProgram(program_id);

                setProgram(data);

                const enrollments_data = await getAllEnrollmentsByProgram(program_id)
                setEnrollments(enrollments_data)
                const openState: Record<number, boolean> = {};
                data.themes?.forEach((t) => (openState[t.id] = true));
                setOpenModules(openState);
            } catch (e) {
                setError('Программа не найдена');
            } finally {
                setLoaded(true);
            }
        })();


    }, [params.id]);

    const toggleModule = (id: number) => {
        setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDelete = async () => {
        if (!program) return;
        try {
            await deleteProgram(program.id);
            navigate(ADMIN_PROGRAMS_ROUTE);
        } catch (e: any) {
            alert(e.response?.data?.message || 'Ошибка удаления программы');
        }
    };

    const handleViewFile = (file: File) => {
        openModal('fileInfo', {
            file,
            onDownload: (file: File) => {
                downloadFile({
                    url: `${process.env.REACT_APP_API_URL}${file.stored_name}`,
                    filename: file.original_name,
                });
            },

        });
    }


    const handleViewTest = (test: Test) => {
        console.log(test);
        openModal('viewTest', { test });
    }


    if (!loaded) {
        return <AppContainer>Загрузка...</AppContainer>;
    }

    if (error) {
        return (
            <AppContainer>
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <h2 className="text-xl font-semibold mb-2">
                        😕 Программа не найдена
                    </h2>
                    <p className="text-sm">
                        Возможно, она была удалена или у вас нет доступа
                    </p>
                </div>
            </AppContainer>
        );
    }

    return (
        <AppContainer>
            {/* Основная карточка программы */}
            <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex gap-4 items-center">
                        <div className="w-[175px] h-[100px] bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl text-blue-500 overflow-hidden">
                            {program.img ? (
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${program.img}`}
                                    alt={program.title ?? 'program'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaVideo />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-gray-800 truncate">{program.short_title || 'Без названия'}</span>
                            {program.title && program.title !== program.short_title && (
                                <span className="text-sm text-gray-500 mt-1">{program.title}</span>
                            )}
                            <span className="mt-1 text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded w-max">
                                {statusTranslate[program.status]}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                        <Button
                            onClick={() => navigate(MAKE_PROGRAM_ROUTE.replace(':id', program.id.toString()))}
                            checkRole="ADMIN"
                            className="max-h-min px-4 py-1 text-sm"
                        >
                            Редактировать
                        </Button>
                        <Button
                            onClick={handleDelete}
                            checkRole="ADMIN"
                            className="max-h-min px-4 py-1 text-sm bg-red-500 hover:bg-red-600"
                        >
                            Удалить
                        </Button>
                    </div>
                </div>

                {/* Метрики */}
                <div className="flex flex-wrap gap-6 mt-4 text-gray-700">

                    <div className="flex items-center gap-2"><FaUserAlt /> {enrollments.length ?? 0} пользователей</div>
                    <div className="flex items-center gap-2"><FaRubleSign /> {program.price ?? '-'}</div>
                </div>

                {/* Аккордеон модулей */}
                <div className="mt-6 space-y-3">
                    {program.themes?.sort((a, b) => a.order_index - b.order_index).map((theme) => {
                        const open = openModules[theme.id] || false;


                        return (

                            <div key={theme.id} className="bg-gray-50 rounded-lg border border-gray-200" >
                                <div
                                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 transition"
                                    onClick={() => toggleModule(theme.id)}
                                >
                                    <div className="text-lg font-semibold text-gray-800 tracking-tight">
                                        {theme.title}
                                    </div>
                                    {open ? <MdExpandLess className="w-6 h-6"/> : <MdExpandMore className="w-6 h-6"/>}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1 p-4">
                                    {theme.files?.map((file) => (
                                        <div key={file.id}
                                             onClick={() => handleViewFile(file)}
                                             className="flex items-center gap-2
                                                        px-4 py-2
                                                        rounded-xl
                                                        bg-gray-50
                                                        border border-gray-200
                                                        text-sm font-medium text-gray-700

                                                        cursor-pointer
                                                        transition-all
                                                        hover:bg-gray-100
                                                        hover:border-gray-300
                                                        hover:shadow-sm
                                                        active:scale-[0.98]">
                                            {fileIcon(file.type)}
                                            <span>{file.original_name}</span>
                                            {file.status === 'uploading' &&
                                                <span className="ml-1 text-xs text-blue-500">Загрузка...</span>}
                                        </div>
                                    ))}
                                </div>
                                {!open && (
                                    <div className="pl-6 pr-3 pb-3 space-y-2">
                                        {theme.puncts
                                            ?.sort((a, b) => a.order_index - b.order_index)
                                            .map((punct, i) => (
                                                <div
                                                    key={punct.id}
                                                    className="border-b border-gray-200 pb-6 mb-6 last:border-none last:mb-0"
                                                >
                                                    {/* Заголовок */}
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <div className="text-sm font-semibold text-gray-400 mt-0.5">
                                                            {i + 1}.
                                                        </div>

                                                        <div>
                                                            <div className="text-base font-medium text-gray-700">
                                                                {punct.title}
                                                            </div>

                                                            {/* Описание */}
                                                            {punct.description && (
                                                                <div className="mt-1 text-sm text-gray-500 leading-relaxed">
                                                                    {punct.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Файлы */}
                                                    {punct.files?.length > 0 && (
                                                        <div className="flex flex-wrap gap-3 mt-3">
                                                            {punct.files.map((file) => (
                                                                <div
                                                                    key={file.id}
                                                                    onClick={() => handleViewFile(file)}
                                                                    className="
                                                                    flex items-center gap-2
                                                                    px-4 py-2
                                                                    rounded-xl
                                                                    bg-gray-50
                                                                    border border-gray-200
                                                                    text-sm font-medium text-gray-700

                                                                    cursor-pointer
                                                                    transition-all
                                                                    hover:bg-gray-100
                                                                    hover:border-gray-300
                                                                    hover:shadow-sm
                                                                    active:scale-[0.98]
                                                                  "
                                                                >
                                                                    <div className="text-base">{fileIcon(file.type)}</div>

                                                                    <span className="truncate max-w-[200px]">
                                                                        {file.original_name}
                                                                      </span>

                                                                    {file.status === "uploading" && (
                                                                        <span className="text-xs text-blue-500 animate-pulse">
                                                                          Загрузка...
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Тесты */}
                                                    {punct.tests?.length > 0 && (
                                                        <div className="mt-4 space-y-3">
                                                            {punct.tests.map((test) => (
                                                                <button
                                                                    key={test.id}
                                                                    onClick={() => handleViewTest(test)}
                                                                    className="
                                                                          group
                                                                          w-full
                                                                          flex items-center gap-4
                                                                          px-5 py-4
                                                                          rounded-2xl
                                                                          border border-green-200
                                                                          bg-green-50/70
                                                                          text-left

                                                                          hover:bg-green-100
                                                                          hover:border-green-300
                                                                          hover:shadow-md

                                                                          active:scale-[0.99]
                                                                          transition-all
                                                                        "
                                                                >
                                                                    {/* Левая иконка теста */}
                                                                    <div className="
                                                                      w-10 h-10
                                                                      flex items-center justify-center
                                                                      rounded-xl
                                                                      bg-white
                                                                      border border-green-200
                                                                      text-green-600
                                                                      group-hover:scale-105
                                                                      transition
                                                                    ">
                                                                        <FiClipboard className="text-lg" />
                                                                    </div>

                                                                    {/* Название */}
                                                                    <div className="flex-1">
                                                                        <div className="text-sm font-semibold text-green-900">
                                                                            {test.title || `Тест ${test.id}`}
                                                                        </div>
                                                                        <div className="text-xs text-green-700/70">
                                                                            Проверка знаний
                                                                        </div>
                                                                    </div>

                                                                    {/* Правая часть */}
                                                                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                                                                        <FiPlay className="text-base" />
                                                                        <span>просмотр</span>
                                                                        <FiChevronRight className="opacity-60 group-hover:translate-x-1 transition" />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppContainer>
    );
};

export default ViewProgram;
