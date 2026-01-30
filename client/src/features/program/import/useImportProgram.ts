import type {Program} from "../../../entities/program/model/type";
import {useState} from "react";
import {importProgram} from "../../../entities/program/api/program.api";

export const useImportProgram = (
    programId: number,
    setProgram: (p: Program) => void
) => {
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const [dataVersion, setDataVersion] = useState(0);

    const importFromZip = async (file: File, reset: boolean) => {
        const fd = new FormData();
        fd.append('zip', file);
        fd.append('resetProgram', String(reset));

        setImporting(true);
        setProgress(0);

        try {
            const program = await importProgram(programId, fd, setProgress);
            setProgram(program);
            setDataVersion(v => v + 1);
        } finally {
            setImporting(false);
        }
    };

    return { importFromZip, importing, progress, dataVersion };
};
