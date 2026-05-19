const Router = require("express");
const router = new Router();

const EnrollmentController = require("../controllers/enrollment.controller");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

// ---------- Current user ----------
router.get(
    "/programs/:programId/me",
    authMiddleware,
    EnrollmentController.getEnrollment
);

// ---------- Admin reads ----------
router.get(
    "/programs/:programId",
    checkRole(["ADMIN", "VIEWER"]),
    EnrollmentController.getEnrollmentsByProgram
);

router.get(
    "/users/:userId",
    checkRole(["ADMIN", "VIEWER"]),
    EnrollmentController.getEnrollmentsByUser
);

// ---------- Admin actions ----------
router.post(
    "/",
    checkRole("ADMIN"),
    EnrollmentController.createEnrollment
);

router.patch(
    "/:enrollmentId/status",
    checkRole("ADMIN"),
    EnrollmentController.updateEnrollmentStatus
);

router.patch(
    "/:enrollmentId/progress",
    checkRole("ADMIN"),
    EnrollmentController.updateEnrollmentProgress
);

router.patch(
    "/:enrollmentId/archive",
    checkRole("ADMIN"),
    EnrollmentController.archiveEnrollment
);

router.patch(
    "/:enrollmentId/restore",
    checkRole("ADMIN"),
    EnrollmentController.restoreEnrollment
);

router.delete(
    "/:enrollmentId",
    checkRole("ADMIN"),
    EnrollmentController.deleteEnrollment
);

module.exports = router;