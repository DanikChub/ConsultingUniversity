const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const STATIC_DIR = path.resolve(__dirname, "..", "static");

if (!fs.existsSync(STATIC_DIR)) {
    fs.mkdirSync(STATIC_DIR, { recursive: true });
}

function safeFilename(originalName = "file") {
    const ext = originalName.includes(".")
        ? "." + originalName.split(".").pop()
        : "";

    return uuid.v4() + ext;
}

async function saveSingleFile(file) {
    if (!file) return null;

    const filename = safeFilename(file.name || "file");
    const fullPath = path.join(STATIC_DIR, filename);

    await new Promise((resolve, reject) => {
        file.mv(fullPath, err => (err ? reject(err) : resolve()));
    });

    return filename;
}

async function deleteStaticFile(filename) {
    if (!filename) return;

    const fullPath = path.join(STATIC_DIR, filename);

    if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
    }
}

async function cloneStaticFile(filename, copiedFiles = []) {
    if (!filename) return null;

    const sourcePath = path.join(STATIC_DIR, filename);

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Исходный файл не найден: ${filename}`);
    }

    const ext = path.extname(filename);
    const newFilename = `${uuid.v4()}${ext}`;
    const targetPath = path.join(STATIC_DIR, newFilename);

    await fs.promises.copyFile(sourcePath, targetPath);
    copiedFiles.push(newFilename);

    return newFilename;
}

module.exports = {
    STATIC_DIR,
    safeFilename,
    saveSingleFile,
    deleteStaticFile,
    cloneStaticFile,
};