import { Program } from "../../program/model/type";

interface ProgramWithProgress extends Program {
    progress: number | null; // сервер может прислать null
}

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
    organization?: string | null;
    inn?: string | null;
    statistic?: number | null;
    graduation_date?: string | null; // ISO date string
    forgot_pass_code?: string | null;

    // дополнительные поля, которые фронт может ожидать
    yellow_value?: string; // используется в поиске подсветки
    createdAt?:string;
    programs?: ProgramWithProgress[]
  }

// User для этой страницы
export interface UserWithProgress {
    id: number;
    email?: string | null;
    number?: string | null;
    name: string;
    password?: string | null;
    role?: string; // "USER" | "ADMIN" | ...
    programs_id: number[]; // DataTypes.ARRAY(DataTypes.INTEGER)
    diplom?: boolean | null;
    address?: string | null;
    organization?: string | null;
    inn?: string | null;
    statistic?: number | null;
    graduation_date?: string | null; // ISO date string
    forgot_pass_code?: string | null;

    yellow_value?: string; // используется в поиске подсветки
    createdAt?:string;
    programs: ProgramWithProgress[]; // используем расширенный тип
}


export interface UsersAPIResponse {
    count: number;
    rows: User[];
}

export interface PaginationItem {
    number: number;
    class: string;
}