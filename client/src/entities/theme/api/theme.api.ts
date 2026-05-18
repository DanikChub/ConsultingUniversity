import { $authHost } from "../../../shared/api/axios";
import type { Theme } from "../model/type";
import type { File as ProgramFile } from "../model/type";

// ---------- Themes ----------

export const getOneTheme = async (themeId: number): Promise<Theme> => {
    const { data } = await $authHost.get<Theme>(
        `api/program/themes/${themeId}`
    );

    return data;
};

export const createTheme = async (programId: number): Promise<Theme> => {
    const { data } = await $authHost.post<Theme>(
        `api/program/${programId}/themes`
    );

    return data;
};

export const updateThemeTitle = async (
    themeId: number,
    title: string
): Promise<{ id: number; title: string }> => {
    const { data } = await $authHost.patch<{ id: number; title: string }>(
        `api/program/themes/${themeId}`,
        { title }
    );

    return data;
};

export const deleteTheme = async (
    themeId: number
): Promise<{ success: boolean; message: string }> => {
    const { data } = await $authHost.delete<{
        success: boolean;
        message: string;
    }>(`api/program/themes/${themeId}`);

    return data;
};

