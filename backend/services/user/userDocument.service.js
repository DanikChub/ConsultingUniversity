const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const ApiError = require("../../error/ApiError");
const { User, UserDocument } = require("../../models/models");
const {
    STATIC_DIR,
    USER_DOCS_DIR,
    sanitizeOriginalFilename,
} = require("../../utils/userFiles");

class UserDocumentService {
    async addUserDocuments({ userId, documents }) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        if (!documents) {
            throw ApiError.badRequest("Файлы не переданы");
        }

        if (!fs.existsSync(USER_DOCS_DIR)) {
            fs.mkdirSync(USER_DOCS_DIR, { recursive: true });
        }

        const uploaded = Array.isArray(documents) ? documents : [documents];

        const allowedMimes = [
            "image/png",
            "image/jpeg",
            "application/pdf",
        ];

        const createdDocuments = [];

        for (const file of uploaded) {
            if (!allowedMimes.includes(file.mimetype)) {
                throw ApiError.badRequest(
                    "Допустимы только файлы PNG, JPG, PDF"
                );
            }

            const originalName = sanitizeOriginalFilename(file.name);
            const ext = path.extname(file.name);
            const fileName = `${uuid.v4()}${ext}`;
            const savePath = path.join(USER_DOCS_DIR, fileName);

            await file.mv(savePath);

            const createdDoc = await UserDocument.create({
                userId: user.id,
                original_name: originalName,
                file_name: fileName,
                file_path: `user-documents/${fileName}`,
                mime_type: file.mimetype,
                size: file.size,
            });

            createdDocuments.push(createdDoc);
        }

        return {
            message: "Документы загружены",
            documents: createdDocuments,
        };
    }

    async deleteUserDocument(documentId) {
        const document = await UserDocument.findByPk(documentId);

        if (!document) {
            throw ApiError.badRequest("Документ не найден");
        }

        if (document.file_path) {
            const filePath = path.join(STATIC_DIR, document.file_path);

            try {
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                }
            } catch (err) {
                console.warn(
                    "Не удалось удалить файл документа:",
                    filePath,
                    err
                );
            }
        }

        await document.destroy();

        return {
            message: "Документ удалён",
        };
    }

    async getUserDocuments(userId) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        return UserDocument.findAll({
            where: {
                userId,
            },
            order: [["createdAt", "DESC"]],
        });
    }

    async updateUserDocument(documentId, payload) {
        const document = await UserDocument.findByPk(documentId);

        if (!document) {
            throw ApiError.badRequest("Документ не найден");
        }

        const { original_name, document_type } = payload;

        if (original_name !== undefined) {
            const trimmedName = String(original_name).trim();

            if (!trimmedName) {
                throw ApiError.badRequest("Название документа не может быть пустым");
            }

            document.original_name = trimmedName;
        }

        if (document_type !== undefined) {
            const trimmedType = String(document_type).trim();
            document.document_type = trimmedType || null;
        }

        await document.save();

        return {
            message: "Документ обновлен",
            document,
        };
    }


}

module.exports = new UserDocumentService();