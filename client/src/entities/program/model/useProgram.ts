import { getOneProgram } from "../api/program.api";
import { useEffect, useState } from "react";
import type { Program } from "./type";

export const useProgram = (programId?: number) => {
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!programId) return;

        setLoading(true);
        setError(null);


        getOneProgram(programId)
            .then((data) => {
                if (!data) {
                    // программа не найдена
                    setProgram(null);
                } else {
                    setProgram(data);
                }
            })
            .catch((e) => {
                console.error(e);
                setError(e?.response?.data?.message);
            })
            .finally(() => setLoading(false));
    }, [programId]);

    return {
        program,
        setProgram,
        loading,
        error,

    };
};
