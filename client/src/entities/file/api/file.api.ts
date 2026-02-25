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

// ---------- Upload file with progress ----------
export const uploadFile = (
    file: File,
    type: string,
    targetType: 'theme' | 'punct',
    targetId: number,
    onProgress?: (percent: number) => void
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('targetType', targetType);
        formData.append('targetId', `${targetId}`);

        const xhr = new XMLHttpRequest();
        xhr.open(
            'POST',
            `${process.env.REACT_APP_API_URL}api/program/file`
        );

        // если нужен токен
        const token = localStorage.getItem('token');
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.response);
                resolve(response.file);
            } else {
                reject(xhr.response);
            }
        };

        xhr.onerror = () => reject(xhr.response);

        xhr.send(formData);
    });
};

// ---------- Add video ----------
export const createVideoFile = async (
    url: string,
    targetType: 'theme' | 'punct',
    targetId: number
): Promise<File> => {
    const { data } = await $authHost.post(
        `api/program/file`,
        {
            targetType,
            targetId,
            type: 'video',
            url,
        }
    );

    return data.file;
};
