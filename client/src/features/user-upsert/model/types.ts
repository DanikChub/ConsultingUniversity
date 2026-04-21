import type { UserDocument } from '../../../entities/user/model/type';

export type UserUpsertMode =
    | 'create-listener'
    | 'edit-listener'
    | 'create-admin'
    | 'edit-admin';

export type ProgramOption = {
    id: number;
    title: string;
    short_title?: string | null;
};

export type ListenerFormValues = {
    login: string;
    name: string;
    email: string;
    password: string;
    number: string;
    organization: string;
    inn: string;
    address: string;
    diplom: boolean;
    passport: string;
    education_document: string;
    snils: string;
    programIds: number[];
};

export type AdminFormValues = {
    login: string;
    name: string;
    email: string;
    password: string;
    number: string;
    role: 'ADMIN' | 'VIEWER';
    admin_signature: string;
};

export type ListenerFormDefaultValues = ListenerFormValues;
export type AdminFormDefaultValues = AdminFormValues;

export type UserUpsertPageData = {
    mode: UserUpsertMode;
    isEdit: boolean;
    isAdmin: boolean;
    loading: boolean;
    programOptions: ProgramOption[];
    existingDocuments: UserDocument[];
    currentProfileImg: string | null;
    listenerDefaultValues: ListenerFormDefaultValues;
    adminDefaultValues: AdminFormDefaultValues;
};