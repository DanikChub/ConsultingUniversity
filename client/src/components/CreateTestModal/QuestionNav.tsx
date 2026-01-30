import React from 'react';
import type { Question } from '../../entities/test/model/type';
import Button from '../../shared/ui/buttons/Button';

interface Props {
    questions: Question[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onAdd: () => void;
    onRemove?: (questionId: number) => void;
}

const QuestionNav: React.FC<Props> = ({
                                          questions,
                                          activeIndex,
                                          onSelect,
                                          onAdd,
                                          onRemove,
                                      }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                    Вопросы
                </h3>
                <Button onClick={onAdd}>
                    +
                </Button>
            </div>

            {questions.length === 0 && (
                <div className="text-sm text-gray-400">
                    Вопросов пока нет
                </div>
            )}

            <ul className="space-y-1 h-[400px] overflow-y-auto">
                {questions.map((q, index) => (
                    <li
                        key={q.id}
                        className={`group flex items-center justify-between rounded-md px-2 py-1 cursor-pointer text-sm
                            ${
                            index === activeIndex
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                        }`}
                        onClick={() => onSelect(index)}
                    >
                        <span className="truncate">
                            {index + 1}. {q.text || 'Без текста'}
                        </span>

                        {onRemove && (
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    onRemove(q.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-red-500 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionNav;
