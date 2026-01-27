// modals/FileInfoModal.tsx
import {FC, useEffect, useState} from 'react';
import type { File as ProgramFile } from '../types/program';


type Props = {
    file: ProgramFile;
    onClose: () => void;
    onDelete?: (fileId: number) => Promise<void>;
    onDownload?: (file: ProgramFile) => void;
    onRename?: (name: string) => Promise<void>;

};

const API_URL = process.env.REACT_APP_API_URL


const FileInfoModal: FC<Props> = ({ file, onClose, onDelete, onDownload, onRename, }) => {
    const [isEditing, setIsEditing] = useState(false);

    const [fileName, setFileName] = useState(file.original_name)

    // ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleDelete = async () => {
        if (!onDelete) return;
        const ok = window.confirm('Удалить файл?');
        if (!ok) return;

        await onDelete(file.id);
        onClose();
    };

    const handleEditName = async (newName: string) => {

        setFileName(newName);

        if (!onRename) return;

        try {
            // ждем, пока rename сохранится на сервере
            await onRename(newName);
            // здесь можно добавить уведомление об успехе, если нужно
        } catch (err) {
            console.error('Ошибка при переименовании файла', err);
            // откатываем имя, если нужно
            setFileName(file.original_name);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">

                {/* header */}
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1 pr-4">
                        {!isEditing ? (
                            <div className="group flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {fileName}
                                </h3>


                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 text-sm"
                                    title="Переименовать"
                                >
                                    ✏️
                                </button>

                            </div>
                        ) : (
                            <input
                                autoFocus
                                value={fileName}
                                onChange={(e) => handleEditName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {

                                        setIsEditing(false);
                                    }
                                    if (e.key === 'Escape') {

                                        setIsEditing(false);
                                    }
                                }}
                                onBlur={() => {

                                    setIsEditing(false);
                                }}
                                className="text-lg font-semibold text-gray-900
                                            w-full
                                            bg-transparent
                                            border-none
                                            p-0
                                            m-0
                                            focus:outline-none
                                            focus:ring-0"
                            />
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                            {file.type.toUpperCase()} · {(file.size / 1024 / 1024).toFixed(2)} МБ
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>


                {/* preview */}
                <div className="mb-5 rounded-lg border bg-gray-50 p-4">
                    <FilePreview file={file}/>
                </div>

                {/* info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <Info label="Тип" value={file.type}/>
                    <Info label="Хранилище" value={file.storage}/>
                    <Info label="Статус" value={<Status status={file.status}/>}/>
                    <Info label="ID" value={String(file.id)}/>
                </div>

                {/* actions */}
                <div className="mt-6 flex justify-between">
                    <div className="flex gap-2">
                        {onDownload && (
                            <button
                                onClick={() => onDownload(file)}
                                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                            >
                                Скачать
                            </button>
                        )}
                    </div>

                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                        >
                            Удалить
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilePreview = ({file}: { file: ProgramFile }) => {
    const src = `${API_URL}${file.stored_name}`;

    if (file.type === 'audio') {
        return (
            <audio
                controls
                className="w-full"
                src={src}
            />
        );
    }

    if (file.type === 'pdf') {
        return (
            <iframe
                src={src}
                className="h-[500px] w-full rounded"
                title={file.original_name}
            />
        );
    }

    if (file.type === 'docx') {
        return file.file_asset?.content ? (
            <div
                className="h-[500px] overflow-auto border rounded p-2 bg-gray-50 text-sm text-gray-800"
                dangerouslySetInnerHTML={{__html: file.file_asset.content}}
            />
        ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-600">
                Нет содержимого для отображения
            </div>
        );
    }

    return (
        <div className="text-sm text-gray-500">
            Предпросмотр недоступен
        </div>
    );
};


const Info = ({label, value}: { label: string; value: any }) => (
    <div>
        <div className="text-xs text-gray-500 mb-2">{label}</div>
        <div className="font-medium">{value}</div>
    </div>
);

const Status = ({status}: { status: string }) => {
    const map: Record<string, string> = {
        uploading: 'bg-blue-100 text-blue-700',
        idle: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700',
    };

    const mapRu: Record<string, string> = {
        uploading: 'Загружается...',
        idle: 'Загружено',
        error: 'Ошибка загрузки',
    };

    return (
        <span className={`rounded-full px-2 py-1 text-xs ${map[status]} `}>
            {mapRu[status]}
        </span>
    );
};

export default FileInfoModal;
