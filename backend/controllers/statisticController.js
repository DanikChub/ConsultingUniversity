const { Statistic, ThemeStatistic, PunctStatistic } = require("../models/models");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");

class StatisticController {

    // ---------------------- VIDEOS ----------------------
    async updateVideos(req, res, next) {
        try {
            const { users_id, programs_id, punct_id } = req.body;

            if (!users_id || !programs_id || !punct_id)
                return next(ApiError.badRequest("Не хватает данных"));

            const punctStatic = await PunctStatistic.findByPk(punct_id);
            if (!punctStatic) return next(ApiError.badRequest("PunctStatistic не найден"));

            const statistic = await Statistic.findOne({
                where: { users_id, programs_id }
            });
            if (!statistic) return next(ApiError.badRequest("Statistic не найден"));

            if (statistic.well_videos < statistic.max_videos && !punctStatic.video) {
                statistic.well_videos += 1;
                punctStatic.video = true;
            }

            await statistic.save();
            await punctStatic.save();

            return res.json(statistic);

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }


    // ---------------------- TESTS ----------------------
    async updateTests(req, res, next) {
        try {
            const { users_id, programs_id, punct_id, theme_id } = req.body;

            if (!users_id || !programs_id || !punct_id || !theme_id)
                return next(ApiError.badRequest("Не хватает данных"));

            const punctStatic = await PunctStatistic.findByPk(punct_id);
            if (!punctStatic) return next(ApiError.badRequest("PunctStatistic не найден"));

            const statistic = await Statistic.findOne({
                where: { users_id, programs_id }
            });
            if (!statistic) return next(ApiError.badRequest("Statistic не найден"));

            if (statistic.well_tests < statistic.max_tests && !punctStatic.test_bool) {
                statistic.well_tests += 1;
                punctStatic.test_bool = true;
            }

            const theme = await ThemeStatistic.findByPk(theme_id);
            if (!theme) return next(ApiError.badRequest("ThemeStatistic не найден"));

            theme.well = true;

            await theme.save();
            await statistic.save();
            await punctStatic.save();

            return res.json(statistic);

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }


    // ---------------------- PRACTICAL WORKS ----------------------
    async updatePracticalWorks(req, res, next) {
        try {
            const { users_id, programs_id, theme_id } = req.body;

            if (!users_id || !programs_id || !theme_id)
                return next(ApiError.badRequest("Не хватает данных"));

            const statistic = await Statistic.findOne({
                where: { users_id, programs_id }
            });
            if (!statistic) return next(ApiError.badRequest("Statistic не найден"));

            if (statistic.well_tests < statistic.max_tests) {
                statistic.well_tests += 1;
            }

            await statistic.save();

            const theme = await ThemeStatistic.findByPk(theme_id);
            if (!theme) return next(ApiError.badRequest("ThemeStatistic не найден"));

            theme.well = true;
            await theme.save();

            return res.json(statistic);

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }


    // ---------------------- GET STATISTICS ----------------------
    async getStatistics(req, res, next) {
        try {
            const { users_id, programs_id } = req.body;

            if (!users_id) return next(ApiError.badRequest("Нет id пользователя"));
            if (!programs_id) return next(ApiError.badRequest("Нет id программы"));

            const statistic = await Statistic.findOne({
                where: { users_id, programs_id }
            });

            if (!statistic) return res.json(null);

            const themes = await ThemeStatistic.findAll({
                where: { statisticId: statistic.id },
                order: [["id", "ASC"]]
            });

            const themeIds = themes.map(t => t.id);

            const puncts = await PunctStatistic.findAll({
                where: {
                    themeStatisticId: {
                        [Op.in]: themeIds
                    }
                },
                order: [["id", "ASC"]]
            });

            const punctsByTheme = {};
            themeIds.forEach(id => (punctsByTheme[id] = []));

            puncts.forEach(p => {
                punctsByTheme[p.themeStatisticId].push(p);
            });

            themes.forEach(theme => {
                theme.dataValues.punctsStatistic = punctsByTheme[theme.id] || [];
            });

            statistic.dataValues.themesStatistic = themes;

            return res.json(statistic);

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new StatisticController();
