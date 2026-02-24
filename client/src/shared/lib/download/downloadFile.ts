import type {File as FileType} from "../../../entities/file/model/type";


type DownloadParams = {
    url: string;
    filename: string;
};

export const downloadFile = async ({ url, filename }: DownloadParams) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        const blob = this.response;
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        link.click();
    };
    xhr.send();
};