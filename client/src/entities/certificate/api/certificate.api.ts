// entities/certificate/api/certificate.api.ts

import { $authHost } from "../../../shared/api/axios";
import type { Certificate, CertificateStatus } from "../model/types";


// 📌 Получить все
export const getCertificates = async (
    status?: CertificateStatus
): Promise<Certificate[]> => {
    const { data } = await $authHost.get<Certificate[]>("api/certificates", {
        params: status ? { status } : undefined,
    });
    return data;
};


// 📌 Получить один
export const getCertificate = async (
    id: number
): Promise<Certificate> => {
    const { data } = await $authHost.get<Certificate>(`api/certificates/${id}`);
    return data;
};


// 📌 Создать
export const createCertificate = async (
    enrollmentId: number
): Promise<Certificate> => {
    const { data } = await $authHost.post<Certificate>("api/certificates", {
        enrollmentId,
    });
    return data;
};


// 📌 Обновить статус
export const updateCertificateStatus = async (
    id: number,
    status: CertificateStatus
): Promise<Certificate> => {
    const { data } = await $authHost.patch<Certificate>(
        `api/certificates/${id}/status`,
        { status }
    );
    return data;
};


// 📌 Указать почтовую доставку
export const setCertificatePostDelivery = async (
    id: number,
    address: string
): Promise<Certificate> => {
    const { data } = await $authHost.patch<Certificate>(
        `api/certificates/${id}/post`,
        { address }
    );
    return data;
};


// 📌 Самовывоз
export const setCertificatePickup = async (
    id: number
): Promise<Certificate> => {
    const { data } = await $authHost.patch<Certificate>(
        `api/certificates/${id}/pickup`
    );
    return data;
};


// 📌 Отметить отправленным
export const markCertificateShipped = async (
    id: number,
    tracking_number: string
): Promise<Certificate> => {
    const { data } = await $authHost.patch<Certificate>(
        `api/certificates/${id}/shipped`,
        { tracking_number }
    );
    return data;
};


// 📌 Отметить доставленным
export const markCertificateDelivered = async (
    id: number
): Promise<Certificate> => {
    const { data } = await $authHost.patch<Certificate>(
        `api/certificates/${id}/delivered`
    );
    return data;
};


// 📌 Удалить
export const deleteCertificate = async (
    id: number
): Promise<{ message: string }> => {
    const { data } = await $authHost.delete<{ message: string }>(
        `api/certificates/${id}`
    );
    return data;
};

// 📌 Полное редактирование диплома
export const updateCertificate = async (
    id: number,
    payload: Partial<Certificate>
): Promise<Certificate> => {
    const { data } = await $authHost.patch<Certificate>(
        `api/certificates/${id}`,
        payload
    );
    return data;
};