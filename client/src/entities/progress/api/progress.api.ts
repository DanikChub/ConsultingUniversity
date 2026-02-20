// entities/progress/api/progress.api.ts
import { $authHost, $host } from "../../../shared/api/axios";
import type {ContentProgress, ContentType, ProgramProgress, ProgressStatus} from "../model/type";

export interface UpdateProgressDto {
    enrollmentId: number
    contentType: ContentType
    contentId: number
    status: ProgressStatus
    score?: number
}



/**
 * Обновить прогресс конкретного контента
 */
export const updateProgress = async (
    dto: UpdateProgressDto
): Promise<ContentProgress> => {
    try {
        const { data } = await $authHost.put<ContentProgress>("/api/progress", dto);
        return data;
    } catch (error: any) {
        console.error("Ошибка обновления прогресса:", error?.response?.data || error.message);
        throw new Error("Ошибка обновления прогресса");
    }
};

/**
 * Получить весь прогресс по enrollmentId
 */
export const getEnrollmentProgress = async (enrollmentId: number): Promise<ProgramProgress> => {
    try {
        const { data } = await $authHost.get<ProgramProgress>(`/api/progress/${enrollmentId}`);
        return data;
    } catch (error: any) {
        console.error("Ошибка получения прогресса:", error?.response?.data || error.message);
        throw new Error("Ошибка получения прогресса");
    }
};

