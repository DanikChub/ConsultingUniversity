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
        <div
            className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/40 backdrop-blur-sm
    animate-fadeIn
  "
        >
            <div
                className="
      w-full max-w-4xl
      rounded-3xl
      bg-white
      shadow-[0_25px_80px_rgba(0,0,0,0.25)]
      border border-gray-100
      overflow-hidden
      animate-fadeIn
    "
            >
                {/* Верхняя панель */}
                <div className="flex items-center justify-between px-8 py-5 border-b bg-gray-50/70 backdrop-blur">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Просмотр теста
                    </h3>

                    <button
                        onClick={onClose}
                        className="
          w-9 h-9
          flex items-center justify-center
          rounded-full
          text-gray-400
          hover:bg-gray-200
          hover:text-gray-700
          transition
        "
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[85vh] flex flex-col">

                    {/* Header теста */}
                    <div className="px-8 py-6 border-b space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {test.title || 'Без названия'}
                            </h2>

                            <span
                                className={`
              px-4 py-1.5 rounded-full text-sm font-semibold
              ${test.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-200 text-gray-600'}
            `}
                            >
            {statusTranslate[test.status]}
          </span>
                        </div>

                        {test.description && (
                            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                                {test.description}
                            </p>
                        )}
                    </div>

                    {/* Пагинация */}
                    <div className="flex gap-3 px-8 py-4 overflow-x-auto border-b bg-white">
                        {test.questions.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => setActiveQuestionIndex(i)}
                                className={`
                                  w-11 h-11
                                  flex items-center justify-center
                                  rounded-full
                                  text-sm font-semibold
                                  transition-all duration-200
                                  ${
                                    i === activeQuestionIndex
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }
            `}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Контент вопроса */}
                    <div className="px-8 py-8 overflow-y-auto flex-1 bg-gray-50/40">
                        {activeQuestion ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-snug">
                                    {activeQuestionIndex + 1}. {activeQuestion.text}
                                </h3>

                                <ul className="space-y-3">
                                    {activeQuestion.answers.map((a) => (
                                        <li
                                            key={a.id}
                                            className={`
                    flex items-start gap-3
                    px-5 py-4
                    rounded-2xl
                    border
                    transition
                    ${
                                                a.is_correct
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                                    : 'bg-white border-gray-200 text-gray-700'
                                            }
                  `}
                                        >
                                            {a.is_correct ? (
                                                <HiCheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0"/>
                                            ) : (
                                                <HiXCircle className="w-6 h-6 text-gray-300 mt-0.5 shrink-0"/>
                                            )}

                                            <span className="leading-relaxed">
                    {a.text}
                  </span>
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