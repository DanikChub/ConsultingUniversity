import {$authHost, $host} from "../../../shared/api/axios";
import { jwtDecode } from "jwt-decode";
import type {UserDocument} from "../model/type";


export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const forgotPassword = async (email) => {
    const {data} = await $host.post('api/user/forgot_password', {email})

    return data
}

export const checkForgotPassword = async (email, code, pass) => {
    const {data} = await $host.post('api/user/check_forgot_password', {email, code, pass})

    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getUserById = async (id) => {
    const {data} = await $authHost.get(`api/user/getUser/${id}`)
    
    return data;
}

export const getAllUsers = async () => {
    const {data} = await $authHost.get(`api/user/getUser/`)
    
    return data;
}

export const getUsersWithLastMessages = async () => {
    const {data} = await $authHost.get(`api/user/getUsersWithLastMessages/`)
    
    return data;
}

export const getAllUsersGraduation = async () => {
    const {data} = await $authHost.get(`api/user/getAllUsersGraduation/`)
    
    return data;
}

export const getAllAdmins = async () => {
    const {data} = await $authHost.get(`api/user/getAdmins/`)
    
    return data;
}

export const searchUsers = async (page, q) => {
    const {data} = await $authHost.get(`api/user/search/${page}?q=${q}`)
    
    return data;
}

export const getAllUsersWithPage = async (page, sort_type, sort_down) => {
    const {data} = await $authHost.get(`api/user/getAllUser/${page}?sort_type=${sort_type}&sort_down=${sort_down}`)
    
    return data;
}


export const registrateAdmin = async (
    email: string,
    password: string,
    role: string,
    name: string,
    number: string,
    admin_signature?: string | null
) => {
    const { data } = await $authHost.post('api/user/registrationAdmin', {
        email,
        password,
        role,
        name,
        number,
        admin_signature
    });

    return data;
};

export const remakeAdmin = async (
    id: number | string,
    email: string,
    password: string,
    role: string,
    name: string,
    number: string,
    admin_signature?: string | null
) => {
    const { data } = await $authHost.post('api/user/remakeAdmin', {
        id,
        email,
        password,
        role,
        name,
        number,
        admin_signature
    });

    return data;
};



export interface UserPayload {
    id?: number;
    email: string;
    password?: string;
    role?: string;
    name: string;
    number: string;
    organization?: string | null;
    programs_id: number[];
    diplom?: boolean | null;
    inn?: string | null;
    address?: string | null;

    passport?: string | null;
    education_document?: string | null;
    snils?: string | null;
}

export interface AddUserDocumentsResponse {
    message: string;
    documents: UserDocument[];
}

export interface DeleteUserDocumentResponse {
    message: string;
}

export const registrateUser = async (payload: UserPayload) => {
    const { data } = await $authHost.post("api/user/registration", payload);
    return data;
};

export const remakeUser = async (payload: UserPayload) => {
    const { data } = await $authHost.post("api/user/remake", payload);
    return data;
};

export const addUserDocuments = async (
    userId: number,
    files: File[]
): Promise<AddUserDocumentsResponse> => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("documents", file);
    });

    const { data } = await $authHost.post(
        `api/user/addUserDocuments/${userId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};

export const deleteUserDocument = async (
    documentId: number
): Promise<DeleteUserDocumentResponse> => {
    const { data } = await $authHost.post(
        `api/user/deleteUserDocument/${documentId}`
    );

    return data;
};

export const getUserDocuments = async (
    userId: number
): Promise<UserDocument[]> => {
    const { data } = await $authHost.get(`api/user/getUserDocuments/${userId}`);
    return data;
};

export const deleteUser = async (id) => {
    const {data} = await $authHost.post('api/user/delete', {id})

    return data
}


export const setUserProfileImg = async (formdata) => {
    const {data} = await $host.post('api/user/setUserProfileImg', formdata)

    return data
}