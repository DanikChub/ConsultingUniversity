const path = require("path");
const fs = require("fs");
const util = require("node:util");
const yauzl = require("yauzl");

const ApiError = require("../../error/ApiError");
const sequelize = require("../../db");

const {
    Program,
    Theme,
    Punct,
    File,
    FileAsset,
} = require("../../models/models");

const {
    STATIC_DIR,
    safeFilename,
} = require("../../utils/fileStorage");

const { convertDocxToHtmlIfExists } = require("../../utils/docx");
const { getNextOrderIndex } = require("../../utils/order");
const programQueryService = require("./programQuery.service");

const writeFileAsync = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);

class ProgramImportService {
    async importProgramZip({ programId, zipFile, resetProgram }) {
        if (!zipFile) {
            throw ApiError.badRequest("No zip uploaded");
        }

        const tmpDir = path.join(__dirname, "../../tmp");

        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const tmpPath = path.join(tmpDir, zipFile.name);

        await zipFile.mv(tmpPath);

        const themeMap = new Map();
        const punctMap = new Map();

        const getOrCreateTheme = async themeName => {
            if (themeMap.has(themeName)) {
                return themeMap.get(themeName);
            }

            const order_index = await getNextOrderIndex(Theme, { programId });

            const theme = await Theme.create({
                programId,
                title: themeName,
                order_index,
            });

            themeMap.set(themeName, theme.id);
            return theme.id;
        };

        const getOrCreatePunct = async (themeId, punctName) => {
            const key = `${themeId}-${punctName}`;

            if (punctMap.has(key)) {
                return punctMap.get(key);
            }

            const order_index = await getNextOrderIndex(Punct, { themeId });

            const punct = await Punct.create({
                themeId,
                title: punctName,
                order_index,
            });

            punctMap.set(key, punct.id);
            return punct.id;
        };

        try {
            if (resetProgram) {
                await sequelize.transaction(async transaction => {
                    await Theme.destroy({
                        where: { programId },
                        transaction,
                    });
                });
            }

            await this.processZip({
                tmpPath,
                getOrCreateTheme,
                getOrCreatePunct,
            });

            await unlinkAsync(tmpPath);

            return await programQueryService.getProgramFull(programId);
        } catch (e) {
            try {
                if (fs.existsSync(tmpPath)) {
                    await unlinkAsync(tmpPath);
                }
            } catch (_) {}

            console.error("importProgramZip error:", e);
            throw ApiError.internal("Failed to import zip");
        }
    }

    async processZip({ tmpPath, getOrCreateTheme, getOrCreatePunct }) {
        await new Promise((resolve, reject) => {
            yauzl.open(tmpPath, { lazyEntries: true }, (err, zip) => {
                if (err) return reject(err);

                zip.readEntry();

                zip.on("entry", async entry => {
                    try {
                        await this.processEntry({
                            zip,
                            entry,
                            getOrCreateTheme,
                            getOrCreatePunct,
                        });

                        zip.readEntry();
                    } catch (e) {
                        zip.close();
                        reject(e);
                    }
                });

                zip.on("end", resolve);
                zip.on("error", reject);
            });
        });
    }

    async processEntry({ zip, entry, getOrCreateTheme, getOrCreatePunct }) {
        return await new Promise((resolve, reject) => {
            if (/\/$/.test(entry.fileName)) {
                return resolve();
            }

            const parts = entry.fileName.split("/").filter(Boolean);

            if (parts.length < 3) {
                return resolve();
            }

            const themeName = parts[1];
            const fileName = parts[parts.length - 1];
            const storedName = safeFilename(fileName);
            const fullPath = path.join(STATIC_DIR, storedName);

            const isThemeFile = parts.length === 3;
            const isPunctFile = parts.length >= 4;
            const punctName = isPunctFile ? parts[2] : null;

            zip.openReadStream(entry, async (err, readStream) => {
                if (err) return reject(err);

                try {
                    const themeId = await getOrCreateTheme(themeName);
                    let punctId = null;

                    if (isPunctFile && punctName) {
                        punctId = await getOrCreatePunct(themeId, punctName);
                    }

                    const chunks = [];

                    readStream.on("data", chunk => chunks.push(chunk));

                    readStream.on("end", async () => {
                        try {
                            const buffer = Buffer.concat(chunks);
                            await writeFileAsync(fullPath, buffer);

                            const ext = fileName.split(".").pop()?.toLowerCase();

                            const EXTENSION_MAP = {
                                docx: "docx",
                                pdf: "pdf",
                                mp3: "audio",
                                wav: "audio",
                                ogg: "audio",
                            };

                            const type = EXTENSION_MAP[ext || ""];

                            if (!type) {
                                return resolve();
                            }

                            const whereOrder = isPunctFile
                                ? { punctId }
                                : { themeId, punctId: null };

                            const order_index = await getNextOrderIndex(File, whereOrder);

                            const fileRecord = await File.create({
                                original_name: fileName,
                                stored_name: storedName,
                                mime_type: "application/octet-stream",
                                size: buffer.length,
                                storage: "local",
                                type,
                                themeId: isThemeFile ? themeId : null,
                                punctId: isPunctFile ? punctId : null,
                                order_index,
                                status: "idle",
                            });

                            if (type === "docx") {
                                const html = await convertDocxToHtmlIfExists(storedName);

                                if (html) {
                                    await FileAsset.create({
                                        fileId: fileRecord.id,
                                        type: "html",
                                        content: html,
                                    });
                                }
                            }

                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}

module.exports = new ProgramImportService();