export const normalizeLogin = (value: string) => {
    return value
        .replace(/[^a-zA-Z0-9@._-]/g, "")
        .trim();
};

export const normalizeName = (value: string) => {
    return value
        .replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, "")
        .replace(/\s+/g, " ")
        .replace(/^\s/, "");
};

export const normalizePhone = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
        digits = "7" + digits.slice(1);
    }

    if (!digits.startsWith("7") && digits.length > 0) {
        digits = "7" + digits;
    }

    digits = digits.slice(0, 11);

    if (digits.length === 0) return "";

    let result = "+7";

    if (digits.length > 1) {
        result += " (" + digits.slice(1, 4);
    }

    if (digits.length >= 4) {
        result += ") " + digits.slice(4, 7);
    }

    if (digits.length >= 7) {
        result += "-" + digits.slice(7, 9);
    }

    if (digits.length >= 9) {
        result += "-" + digits.slice(9, 11);
    }

    return result;
};

export const isValidRuPhone = (value: string) => {
    return value.replace(/\D/g, "").length === 11;
};

export const isValidEmail = (value: string) => {
    if (!value.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};