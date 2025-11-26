class ApiError extends Error {
    constructor(status, message, errors = null, code = null) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;   // массив или объект доп. ошибок
        this.code = code;       // строковый код ошибки, например "VALIDATION_ERROR"
    }

    static badRequest(message, errors = null, code = "BAD_REQUEST") {
        return new ApiError(400, message, errors, code);
    }

    static notFound(message, errors = null, code = "NOT_FOUND") {
        return new ApiError(404, message, errors, code);
    }

    static internal(message = "Internal server error", errors = null, code = "INTERNAL_ERROR") {
        return new ApiError(500, message, errors, code);
    }

    static forbidden(message, errors = null, code = "FORBIDDEN") {
        return new ApiError(403, message, errors, code);
    }

    static unauthorized(message, errors = null, code = "UNAUTHORIZED") {
        return new ApiError(401, message, errors, code);
    }

    static conflict(message, errors = null, code = "CONFLICT") {
        return new ApiError(409, message, errors, code);
    }

    // Автоматическая JSON-версия ошибки (для удобства)
    toJSON() {
        return {
            status: this.status,
            message: this.message,
            code: this.code,
            errors: this.errors
        };
    }
}

module.exports = ApiError;