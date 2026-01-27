import { useEffect, useRef, useState } from 'react';
import type { Program } from '../types/program';
import {destroyImg, getOneProgram, importProgram, publishProgram, updateImg, updateProgram} from '../http/programAPI';

export const useProgram = (programId?: number) => {
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    const dirtyFields = useRef<Set<keyof Program>>(new Set());
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    const [dataVersion, setDataVersion] = useState(0);

    const [error, setError] = useState<boolean | null>(null);
    const [publicateError, setPublicateError] = useState<string>('')

    useEffect(() => {
        if (!programId) return;
        getOneProgram(programId)
            .then(setProgram)
            .finally(() => setLoading(false));


    }, [programId]);


    const importProgramFromZip = async (file: File, resetProgram: boolean) => {
        if (!programId) return;

        const stringReset = resetProgram ? 'true' : 'false'

        const fd = new FormData();
        fd.append("zip", file);
        fd.append('resetProgram', stringReset)

        setImporting(true);
        setImportProgress(0);

        try {
            const importedProgram = await importProgram(
                programId,
                fd,
                (percent) => setImportProgress(percent)
            );

            setProgram(importedProgram);
            setDataVersion(v => v + 1);
        } catch (err) {
            console.error("Ошибка импортирования программы:", err);
        } finally {
            setImporting(false);
        }
    };




    const updateField = (field: keyof Program, value: any) => {
        setProgram(prev => ({ ...prev, [field]: value }));


        dirtyFields.current.add(field);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            const fd = new FormData();
            // берем последнее value напрямую, а не из state
            fd.append(field as string, value);
            dirtyFields.current.delete(field); // поле уже сохранили
            await updateProgram(programId!, fd);
        }, 700);
    };

    // ----------------- Обновление картинки -----------------
    const updateProgramImage = async (file: File) => {
        if (!programId) return;
        const fd = new FormData();
        fd.append("img", file);

        try {
            const updatedProgram = await updateImg(programId, fd);
            setProgram((prev) => (prev ? { ...prev, img: updatedProgram.img } : prev));
        } catch (err) {
            console.error("Ошибка обновления картинки:", err);
        }
    };

    // ----------------- Удаление картинки -----------------
    const deleteProgramImage = async () => {
        if (!programId) return;

        try {
            const updatedProgram = await destroyImg(programId, new FormData());
            setProgram((prev) => (prev ? { ...prev, img: updatedProgram.img } : prev));
        } catch (err) {
            console.error("Ошибка удаления картинки:", err);
        }
    };

    const publicateProgram = async () => {
        if (!programId) return;

        try {
            const response = await publishProgram(programId);

            return response;
        } catch (err) {
            // console.error("Ошибка удаления картинки:", err);
            setPublicateError(err?.response?.data?.error);
            console.log(err)
        }
    }

    return {
        program,
        loading,
        importProgramFromZip,
        importing,
        importProgress,
        updateField,
        updateProgramImage,
        deleteProgramImage,
        dataVersion,
        publicateProgram,
        publicateError
    };
};
