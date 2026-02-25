import React, { useMemo } from 'react';
import { useTestEditor } from '../hooks/useTestEditor';

import Modal from '../components/ui/Modal';
import Button from '../shared/ui/buttons/Button';

import TestHeader from '../components/CreateTestModal/TestHeader';
import QuestionNav from '../components/CreateTestModal/QuestionNav';
import QuestionEditor from '../components/CreateTestModal/QuestionEditor';

import type { Test } from '../entities/test/model/type';

interface Props {
    targetId: number;
    onDelete?: (fileId: number) => Promise<void>;
    onClose: () => void;
    onSubmit?: (test: Test) => void;
    mode: 'create' | 'edit'
}

const CreateTestModal: React.FC<Props> = ({
                                              targetId,
                                              onDelete,
                                              onClose,
                                              onSubmit,
                                              mode
                                          }) => {
    const {
        test,
        loading,
        error,

        activeQuestionIndex,
        setActiveQuestionIndex,

        updateTest,

        addQuestion,
        updateQuestion,
        removeQuestion,

        addAnswer,
        updateAnswer,
        removeAnswer,
        publishCurrentTest,

        testDebounces,
        questionDebounces,
        answerDebounces
    } = useTestEditor(targetId, mode);

    /* ---------------- SAFE ACTIVE QUESTION ---------------- */

    const activeQuestion = useMemo(() => {
        if (!test) return null;
        return test.questions[activeQuestionIndex] ?? null;
    }, [test, activeQuestionIndex]);

    /* ---------------- HANDLERS ---------------- */

    const handleCreate = () => {
        testDebounces.current.forEach(d => d.flush());
        questionDebounces.current.forEach(d => d.flush());
        answerDebounces.current.forEach(d => d.flush());
        if (!test) return;
        onSubmit?.(test);
    };


    const handleDelete = async () => {
        if (!onDelete) return;
        const ok = window.confirm('Удалить тест?');
        if (!ok) return;



        await onDelete(test.id);
        onClose();
    };

    const handleClose = async () => {
        testDebounces.current.forEach(d => d.flush());
        questionDebounces.current.forEach(d => d.flush());
        answerDebounces.current.forEach(d => d.flush());

        if (!test) return;
        onSubmit?.(test);
    }


    const handlePublish = async () => {
        const publishedTest = await publishCurrentTest();
        if (!publishedTest) return;

        onSubmit?.(publishedTest);
    };


    /* ---------------- RENDER ---------------- */

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
                <div className="w-full max-w-5xl h-2/3 rounded-xl bg-white p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Редактирование теста</h3>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            ✕
                        </button>
                    </div>
                    <div className="p-8 text-center text-gray-500">
                        {mode == 'create' ? 'Создаём тест…' : 'Загружаем тест'}
                    </div>
                </div>
            </div>
        );
    }

    if (!test) return null;
    console.log(test)
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-5xl min-h-[786px] rounded-xl bg-white p-6 shadow-xl">

                {/* header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Редактирование теста {test.final_test && <span className="font-bold text-blue-500">[Финальный тест]</span>}</h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>
                <div className="flex flex-col h-full">

                    {/* -------- HEADER -------- */}
                    <div className="border-b pb-4 mb-4">
                        <TestHeader
                            title={test.title}
                            description={test.description}
                            time_limit={test.time_limit}
                            final_test={test.final_test}
                            onChange={updateTest}
                        />
                    </div>

                    {/* -------- BODY -------- */}
                    <div className="flex gap-4 flex-1 overflow-hidden">

                        {/* QUESTIONS NAV */}
                        <aside className="w-64 border-r pr-2 overflow-y-auto">
                            <QuestionNav
                                questions={test.questions}
                                activeIndex={activeQuestionIndex}
                                onSelect={setActiveQuestionIndex}
                                onAdd={addQuestion}
                                onRemove={removeQuestion}
                            />
                        </aside>

                        {/* QUESTION EDITOR */}
                        <main className="flex-1 overflow-y-auto px-2">
                            {activeQuestion ? (
                                <QuestionEditor
                                    question={activeQuestion}
                                    onChangeQuestion={updateQuestion}
                                    onAddAnswer={addAnswer}
                                    onChangeAnswer={updateAnswer}
                                    onRemoveAnswer={removeAnswer}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Добавьте вопрос
                                </div>
                            )}
                        </main>
                    </div>

                    {/* -------- FOOTER -------- */}
                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        {error && (
                            <span className="text-sm text-red-500">
                                {error}
                            </span>
                        )}

                        <div className="flex gap-2 ml-auto">

                            <Button
                                variant="red"
                                onClick={handleDelete}
                            >
                                Удалить
                            </Button>



                            <Button
                                onClick={handlePublish}
                                disabled={test.questions.length === 0}
                            >
                                Проверить тест
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTestModal;
