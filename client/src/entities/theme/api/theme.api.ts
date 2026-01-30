// ---------- Themes ----------

// Получить одну тему
import type {Theme} from "../model/type";
import {$authHost} from "../../../shared/api/axios";

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
