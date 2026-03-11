const { 
    Test, 
    Question,
    Answer,
    UserContentProgress,
    TestAttemptAnswer,
    TestAttempt,
    TestQuestionLink,
    Theme,
    Punct
} = require("../models/models");
const sequelize = require('../db');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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



    async createTest(req, res) {
        const t = await sequelize.transaction();

        try {
            const { punctId, programId, final_test } = req.body;

            console.log(punctId, programId, final_test)

            // ============================================================
            // ОБЫЧНЫЙ ТЕСТ (как раньше)
            // ============================================================
            if (!final_test) {

                if (!punctId) {
                    await t.rollback();
                    return res.status(400).json({ message: 'punctId is required' });
                }

                const lastIndex = await Test.max('order_index', {
                    where: { punctId },
                    transaction: t
                });

                const test = await Test.create({
                    punctId,
                    title: 'Новый тест',
                    description: '',
                    time_limit: null,
                    status: 'draft',
                    order_index: (lastIndex ?? -1) + 1,
                    final_test: false
                }, { transaction: t });

                await t.commit();
                return res.json(test);
            }

            // ============================================================
            // ИТОГОВЫЙ ТЕСТ
            // ============================================================


            if (!programId) {
                await t.rollback();
                return res.status(400).json({ message: 'programId is required for final test' });
            }

            const existingFinal = await Test.findOne({
                where: {
                    programId,
                    final_test: true
                },
                transaction: t
            });

            if (existingFinal) {
                await t.rollback();
                return res.status(400).json({ message: 'Final test already exists for this program' });
            }

            // создаём финальный тест
            const finalTest = await Test.create({
                programId,
                title: 'Итоговое тестирование',
                description: 'Итоговый тест формируется автоматически из тестов всех модулей',
                time_limit: null,
                status: 'draft',
                final_test: true,
                order_index: 9999
            }, { transaction: t });

            // ============================================================
            // Получаем ВСЮ вложенность Program → Theme → Punct → Test
            // ============================================================
            const themes = await Theme.findAll({
                where: { programId },
                include: {
                    model: Punct,
                    include: {
                        model: Test,
                        required: false,
                        separate: true,
                        order: [['order_index', 'ASC']],
                        where: {
                            [Op.or]: [
                                { final_test: false },
                                { final_test: null }
                            ]
                        },
                        include: {
                            model: Question,
                            as: 'questions',
                            include: [Answer]
                        }
                    }
                },
                transaction: t
            });

            let questionOrder = 0;


            for (const theme of themes) {

                for (const punct of theme.puncts || []) {
                    console.log('\n ###############',punct)
                    for (const test of punct.tests || []) {
                        console.log('\n ###############',test.questions)
                        const questions = test.questions || [];
                        if (!questions.length) continue;



                        const shuffled = shuffle([...questions]);


                        // берём максимум 5
                        const selected = shuffled.slice(0, 5);

                        for (const question of selected) {

                            await TestQuestionLink.create({
                                testId: finalTest.id,
                                questionId: question.id,
                                order_index: questionOrder++
                            }, { transaction: t });

                        }
                    }
                }
            }

            await t.commit();
            return res.json(finalTest);

        } catch (e) {
            await t.rollback();
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
            console.log(fields)
            const allowedFields = ['title', 'description', 'final_test', 'time_limit'];

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

            const test = await Test.findByPk(req.params.id);

            if (!test) {
                return next(ApiError.notFound('Тест не найден'));
            }

            let fullTest;

            if (test.final_test) {

                const finalTest = await Test.findByPk(req.params.id, {
                    include: [
                        {
                            model: Question,
                            as: 'finalQuestions',
                            through: { attributes: ['order_index'] },
                            include: [
                                {
                                    model: Answer,
                                    as: 'answers',
                                    separate: true,
                                    order: [['order_index', 'ASC']]
                                }
                            ]
                        }
                    ],
                    order: [
                        [{ model: Question, as: 'finalQuestions' }, TestQuestionLink, 'order_index', 'ASC']
                    ]
                });

                if (!finalTest) {
                    return next(ApiError.notFound('Тест не найден'));
                }

                // 🔥 НОРМАЛИЗАЦИЯ
                const normalized = finalTest.toJSON();

                normalized.questions = normalized.finalQuestions ?? [];
                delete normalized.finalQuestions;

                fullTest = normalized;

            } else {

                const regularTest = await Test.findOne({
                    where: { id: req.params.id },
                    include: [
                        {
                            model: Question,
                            as: 'questions',
                            separate: true,
                            order: [['order_index', 'ASC']],
                            include: [
                                {
                                    model: Answer,
                                    as: 'answers',
                                    separate: true,
                                    order: [['order_index', 'ASC']]
                                }
                            ]
                        }
                    ]
                });

                if (!regularTest) {
                    return next(ApiError.notFound('Тест не найден'));
                }

                fullTest = regularTest.toJSON();
            }

            return res.json(fullTest);

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
                        as: 'questions',
                        include: [Answer],
                    },
                ],
            });

            if (!test) return res.status(404).json({ message: 'Test not found' });

            // 1. Проверяем основные поля теста
            if (!test.title) {
                return res.status(400).json({ message: 'Название - обязательное поле' });
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

    async submitTestAttempt(req, res) {
        try {
            const { testId } = req.params;
            const { enrollmentId, answers } = req.body;
            // answers: [{ questionId, selected_answer_ids: [] }]
            console.log(enrollmentId)
            const test = await Test.findByPk(testId, {
                include: {
                    model: Question,
                    include: [Answer],
                }
            });

            if (!test) {
                return res.status(404).json({ message: 'Тест недоступен' });
            }

            // номер попытки
            const lastAttempt = await TestAttempt.max('attempt_number', {
                where: { enrollmentId, testId }
            });

            const attemptNumber = (lastAttempt ?? 0) + 1;

            const attempt = await TestAttempt.create({
                enrollmentId,
                testId,
                attempt_number: attemptNumber,
                started_at: new Date()
            });

            let correctCount = 0;

            for (const question of test.questions) {
                const userAnswer = answers.find(a => a.questionId === question.id);
                const correctAnswers = question.answers
                    .filter(a => a.is_correct)
                    .map(a => a.id)
                    .sort();

                const selected = (userAnswer?.selected_answer_ids || []).sort();

                const isCorrect =
                    JSON.stringify(correctAnswers) === JSON.stringify(selected);

                if (isCorrect) correctCount++;
                console.log(selected)
                await TestAttemptAnswer.create({
                    testAttemptId: attempt.id,
                    questionId: question.id,
                    selected_answers: selected,
                    is_correct: isCorrect
                });
            }

            const score = Math.round(
                (correctCount / test.questions.length) * 100
            );

            const passed = score >= 70;

            attempt.score = score;
            attempt.passed = passed;
            attempt.finished_at = new Date();

            await attempt.save();

            // 🔥 обновляем UserContentProgress
            let progress = await UserContentProgress.findOne({
                where: {
                    enrollmentId,
                    contentType: 'test',
                    contentId: testId
                }
            });

            if (!progress) {
                // первый раз — создаём
                progress = await UserContentProgress.create({
                    enrollmentId,
                    contentType: 'test',
                    contentId: testId,
                    status: passed ? 'completed' : 'failed',
                    score,
                    completedAt: passed ? new Date() : null
                });
            } else {
                // уже есть прогресс — обновляем только если score выше
                if (score > (progress.score ?? 0)) {
                    progress.status = passed ? 'completed' : 'failed';
                    progress.score = score;

                    if (passed) {
                        progress.completedAt = new Date();
                    }

                    await progress.save();
                } else {
                    console.log(`Попытка ${score} хуже или равна предыдущей ${progress.score}, прогресс не меняем`);
                }
            }

            return res.json({
                attemptId: attempt.id,
                score,
                status: attempt.status
            });

        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при отправке теста' });
        }
    }


    async getAllAttempts(req, res) {
        try {
            const { testId } = req.params;
            const { enrollmentId } = req.query;

            const attempts = await TestAttempt.findAll({
                where: { testId, enrollmentId },
                order: [['score', 'DESC']]
            });

            return res.json(attempts);

        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при получении попыток' });
        }
    }



    async getAttemptById(req, res) {
        try {
            const { attemptId } = req.params;

            const attempt = await TestAttempt.findByPk(attemptId, {
                include: [
                    {
                        model: Test,
                        include: {
                            model: Question,
                            include: [Answer]
                        }
                    },
                    {
                        model: TestAttemptAnswer
                    }
                ]
            });

            if (!attempt) {
                return res.status(404).json({ message: 'Попытка не найдена' });
            }

            // создаём map ответов пользователя
            const answerMap = {};
            attempt.test_attempt_answers.forEach(a => {
                answerMap[a.questionId] = a;
            });

            const questions = attempt.test.questions.map(question => {

                const userAnswer = answerMap[question.id];
                const selectedIds = userAnswer?.selected_answers || [];

                return {
                    id: question.id,
                    text: question.text,
                    is_correct: userAnswer?.is_correct ?? false,
                    answers: question.answers.map(answer => ({
                        id: answer.id,
                        text: answer.text,
                        is_correct: answer.is_correct,
                        is_selected: selectedIds.includes(answer.id)
                    }))
                };
            });


            return res.json({
                attemptId: attempt.id,
                attempt_number: attempt.attempt_number,
                score: attempt.score,
                status: attempt.status,
                passed: attempt.passed,
                questions
            });

        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка получения попытки' });
        }
    }








}

module.exports = new TestController();
