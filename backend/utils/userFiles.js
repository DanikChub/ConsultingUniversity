const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const STATIC_DIR = path.resolve(__dirname, "..", "static");
const USER_DOCS_DIR = path.resolve(STATIC_DIR, "user-documents");

if (!fs.existsSync(STATIC_DIR)) {
    fs.mkdirSync(STATIC_DIR, { recursive: true });
}

if (!fs.existsSync(USER_DOCS_DIR)) {
    fs.mkdirSync(USER_DOCS_DIR, { recursive: true });
}

function decodeOriginalFilename(name = "") {
    try {
        return Buffer.from(name, "latin1").toString("utf8");
    } catch {
        return name;
    }
}

function sanitizeOriginalFilename(name = "") {
    return decodeOriginalFilename(name)
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
        .trim();
}

function safeFilename(originalName = "file") {
    const ext =
        originalName && originalName.includes(".")
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

module.exports = {
    STATIC_DIR,
    USER_DOCS_DIR,
    decodeOriginalFilename,
    sanitizeOriginalFilename,
    safeFilename,
    saveSingleFile,
};