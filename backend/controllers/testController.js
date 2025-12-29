const { 
    Test, 
    TestPunct, 
    TestStatictis, 
    TestPunctStatictis 
} = require("../models/models");

const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class TestController {

    // -------------------------------
    // CREATE TEST
    // -------------------------------
    async create(req, res, next) {
        const { title, puncts, time_limit } = req.body;

        if (!title) {
            return next(ApiError.internal('Заполните название теста!'));
        }

        try {
            const test = await Test.create({
                id: Math.floor(Math.random() * 9000000) + 1000000,
                title,
                time_limit
            });

            for (const punct of puncts) {
                if (!punct.question) {
                    return next(ApiError.internal('Заполните все вопросы в пунктах!'));
                }

                if (!punct.correct_answer || punct.correct_answer.length === 0) {
                    return next(ApiError.internal('Заполните правильные ответы!'));
                }

                await TestPunct.create({
                    question: punct.question,
                    answers: punct.answers,
                    correct_answer: punct.correct_answer,
                    several_answers: punct.several_answers,
                    testId: test.id
                });
            }

            return res.json({ test });

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Ошибка при сохранении теста или пунктов'));
        }
    }



    // -------------------------------
    // GET ONE TEST
    // -------------------------------
    async getOne(req, res, next) {
        try {
            const { id } = req.params;

            const test = await Test.findOne({ where: { id } });
            if (!test) return res.json(null);

            const puncts = await TestPunct.findAll({
                where: { testId: test.id }
            });

            test.dataValues.puncts = puncts;

            return res.json(test);

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest("Ошибка при получении теста"));
        }
    }



    // -------------------------------
    // REMAKE TEST
    // -------------------------------
    async remakeTest(req, res, next) {
        const { id, title, time_limit, puncts } = req.body;

        if (!title) {
            return next(ApiError.internal('Заполните название теста!'));
        }

        try {
            const test = await Test.findOne({ where: { id } });
            if (!test) return next(ApiError.badRequest("Тест не найден"));

            test.title = title;
            test.time_limit = time_limit;

            // Удаляем старые пункты
            await TestPunct.destroy({ where: { testId: id } });

            // Добавляем новые
            for (const punct of puncts) {
                if (!punct.question) {
                    return next(ApiError.internal('Заполните все вопросы в пунктах!'));
                }

                if (!punct.correct_answer || punct.correct_answer.length === 0) {
                    return next(ApiError.internal('Заполните правильные ответы!'));
                }

                await TestPunct.create({
                    question: punct.question,
                    answers: punct.answers,
                    correct_answer: punct.correct_answer,
                    several_answers: punct.several_answers,
                    testId: id
                });
            }

            await test.save();

            return res.json({ test });

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Ошибка при обновлении теста'));
        }
    }




    // -------------------------------
    // DELETE TEST
    // -------------------------------
    async deleteTest(req, res, next) {
        try {
            const { id } = req.body;

            const test = await Test.destroy({ where: { id } });

            return res.json({ test });

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest("Ошибка при удалении теста"));
        }
    }




    // -------------------------------
    // UPDATE TEST STATISTICS
    // -------------------------------
    async updateTestStatistics(req, res, next) {
        const { user_id, punctsStatistic, test_id } = req.body;

        try {
            let stat = await TestStatictis.findOne({
                where: {
                    [Op.and]: [{ user_id, test_id }]
                }
            });

            if (!stat) {
                stat = await TestStatictis.create({ user_id, test_id });
            } else {
                await TestPunctStatictis.destroy({
                    where: { testStatisticId: stat.id }
                });
            }
    
            for (const punct of punctsStatistic) {
                console.log(punct)
                if (!punct || punct.length === 0) {
                    return next(ApiError.internal('Заполните правильные ответы!'));
                }

                await TestPunctStatictis.create({
                    user_answer: punct,
                    testStatisticId: stat.id
                });
            }

            return res.json({ stat });

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest("Ошибка при сохранении статистики"));
        }
    }




    // -------------------------------
    // GET TEST STATISTICS
    // -------------------------------
    async getTestStatistic(req, res, next) {
        const { user_id, test_id } = req.body;

        try {
            const stat = await TestStatictis.findOne({
                where: {
                    [Op.and]: [{ user_id, test_id }]
                }
            });

            if (!stat) return res.json(null);

            const punctsStatistic = await TestPunctStatictis.findAll({
                where: { testStatisticId: stat.id }
            });

            stat.dataValues.punctsStatistic = punctsStatistic;

            return res.json(stat);

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest("Ошибка при получении статистики"));
        }
    }
}

module.exports = new TestController();
