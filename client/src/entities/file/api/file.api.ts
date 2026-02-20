import { $authHost, $host } from "../../../shared/api/axios";
import { File } from "../model/type";
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

export const getFile = async (id: string): Promise<File> => {
    const { data } = await $authHost.get(`api/program/file/${id}`);
    return data;
};