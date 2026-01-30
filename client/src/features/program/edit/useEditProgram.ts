import {useRef} from "react";
import type {Program} from "../../../entities/program/model/type";
import {destroyImg, updateImg, updateProgram} from "../../../entities/program/api/program.api";

export const useEditProgram = (
    programId: number,
    setProgram: React.Dispatch<React.SetStateAction<Program | null>>
) => {
    const dirtyFields = useRef<Set<keyof Program>>(new Set());
    const timer = useRef<NodeJS.Timeout | null>(null);

    const updateField = (field: keyof Program, value: any) => {
        setProgram(prev => prev ? { ...prev, [field]: value } : prev);
        dirtyFields.current.add(field);

        if (timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(async () => {
            const fd = new FormData();
            fd.append(field, value);
            dirtyFields.current.delete(field);
            await updateProgram(programId, fd);
        }, 700);
    };

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

    return { updateField, updateProgramImage, deleteProgramImage };
};