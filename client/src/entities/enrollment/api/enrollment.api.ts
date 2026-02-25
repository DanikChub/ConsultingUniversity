import {$authHost, $host} from "../../../shared/api/axios";


export interface Enrollment {
    id: number;
    userId: number;
    programId: number;
    status: 'active' | 'completed' | 'canceled';
    createdAt: string;
    updatedAt: string;
}

/**
 * Получить enrollment по programId для текущего пользователя
 */
export const getEnrollmentByProgram = async (programId: number, userId: number): Promise<Enrollment> => {
    try {
        const {data} = await $authHost.post<Enrollment>(`/api/enrollment/getEnrollment/${programId}`, {userId} );
        return data;
    } catch (error: any) {
        console.error("Error fetching enrollment:", error?.response?.data || error.message);
        throw error;
    }
};



export const getAllEnrollmentsByProgram = async (programId: number): Promise<Enrollment[]> => {
    try {
        const {data} = await $authHost.get<Enrollment[]>(`/api/enrollment/getEnrollment/${programId}`);
        return data;
    } catch (error: any) {
        console.error("Error fetching enrollment:", error?.response?.data || error.message);
        throw error;
    }
};