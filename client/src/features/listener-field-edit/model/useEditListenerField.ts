import { useState } from "react";
import {
    updateListenerField,
    type EditableListenerField,
} from "../../../entities/user/api/user.api";

import {
    isValidEmail,
    isValidRuPhone,
    normalizeName,
    normalizePhone,
} from "../../../shared/lib/normalize/userNormalize";

interface OpenEditFieldPayload {
    field: EditableListenerField;
    label: string;
    value: string | null;
    multiline?: boolean;
}

interface UseEditListenerFieldParams {
    userId: number;
    onSuccess: (field: EditableListenerField, value: string | null) => void;
}

const transformByField: Partial<Record<EditableListenerField, (value: string) => string>> = {
    number: normalizePhone,
    name: normalizeName,
};

const validateByField: Partial<Record<EditableListenerField, (value: string) => string | null>> = {
    name: value => {
        if (!value.trim()) return "ФИО обязательно";
        if (value.trim().length < 3) return "ФИО слишком короткое";
        return null;
    },
    email: value => {
        if (!isValidEmail(value)) return "Некорректный email";
        return null;
    },
    number: value => {
        if (!value.trim()) return null;
        if (!isValidRuPhone(value)) return "Телефон должен быть в формате +7 (___) ___-__-__";
        return null;
    },
};

export const useEditListenerField = ({
                                         userId,
                                         onSuccess,
                                     }: UseEditListenerFieldParams) => {
    const [opened, setOpened] = useState(false);
    const [field, setField] = useState<EditableListenerField | null>(null);
    const [label, setLabel] = useState("");
    const [value, setValueRaw] = useState("");
    const [multiline, setMultiline] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setValue = (nextValue: string) => {
        if (field && transformByField[field]) {
            setValueRaw(transformByField[field]!(nextValue));
            return;
        }

        setValueRaw(nextValue);
    };

    const openEditField = (payload: OpenEditFieldPayload) => {
        setField(payload.field);
        setLabel(payload.label);

        const startValue = payload.value || "";
        const transform = transformByField[payload.field];

        setValueRaw(transform ? transform(startValue) : startValue);

        setMultiline(Boolean(payload.multiline));
        setError("");
        setOpened(true);
    };

    const closeEditField = () => {
        if (loading) return;

        setOpened(false);
        setField(null);
        setLabel("");
        setValueRaw("");
        setError("");
        setMultiline(false);
    };

    const submitEditField = async () => {
        if (!field) return;

        const validate = validateByField[field];
        const validationError = validate?.(value);

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const normalizedValue = value.trim() === "" ? null : value.trim();

            const result = await updateListenerField(userId, {
                field,
                value: normalizedValue,
            });

            onSuccess(field, result.value);
            closeEditField();
        } catch (e: any) {
            setError(
                e?.response?.data?.message ||
                e?.message ||
                "Ошибка изменения поля"
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        opened,
        field,
        label,
        value,
        multiline,
        loading,
        error,

        setValue,
        openEditField,
        closeEditField,
        submitEditField,
    };
};