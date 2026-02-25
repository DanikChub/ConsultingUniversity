import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import {FiArrowLeft, FiCheckCircle, FiXCircle} from "react-icons/fi"
import type {AttemptResponse, TestAttempt} from "../../../entities/test/model/type";
import {getTestAttempt} from "../../../entities/test/api/test.api";
import UserContainer from "../../../components/ui/UserContainer";

const TestAttemptPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [attempt, setAttempt] = useState<AttemptResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!id) return
        setLoading(true)

        getTestAttempt(Number(id))
            .then(data => setAttempt(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="p-10 text-center text-gray-500">Загрузка результатов...</div>
    if (error || !attempt) return <div className="p-10 text-center text-red-500">Попытка не найдена</div>

    // Определяем, прошёл ли тест (есть хотя бы один выбранный правильный ответ на все вопросы)
    const passed = attempt.questions.every(q =>
        q.answers.some(a => a.is_selected && a.is_correct)
    )

    // Средний балл как % выбранных правильных среди всех правильных
    const totalCorrect = attempt.questions.reduce(
        (acc, q) => acc + q.answers.filter(a => a.is_correct).length,
        0
    )
    const selectedCorrect = attempt.questions.reduce(
        (acc, q) => acc + q.answers.filter(a => a.is_correct && a.is_selected).length,
        0
    )
    const scorePercent = totalCorrect > 0 ? Math.round((selectedCorrect / totalCorrect) * 100) : 0

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
            <div className="space-y-6 mt-4">

                {/* Заголовок */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">Результаты попытки #{attempt.attempt_number}</h1>
                    <div
                        className={`flex items-center gap-2 font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                        {passed ? <FiCheckCircle size={24}/> : <FiXCircle size={24}/>}
                        {passed ? "Пройдено" : "Не пройдено"}
                    </div>
                </div>

                {/* Балл */}
                <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <span className="text-gray-500 text-sm">Баллы</span>
                        <div className="font-semibold text-gray-800">{scorePercent}%</div>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Вопросов</span>
                        <div className="font-semibold text-gray-800">{attempt.questions.length}</div>
                    </div>
                </div>

                {/* Список вопросов */}
                <div className="space-y-6">
                    {attempt.questions.map((q, idx) => (
                        <div key={q.id} className="p-4 border rounded-lg bg-white space-y-2">
                            <div className="font-medium text-gray-800">{idx + 1}. {q.text}</div>
                            <div className="flex flex-col gap-2 mt-2">
                                {q.answers.map(answer => {
                                    let label = ''
                                    let bgClass = 'bg-gray-50 text-gray-700'

                                    if (answer.is_selected && answer.is_correct) {
                                        label = 'Ваш ответ ✅'
                                        bgClass = 'bg-green-50 text-green-700'
                                    } else if (answer.is_selected && !answer.is_correct) {
                                        label = 'Ваш ответ ❌'
                                        bgClass = 'bg-red-50 text-red-700'
                                    } else if (!answer.is_selected && answer.is_correct) {
                                        label = 'Правильный ответ'
                                        bgClass = 'bg-green-100 text-green-900/70'
                                    }

                                    return (
                                        <div key={answer.id}
                                             className={`flex justify-between px-3 py-2 rounded ${bgClass}`}>
                                            <span>{answer.text}</span>
                                            <span className="font-medium mr-2">{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>


                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                    onClick={() => navigate(-1)}
                >
                    Назад
                </button>

            </div>
        </UserContainer>
    )
}

export default TestAttemptPage
