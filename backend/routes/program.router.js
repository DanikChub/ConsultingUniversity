const Router = require("express");
const router = new Router();

const ProgramController = require("../controllers/program.controller");

const checkRole = require("../middleware/checkRoleMiddleware");
const checkProgramAccess = require("../middleware/checkProgramAccess");
const checkFileAccess = require("../middleware/checkFileAccess");
const authMiddleware = require("../middleware/authMiddleware");

// ---------- Programs collection ----------
router.post(
    "/",
    checkRole("ADMIN"),
    ProgramController.create
);

router.get(
    "/",
    checkRole(["ADMIN", "VIEWER"]),
    ProgramController.getAll
);

router.get(
    "/published",
    checkRole(["ADMIN", "VIEWER"]),
    ProgramController.getAllPublishedPrograms
);

router.get(
    "/draft",
    checkRole(["ADMIN", "VIEWER"]),
    ProgramController.getAllDraftPrograms
);

// ---------- Program actions ----------
router.post(
    "/:programId/import",
    checkRole("ADMIN"),
    ProgramController.importProgramZip
);

router.post(
    "/:programId/duplicate",
    checkRole("ADMIN"),
    ProgramController.duplicateProgram
);

router.post(
    "/:programId/publish",
    checkRole("ADMIN"),
    ProgramController.publishProgram
);

router.patch(
    "/:programId/img",
    checkRole("ADMIN"),
    ProgramController.updateImage
);

router.delete(
    "/:programId/img",
    checkRole("ADMIN"),
    ProgramController.destroyImage
);

// ---------- Program themes ----------
router.post(
    "/:programId/themes",
    checkRole("ADMIN"),
    ProgramController.createTheme
);

// ---------- Themes ----------
router.get(
    "/themes/:themeId",
    ProgramController.getOneTheme
);

router.patch(
    "/themes/:themeId",
    checkRole("ADMIN"),
    ProgramController.updateThemeTitle
);

router.delete(
    "/themes/:themeId",
    checkRole("ADMIN"),
    ProgramController.deleteTheme
);

// ---------- Theme puncts ----------
router.post(
    "/themes/:themeId/puncts",
    checkRole("ADMIN"),
    ProgramController.createPunct
);

// ---------- Puncts ----------
router.get(
    "/puncts/:punctId",
    ProgramController.getOnePunct
);

router.patch(
    "/puncts/:punctId",
    checkRole("ADMIN"),
    ProgramController.updatePunctTitle
);

router.patch(
    "/puncts/:punctId/description",
    checkRole("ADMIN"),
    ProgramController.updatePunctDescription
);

router.post(
    "/puncts/:punctId/move",
    checkRole("ADMIN"),
    ProgramController.movePunct
);

router.delete(
    "/puncts/:punctId",
    checkRole("ADMIN"),
    ProgramController.deletePunct
);

// ---------- Files ----------
router.post(
    "/files",
    checkRole("ADMIN"),
    ProgramController.addFileToPunctOrTheme
);

router.get(
    "/files/:fileId",
    authMiddleware,
    checkFileAccess,
    ProgramController.getFile
);

router.patch(
    "/files/:fileId",
    checkRole("ADMIN"),
    ProgramController.updateFileName
);

router.post(
    "/files/:fileId/move",
    checkRole("ADMIN"),
    ProgramController.moveFile
);

router.delete(
    "/files/:fileId",
    checkRole("ADMIN"),
    ProgramController.deleteFile
);

// ---------- Dynamic program routes — always last ----------
router.get(
    "/:programId",
    authMiddleware,
    checkProgramAccess,
    ProgramController.getOne
);

router.patch(
    "/:programId",
    checkRole("ADMIN"),
    ProgramController.updatePartial
);

router.delete(
    "/:programId",
    checkRole("ADMIN"),
    ProgramController.deleteProgram
);

module.exports = router;