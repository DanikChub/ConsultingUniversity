import {useState} from "react";
import {publishProgram} from "../../../entities/program/api/program.api";

export const usePublishProgram = (programId: number) => {

    const [publishError, setPublishError] = useState<string>('');

    const publish = async () => {
        try {
            return await publishProgram(programId);
        } catch (err: any) {
            setPublishError(err?.response?.data?.error);
            return null;
        }
    };

    return { publish, publishError };
};
