import { $authHost, $host } from "../../../shared/api/axios";
import type { UserDocument } from "../model/type";

export const login = async (login: string, password: string) => {
    const { data } = await $host.post("api/user/login", { login, password });
    localStorage.setItem("token", data.token);
    return data;
};

export const check = async () => {
    const { data } = await $authHost.get("api/user/auth");
    localStorage.setItem("token", data.token);
    return data;
};

export const setInitialPassword = async (newPassword: string) => {
    const { data } = await $authHost.patch("api/user/initial-password", {
        newPassword,
    });

    localStorage.setItem("token", data.token);
    return data;
};

export const forgotPassword = async (email: string) => {
    const { data } = await $host.post("api/user/forgot-password", { email });
    return data;
};

export const checkForgotPassword = async (
    email: string,
    code: string,
    pass: string
) => {
    const { data } = await $host.post("api/user/forgot-password/check", {
        email,
        code,
        pass,
    });

    return data;
};

// ---------- Listeners ----------

export const getUserById = async (userId: number) => {
    const { data } = await $authHost.get(`api/user/listeners/${userId}`);
    return data;
};

export const getAllUsers = async () => {
    const { data } = await $authHost.get("api/user/listeners");
    return data;
};

export const getAllUsersGraduation = async () => {
    const { data } = await $authHost.get("api/user/listeners/graduation");
    return data;
};

export const searchUsers = async (page: number, q: string) => {
    const { data } = await $authHost.get(
        `api/user/listeners/search/${page}?q=${q}`
    );

    return data;
};

export const getAllUsersWithPage = async (
    page: number,
    sort_type: string,
    sort_down: boolean
) => {
    const { data } = await $authHost.get(
        `api/user/listeners/page/${page}?sort_type=${sort_type}&sort_down=${sort_down}`
    );

    return data;
};

export interface UserPayload {
    id?: number;
    login: string;
    email?: string | null;
    password?: string;
    role?: string;
    name: string;
    number?: string | null;
    organization?: string | null;
    programs_id: number[];
    diplom?: boolean | null;
    inn?: string | null;
    address?: string | null;
    passport?: string | null;
    education_document?: string | null;
    snils?: string | null;
}

export const registrateUser = async (payload: UserPayload) => {
    const { data } = await $authHost.post("api/user/registration", payload);
    return data;
};

export const remakeUser = async (payload: UserPayload) => {
    const { data } = await $authHost.patch("api/user/listeners", payload);
    return data;
};

export const deleteUser = async (id: number) => {
    const { data } = await $authHost.delete("api/user/listeners", {
        data: { id },
    });

    return data;
};

export const setUserProfileImg = async (formData: FormData) => {
    const { data } = await $authHost.post(
        "api/user/listeners/profile-img",
        formData
    );

    return data;
};

export const setGraduationDate = async (
    id: number,
    graduation_date: string
) => {
    const { data } = await $authHost.patch(
        "api/user/listeners/graduation-date",
        {
            id,
            graduation_date,
        }
    );

    return data;
};

// ---------- Admins ----------

export const getAllAdmins = async () => {
    const { data } = await $authHost.get("api/user/admins");
    return data;
};

export const registrateAdmin = async (
    login: string,
    email: string | null,
    password: string,
    role: string,
    name: string,
    number: string,
    admin_signature?: string | null
) => {
    const { data } = await $authHost.post("api/user/registration-admin", {
        login,
        email,
        password,
        role,
        name,
        number,
        admin_signature,
    });

    return data;
};

export const remakeAdmin = async (
    id: number | string,
    login: string,
    email: string | null,
    password: string,
    role: string,
    name: string,
    number: string,
    admin_signature?: string | null
) => {
    const { data } = await $authHost.patch("api/user/admins", {
        id,
        login,
        email,
        password,
        role,
        name,
        number,
        admin_signature,
    });

    return data;
};

// ---------- Documents ----------

export interface AddUserDocumentsResponse {
    message: string;
    documents: UserDocument[];
}

export interface DeleteUserDocumentResponse {
    message: string;
}

export const addUserDocuments = async (
    userId: number,
    files: File[]
): Promise<AddUserDocumentsResponse> => {
    const formData = new FormData();

    files.forEach(file => {
        formData.append("documents", file);
    });

    const { data } = await $authHost.post<AddUserDocumentsResponse>(
        `api/user/listeners/${userId}/documents`,
        formData
    );

    return data;
};

export const getUserDocuments = async (
    userId: number
): Promise<UserDocument[]> => {
    const { data } = await $authHost.get<UserDocument[]>(
        `api/user/listeners/${userId}/documents`
    );

    return data;
};

export const deleteUserDocument = async (
    documentId: number
): Promise<DeleteUserDocumentResponse> => {
    const { data } = await $authHost.delete<DeleteUserDocumentResponse>(
        `api/user/listeners/documents/${documentId}`
    );

    return data;
};

export interface UpdateUserDocumentPayload {
    original_name?: string;
    document_type?: string | null;
}

export interface UpdateUserDocumentResponse {
    message: string;
    document: UserDocument;
}

export const updateUserDocument = async (
    documentId: number,
    payload: UpdateUserDocumentPayload
): Promise<UpdateUserDocumentResponse> => {
    const { data } = await $authHost.patch<UpdateUserDocumentResponse>(
        `api/user/listeners/documents/${documentId}`,
        payload
    );

    return data;
};

// ---------- Listener field editing ----------

export type EditableListenerField =
    | "name"
    | "email"
    | "number"
    | "organization"
    | "inn"
    | "address"
    | "passport"
    | "education_document"
    | "snils";

export interface EditableListenerFieldInfo {
    key: EditableListenerField;
    label: string;
    required: boolean;
    maxLength?: number;
}

export interface UpdateListenerFieldPayload {
    field: EditableListenerField;
    value: string | null;
}

export interface UpdateListenerFieldResponse {
    message: string;
    field: EditableListenerField;
    oldValue: string | null;
    value: string | null;
    user: any;
}

export const getEditableListenerFields = async (): Promise<
    EditableListenerFieldInfo[]
> => {
    const { data } = await $authHost.get<EditableListenerFieldInfo[]>(
        "api/user/listeners/editable-fields"
    );

    return data;
};

export const updateListenerField = async (
    userId: number,
    payload: UpdateListenerFieldPayload
): Promise<UpdateListenerFieldResponse> => {
    const { data } = await $authHost.patch<UpdateListenerFieldResponse>(
        `api/user/listeners/${userId}/field`,
        payload
    );

    return data;
};



// ---------- Admin users registry ----------

export type AdminUsersDeletedFilter = "active" | "deleted" | "all";
export type AdminUsersHasProgramFilter = "all" | "yes" | "no";
export type AdminUsersEnrollmentStatus =
    | "all"
    | "active"
    | "completed"
    | "archived"
    | "paused";

export type AdminUsersSortField =
    | "id"
    | "name"
    | "email"
    | "number"
    | "organization"
    | "createdAt"
    | "updatedAt";

export type AdminUsersSortDirection = "ASC" | "DESC";

export interface GetAdminUsersListParams {
    page?: number;
    limit?: number;
    search?: string;
    deleted?: AdminUsersDeletedFilter;
    hasProgram?: AdminUsersHasProgramFilter;
    programId?: number | string;
    enrollmentStatus?: AdminUsersEnrollmentStatus;
    createdFrom?: string;
    createdTo?: string;
    completedFrom?: string;
    completedTo?: string;
    sortField?: AdminUsersSortField;
    sortDirection?: AdminUsersSortDirection;
}

export interface AdminUserProgram {
    id: number;
    title: string;
    short_title?: string | null;
    img?: string | null;
    progress: number | null;
    enrollment?: {
        id: number;
        status: "active" | "completed" | "archived" | "paused";
        progress_percent: number;
        started_at?: string | null;
        completed_at?: string | null;
    };
}

export interface AdminUserListItem {
    id: number;
    login: string;
    name: string;
    email?: string | null;
    number?: string | null;
    organization?: string | null;
    role: string;
    img?: string | null;
    is_delete: boolean;
    must_change_password: boolean;
    temporary_password_plain?: string | null;
    createdAt: string;
    updatedAt: string;
    programs: AdminUserProgram[];
}

export interface GetAdminUsersListResponse {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    rows: AdminUserListItem[];
}

export const getAdminUsersList = async (
    params: GetAdminUsersListParams = {}
): Promise<GetAdminUsersListResponse> => {
    const { data } = await $authHost.get<GetAdminUsersListResponse>(
        "api/user/listeners/admin",
        {
            params: {
                page: params.page ?? 1,
                limit: params.limit ?? 10,
                search: params.search ?? "",
                deleted: params.deleted ?? "active",
                hasProgram: params.hasProgram ?? "all",
                programId: params.programId || undefined,
                enrollmentStatus: params.enrollmentStatus ?? "all",
                createdFrom: params.createdFrom || undefined,
                createdTo: params.createdTo || undefined,
                completedFrom: params.completedFrom || undefined,
                completedTo: params.completedTo || undefined,
                sortField: params.sortField ?? "createdAt",
                sortDirection: params.sortDirection ?? "DESC",
            },
        }
    );

    return data;
};

export const softDeleteUser = async (userId: number) => {
    const { data } = await $authHost.delete(`api/user/listeners/${userId}`);
    return data;
};

export const restoreUser = async (userId: number) => {
    const { data } = await $authHost.patch(
        `api/user/listeners/${userId}/restore`
    );

    return data;
};