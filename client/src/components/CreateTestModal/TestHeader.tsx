import React from 'react';

interface Props {
    title: string;
    description?: string;
    time_limit?: number | null;
    final_test?: boolean | null;
    onChange: (fields: {
        title?: string;
        description?: string;
        time_limit?: number | null;
        final_test?: boolean | null;
    }) => void;
}

const TestHeader: React.FC<Props> = ({
                                         title,
                                         description,
                                         time_limit,
                                         final_test,
                                         onChange,
                                     }) => {


    return (
        <div className="space-y-3">

            {/* TITLE + TIME */}
            <div className="flex gap-3 items-end">

                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">
                        Название теста
                    </label>
                    <input
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={title}
                        onChange={e => onChange({title: e.target.value})}
                        placeholder="Введите название теста"
                    />
                </div>

                <div className="w-28 shrink-0">
                    <label className="block text-xs font-medium text-gray-500 text-right">
                        Время
                    </label>
                    <div className="relative mt-1">
                        <input
                            type="number"
                            min={0}
                            className="w-full rounded-lg border px-2 py-2 pr-8 text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none"
                            value={time_limit ?? ''}
                            onChange={e =>
                                onChange({
                                    time_limit: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                })
                            }
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            мин
                        </span>
                    </div>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div>
                <label className="block text-xs font-medium text-gray-500">
                    Описание
                </label>
                <textarea
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[60px] resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    value={description ?? ''}
                    onChange={e => onChange({description: e.target.value})}
                    placeholder="Краткое описание теста"
                />
            </div>

            <div className="flex items-center">
                <label className="block text-xs font-medium text-gray-500 mr-2">
                    Финальный тест
                </label>
                <input
                    type="checkbox"
                    checked={final_test}
                    onChange={e =>
                        onChange({
                            final_test: !final_test ? true : false
                        })
                    }
                />
            </div>
        </div>

    );
};

export default TestHeader;
