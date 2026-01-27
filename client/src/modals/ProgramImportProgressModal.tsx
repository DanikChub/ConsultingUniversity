import React, { useEffect, useMemo, useState } from 'react';

type Props = {
    open: boolean;
    progress: number;
};

const STATUS_MESSAGES = [
    'Подготавливаем окружение…',
    'Загружаем структуру программы…',
    'Анализируем код и зависимости…',
    'Распаковываем архив…',
    'Проверяем целостность данных…',
    'Создаём темы и пункты…',
    'Собираем программу воедино…',
    'Почти готово…'
];

const ProgramImportProgressModal: React.FC<Props> = ({ open, progress }) => {
    const [statusIndex, setStatusIndex] = useState(0);

    // блокируем скролл
    useEffect(() => {
        if (!open) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    // смена статусных сообщений
    useEffect(() => {
        if (!open) return;

        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        }, 5200);

        return () => clearInterval(interval);
    }, [open]);



    const isUploading = progress < 100;

    const statusText = useMemo(
        () => STATUS_MESSAGES[statusIndex],
        [statusIndex]
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-2xl animate-fadeIn">
                {/* заголовок */}
                <h2 className="text-2xl font-bold text-center">
                    Импорт программы
                </h2>

                <p className="mt-2 text-center text-sm text-gray-500">
                    Это может занять до <b>5 минут</b>. Пожалуйста, не закрывайте страницу.
                </p>

                {/* статус */}
                <div className="mt-10 text-center">
                    <p className="text-lg font-medium text-blue-600 animate-pulse">
                        {statusText}
                    </p>
                </div>

                {/* progress bar */}
                <div className="mt-8">
                    <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="mt-3 text-center text-sm text-gray-600">
                        {progress}% завершено
                    </p>
                </div>

                {/* пояснения */}
                <div className="mt-8 space-y-2 text-sm text-gray-500 text-center">
                    {isUploading ? (
                        <>
                            <p>Мы обрабатываем файл и создаём структуру программы.</p>
                            <p>Большие файлы могут импортироваться дольше — это нормально.</p>
                        </>
                    ) : (
                        <p>Файл загружен. Выполняется финальная обработка данных…</p>
                    )}
                </div>

                {/* предупреждение */}
                <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-400 text-center">
                    Закрытие или обновление страницы прервёт импорт
                    и может привести к частично созданной программе
                </div>
            </div>
        </div>
    );
};

export default ProgramImportProgressModal;
