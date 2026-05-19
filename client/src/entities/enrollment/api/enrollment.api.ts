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
    started_at: string | null;
    completed_at: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EnrollmentResponse {
    message: string;
    enrollment: Enrollment;
}

// ---------- Current user ----------

export const getMyEnrollmentByProgram = async (
    programId: number
): Promise<Enrollment> => {
    const { data } = await $authHost.get<Enrollment>(
        `/api/enrollment/programs/${programId}/me`
    );

    return data;
};

// ---------- Admin reads ----------

export const getEnrollmentByProgram = async (
    programId: number
): Promise<Enrollment[]> => {
    const { data } = await $authHost.get<Enrollment[]>(
        `/api/enrollment/programs/${programId}`
    );

    return data;
};

export const getEnrollmentsByUser = async (
    userId: number
): Promise<Enrollment[]> => {
    const { data } = await $authHost.get<Enrollment[]>(
        `/api/enrollment/users/${userId}`
    );

    return data;
};

// ---------- Admin actions ----------

export const createEnrollment = async (
    userId: number,
    programId: number
): Promise<EnrollmentResponse> => {
    const { data } = await $authHost.post<EnrollmentResponse>(
        `/api/enrollment`,
        {
            userId,
            programId,
        }
    );

    return data;
};

export const updateEnrollmentStatus = async (
    enrollmentId: number,
    status: EnrollmentStatus
): Promise<EnrollmentResponse> => {
    const { data } = await $authHost.patch<EnrollmentResponse>(
        `/api/enrollment/${enrollmentId}/status`,
        { status }
    );

    return data;
};

export const updateEnrollmentProgress = async (
    enrollmentId: number,
    progress_percent: number
): Promise<EnrollmentResponse> => {
    const { data } = await $authHost.patch<EnrollmentResponse>(
        `/api/enrollment/${enrollmentId}/progress`,
        { progress_percent }
    );

    return data;
};

export const archiveEnrollment = async (
    enrollmentId: number
): Promise<EnrollmentResponse> => {
    const { data } = await $authHost.patch<EnrollmentResponse>(
        `/api/enrollment/${enrollmentId}/archive`
    );

    return data;
};

export const restoreEnrollment = async (
    enrollmentId: number
): Promise<EnrollmentResponse> => {
    const { data } = await $authHost.patch<EnrollmentResponse>(
        `/api/enrollment/${enrollmentId}/restore`
    );

    return data;
};

export const deleteEnrollment = async (
    enrollmentId: number
): Promise<EnrollmentResponse> => {
    const { data } = await $authHost.delete<EnrollmentResponse>(
        `/api/enrollment/${enrollmentId}`
    );

    return data;
};