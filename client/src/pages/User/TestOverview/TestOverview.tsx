import React, {useContext, useEffect, useState} from "react"
import {useParams, useNavigate, useSearchParams} from "react-router-dom"

import {FiArrowLeft, FiCheckCircle, FiXCircle} from "react-icons/fi"
import type {Test, TestAttempt} from "../../../entities/test/model/type";
import {getAllTestAttempts, getOneTest} from "../../../entities/test/api/test.api";
import {TEST_ATTEMPT_ROUTE, TEST_ROUTE} from "../../../shared/utils/consts";
import UserContainer from "../../../components/ui/UserContainer";
import {Context} from "../../../index";
import PdfPageLoader from "./components/PdfPageLoader";

import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';

function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (isToday(date)) {
        return 'Сегодня';
    }

    if (isYesterday(date)) {
        return 'Вчера';
    }

    const diff = formatDistanceToNow(date, { locale: ru, addSuffix: true });

    // если прошло меньше 7 дней, показываем "2 дня назад"
    const daysAgo = Math.ceil((new Date().getTime() - date.getTime()) / (1000*60*60*24));
    if (daysAgo <= 7) {
        return diff; // "2 дня назад"
    }

    // иначе просто дата "3 сентября"
    return format(date, 'd MMMM', { locale: ru });
}


interface TestOverviewProps {}

const TestOverview = ({}: TestOverviewProps) => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const userContext = useContext(Context);

    const [test, setTest] = useState<Test | null>(null)
    const [attempts, setAttempts] = useState<TestAttempt[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const enrollmentId = userContext.user.enrollmentId;
    useEffect(() => {
        if (!id) return
        setLoading(true)

        Promise.all([getOneTest(Number(id)), getAllTestAttempts(Number(id), Number(enrollmentId))])
            .then(([testData, attemptsData]) => {
                setTest(testData)
                setAttempts(attemptsData)
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <PdfPageLoader/>
    if (error || !test) return <div className="p-10 text-center text-red-500">Тест не найден</div>

    // Статистика
    const bestAttempt = attempts.reduce((best, curr) => (curr.score > (best?.score ?? 0) ? curr : best), undefined as TestAttempt | undefined)
    const passed = bestAttempt?.passed ?? false

    console.log(attempts);


    const handleStartTest = () => {
        // переход на страницу прохождения теста
        navigate(TEST_ROUTE.replace(":id", `${test.id}`))
    }

    return (
        <UserContainer loading={!loading}>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
            >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                    <FiArrowLeft size={20}/>
                </div>
                <span className="text-lg font-medium">Назад</span>
            </button>
            <div className="space-y-8 py-6">

                {/* Заголовок */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">{test.title}</h1>
                    {passed && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <FiCheckCircle size={24}/>
                            Пройдено
                        </div>
                    )}
                </div>

                {/* Описание */}
                {test.description && (
                    <p className="text-gray-600">{test.description}</p>
                )}

                {/* Статистика */}
                <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap gap-6">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Вопросов</span>
                        <span className="font-semibold text-gray-800">{test.questions.length}</span>
                    </div>
                    {test.time_limit && (
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">Время</span>
                            <span className="font-semibold text-gray-800">{test.time_limit} мин</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Лучший результат</span>
                        <span className="font-semibold text-gray-800">{bestAttempt?.score ?? 0}%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Попыток</span>
                        <span className="font-semibold text-gray-800">{attempts.length}</span>
                    </div>
                </div>

                {/* Кнопка пройти тест */}
                <button
                    onClick={handleStartTest}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    {passed ? "Пройти снова" : "Пройти тест"}
                </button>

                {/* История попыток */}
                {attempts.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">История попыток</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-gray-600">№</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Дата</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Балл</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Статус</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Действие</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attempts.map((attempt, index) => (
                                    <tr key={attempt.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-4 py-2">{attempt.attempt_number}</td>
                                        <td className="px-4 py-2">{formatDate(attempt.createdAt)}</td>
                                        <td className="px-4 py-2">{attempt.score}%</td>
                                        <td className="px-4 py-2">
                                            {attempt.passed
                                                ? <span
                                                    className="text-green-600 flex items-center gap-1"><FiCheckCircle/> Пройдено</span>
                                                : <span className="text-red-600 flex items-center gap-1"><FiXCircle/> Не пройдено</span>
                                            }
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => navigate(TEST_ATTEMPT_ROUTE.replace(":id", `${attempt.id}`))}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Просмотреть
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </UserContainer>
    )
}

export default TestOverview
