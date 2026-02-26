import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContainer from '../../../components/ui/UserContainer';
import { getOneTest, submitTestAttempt } from '../../../entities/test/api/test.api';
import { FINISH_TEST_ROUTE } from '../../../shared/utils/consts';
import type { Test } from '../../../entities/test/model/type';
import { FiArrowLeft } from "react-icons/fi";
import { Context } from "../../../index";
import {useModals} from "../../../hooks/useModals";
import finishTestPage from "../FinishTestPage/FinishTestPage";

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
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [initialTime, setInitialTime] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {openModal} = useModals()

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const userContext = useContext(Context);
    const enrollmentId = userContext.user.enrollmentId;

    useEffect(() => {
        if (!params.id) return;

        getOneTest(Number(params.id)).then((data: Test) => {
            data.questions = shuffle(data.questions);
            setTest(data);

            if (data.time_limit) {
                setTimeLeft(data.time_limit*60);
                setInitialTime(data.time_limit*60);
            }
        });
    }, [params.id]);

    // ⏳ Таймер
    useEffect(() => {
        if (!initialTime || submitting) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (!prev) return 0;

                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    finishTest();   // ← теперь гарантированно вызывается
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [initialTime]);

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
        console.log('отправлено')
        if (!test || submitting) return;
        setSubmitting(true);

        if (timerRef.current) clearInterval(timerRef.current);

        try {
            const answersPayload = test.questions.map((q, i) => ({
                questionId: q.id,
                selected_answer_ids: userAnswers[i] || [],
            }));

            const result = await submitTestAttempt(test.id, {
                enrollmentId: Number(enrollmentId),
                answers: answersPayload,
            });
            console.log('отправлено')
            navigate(`${FINISH_TEST_ROUTE}?attempt_id=${result.attemptId}`);
        } catch (err) {
            console.error('Ошибка при отправке теста', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinishTest = async () => {
        const confirm = await openModal('confirm', {
            title: 'Вы уверены что хотите заврешить тест?',
            description: 'Проверьте все ответы, после завершения поменять их будет нельзя',
            confirmText: 'Завершить',
            cancelText: 'Проверить ответы'
        })

        if (!confirm) return
        finishTest()
    }

    if (!test) return <UserContainer loading={true}>Загрузка...</UserContainer>;

    const allAnswered = test.questions.every((_, i) => (userAnswers[i]?.length ?? 0) > 0);
    const showFinishButton = numberQuestion === test.questions.length - 1;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress =
        initialTime && timeLeft
            ? (timeLeft / initialTime) * 100
            : 0;

    return (
        <UserContainer loading={true}>

            {/* Назад */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group mb-6"
            >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                    <FiArrowLeft size={20}/>
                </div>
                <span className="text-lg font-medium">Назад</span>
            </button>

            {/* Заголовок */}
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{test.title}</h1>

            {/* Таймер */}
            {timeLeft !== null && (
                <div className="mb-8 bg-white rounded-2xl shadow-md p-5">

                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                            Оставшееся время
                        </span>
                        <span className={`text-lg font-bold ${
                            timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-800'
                        }`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${
                                timeLeft < 60 ? 'bg-red-500' : 'bg-[#5ec1ff]'
                            }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Навигация по вопросам */}
            <div className="flex flex-wrap gap-2 mb-8">
                {test.questions.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setNumberQuestion(i)}
                        className={`w-10 h-10 rounded-full font-semibold transition ${
                            numberQuestion === i
                                ? 'bg-blue-600 text-white'
                                : userAnswers[i]?.length
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Вопрос */}
            {punct && (
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="text-xl font-semibold mb-4">
                        {punct.text}
                    </div>

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

            {/* Кнопки */}
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
                        onClick={handleFinishTest}
                        disabled={submitting}
                        className={`px-6 py-3 rounded-xl text-white font-semibold transition
                            ${!submitting
                            ? 'bg-blue-500 hover:bg-[#2C3E50]'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
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
