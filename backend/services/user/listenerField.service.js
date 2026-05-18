const ApiError = require("../../error/ApiError");
const { User, Event } = require("../../models/models");

const ALLOWED_LISTENER_FIELDS = {
    name: {
        label: "ФИО",
        type: "string",
        required: true,
        maxLength: 255,
    },
    email: {
        label: "Email",
        type: "string",
        required: false,
        maxLength: 255,
    },
    number: {
        label: "Телефон",
        type: "string",
        required: false,
        maxLength: 50,
    },
    organization: {
        label: "Организация",
        type: "string",
        required: false,
        maxLength: 255,
    },
    inn: {
        label: "ИНН",
        type: "string",
        required: false,
        maxLength: 50,
    },
    address: {
        label: "Адрес",
        type: "string",
        required: false,
        maxLength: 500,
    },
    passport: {
        label: "Паспорт",
        type: "string",
        required: false,
        maxLength: 1000,
    },
    education_document: {
        label: "Документ об образовании",
        type: "string",
        required: false,
        maxLength: 1000,
    },
    snils: {
        label: "СНИЛС",
        type: "string",
        required: false,
        maxLength: 50,
    },
};

function normalizeValue(value) {
    if (value === undefined) return undefined;
    if (value === null) return null;

    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? null : trimmed;
    }

    return value;
}

function validateFieldValue(field, value) {
    const config = ALLOWED_LISTENER_FIELDS[field];

    if (!config) {
        throw ApiError.badRequest("Это поле нельзя редактировать");
    }

    const normalizedValue = normalizeValue(value);

    if (config.required && !normalizedValue) {
        throw ApiError.badRequest(`Поле "${config.label}" обязательно`);
    }

    if (
        normalizedValue !== null &&
        normalizedValue !== undefined &&
        typeof normalizedValue !== config.type
    ) {
        throw ApiError.badRequest(`Некорректное значение поля "${config.label}"`);
    }

    if (
        typeof normalizedValue === "string" &&
        config.maxLength &&
        normalizedValue.length > config.maxLength
    ) {
        throw ApiError.badRequest(
            `Поле "${config.label}" не может быть длиннее ${config.maxLength} символов`
        );
    }

    if (field === "email" && normalizedValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedValue)) {
            throw ApiError.badRequest("Некорректный email");
        }
    }

    return normalizedValue;
}

class ListenerFieldService {
    async updateListenerField({ userId, field, value }) {
        if (!userId) {
            throw ApiError.badRequest("Не указан пользователь");
        }

        if (!field) {
            throw ApiError.badRequest("Не указано поле");
        }

        const normalizedValue = validateFieldValue(field, value);

        const user = await User.findOne({
            where: {
                id: userId,
                role: "USER",
            },
        });

        if (!user) {
            throw ApiError.notFound("Слушатель не найден");
        }

        const oldValue = user[field];

        if (oldValue === normalizedValue) {
            return {
                message: "Значение не изменилось",
                field,
                value: normalizedValue,
                user,
            };
        }

        user[field] = normalizedValue;
        await user.save();

        await Event.create({
            event_text: `Изменено поле слушателя: ${ALLOWED_LISTENER_FIELDS[field].label}`,
            name: user.name,
            organization: user.organization,
            type: "user",
            event_id: user.id,
        });

        return {
            message: "Поле успешно обновлено",
            field,
            oldValue,
            value: normalizedValue,
            user,
        };
    }

    getAllowedFields() {
        return Object.entries(ALLOWED_LISTENER_FIELDS).map(([key, config]) => ({
            key,
            label: config.label,
            required: config.required,
            maxLength: config.maxLength,
        }));
    }
}

module.exports = new ListenerFieldService();