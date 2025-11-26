import { $authHost, $host } from "./index";
import { Program, Theme, Punct } from "../types/program";

// Получить одну программу
export const getOneProgram = async (id: number): Promise<Program> => {
    const { data } = await $authHost.get<Program>(`api/program/${id}`);
    return data;
};

// Получить один пункт
export const getOnePunct = async (id: number): Promise<Punct> => {
    const { data } = await $authHost.get<Punct>(`api/program/punct/${id}`);
    return data;
};

// Получить одну тему
export const getOneTheme = async (id: number): Promise<Theme> => {
    const { data } = await $authHost.get<Theme>(`api/program/theme/${id}`);
    return data;
};

// Создать программу
export const createProgram = async (formData: FormData): Promise<Program> => {
    const { data } = await $authHost.post<Program>(`api/program/`, formData);
    return data;
};

// Обновить программу
export const remakeProgram = async (formData: FormData): Promise<Program> => {
    const { data } = await $authHost.post<Program>(`api/program/remake`, formData);
    return data;
};

// Удалить программу
export const deleteProgram = async (id: number): Promise<{ message: string }> => {
    const { data } = await $authHost.post<{ message: string }>(
        `api/program/delete`,
        { id }
    );
    return data;
};

// Получить все программы
export const getAllPrograms = async (): Promise<Program[]> => {
    const { data } = await $authHost.get<Program[]>(`api/program/`);
    return data;
};