import type {File as FileType} from "../../../entities/file/model/type";


type DownloadParams = {
    url: string;
    filename: string;
};

export const downloadFile = async ({ url, filename }: DownloadParams) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);
};