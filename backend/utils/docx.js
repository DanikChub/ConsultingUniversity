const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");
const { STATIC_DIR } = require("./fileStorage");

async function convertDocxToHtmlIfExists(filename) {
    if (!filename) return "";

    const fullPath = path.join(STATIC_DIR, filename);

    try {
        const stats = fs.statSync(fullPath);

        if (!stats || stats.size === 0) {
            return "";
        }
    } catch (e) {
        return "";
    }

    try {
        const result = await mammoth.convertToHtml({ path: fullPath });
        return result?.value || "";
    } catch (e) {
        console.error("Mammoth conversion failed:", filename, e.message || e);
        return "";
    }
}

module.exports = {
    convertDocxToHtmlIfExists,
};