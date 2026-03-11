import React from 'react';
import type { Question, Answer } from '../../entities/test/model/type';
import Button from '../../shared/ui/buttons/Button';
import {AutoResizeTextarea} from "../../shared/ui/inputs/AutoResizeTextarea";

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
    readOnly?: boolean;
}

const QuestionEditor: React.FC<Props> = ({
                                             question,
                                             onChangeQuestion,
                                             onAddAnswer,
                                             onChangeAnswer,
                                             onRemoveAnswer,
                                             readOnly
                                         }) => {
    return (
        <div className="space-y-6">

            {/* QUESTION */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Текст вопроса
                </label>
                <AutoResizeTextarea
                    disabled={readOnly}
                    className="mt-1 w-full rounded-lg border px-3 py-2 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    value={question?.text}
                    onChange={val => onChangeQuestion(question.id, { text: val })}
                    placeholder="Введите текст вопроса"
                />
            </div>

            {/* ANSWERS */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700">
                        Ответы
                    </h4>
                    {!readOnly && (
                        <Button onClick={() => onAddAnswer(question.id)}>
                            Добавить ответ
                        </Button>
                    )}
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
                            className="flex items-center gap-2 rounded-lg border px-3 py-1"
                        >
                            <input
                                disabled={readOnly}
                                type="checkbox"
                                checked={answer.is_correct}
                                onChange={e =>
                                    onChangeAnswer(answer.id, {
                                        is_correct: e.target.checked,
                                    })
                                }
                            />

                            <AutoResizeTextarea
                                disabled={readOnly}
                                className="mt-1 w-full rounded-lg border-none px-1 min-h-[20px] resize-none  outline-none"
                                value={answer.text}
                                onChange={val => onChangeAnswer(answer.id, { text: val })}
                                placeholder="Текст ответа"
                            />
                            {!readOnly && (
                                <button
                                    onClick={() =>
                                        onRemoveAnswer(answer.id)
                                    }
                                    className="text-red-500 text-sm"
                                >
                                    ✕
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuestionEditor;
