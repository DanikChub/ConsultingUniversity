import { Program } from "./program";

export interface User {
    id: number;
    email?: string | null;
    number?: string | null;
    name: string;
    password?: string | null;
    role?: string; // "USER" | "ADMIN" | ...
    programs_id: number[]; // DataTypes.ARRAY(DataTypes.INTEGER)
    diplom?: boolean | null;
    address?: string | null;
    organiztion?: string | null;
    inn?: string | null;
    statistic?: number | null;
    graduation_date?: string | null; // ISO date string
    forgot_pass_code?: string | null;
    well_videos?: number;
    well_tests?: number;
    well_practical_works?: number;
    // дополнительные поля, которые фронт может ожидать
    yellow_value?: string; // используется в поиске подсветки
    createdAt?:string;
    program?:Program
  }


export interface UsersAPIResponse {
    count: number;
    rows: User[];
}

export interface PaginationItem {
    number: number;
    class: string;
}