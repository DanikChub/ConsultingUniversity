import { $authHost } from "../../../shared/api/axios";

export type EnrollmentStatus =
    | "active"
    | "paused"
    | "completed"
    | "archived";

export interface Enrollment {
    id: number;
    userId: number;
    programId: number;

    status: EnrollmentStatus;

    progress_percent: number;
    started_at: string;
    completed_at: string | null;

    createdAt: string;
    updatedAt: string;
}

/**
 * Получить enrollment по programId и userId
 */
export const getEnrollmentByProgram = async (
    programId: number,
    userId: number
): Promise<Enrollment> => {
    const { data } = await $authHost.post<Enrollment>(
        `/api/enrollment/getEnrollment/${programId}`,
        { userId }
    );

    return data;
};

/**
 * Получить все enrollment по программе
 */
export const getAllEnrollmentsByProgram = async (
    programId: number
): Promise<Enrollment[]> => {
    const { data } = await $authHost.get<Enrollment[]>(
        `/api/enrollment/getEnrollment/${programId}`
    );

    return data;
};

/**
 * Получить все enrollment конкретного пользователя
 */
export const getEnrollmentsByUser = async (
    userId: number
): Promise<Enrollment[]> => {
    const { data } = await $authHost.get<Enrollment[]>(
        `/api/enrollment/user/${userId}`
    );

    return data;
};

/**
 * Изменить статус enrollment
 */
export const updateEnrollmentStatus = async (
    enrollmentId: number,
    status: EnrollmentStatus
): Promise<Enrollment> => {
    const { data } = await $authHost.patch<Enrollment>(
        `/api/enrollment/${enrollmentId}/status`,
        { status }
    );

    return data;
};

/**
 * Изменить прогресс enrollment
 */
export const updateEnrollmentProgress = async (
    enrollmentId: number,
    progress_percent: number
): Promise<Enrollment> => {
    const { data } = await $authHost.patch<Enrollment>(
        `/api/enrollment/${enrollmentId}/progress`,
        { progress_percent }
    );

    return data;
};

/**
 * Удалить enrollment
 */
export const deleteEnrollment = async (
    enrollmentId: number
): Promise<{ message: string }> => {
    const { data } = await $authHost.delete<{ message: string }>(
        `/api/enrollment/${enrollmentId}`
    );

    return data;
};