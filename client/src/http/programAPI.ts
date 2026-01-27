import { $authHost, $host } from "./index";
import { Program, Theme, Punct, File } from "../types/program";

// ---------- Programs ----------

// Получить одну программу
export const getOneProgram = async (id: number): Promise<Program> => {
    const { data } = await $authHost.get<Program>(`api/program/${id}`);
    return data;
};

// Получить все программы
export const getAllPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>(`api/program/`);
    return data;
};

// Получить все опубликованные программы
export const getAllPublishedPrograms = async (): Promise<Program[]> => {
    const { data } = await $host.get<Program[]>('api/program/published');
    return data;
};

// Получить все черновые программы
export const getAllDraftPrograms = async (): Promise<Program[]> => {
    const { data } = await $host.get<Program[]>('api/program/draft');
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

// ---------- Themes ----------

// Получить одну тему
export const getOneTheme = async (id: number): Promise<Theme> => {
    const { data } = await $authHost.get<Theme>(`api/program/theme/${id}`);
    return data;
};

// Создать тему
export const createTheme = async (programId: number): Promise<Theme> => {
    const { data } = await $authHost.post<Theme>(`api/program/${programId}/themes`);
    return data;
};

// Обновить название темы
export const updateThemeTitle = async (themeId: number, title: string): Promise<{ id: number; title: string }> => {
    const { data } = await $authHost.patch(`api/program/theme/${themeId}`, { title });
    return data;
};

// Добавить файл к теме
export const addFileToTheme = async (themeId: number, formData: FormData): Promise<{ success: boolean; file: File; fileAsset?: any }> => {
    const { data } = await $authHost.post(`api/program/theme/${themeId}/files`, formData);
    return data;
};

// Удалить тему
export const deleteTheme = async (themeId: number): Promise<{ success: boolean; message: string }> => {
    const { data } = await $authHost.delete(`api/program/theme/${themeId}`);
    return data;
};

// ---------- Puncts ----------

// Получить один пункт
export const getOnePunct = async (id: number): Promise<Punct> => {
    const { data } = await $authHost.get<Punct>(`api/program/punct/${id}`);
    return data;
};

// Создать пункт
export const createPunct = async (themeId: number): Promise<Punct> => {
    const { data } = await $authHost.post(`api/program/theme/${themeId}/puncts`);
    return data;
};

// Обновить название пункта
export const updatePunctTitle = async (punctId: number, title: string): Promise<{ id: number; title: string }> => {
    const { data } = await $authHost.patch(`api/program/punct/${punctId}`, { title });
    return data;
};

// Добавить файл к пункту
export const addFileToPunct = async (punctId: number, formData: FormData): Promise<{ success: boolean; file: File; fileAsset?: any }> => {
    const { data } = await $authHost.post(`api/program/punct/${punctId}/files`, formData);
    return data;
};

// Удалить пункт
export const deletePunct = async (punctId: number): Promise<{ success: boolean; message: string }> => {
    const { data } = await $authHost.delete(`api/program/punct/${punctId}`);
    return data;
};

// Переместить пункт
export const movePunct = async (
    id: number,
    newIndex: number,
    themeId: number
): Promise<{ success: boolean }> => {
    const { data } = await $authHost.post(`api/program/punct/move/${id}`, {
        newIndex,
        themeId
    });
    return data;
};

// ---------- Files ----------

export const updateFileName = async (
    fileId: number,
    original_name: string
): Promise<File> => {
    const { data } = await $authHost.patch<File>(
        `api/program/file/${fileId}`,
        { original_name }
    );
    return data;
};

// Удалить файл
export const deleteFile = async (fileId: number): Promise<{ success: boolean; message: string }> => {
    const { data } = await $authHost.delete(`api/program/file/${fileId}`);
    return data;
};


export const moveFile = async (
    id: number,
    newIndex: number,
    targetType: 'theme' | 'punct',
    targetId: number
): Promise<{ success: boolean; file: any }> => {
    const { data } = await $authHost.post(`api/program/file/${id}/move`, {
        newIndex,
        targetType,
        targetId,
    });
    return data;
};