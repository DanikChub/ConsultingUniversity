import React, {FC, useEffect, useState} from 'react';

import type {Question, Test} from "../entities/test/model/type";

import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
interface Props {
    test: Test;
    onClose: () => void;
}

export const TestViewModal: FC<Props> = ({ test, onClose }) => {
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    const activeQuestion: Question | undefined = test.questions[activeQuestionIndex];
    const statusTranslate = {
        published: 'Проверен',
        draft: 'Черновик'
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm
                    transition-opacity duration-200
                    opacity-0
                    animate-fadeIn">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Просмотр теста</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>


                <div className="w-full max-w-3xl max-h-[80vh] overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h2 className="text-2xl font-bold">{test.title || 'Без названия'}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                ${test.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                {statusTranslate[test.status]}
                              </span>
                        </div>
                        {test.description && (
                            <p className="mt-2 text-gray-600 text-sm">
                                <span className="font-semibold">Описание:</span> {test.description}
                            </p>
                        )}
                    </div>

                    {/* Пагинация вопросов сверху */}
                    <div className="flex gap-2 p-4 overflow-x-auto border-b">
                        {test.questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => setActiveQuestionIndex(i)}
                                className={`
          w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition
          ${i === activeQuestionIndex
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        `}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Контент выбранного вопроса */}
                    <div className="p-6 overflow-y-auto h-[60vh]">
                        {activeQuestion ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    {activeQuestionIndex + 1}. {activeQuestion.text}
                                </h3>

                                <ul className="space-y-2">
                                    {activeQuestion.answers.map((a) => (
                                        <li
                                            key={a.id}
                                            className={`flex items-center gap-2 px-4 py-2 rounded
                ${a.is_correct ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {a.is_correct ? (
                                                <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0"/>
                                            ) : (
                                                <HiXCircle className="w-5 h-5 text-gray-400 flex-shrink-0"/>
                                            )}
                                            <span>{a.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-gray-500">Вопрос не найден</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};