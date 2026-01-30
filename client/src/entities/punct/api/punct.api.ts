import { $authHost, $host } from "../../../shared/api/axios";
import type {Punct} from "../model/type";

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
