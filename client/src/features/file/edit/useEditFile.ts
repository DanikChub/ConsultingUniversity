import { useEffect, useRef, useState } from 'react';
import type {Punct} from "../../../entities/punct/model/type";
import type {Theme} from "../../../entities/theme/model/type";
import type {File as FileType} from "../../../entities/file/model/type";
import {deleteFile, moveFile, updateFileName} from "../../../entities/file/api/file.api";

export const useFile = (target: Punct | Theme | null, targetType: 'theme' | 'punct') => {
    const [files, setFiles] = useState<FileType[]>(() => target?.files || []);
    const renameTimers = useRef<Record<number, NodeJS.Timeout>>({});


    const addFile = async (file: File, onProgress?: (p: number) => void) => {
        if (!target) return;

        // создаём временный объект файла для UI
        const tempFile: any = {
            id: Date.now(),
            original_name: file.name,
            size: file.size,
            type: file.name.split('.').pop() === 'mp3' ? 'audio' : file.name.split('.').pop(),
            status: 'uploading',
            progress: 0,
            order_index: files.length+1,
        };
        setFiles(prev => [...prev, tempFile]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', tempFile.type);

        formData.append('targetType', targetType);
        formData.append('targetId', `${target.id}`);




        try {
            // используем XMLHttpRequest чтобы отслеживать прогресс
            const uploadedFile = await new Promise<FileType>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${process.env.REACT_APP_API_URL}api/program/file`);

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        tempFile.progress = percent;
                        setFiles(prev => prev.map(f => f.id === tempFile.id ? tempFile : f));
                        if (onProgress) onProgress(percent);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.response);
                        resolve(response.file);
                    } else {
                        tempFile.status = 'error';
                        setFiles(prev => prev.map(f => f.id === tempFile.id ? tempFile : f));
                        reject(xhr.response);
                    }
                };

                xhr.onerror = () => {
                    tempFile.status = 'error';
                    setFiles(prev => prev.map(f => f.id === tempFile.id ? tempFile : f));
                    reject(xhr.response);
                };

                xhr.send(formData);
            });

            // обновляем UI на завершённый файл
            uploadedFile.progress = 100;

            console.log(uploadedFile)
            setFiles(prev => prev.map(f => f.id === tempFile.id ? uploadedFile : f));

            return uploadedFile;

        } catch (e) {
            console.error('Ошибка загрузки файла', e);
            tempFile.status = 'error';
            setFiles(prev => prev.map(f => f.id === tempFile.id ? tempFile : f));
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
        destroyFile,
        moveOneFile,
        editFileName
    };
};
