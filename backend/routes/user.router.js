const Router = require("express");
const router = new Router();

const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

// ---------- Auth ----------
router.post("/registration", checkRole("ADMIN"), UserController.registration);
router.post("/registration-admin", UserController.registrationAdmin);

router.post("/login", UserController.login);
router.get("/auth", authMiddleware, UserController.check);

router.patch("/initial-password", authMiddleware, UserController.setInitialPassword);

router.post("/forgot-password", UserController.forgotPassword);
router.post("/forgot-password/check", UserController.checkForgotPassword);

// ---------- Admin users ----------
router.get("/admins", checkRole("ADMIN"), UserController.getAllAdmins);
router.patch("/admins", checkRole("ADMIN"), UserController.remakeAdmin);

// ---------- Listeners collection ----------
router.get("/listeners", checkRole(["ADMIN", "VIEWER"]), UserController.getAllUsers);
router.get("/listeners/graduation", checkRole(["ADMIN", "VIEWER"]), UserController.getAllUsersGraduation);
router.get("/listeners/page/:page", checkRole(["ADMIN", "VIEWER"]), UserController.getAllUsersWithPage);
router.get("/listeners/search/:page", checkRole(["ADMIN", "VIEWER"]), UserController.searchUsers);

router.post("/listeners/profile-img", authMiddleware, UserController.setUserProfileImg);

// ---------- Listener documents ----------
router.delete(
    "/listeners/documents/:documentId",
    authMiddleware,
    UserController.deleteUserDocument
);

router.patch(
    "/listeners/documents/:documentId",
    authMiddleware,
    UserController.updateUserDocument
);

router.get(
    "/listeners/:userId/documents",
    authMiddleware,
    UserController.getUserDocuments
);

router.post(
    "/listeners/:userId/documents",
    authMiddleware,
    UserController.addUserDocuments
);

// ---------- Listener actions ----------
router.patch("/listeners", checkRole("ADMIN"), UserController.remakeUser);
router.patch("/listeners/graduation-date", checkRole("ADMIN"), UserController.setGraduationDate);
router.delete("/listeners", checkRole("ADMIN"), UserController.deleteUser);

// ---------- Listener field editing ----------
router.get(
    "/listeners/editable-fields",
    checkRole(["ADMIN", "VIEWER"]),
    UserController.getEditableListenerFields
);

router.patch(
    "/listeners/:userId/field",
    checkRole("ADMIN"),
    UserController.updateListenerField
);


// ---------- Admin users registry ----------
router.get(
    "/listeners/admin",
    checkRole(["ADMIN", "VIEWER"]),
    UserController.getAdminUsersList
);

router.delete(
    "/listeners/:userId",
    checkRole("ADMIN"),
    UserController.softDeleteUser
);

router.patch(
    "/listeners/:userId/restore",
    checkRole("ADMIN"),
    UserController.restoreUser
);

// ---------- Dynamic listener route — always last ----------
router.get("/listeners/:userId", authMiddleware, UserController.getUserById);

module.exports = router;