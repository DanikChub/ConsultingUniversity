import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import UserContainer from '../../../components/ui/UserContainer';
import CountDown from '../../../components/CountDown/CountDown';
import { getOneTest } from '../../../entities/test/api/test.api';
import { submitTestAttempt } from '../../../entities/test/api/test.api';
import { FINISH_TEST_ROUTE } from '../../../shared/utils/consts';
import type { Test } from '../../../entities/test/model/type';
import {FiArrowLeft} from "react-icons/fi";
import {Context} from "../../../index";

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const TestPage: React.FC = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState<Test | null>(null);
    const [numberQuestion, setNumberQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
    const [secForEnd, setSecForEnd] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const userContext = useContext(Context);
    const enrollmentId = userContext.user.enrollmentId;

    useEffect(() => {
        if (!params.id) return;

        getOneTest(Number(params.id)).then((data: Test) => {
            // перемешиваем вопросы для случайного порядка
            data.questions = shuffle(data.questions);
            setTest(data);
            setSecForEnd(data.time_limit || null);
        });
    }, [params.id]);

    const punct = test?.questions[numberQuestion];

    const setSingleAnswer = (i: number, answerId: number) => {
        setUserAnswers(prev => ({ ...prev, [i]: [answerId] }));
    };

    const setMultipleAnswer = (i: number, answerId: number, checked: boolean) => {
        setUserAnswers(prev => {
            const arr = prev[i] ? [...prev[i]] : [];
            if (checked) arr.push(answerId);
            else arr.splice(arr.indexOf(answerId), 1);
            return { ...prev, [i]: arr };
        });
    };

    const finishTest = async () => {
        if (!test || submitting) return;
        setSubmitting(true);

        try {

            // формируем payload в формате бэка
            const answersPayload = test.questions.map((q, i) => ({
                questionId: q.id,
                selected_answer_ids: userAnswers[i] || [],
            }));
            console.log(answersPayload)
            const result = await submitTestAttempt(test.id, {
                enrollmentId: Number(enrollmentId),
                answers: answersPayload,
            });

            // переход на страницу завершения с attempt_id
            navigate(`${FINISH_TEST_ROUTE}?attempt_id=${result.attemptId}`);
        } catch (err) {
            console.error('Ошибка при отправке теста', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!test) return <UserContainer loading={true}>Загрузка...</UserContainer>;


    // Проверяем, все ли вопросы отвечены
    const allAnswered = test.questions.every((_, i) => (userAnswers[i]?.length ?? 0) > 0);

    // Определяем, показывать ли кнопку
    const showFinishButton = numberQuestion === test.questions.length - 1;
    return (
        <UserContainer loading={true}>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
            >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                    <FiArrowLeft size={20}/>
                </div>
                <span className="text-lg font-medium">Назад</span>
            </button>

            <h1 className="text-3xl font-bold mb-1">{test.title}</h1>

            {secForEnd && (
                <div className="mb-6">
                    <CountDown seconds={secForEnd} checkAllAnswers={finishTest}/>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
                {test.questions.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setNumberQuestion(i)}
                        className={`w-10 h-10 rounded-full font-semibold transition ${
                            numberQuestion === i
                                ? 'bg-[#5ec1ff] text-white'
                                : userAnswers[i]?.length
                                    ? 'bg-[#2980B9] text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {punct && (
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="text-xl font-semibold mb-4">{punct.text}</div>

                    <div className="text-sm text-gray-500 mb-4">
                        {punct.answers.filter(a => a.is_correct).length > 1
                            ? 'Можно выбрать несколько вариантов'
                            : 'Один правильный вариант'}
                    </div>

                    <div className="flex flex-col gap-3">
                        {punct.answers.map((answer) => (
                            <label
                                key={answer.id}
                                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition"
                            >
                                <input
                                    type={
                                        punct.answers.filter(a => a.is_correct).length > 1
                                            ? 'checkbox'
                                            : 'radio'
                                    }
                                    checked={userAnswers[numberQuestion]?.includes(answer.id) || false}
                                    onChange={(e) =>
                                        punct.answers.filter(a => a.is_correct).length > 1
                                            ? setMultipleAnswer(numberQuestion, answer.id, e.target.checked)
                                            : setSingleAnswer(numberQuestion, answer.id)
                                    }
                                    className="scale-125 accent-blue-500"
                                />
                                <span>{answer.text}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between mt-8">
                <button
                    disabled={numberQuestion === 0}
                    onClick={() => setNumberQuestion((n) => n - 1)}
                    className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                >
                    Назад
                </button>

                {showFinishButton && (
                    <button
                        onClick={finishTest}
                        disabled={!allAnswered || submitting}  // блокируем если не все отвечены
                        className={`px-6 py-3 rounded-xl text-white font-semibold transition
                ${allAnswered ? 'bg-[#2980B9] hover:bg-[#2C3E50]' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        Завершить
                    </button>
                )}

                <button
                    disabled={numberQuestion === test.questions.length - 1}
                    onClick={() => setNumberQuestion((n) => n + 1)}
                    className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                >
                    Далее
                </button>
            </div>
        </UserContainer>
    );
};

export default TestPage;
