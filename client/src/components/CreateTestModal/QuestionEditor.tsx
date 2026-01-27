import React from 'react';
import type { Question, Answer } from '../../types/test';
import Button from '../ui/Button';

interface Props {
    question: Question;
    onChangeQuestion: (
        questionId: number,
        fields: Partial<Pick<Question, 'text' | 'type'>>
    ) => void;

    onAddAnswer: (questionId: number) => void;
    onChangeAnswer: (
        answerId: number,
        fields: Partial<Pick<Answer, 'text' | 'is_correct'>>
    ) => void;
    onRemoveAnswer: (answerId: number) => void;
}

const QuestionEditor: React.FC<Props> = ({
                                             question,
                                             onChangeQuestion,
                                             onAddAnswer,
                                             onChangeAnswer,
                                             onRemoveAnswer,
                                         }) => {
    return (
        <div className="space-y-6">

            {/* QUESTION */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Текст вопроса
                </label>
                <textarea
                    className="mt-1 w-full rounded-lg border px-3 py-2 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    value={question?.text}
                    onChange={e =>
                        onChangeQuestion(question.id, {
                            text: e.target.value,
                        })
                    }
                    placeholder="Введите текст вопроса"
                />
            </div>

            {/* ANSWERS */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700">
                        Ответы
                    </h4>
                    <Button

                        onClick={() => onAddAnswer(question.id)}
                    >
                        Добавить ответ
                    </Button>
                </div>

                {question?.answers.length === 0 && (
                    <div className="text-sm text-gray-400">
                        Добавьте варианты ответов
                    </div>
                )}

                <ul className="space-y-2 max-h-[250px] overflow-y-auto">
                    {question?.answers.map(answer => (
                        <li
                            key={answer.id}
                            className="flex items-center gap-2 rounded-lg border px-3 py-2"
                        >
                            <input
                                type="checkbox"
                                checked={answer.is_correct}
                                onChange={e =>
                                    onChangeAnswer(answer.id, {
                                        is_correct: e.target.checked,
                                    })
                                }
                            />

                            <input
                                className="flex-1 border-none outline-none"
                                value={answer.text}
                                onChange={e =>
                                    onChangeAnswer(answer.id, {
                                        text: e.target.value,
                                    })
                                }
                                placeholder="Текст ответа"
                            />

                            <button
                                onClick={() =>
                                    onRemoveAnswer(answer.id)
                                }
                                className="text-red-500 text-sm"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuestionEditor;
