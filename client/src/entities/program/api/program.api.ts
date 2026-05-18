import { $authHost } from "../../../shared/api/axios";
import type { Program } from "../model/type";

// ---------- Programs ----------

export const getOneProgram = async (programId: number): Promise<Program> => {
    const { data } = await $authHost.get<Program>(`api/program/${programId}`);

    localStorage.setItem("programId", `${programId}`);

    return data;
};

export const getAllPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>("api/program");
    return data;
};

export const getAllPublishedPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>("api/program/published");
    return data;
};

export const getAllDraftPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>("api/program/draft");
    return data;
};

export const createProgram = async (admin_id: number): Promise<Program> => {
    const { data } = await $authHost.post<Program>("api/program", {
        admin_id,
    });

    return data;
};

export const updateProgram = async (
    programId: number,
    formData: FormData
): Promise<Program> => {
    const { data } = await $authHost.patch<Program>(
        `api/program/${programId}`,
        formData
    );

    return data;
};

export const deleteProgram = async (
    programId: number
): Promise<{ message: string }> => {
    const { data } = await $authHost.delete<{ message: string }>(
        `api/program/${programId}`
    );

    return data;
};

export const duplicateProgram = async (programId: number): Promise<Program> => {
    const { data } = await $authHost.post<Program>(
        `api/program/${programId}/duplicate`
    );

    return data;
};

export const publishProgram = async (
    programId: number
): Promise<{ success: boolean; message: string; program: Program }> => {
    const { data } = await $authHost.post<{
        success: boolean;
        message: string;
        program: Program;
    }>(`api/program/${programId}/publish`);

    return data;
};

export const importProgram = (
    programId: number,
    formData: FormData,
    onProgress?: (percent: number) => void
): Promise<Program> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(
            "POST",
            `${process.env.REACT_APP_API_URL}api/program/${programId}/import`
        );

        const token = localStorage.getItem("token");

        if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.upload.onprogress = event => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(xhr.responseText);
            }
        };

        xhr.onerror = () => {
            reject(xhr.responseText);
        };

        xhr.send(formData);
    });
};

// ---------- Program image ----------

export const updateImg = async (
    programId: number,
    formData: FormData
): Promise<{ img: string; message: string }> => {
    const { data } = await $authHost.patch<{ img: string; message: string }>(
        `api/program/${programId}/img`,
        formData
    );

    return data;
};

export const destroyImg = async (
    programId: number
): Promise<{ img: null; message: string }> => {
    const { data } = await $authHost.delete<{ img: null; message: string }>(
        `api/program/${programId}/img`
    );

    return data;
};