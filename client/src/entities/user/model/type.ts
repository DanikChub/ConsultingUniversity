import { Program } from "../../program/model/type";

interface ProgramWithProgress extends Program {
    progress: number | null;
}

export interface UserDocument {
    id: number;
    userId?: number;
    original_name: string;
    file_name: string;
    file_path: string;
    mime_type?: string | null;
    size?: number | null;
    document_type?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    id: number;
    login: string;
    email?: string | null;
    number?: string | null;
    name: string;
    password?: string | null;
    role?: string;
    programs_id: number[];
    diplom?: boolean | null;
    address?: string | null;
    organization?: string | null;
    inn?: string | null;
    statistic?: number | null;
    graduation_date?: string | null;
    forgot_pass_code?: string | null;
    img: string;

    passport?: string | null;
    education_document?: string | null;
    snils?: string | null;
    documents?: UserDocument[];


    temporary_password_plain?: string | null;
    temporary_password_hash?: string | null;
    must_change_password?: boolean;
    admin_signature?: string | null;

    yellow_value?: string;
    createdAt?: string;
    programs?: ProgramWithProgress[];
}

export interface UserWithProgress {
    id: number;
    login: string;
    email?: string | null;
    number?: string | null;
    name: string;
    password?: string | null;
    role?: string;
    programs_id: number[];
    diplom?: boolean | null;
    address?: string | null;
    organization?: string | null;
    inn?: string | null;
    statistic?: number | null;
    graduation_date?: string | null;
    forgot_pass_code?: string | null;

    passport?: string | null;
    education_document?: string | null;
    snils?: string | null;
    documents?: UserDocument[];

    temporary_password_plain?: string | null;
    temporary_password_hash?: string | null;
    must_change_password?: boolean;
    admin_signature?: string | null;

    yellow_value?: string;
    createdAt?: string;
    programs: ProgramWithProgress[];
}

export interface UsersAPIResponse {
    count: number;
    rows: User[];
}

export interface PaginationItem {
    number: number;
    class: string;
}