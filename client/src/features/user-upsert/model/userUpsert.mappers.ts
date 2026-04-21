import type {
    AdminFormDefaultValues,
    ListenerFormDefaultValues,
} from './types';

type BackendUser = {
    login?: string | null;
    name?: string | null;
    email?: string | null;
    number?: string | null;
    organization?: string | null;
    inn?: string | null;
    address?: string | null;
    diplom?: boolean | null;
    passport?: string | null;
    education_document?: string | null;
    snils?: string | null;
    admin_signature?: string | null;
    role?: 'ADMIN' | 'VIEWER' | 'USER' | null;
    programs?: Array<{ id: number }>;
};

export function createEmptyListenerDefaults(): ListenerFormDefaultValues {
    return {
        login: '',
        name: '',
        email: '',
        password: '',
        number: '',
        organization: '',
        inn: '',
        address: '',
        diplom: false,
        passport: '',
        education_document: '',
        snils: '',
        programIds: [],
    };
}

export function createEmptyAdminDefaults(): AdminFormDefaultValues {
    return {
        login: '',
        name: '',
        email: '',
        password: '',
        number: '',
        role: 'ADMIN',
        admin_signature: '',
    };
}

export function mapUserToListenerDefaults(user: BackendUser): ListenerFormDefaultValues {
    return {
        login: user.login || '',
        name: user.name || '',
        email: user.email || '',
        password: '',
        number: user.number || '',
        organization: user.organization || '',
        inn: user.inn || '',
        address: user.address || '',
        diplom: Boolean(user.diplom),
        passport: user.passport || '',
        education_document: user.education_document || '',
        snils: user.snils || '',
        programIds: Array.isArray(user.programs) ? user.programs.map((p) => p.id) : [],
    };
}

export function mapUserToAdminDefaults(user: BackendUser): AdminFormDefaultValues {
    return {
        login: user.login || '',
        name: user.name || '',
        email: user.email || '',
        password: '',
        number: user.number || '',
        role: user.role === 'VIEWER' ? 'VIEWER' : 'ADMIN',
        admin_signature: user.admin_signature || '',
    };
}

function emptyToNull(value: string): string | null {
    const normalized = value.trim();
    return normalized ? normalized : null;
}

function normalizeLogin(value: string): string {
    return value.trim().toLowerCase();
}

export function buildCreateListenerPayload(values: ListenerFormDefaultValues) {
    return {
        login: normalizeLogin(values.login),
        email: emptyToNull(values.email),
        temporary_password: values.password.trim(),
        role: 'USER',
        name: values.name.trim(),
        number: emptyToNull(values.number),
        organization: emptyToNull(values.organization),
        programs_id: values.programIds,
        diplom: values.diplom,
        inn: emptyToNull(values.inn),
        address: emptyToNull(values.address),
        passport: emptyToNull(values.passport),
        education_document: emptyToNull(values.education_document),
        snils: emptyToNull(values.snils),
    };
}

export function buildUpdateListenerPayload(
    id: number,
    values: ListenerFormDefaultValues
) {
    return {
        id,
        login: normalizeLogin(values.login),
        email: emptyToNull(values.email),
        password: values.password.trim() || undefined,
        role: 'USER',
        name: values.name.trim(),
        number: emptyToNull(values.number),
        organization: emptyToNull(values.organization),
        programs_id: values.programIds,
        diplom: values.diplom,
        inn: emptyToNull(values.inn),
        address: emptyToNull(values.address),
        passport: emptyToNull(values.passport),
        education_document: emptyToNull(values.education_document),
        snils: emptyToNull(values.snils),
    };
}

export function buildCreateAdminPayload(values: AdminFormDefaultValues) {
    return {
        login: normalizeLogin(values.login),
        email: emptyToNull(values.email),
        password: values.password.trim(),
        role: values.role,
        name: values.name.trim(),
        number: emptyToNull(values.number),
        admin_signature: emptyToNull(values.admin_signature),
    };
}

export function buildUpdateAdminPayload(
    id: number,
    values: AdminFormDefaultValues
) {
    return {
        id,
        login: normalizeLogin(values.login),
        email: emptyToNull(values.email),
        password: values.password.trim() || undefined,
        role: values.role,
        name: values.name.trim(),
        number: emptyToNull(values.number),
        admin_signature: emptyToNull(values.admin_signature),
    };
}