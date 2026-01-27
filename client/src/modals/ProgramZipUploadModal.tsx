import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillWarning } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';

type Props = {
    onClose: () => void;
    onSubmit: (data: { file: File; resetProgram: boolean }) => void;
};

const ProgramZipUploadModal = ({ onClose, onSubmit }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [resetProgram, setResetProgram] = useState<boolean | null>(true); // null = ещё не выбран



    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: { 'application/zip': ['.zip'] },
        onDrop: (files) => {
            setFile(files[0]);
            setResetProgram(true); // сброс выбора при новом файле
        },
    });

    const handleUpload = () => {
        if (!file || resetProgram === null) return;
        setLoading(true);
        onSubmit({ file, resetProgram });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">

                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Импорт программы</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="mb-4">

                    {/* Контент инструкции */}
                    <div
                        className={`overflow-hidden transition-all duration-500 mt-2 px-4 py-2 text-sm text-gray-700 bg-blue-50 rounded-md border-l-4 border-blue-400 `}
                    >
                        <p>
                            Чтобы импортировать программу корректно, ваш ZIP-файл должен содержать <strong>главную папку
                            с названием программы</strong>:
                        </p>

                        <div className="ml-4 mt-2">
                            <p className="font-semibold text-gray-800">Пример структуры:</p>
                            <ul className="ml-4 list-disc text-gray-700 space-y-1">
                                <li>
                                    <span className="font-medium text-blue-600">ProgramName/</span> — главная папка
                                    программы
                                    <ul className="ml-4 list-disc">
                                        <li>
                                            <span className="font-medium text-purple-600">Module1/</span> — папка модуля
                                            <ul className="ml-4 list-disc">
                                                <li><span className="text-gray-800">file1.docx</span> — файлы модуля
                                                </li>
                                                <li>
                                                    <span className="font-medium text-green-600">Lesson1/</span> — папка
                                                    пункта
                                                    <ul className="ml-4 list-disc">
                                                        <li><span className="text-gray-800">lesson_file1.pdf</span></li>
                                                        <li><span className="text-gray-800">lesson_file2.docx</span>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <span className="font-medium text-purple-600">Module2/</span> — следующий
                                            модуль
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <p className="mt-2 text-gray-700">
                            <span className="font-semibold text-red-600">Важно:</span> Главная папка программы должна
                            быть архивирована через <span className="font-medium">7zip</span> в формате <span
                            className="font-medium">.zip</span>.
                            Внутри модулей могут быть файлы и папки с названиями пунктов. Внутри пунктов должны быть
                            только файлы.
                        </p>
                    </div>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed  px-6 py-10 text-center transition mt-4
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                >
                    <input {...getInputProps()} />
                    {!file ? (
                        <>
                            <p className="text-sm font-medium text-gray-700">
                                Перетащите сюда ZIP-файл с программой
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                или нажмите, чтобы выбрать файл
                            </p>
                        </>
                    ) : (
                        <div className="text-sm">
                            <p className="font-medium text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(1)} МБ
                            </p>
                        </div>
                    )}
                </div>

                {/* Выбор действия: checkbox-style */}
                {file && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">
                            Выберите действие:
                        </p>
                        <p className="text-xs text-gray-400">
                            Можно либо полностью перезаписать программу, либо добавить новые данные в конец.
                        </p>

                        <div className="flex flex-col justify-center gap-4 mt-3">
                            <label
                                className={`flex-1 cursor-pointer px-4 py-2 rounded-lg border transition
                                    ${resetProgram === true
                                    ? 'border-red-500 bg-red-100'
                                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
                                }`}
                            >
                                <div className="flex">
                                    <input
                                        type="radio"
                                        name="importType"
                                        className="mr-2"
                                        checked={resetProgram === true}
                                        onChange={() => setResetProgram(true)}
                                    />
                                    <h4 className="font-semibold">Перезаписать программу</h4>
                                </div>
                                <span className="block text-xs text-gray-600 mt-1">
                                    Удалит все существующие темы и пункты
                                </span>
                            </label>

                            <label
                                className={`flex-1 cursor-pointer px-4 py-2 rounded-lg border transition
                                    ${resetProgram === false
                                    ? 'border-green-500 bg-green-100'
                                    : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                                }`}
                            >
                                <div className="flex">
                                    <input
                                        type="radio"
                                        name="importType"
                                        className="mr-2"
                                        checked={resetProgram === false}
                                        onChange={() => setResetProgram(false)}
                                    />
                                    <h4 className="font-semibold">Добавить в конец</h4>
                                </div>

                                <span className="block text-xs text-gray-600 mt-1">
                                    Сохраняет существующие темы, новые добавляются в конец
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Кнопка отправки всегда видна */}
                {file && (
                    <button
                        disabled={loading || resetProgram === null}
                        onClick={handleUpload}
                        className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white
                        hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {loading ? 'Импортируется...' : 'Начать импорт'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProgramZipUploadModal;
