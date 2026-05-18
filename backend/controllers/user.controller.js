const authService = require("../services/user/auth.service");
const passwordService = require("../services/user/password.service");
const userRegistrationService = require("../services/user/userRegistration.service");
const userAdminService = require("../services/user/userAdmin.service");
const userQueryService = require("../services/user/userQuery.service");
const userProfileService = require("../services/user/userProfile.service");
const userDocumentService = require("../services/user/userDocument.service");
const listenerFieldService = require("../services/user/listenerField.service");

class UserController {
    async registration(req, res, next) {
        try {
            const result = await userRegistrationService.registration(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async registrationAdmin(req, res, next) {
        try {
            const result = await userRegistrationService.registrationAdmin(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const result = await authService.login(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async check(req, res, next) {
        try {
            const result = await authService.check(req.user);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async setInitialPassword(req, res, next) {
        try {
            const result = await authService.setInitialPassword(req.user.id, req.body.newPassword);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const result = await passwordService.forgotPassword(req.body.email);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async checkForgotPassword(req, res, next) {
        try {
            const result = await passwordService.checkForgotPassword(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async remakeUser(req, res, next) {
        try {
            const result = await userAdminService.remakeUser(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async remakeAdmin(req, res, next) {
        try {
            const result = await userAdminService.remakeAdmin(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const result = await userAdminService.deleteUser(req.body.id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async setGraduationDate(req, res, next) {
        try {
            const result = await userAdminService.setGraduationDate(req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await userQueryService.getUserById(req.params.userId);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getAllUsers(req, res, next) {
        try {

            const users = await userQueryService.getAllUsers();

            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getAllAdmins(req, res, next) {
        try {
            const users = await userQueryService.getAllAdmins();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getAllUsersGraduation(req, res, next) {
        try {
            const users = await userQueryService.getAllUsersGraduation();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getAllUsersWithPage(req, res, next) {
        try {

            const result = await userQueryService.getAllUsersWithPage({
                page: req.params.page,
                query: req.query,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async searchUsers(req, res, next) {
        try {
            const result = await userQueryService.searchUsers({
                page: req.params.page,
                q: req.query.q,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async setUserProfileImg(req, res, next) {
        try {
            const result = await userProfileService.setUserProfileImg({
                userId: req.body.id,
                img: req.files?.img,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async addUserDocuments(req, res, next) {
        try {
            const result = await userDocumentService.addUserDocuments({
                userId: req.params.userId,
                documents: req.files?.documents,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteUserDocument(req, res, next) {
        try {
            const result = await userDocumentService.deleteUserDocument(req.params.documentId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getUserDocuments(req, res, next) {
        try {
            const documents = await userDocumentService.getUserDocuments(req.params.userId);
            return res.json(documents);
        } catch (e) {
            next(e);
        }
    }

    async updateListenerField(req, res, next) {
        try {
            const result = await listenerFieldService.updateListenerField({
                userId: req.params.userId,
                field: req.body.field,
                value: req.body.value,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getEditableListenerFields(req, res, next) {
        try {
            const fields = listenerFieldService.getAllowedFields();
            return res.json(fields);
        } catch (e) {
            next(e);
        }
    }

    async getAdminUsersList(req, res, next) {
        try {
            const result = await userQueryService.getAdminUsersList(req.query);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async softDeleteUser(req, res, next) {
        try {
            const result = await userAdminService.softDeleteUser(req.params.userId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async restoreUser(req, res, next) {
        try {
            const result = await userAdminService.restoreUser(req.params.userId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateUserDocument(req, res, next) {
        try {
            const result = await userDocumentService.updateUserDocument(
                req.params.documentId,
                req.body
            );

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();