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

const statusTranslate: Record<string, string> = {
    draft: 'Черновик',
    published: 'Опубликовано',
    archived: 'Архив',
};

const fileIcon = (type: string) => {
    switch (type) {
        case 'pdf':
            return <FaFilePdf className="text-red-500 w-4 h-4" />;
        case 'docx':
            return <FaFileWord className="text-blue-500 w-4 h-4" />;
        case 'audio':
            return <FaFileAudio className="text-green-500 w-4 h-4" />;
        default:
            return <FaFilePdf className="w-4 h-4" />;
    }
};

const ViewProgram: React.FC = () => {
    const [program, setProgram] = useState<Program | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();

    const {openModal} = useModals()

    useEffect(() => {
        const program_id = params.id;
        if (!program_id) return;



        (async () => {
            try {
                const data = await getOneProgram(program_id);

                setProgram(data);

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

                    <div className="flex items-center gap-1"><FaUserAlt /> {program.users_quantity ?? 0} пользователей</div>
                    <div className="flex items-center gap-1"><FaRubleSign /> {program.price ?? '-'}</div>
                </div>

                {/* Аккордеон модулей */}
                <div className="mt-6 space-y-3">
                    {program.themes?.sort((a, b) => a.order_index - b.order_index).map((theme) => {
                        const open = openModules[theme.id] || false;


                        return (

                            <div key={theme.id} className="bg-gray-50 rounded-lg border border-gray-200">
                                <div
                                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 transition"
                                    onClick={() => toggleModule(theme.id)}
                                >
                                    <span className="font-medium text-gray-800">{theme.title}</span>
                                    {open ? <MdExpandLess className="w-6 h-6"/> : <MdExpandMore className="w-6 h-6"/>}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {theme.files?.map((file) => (
                                        <div key={file.id}
                                             onClick={() => handleViewFile(file)}
                                             className="flex items-center gap-1
                                                        text-gray-600 text-sm
                                                        bg-gray-100 px-2 py-1 rounded

                                                        cursor-pointer
                                                        transition
                                                        hover:bg-gray-200
                                                        hover:text-gray-800">
                                            {fileIcon(file.type)}
                                            <span>{file.original_name}</span>
                                            {file.status === 'uploading' &&
                                                <span className="ml-1 text-xs text-blue-500">Загрузка...</span>}
                                        </div>
                                    ))}
                                </div>
                                {open && (
                                    <div className="pl-6 pr-3 pb-3 space-y-2">
                                        {theme.puncts?.sort((a, b) => a.order_index - b.order_index).map((punct, i) => (
                                            <div key={punct.id} className="border-b border-gray-200 pb-2">
                                                <div className="font-medium text-gray-700">{i + 1}. {punct.title}</div>

                                                {/* Файлы */}
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {punct.files?.map((file) => (
                                                        <div
                                                            key={file.id}
                                                            onClick={() => handleViewFile(file)}
                                                            className="
                                                                flex items-center gap-1
                                                                text-gray-600 text-sm
                                                                bg-gray-100 px-2 py-1 rounded

                                                                cursor-pointer
                                                                transition
                                                                hover:bg-gray-200
                                                                hover:text-gray-800
                                                            "
                                                        >
                                                            {fileIcon(file.type)}
                                                            <span>{file.original_name}</span>

                                                            {file.status === 'uploading' && (
                                                                <span className="ml-1 text-xs text-blue-500">
                                                                    Загрузка...
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>


                                                {/* Тесты */}
                                                {punct.tests?.length > 0 && (
                                                    <div className="mt-1">
                                                        {punct.tests.map((test) => (
                                                            <button
                                                                key={test.id}
                                                                onClick={() => handleViewTest(test)}
                                                                className="
                                                                  w-full
                                                                  flex items-center gap-3
                                                                  px-4 py-3
                                                                  rounded-lg
                                                                  border border-green-200
                                                                  bg-green-50
                                                                  text-left text-sm font-medium text-green-800

                                                                  hover:bg-green-100
                                                                  hover:border-green-300

                                                                  active:bg-green-200
                                                                  transition
                                                                "
                                                            >
                                                                <FaCheck className="text-green-600 text-lg shrink-0" />

                                                                <span className="flex-1">
                                                                  {test.title || `Тест ${test.id}`}
                                                                </span>

                                                                <span className="text-xs text-green-600 opacity-70">
                                                                  открыть
                                                                </span>
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
