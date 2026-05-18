import { $authHost } from "../../../shared/api/axios";
import type { File as ProgramFile } from "../model/type";

// ---------- Files ----------

export type ProgramFileTargetType = "theme" | "punct";
export type ProgramFileType = "docx" | "pdf" | "audio" | "video";

export const updateFileName = async (
    fileId: number,
    original_name: string
): Promise<{ file: ProgramFile }> => {
    const { data } = await $authHost.patch<{ file: ProgramFile }>(
        `api/program/files/${fileId}`,
        { original_name }
    );

    return data;
};

export const deleteFile = async (
    fileId: number
): Promise<{ success: boolean; message: string }> => {
    const { data } = await $authHost.delete<{
        success: boolean;
        message: string;
    }>(`api/program/files/${fileId}`);

    return data;
};

export const moveFile = async (
    fileId: number,
    newIndex: number,
    targetType: ProgramFileTargetType,
    targetId: number
): Promise<{ success: boolean; item: ProgramFile }> => {
    const { data } = await $authHost.post<{ success: boolean; item: ProgramFile }>(
        `api/program/files/${fileId}/move`,
        {
            newIndex,
            targetType,
            targetId,
        }
    );

    return data;
};

export const getFile = async (fileId: string | number): Promise<ProgramFile> => {
    const { data } = await $authHost.get<ProgramFile>(
        `api/program/files/${fileId}`
    );

    return data;
};

export const uploadFile = (
    file: File,
    type: ProgramFileType,
    targetType: ProgramFileTargetType,
    targetId: number,
    onProgress?: (percent: number) => void
): Promise<ProgramFile> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("type", type);
        formData.append("targetType", targetType);
        formData.append("targetId", String(targetId));

        const xhr = new XMLHttpRequest();

        xhr.open(
            "POST",
            `${process.env.REACT_APP_API_URL}api/program/files`
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
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.file);
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

export const createVideoFile = async (
    url: string,
    targetType: ProgramFileTargetType,
    targetId: number
): Promise<ProgramFile> => {
    const { data } = await $authHost.post<{
        success: boolean;
        file: ProgramFile;
    }>("api/program/files", {
        targetType,
        targetId,
        type: "video",
        url,
    });

    return data.file;
};