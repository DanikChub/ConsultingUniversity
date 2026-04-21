import { z } from 'zod';

const nullableStringField = z.string().trim();

const baseListenerSchema = z.object({
    login: z
        .string()
        .trim()
        .min(1, 'Укажите логин')
        .max(50, 'Логин слишком длинный')
        .regex(/^[a-z0-9._-]+$/i, 'Логин может содержать только буквы, цифры, ".", "_" и "-"'),

    name: z
        .string()
        .trim()
        .min(1, 'Укажите ФИО')
        .refine((value) => value.split(/\s+/).filter(Boolean).length === 3, {
            message: 'Введите Фамилию Имя Отчество',
        }),

    email: z.string().trim().optional().or(z.literal('')),
    password: z.string(),

    number: nullableStringField,
    organization: nullableStringField,
    inn: nullableStringField,
    address: nullableStringField,
    diplom: z.boolean(),
    passport: nullableStringField,
    education_document: nullableStringField,
    snils: nullableStringField,

    programIds: z.array(z.number()).min(1, 'Выберите программу'),
});

export const listenerCreateSchema = baseListenerSchema.extend({
    password: z.string().trim().min(1, 'Укажите временный пароль'),
});

export const listenerEditSchema = baseListenerSchema.extend({
    password: z.string().optional().or(z.literal('')),
});

const baseAdminSchema = z.object({
    login: z
        .string()
        .trim()
        .min(1, 'Укажите логин')
        .max(50, 'Логин слишком длинный')
        .regex(/^[a-z0-9._-]+$/i, 'Логин может содержать только буквы, цифры, ".", "_" и "-"'),

    name: z
        .string()
        .trim()
        .min(1, 'Укажите ФИО')
        .refine((value) => value.split(/\s+/).filter(Boolean).length === 3, {
            message: 'Введите Фамилию Имя Отчество',
        }),

    email: z.string().trim().optional().or(z.literal('')),
    password: z.string(),
    number: nullableStringField,
    role: z.enum(['ADMIN', 'VIEWER']),
    admin_signature: nullableStringField,
});

export const adminCreateSchema = baseAdminSchema.extend({
    password: z.string().trim().min(1, 'Укажите пароль'),
});

export const adminEditSchema = baseAdminSchema.extend({
    password: z.string().optional().or(z.literal('')),
});

export type ListenerCreateSchema = z.infer<typeof listenerCreateSchema>;
export type ListenerEditSchema = z.infer<typeof listenerEditSchema>;
export type AdminCreateSchema = z.infer<typeof adminCreateSchema>;
export type AdminEditSchema = z.infer<typeof adminEditSchema>;