import { $authHost } from "../../../shared/api/axios";
import type { Punct } from "../model/type";

// ---------- Puncts ----------

export const getOnePunct = async (punctId: number): Promise<Punct> => {
    const { data } = await $authHost.get<Punct>(
        `api/program/puncts/${punctId}`
    );

    return data;
};

export const createPunct = async (themeId: number): Promise<Punct> => {
    const { data } = await $authHost.post<Punct>(
        `api/program/themes/${themeId}/puncts`
    );

    return data;
};

export const updatePunctTitle = async (
    punctId: number,
    title: string
): Promise<{ id: number; title: string }> => {
    const { data } = await $authHost.patch<{ id: number; title: string }>(
        `api/program/puncts/${punctId}`,
        { title }
    );

    return data;
};

export const updatePunctDescription = async (
    punctId: number,
    description: string
): Promise<{ id: number; description: string }> => {
    const { data } = await $authHost.patch<{
        id: number;
        description: string;
    }>(`api/program/puncts/${punctId}/description`, {
        description,
    });

    return data;
};

export const deletePunct = async (
    punctId: number
): Promise<{ success: boolean; message: string }> => {
    const { data } = await $authHost.delete<{
        success: boolean;
        message: string;
    }>(`api/program/puncts/${punctId}`);

    return data;
};

export const movePunct = async (
    punctId: number,
    newIndex: number,
    themeId: number
): Promise<{ success: boolean }> => {
    const { data } = await $authHost.post<{ success: boolean }>(
        `api/program/puncts/${punctId}/move`,
        {
            newIndex,
            themeId,
        }
    );

    return data;
};