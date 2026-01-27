import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import pdfIcon from '../../assets/imgs/pdf.png';
import wordIcon from '../../assets/imgs/word_blue.png';
import audioIcon from '../../assets/imgs/audio.png';
import type { File } from '../../types/program';
import {useModals} from "../../hooks/useModals";
import ButtonRemove from "../ui/ButtonRemove";

type Props = {
    file: File;
    onDelete: (fileId: number) => void;
    renameFile: (fileId: number, name: string) => void;
};

const FileItem: React.FC<Props> = ({ file, onDelete, renameFile }) => {
    const { openModal } = useModals();

    const downloadFile = async (file: File) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${file.stored_name}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.original_name; // имя при скачивании
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const handleViewFile = () => {
        openModal('fileInfo', {
            file,
            onDelete: async (id) => onDelete(id),
            onDownload: (file) => {
                downloadFile(file)
            },
            onRename: async (newName) => renameFile(file.id, newName)
        });
    };

    const getIcon = () => {
        switch (file.type) {
            case 'pdf': return pdfIcon;
            case 'docx': return wordIcon;
            case 'audio': return audioIcon;
            default: return pdfIcon;
        }
    };

    const formatSize = (size: number) => {
        if (size < 1024) return size + ' B';
        if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
        return (size / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const makeShortFileName = (fullName: string, maxLength = 15): string => {
        const dotIndex = fullName.lastIndexOf('.');
        if (dotIndex === -1) return fullName.length > maxLength ? fullName.slice(0, maxLength) + '...' : fullName;

        const name = fullName.slice(0, dotIndex);
        const ext = fullName.slice(dotIndex);

        if (name.length <= maxLength) return name + ext;

        return name.slice(0, maxLength) + '...' + ext;
    };



    return (
        <div onClick={handleViewFile} className="flex flex-col w-full max-w-max min-w-[150px] h-full bg-gray-50 rounded p-2 border border-gray-200 hover:bg-gray-100">
            <div className="flex items-center gap-2">
                <img src={getIcon()} alt={file.type} className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{makeShortFileName(file.original_name)}</p>
                    <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                </div>
                <ButtonRemove onClick={() => onDelete(file.id)} message="Вы уверены, что хотите удалить файл?"/>
            </div>

            {/* Прогресс-бар */}
            {file.status === 'uploading' && (
                <div className="mt-1 w-full h-1 bg-gray-200 rounded">
                    <div
                        className="h-1 bg-blue-500 rounded"
                        style={{ width: `${file.progress || 0}%` }}
                    />
                </div>
            )}

            {file.status === 'error' && (
                <p className="text-red-500 text-xs mt-1">Ошибка загрузки</p>
            )}


        </div>
    );
};

export default FileItem;
