const ApiError = require("../../error/ApiError");
const { User } = require("../../models/models");
const { saveSingleFile } = require("../../utils/userFiles");

class UserProfileService {
    async setUserProfileImg({ userId, img }) {
        if (!userId) {
            throw ApiError.badRequest("Не указан пользователь");
        }

        if (!img) {
            throw ApiError.badRequest("Файл изображения не передан");
        }

        const imgSaved = await saveSingleFile(img);

        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        user.img = imgSaved;
        await user.save();

        return {
            message: "Фото пользователя обновлено",
            img: imgSaved,
        };
    }
}

module.exports = new UserProfileService();