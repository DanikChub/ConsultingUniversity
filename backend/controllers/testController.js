const { 
    Test, 
    Question,
    Answer,
    TestStatictis, 
    TestPunctStatictis 
} = require("../models/models");

const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

async function markTestAsDraftIfPublished(testId) {
    await Test.update(
        { status: 'draft' },
        {
            where: {
                id: testId,
                status: 'published',
            },
        }
    );
}


class TestController {

    // -------------------------------
    // CREATE TEST
    // -------------------------------
    /*async create(req, res, next) {
        const { title, puncts, time_limit, punctId } = req.body;

        if (!title) {
            return next(ApiError.internal('Заполните название теста!'));
        }

        try {
            const test = await Test.create({
                id: Math.floor(Math.random() * 9000000) + 1000000,
                title,
                time_limit,
                punctId
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
                    several_answers: punct.correct_answer.length > 1,
                    testId: test.id
                });
            }

            return res.json({ test });

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Ошибка при сохранении теста или пунктов'));
        }
    }*/

    async createTest(req, res) {
        try {
            const { punctId } = req.body;

            if (!punctId) {
                return res.status(400).json({ message: 'punctId is required' });
            }

            // order_index — последний
            const lastIndex = await Test.max('order_index', {
                where: { punctId }
            });

            const test = await Test.create({
                punctId,
                title: 'Новый тест',
                description: '',
                time_limit: null,
                status: 'draft',
                order_index: (lastIndex ?? -1) + 1
            });

            return res.json(test);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to create test' });
        }
    }

    async updateTestFields(req, res) {
        try {
            const { testId } = req.params;
            const fields = req.body;

            const test = await Test.findByPk(testId);
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }

            const allowedFields = ['title', 'description', 'time_limit'];

            for (const key of Object.keys(fields)) {
                if (allowedFields.includes(key)) {
                    test[key] = fields[key];
                }
            }

            // ⬅️ ВАЖНО
            if (test.status === 'published') {
                test.status = 'draft';
            }

            await test.save();

            return res.json(test);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to update test' });
        }
    }


    async createQuestion(req, res) {
        try {
            const { testId } = req.body;
            if (!testId) {
                return res.status(400).json({ message: 'testId is required' });
            }

            await markTestAsDraftIfPublished(testId);

            const lastIndex = await Question.max('order_index', {
                where: { testId }
            });

            const question = await Question.create({
                testId,
                text: '',
                type: 'single',
                order_index: (lastIndex ?? -1) + 1
            });

            return res.json(question);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to create question' });
        }
    }


    async updateQuestionFields(req, res) {
        try {
            const { questionId } = req.params;
            const fields = req.body;

            const question = await Question.findByPk(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            const allowedFields = ['text', 'type'];

            for (const key of Object.keys(fields)) {
                if (allowedFields.includes(key)) {
                    question[key] = fields[key];
                }
            }

            await question.save();

            // ⬅️ переводим тест в draft
            await markTestAsDraftIfPublished(question.testId);

            return res.json(question);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to update question' });
        }
    }


    async createAnswer(req, res) {
        try {
            const { questionId } = req.body;
            if (!questionId) {
                return res.status(400).json({ message: 'questionId is required' });
            }

            const question = await Question.findByPk(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            await markTestAsDraftIfPublished(question.testId);

            const lastIndex = await Answer.max('order_index', {
                where: { questionId }
            });

            const answer = await Answer.create({
                questionId,
                text: '',
                is_correct: false,
                order_index: (lastIndex ?? -1) + 1
            });

            return res.json(answer);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to create answer' });
        }
    }


    async updateAnswerFields(req, res) {
        try {
            const { answerId } = req.params;
            const fields = req.body;

            const answer = await Answer.findByPk(answerId);
            if (!answer) {
                return res.status(404).json({ message: 'Answer not found' });
            }

            const allowedFields = ['text', 'is_correct'];
            let isCorrectUpdated = false;

            for (const key of Object.keys(fields)) {
                if (allowedFields.includes(key)) {
                    answer[key] = fields[key];
                    if (key === 'is_correct') isCorrectUpdated = true;
                }
            }

            await answer.save();

            const question = await Question.findByPk(answer.questionId, {
                include: [Answer],
            });

            if (question) {
                await markTestAsDraftIfPublished(question.testId);

                if (isCorrectUpdated) {
                    const correctAnswers = question.answers.filter(a => a.is_correct);

                    if (correctAnswers.length === 1) {
                        question.type = 'single';
                    } else if (correctAnswers.length > 1) {
                        question.type = 'multiple';
                    }

                    await question.save();
                }
            }

            return res.json(answer);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to update answer' });
        }
    }



    async deleteTest(req, res) {
        try {
            const { testId } = req.params;

            const test = await Test.findByPk(testId);
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }

            await test.destroy();
            return res.json({ success: true });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to delete test' });
        }
    }

    async deleteQuestion(req, res) {
        const question = await Question.findByPk(req.params.questionId);
        if (!question) return res.sendStatus(404);

        await markTestAsDraftIfPublished(question.testId);
        await question.destroy();

        res.json({ success: true });
    }


    async deleteAnswer(req, res) {
        const answer = await Answer.findByPk(req.params.answerId);
        if (!answer) return res.sendStatus(404);

        const question = await Question.findByPk(answer.questionId);
        if (question) {
            await markTestAsDraftIfPublished(question.testId);
        }

        await answer.destroy();
        res.json({ success: true });
    }




    // -------------------------------
    // GET ONE TEST
    // -------------------------------
    async getOne(req, res, next) {
        try {
            const test = await Test.findOne({
                where: {id: req.params.id},
                include: [
                    {
                        model: Question,
                        as: 'questions', // <- если ассоциация создает alias, укажи его, иначе убери
                        separate: true,
                        order: [['order_index', 'ASC']],
                        include: [
                            {
                                model: Answer,
                                as: 'answers', // <- если ассоциация создает alias, укажи его
                                separate: true,
                                order: [['order_index', 'ASC']],
                            },
                        ],
                    },
                ],

            });
            if (!test) return next(ApiError.notFound('Тест не найден'));

            return res.json(test);

        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest("Ошибка при получении теста"));
        }
    }


    async publishTest(req, res) {
        try {
            const { testId } = req.params;

            const test = await Test.findByPk(testId, {
                include: [
                    {
                        model: Question,
                        include: [Answer],
                    },
                ],
            });

            if (!test) return res.status(404).json({ message: 'Test not found' });

            // 1. Проверяем основные поля теста
            if (!test.title || !test.description) {
                return res.status(400).json({ message: 'Не все поля теста заполнены' });
            }

            // 2. Проверяем вопросы
            for (const question of test.questions) {
                if (!question.text) {
                    return res.status(400).json({ message: `Вопрос ${question.order_index + 1} пустой` });
                }

                if (!question.answers || question.answers.length === 0) {
                    return res.status(400).json({ message: `У вопроса ${question.order_index + 1} нет ответов` });
                }

                const correctAnswers = question.answers.filter(a => a.is_correct);
                if (correctAnswers.length === 0) {
                    return res.status(400).json({ message: `У вопроса "${question.order_index + 1}" нет правильного ответа` });
                }
            }

            // 3. Если всё ок — публикуем
            test.status = 'published';
            await test.save();

            return res.json({ test });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Failed to publish test' });
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
                    several_answers: punct.correct_answer.length > 1,
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
