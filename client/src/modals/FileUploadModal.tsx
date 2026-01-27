import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {

    onClose: () => void;
    onSubmit: (file: File) => void;
};

const FileUploadModal = ({ onClose, onSubmit }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'audio/*': ['.mp3', '.wav'],
        },
        onDrop: (files) => setFile(files[0]),
    });

    const handleUpload = () => {
        if (!file) return;
        setLoading(true);
        onSubmit(file);   // 👈 просто отдаём файл
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">

                {/* header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Добавить материал</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <div className="mb-4">
                    {/* Контент инструкции */}
                    <div
                        className="overflow-hidden transition-all duration-500 mt-2 px-4 py-2 text-sm text-gray-700 bg-blue-50 rounded-md border-l-4 border-blue-400"
                    >
                        <p>
                            Для корректной работы программы в архиве допускаются <strong>только определённые типы
                            файлов</strong>.
                        </p>

                        <div className="ml-4 mt-2">
                            <p className="font-semibold text-gray-800">Поддерживаемые форматы:</p>
                            <ul className="ml-4 list-disc space-y-1">
                                <li>
                                    <span className="font-medium text-purple-600">.docx</span> — текстовые документы
                                </li>
                                <li>
                                    <span className="font-medium text-red-600">.pdf</span> — PDF-файлы
                                </li>
                                <li>
                                    <span className="font-medium text-green-600">.mp3</span> — аудиофайлы
                                </li>
                                <li>
                                    <span className="font-medium text-green-600">.wav</span> — аудиофайлы
                                </li>
                            </ul>
                        </div>

                        <p className="mt-2 text-gray-700">
                            <strong className="font-semibold text-red-600">Важно:</strong> Внутри модулей и пунктов
                            программы должны
                            находиться <strong>только файлы указанных форматов</strong>.
                            Все остальные типы файлов (например: <span className="font-medium">.txt</span>, <span
                            className="font-medium">.jpg</span>, <span className="font-medium">.exe</span>) будут
                            <strong className="text-red-600"> проигнорированы или будут отображаться неправильно</strong>.
                        </p>

                    </div>
                </div>


                {/* dropzone */}
                <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed py-10 px-6 text-center transition
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                >
                    <input {...getInputProps()} />

                    {!file ? (
                        <>
                            <p className="text-sm font-medium text-gray-700">
                                Перетащите файл сюда
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                или нажмите для выбора
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

                {/* actions */}
                <button
                    disabled={!file || loading}
                    onClick={handleUpload}
                    className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white
                     hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    Добавить файл
                </button>
            </div>
        </div>
    );
};

export default FileUploadModal;
