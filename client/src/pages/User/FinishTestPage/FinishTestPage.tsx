import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserContainer from '../../../components/ui/UserContainer';
import completeImg from '../../../assets/imgs/complete.png';
import failImg from '../../../assets/imgs/fall.jpg';
import {
    TEST_ROUTE,
    TEST_ATTEMPT_ROUTE,
    COURSE_ROUTE,
    TEST_OVERVIEW_ROUTE,
    USER_ROUTE
} from '../../../shared/utils/consts';
import { getTestAttempt } from '../../../entities/test/api/test.api';
import type { AttemptResponse } from '../../../entities/test/model/type';
import { FiArrowLeft } from 'react-icons/fi';

const FinishTestPage: React.FC = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const attemptId = Number(params.get('attempt_id'));

    const [attempt, setAttempt] = useState<AttemptResponse | null>(null);

    useEffect(() => {
        if (!attemptId) return;
        getTestAttempt(attemptId).then(data => setAttempt(data));
    }, [attemptId]);

    if (!attempt)
        return <UserContainer loading={true}>Загрузка результата теста...</UserContainer>;

    const passed = attempt.passed;
    const totalQuestions = attempt.questions.length;
    const correctAnswers = Math.round(attempt.score/100*totalQuestions)
    const score = attempt.score;
    const percentage = Math.round(score);

    console.log(attempt);
    return (
        <UserContainer loading={true}>
            {/* 🔙 Back */}
            <button
                onClick={() => navigate(USER_ROUTE)}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
            >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                    <FiArrowLeft size={20}/>
                </div>
                <span className="text-lg font-medium">Назад</span>
            </button>

            {/* Результат */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
                <img
                    src={passed ? completeImg : failImg}
                    alt={passed ? 'Complete' : 'Fail'}
                    className="mx-auto w-36 h-36 object-contain"
                />
                <h1 className="text-3xl font-bold text-gray-800">
                    {passed ? 'Тест пройден!' : 'Тест не пройден'}
                </h1>
                <p className="text-gray-600 text-lg">
                    {passed
                        ? 'Поздравляем! Вы успешно прошли тест.'
                        : 'Не удалось пройти тест. Попробуйте еще раз.'}
                </p>

                {/* Прогресс-бар */}
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                    <div
                        className={`h-full bg-gradient-to-r ${
                            passed ? 'from-green-400 to-blue-500' : 'from-red-400 to-red-600'
                        } transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="block text-gray-700 font-semibold text-lg mt-2">
          {correctAnswers} / {totalQuestions} ({percentage}%)
        </span>

                {/* Действия */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    {!passed && (
                        <button
                            onClick={() => navigate(TEST_ROUTE)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Пройти ещё раз
                        </button>
                    )}
                    <button
                        onClick={() => navigate(USER_ROUTE)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                    >
                        Вернуться к курсу
                    </button>
                </div>
            </div>


        </UserContainer>
    );
};

export default FinishTestPage;
