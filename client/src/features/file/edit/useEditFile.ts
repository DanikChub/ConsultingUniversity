import { useEffect, useRef, useState } from 'react';
import type {Punct} from "../../../entities/punct/model/type";
import type {Theme} from "../../../entities/theme/model/type";
import type {File as FileType} from "../../../entities/file/model/type";
import {createVideoFile, deleteFile, moveFile, updateFileName, uploadFile} from "../../../entities/file/api/file.api";
import axios from "axios";

export const useFile = (target: Punct | Theme | null, targetType: 'theme' | 'punct') => {
    const [files, setFiles] = useState<FileType[]>(() => target?.files || []);
    const renameTimers = useRef<Record<number, NodeJS.Timeout>>({});


    const addFile = async (file: FileType, onProgress?: (p: number) => void) => {
        if (!target) return;

        const FILE_TYPES: Record<string, string[]> = {
            docx: ['docx'],
            pdf: ['pdf'],
            audio: ['mp3', 'wav', 'ogg'],
        };

        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let type: string | null = null;

        for (const [key, exts] of Object.entries(FILE_TYPES)) {
            if (exts.includes(ext)) {
                type = key;
                break;
            }
        }

        if (!type) return;

        const tempId = Date.now();

        const tempFile: any = {
            id: tempId,
            original_name: file.name,
            size: file.size,
            type,
            status: 'uploading',
            progress: 0,
            order_index: files.length + 1,
        };

        setFiles(prev => [...prev, tempFile]);

        try {
            const uploadedFile = await uploadFile(
                file,
                type,
                targetType,
                target.id,
                (percent) => {
                    setFiles(prev =>
                        prev.map(f =>
                            f.id === tempId
                                ? { ...f, progress: percent }
                                : f
                        )
                    );

                    if (onProgress) onProgress(percent);
                }
            );

            setFiles(prev =>
                prev.map(f =>
                    f.id === tempId
                        ? { ...uploadedFile, progress: 100 }
                        : f
                )
            );

            return uploadedFile;

        } catch (e) {
            console.error('Ошибка загрузки файла', e);

            setFiles(prev =>
                prev.map(f =>
                    f.id === tempId
                        ? { ...f, status: 'error' }
                        : f
                )
            );
        }
    };


    const addVideo = async (url: string) => {
        if (!target) return;

        const tempId = Date.now();

        const tempFile: any = {
            id: tempId,
            original_name: 'VK Video',
            type: 'video',
            storage: 'vk',
            url,
            status: 'idle',
            order_index: files.length + 1,
        };

        setFiles(prev => [...prev, tempFile]);

        try {
            const file = await createVideoFile(
                url,
                targetType,
                target.id
            );

            setFiles(prev =>
                prev.map(f =>
                    f.id === tempId ? file : f
                )
            );

            return file;

        } catch (e) {
            console.error('Ошибка добавления видео', e);

            setFiles(prev =>
                prev.map(f =>
                    f.id === tempId
                        ? { ...f, status: 'error' }
                        : f
                )
            );
        }
    };



    const destroyFile = async (fileId: number) => {
        try {
            // optimistic UI
            setFiles(prev => prev.filter(p => p.id !== fileId));
            await deleteFile(fileId);
        } catch (e) {
            console.error('Ошибка удаления пункта', e);
        }
    }

    // ------------------- Новое: перемещение -------------------
    const moveOneFile = async (fileId: number, newIndex: number) => {
        if (!target) return;

        const oldIndex = files.findIndex(f => f.id === fileId);
        if (oldIndex === -1 || oldIndex === newIndex) return;

        // Оптимистично меняем порядок UI
        const newFiles = Array.from(files);
        const [moved] = newFiles.splice(oldIndex, 1);
        newFiles.splice(newIndex, 0, moved);
        setFiles(newFiles);
        console.log('перемещаем!')
        try {
            await moveFile(fileId, newIndex, targetType, target.id);
        } catch (e) {
            console.error('Ошибка перемещения файла', e);
            // rollback UI при ошибке
            setFiles(files);
        }
    };


    const editFileName = async (fileId: number, newName: string) => {
        // 1️⃣ сохраняем текущее имя на случай отката
        let prevName: string | undefined;
        setFiles((prev) =>
            prev.map((f) => {
                if (f.id === fileId) {
                    prevName = f.original_name;
                    return { ...f, original_name: newName };
                }
                return f;
            })
        );

        // 2️⃣ сбрасываем предыдущий таймер
        if (renameTimers.current[fileId]) {
            clearTimeout(renameTimers.current[fileId]);
        }

        // 3️⃣ debounce сохранение
        renameTimers.current[fileId] = setTimeout(async () => {
            try {
                await updateFileName(fileId, newName);
            } catch (e) {
                console.error('Ошибка сохранения имени файла', e);
                // 🔴 откатываем к старому имени
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileId && prevName
                            ? { ...f, original_name: prevName }
                            : f
                    )
                );
            }
        }, 700);
    };


    return {
        files,
        addFile,
        addVideo,
        destroyFile,
        moveOneFile,
        editFileName
    };
};
