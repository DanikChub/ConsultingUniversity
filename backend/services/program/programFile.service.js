const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const sequelize = require("../../db");
const ApiError = require("../../error/ApiError");

const { Program, File, FileAsset } = require("../../models/models");

const {
    STATIC_DIR,
    safeFilename,
    saveSingleFile,
    deleteStaticFile,
} = require("../../utils/fileStorage");

const { convertDocxToHtmlIfExists } = require("../../utils/docx");
const { getNextOrderIndex, moveOrderedItem } = require("../../utils/order");

const ALLOWED_FILE_TYPES = ["docx", "pdf", "audio", "video"];

const typeExtensions = {
    docx: ["docx"],
    pdf: ["pdf"],
    audio: ["mp3", "wav", "ogg"],
};

class ProgramFileService {
    async updateProgramImage(programId, file) {
        const program = await Program.findByPk(programId);

        if (!program) {
            throw ApiError.notFound("Программа не найдена");
        }

        if (!file) {
            throw ApiError.badRequest("Файл не передан");
        }

        const imgSaved = await saveSingleFile(file);

        if (program.img) {
            await deleteStaticFile(program.img);
        }

        program.status = "draft";
        program.img = imgSaved;
        await program.save();

        return {
            img: program.img,
            message: "Картинка обновлена",
        };
    }

    async deleteProgramImage(programId) {
        const program = await Program.findByPk(programId);

        if (!program) {
            throw ApiError.notFound("Программа не найдена");
        }

        if (program.img) {
            await deleteStaticFile(program.img);
        }

        program.status = "draft";
        program.img = null;
        await program.save();

        return {
            img: null,
            message: "Картинка удалена",
        };
    }

    async addFileToPunctOrTheme({ body, files }) {
        const { targetType, targetId, type, url } = body;

        if (!targetType || !targetId) {
            throw ApiError.badRequest("targetType and targetId are required");
        }

        if (!["theme", "punct"].includes(targetType)) {
            throw ApiError.badRequest("Invalid targetType");
        }

        if (!ALLOWED_FILE_TYPES.includes(type)) {
            throw ApiError.badRequest("Invalid type");
        }

        const orderWhere =
            targetType === "punct"
                ? { punctId: targetId }
                : { themeId: targetId, punctId: null };

        const order_index = await getNextOrderIndex(File, orderWhere);

        if (type === "video") {
            if (!url) {
                throw ApiError.badRequest("Video url required");
            }

            const videoRecord = await File.create({
                original_name: "Видео",
                stored_name: null,
                mime_type: null,
                type: "video",
                size: null,
                url,
                storage: "s3",
                themeId: targetType === "theme" ? targetId : null,
                punctId: targetType === "punct" ? targetId : null,
                order_index,
                status: "idle",
            });

            return {
                success: true,
                file: videoRecord,
            };
        }

        if (!files || Object.keys(files).length === 0) {
            throw ApiError.badRequest("No files uploaded");
        }

        const fileKey = Object.keys(files)[0];
        const file = files[fileKey];

        const ext = file.name.split(".").pop().toLowerCase();

        if (!typeExtensions[type]?.includes(ext)) {
            throw ApiError.badRequest(`File extension .${ext} does not match type ${type}`);
        }

        const originalName = Buffer.from(file.name, "latin1").toString("utf8");

        const tempFileRecord = await File.create({
            original_name: originalName,
            stored_name: "",
            mime_type: file.mimetype,
            size: file.size,
            storage: "local",
            type,
            themeId: targetType === "theme" ? targetId : null,
            punctId: targetType === "punct" ? targetId : null,
            order_index,
            status: "uploading",
        });

        const storedName = safeFilename(file.name);
        const fullPath = path.join(STATIC_DIR, storedName);

        try {
            await new Promise((resolve, reject) => {
                file.mv(fullPath, err => (err ? reject(err) : resolve()));
            });

            await tempFileRecord.update({
                stored_name: storedName,
                status: "idle",
            });
        } catch (err) {
            await tempFileRecord.update({ status: "error" });
            throw ApiError.internal("File save failed");
        }

        if (type === "docx") {
            const htmlContent = await convertDocxToHtmlIfExists(storedName);

            if (htmlContent) {
                await FileAsset.create({
                    fileId: tempFileRecord.id,
                    type: "html",
                    content: htmlContent,
                });
            }
        }

        const fullFile = await File.findByPk(tempFileRecord.id, {
            include: [FileAsset],
        });

        return {
            success: true,
            file: fullFile,
        };
    }

    async updateFileName(fileId, originalName) {
        if (!originalName) {
            throw ApiError.badRequest("original_name is required");
        }

        const file = await File.findByPk(fileId);

        if (!file) {
            throw ApiError.notFound("File not found");
        }

        file.original_name = originalName;
        await file.save();

        return { file };
    }

    async deleteFile(fileId) {
        const file = await File.findByPk(fileId);

        if (!file) {
            throw ApiError.notFound("Файл не найден");
        }

        await file.destroy();

        return {
            success: true,
            message: "Файл успешно удалён",
        };
    }

    async getFile(fileId) {
        console.log('второе', fileId)
        const file = await File.findByPk(fileId, {
            include: [FileAsset],
        });

        if (!file) {
            throw ApiError.notFound("Файл не найден");
        }

        return file;
    }

    async moveFile({ fileId, newIndex, targetType, targetId }) {
        if (!fileId || newIndex === undefined || !targetType || !targetId) {
            throw ApiError.badRequest("fileId, newIndex, targetType and targetId are required");
        }

        let parentWhere;

        if (targetType === "punct") {
            parentWhere = { punctId: targetId };
        } else if (targetType === "theme") {
            parentWhere = { themeId: targetId, punctId: null };
        } else {
            throw ApiError.badRequest("Invalid targetType");
        }

        return await moveOrderedItem({
            Model: File,
            itemId: fileId,
            parentWhere,
            newIndex,
        });
    }
}

module.exports = new ProgramFileService();