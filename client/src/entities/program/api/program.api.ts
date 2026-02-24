import { $authHost, $host } from "../../../shared/api/axios";
import { Program } from "../model/type";

// ---------- Programs ----------

// Получить одну программу
export const getOneProgram = async (id: number): Promise<Program> => {
    const { data } = await $authHost.get<Program>(`api/program/${id}`);
    localStorage.setItem('programId', `${id}`)
    return data;
};

export const getOnePunct = async (id: number): Promise<Program> => {
    const { data } = await $authHost.get<Program>(`api/program/theme${id}`);
    return data;
};
export const getOneTheme = async (id: number): Promise<Program> => {
    const { data } = await $authHost.get<Program>(`api/program/punct/${id}`);
    return data;
};

// Получить все программы
export const getAllPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>(`api/program/`);
    return data;
};

// Получить все опубликованные программы
export const getAllPublishedPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>('api/program/published');
    return data;
};

// Получить все черновые программы
export const getAllDraftPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>('api/program/draft');
    return data;
};

// Создать программу
export const createProgram = async (admin_id: number): Promise<Program> => {
    const { data } = await $authHost.post<Program>(`api/program/`, { admin_id });
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
            'POST',
            `${process.env.REACT_APP_API_URL}api/program/${programId}/import`
        );

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
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

// Частичное обновление программы
export const updateProgram = async (id: number, formData: FormData): Promise<Program> => {
    const { data } = await $authHost.patch<Program>(`api/program/${id}`, formData);
    return data;
};


// Обновление изображения программы
export const updateImg = async (id: number, formData: FormData): Promise<Program> => {
    const { data } = await $authHost.patch<Program>(`api/program/${id}/img`, formData);
    return data;
};

// Удаление изображения программы
export const destroyImg = async (id: number, formData: FormData): Promise<Program> => {
    const { data } = await $authHost.delete<Program>(`api/program/${id}/img`);
    return data;
};

// Удалить программу
export const deleteProgram = async (id: number): Promise<{ message: string }> => {
    const { data } = await $authHost.delete<{ message: string }>(`api/program/${id}`);
    return data;
};

// Опубликовать программу
export const publishProgram = async (id: number): Promise<{ success: boolean; message: string; program: Program }> => {
    const { data } = await $authHost.post(`api/program/${id}/publish`);
    return data;
};



