import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

import {
    createTest,
    getOneTest,
    updateTestFields,
    deleteTest,
    createQuestion,
    updateQuestionFields,
    deleteQuestion,
    createAnswer,
    updateAnswerFields,
    deleteAnswer,
    publishTest,
} from '../entities/test/api/test.api';
import type { Answer, Question, Test } from "../entities/test/model/type";

export const useTestEditor = (targetId: number, mode: 'create' | 'edit') => {
    const [test, setTest] = useState<Test | null>(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isFinal = test?.final_test ?? false;

    /* ------------------ HELPERS ------------------ */
    const handleError = (e: unknown, fallback = 'Ошибка запроса') => {
        console.error(e);
        setError(fallback);
    };

    const safeRequest = async <T>(cb: () => Promise<T>, fallback?: string): Promise<T | null> => {
        try {
            return await cb();
        } catch (e) {
            handleError(e, fallback);
            return null;
        }
    };

    /* ------------------ INIT ------------------ */
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        (async () => {
            let fullTest: Test | null = null;

            if (mode === 'create') {
                const created = await safeRequest(
                    () => createTest({ punctId: targetId, final_test: false }),
                    'Не удалось создать тест'
                );
                if (!created || !mounted) return;

                fullTest = await safeRequest(
                    () => getOneTest(created.id),
                    'Не удалось загрузить тест'
                );
            }

            if (mode === 'edit') {
                fullTest = await safeRequest(
                    () => getOneTest(targetId),
                    'Не удалось загрузить тест'
                );
            }

            if (!fullTest || !mounted) return;

            setTest({
                ...fullTest,
                questions: (fullTest.questions ?? []).map(q => ({
                    ...q,
                    answers: q.answers ?? []
                })),
            });

            setLoading(false);
        })();

        return () => { mounted = false; };
    }, [targetId, mode]);

    /* ------------------ DEBOUNCE MAP ------------------ */
    const testDebounces = useRef<Map<number, ReturnType<typeof debounce>>>(new Map());
    const questionDebounces = useRef<Map<number, ReturnType<typeof debounce>>>(new Map());
    const answerDebounces = useRef<Map<number, ReturnType<typeof debounce>>>(new Map());

    const debouncedUpdateTestFields = (testId: number, fields: Partial<Test>) => {
        if (isFinal) return;

        if (!testDebounces.current.has(testId)) {
            testDebounces.current.set(
                testId,
                debounce(async (fields: Partial<Test>) => {
                    try { await updateTestFields(testId, fields); }
                    catch (e) { handleError(e, 'Не удалось сохранить тест'); }
                }, 700)
            );
        }
        testDebounces.current.get(testId)!(fields);
    };

    const debouncedUpdateQuestionFields = (questionId: number, fields: Partial<Pick<Question, 'text' | 'type'>>) => {
        if (isFinal) return;

        if (!questionDebounces.current.has(questionId)) {
            questionDebounces.current.set(
                questionId,
                debounce(async (fields: Partial<Pick<Question, 'text' | 'type'>>) => {
                    try { await updateQuestionFields(questionId, fields); }
                    catch (e) { handleError(e, 'Не удалось обновить вопрос'); }
                }, 700)
            );
        }
        questionDebounces.current.get(questionId)!(fields);
    };

    const answerPendingFields = useRef<Map<number, Partial<Pick<Answer, 'text' | 'is_correct'>>>>(
        new Map()
    );

    const debouncedUpdateAnswerFields = (answerId: number, fields: Partial<Pick<Answer, 'text' | 'is_correct'>>) => {
        if (isFinal) return;

        const prev = answerPendingFields.current.get(answerId) || {};
        answerPendingFields.current.set(answerId, { ...prev, ...fields });

        if (!answerDebounces.current.has(answerId)) {
            answerDebounces.current.set(
                answerId,
                debounce(async () => {
                    const data = answerPendingFields.current.get(answerId);
                    if (!data) return;

                    try {
                        await updateAnswerFields(answerId, data);
                        answerPendingFields.current.delete(answerId);
                    } catch (e) {
                        handleError(e, 'Не удалось обновить ответ');
                    }
                }, 700)
            );
        }

        answerDebounces.current.get(answerId)!();
    };

    useEffect(() => {
        return () => {
            testDebounces.current.forEach(d => d.cancel());
            questionDebounces.current.forEach(d => d.cancel());
            answerDebounces.current.forEach(d => d.cancel());
        };
    }, []);

    /* ------------------ UPDATE FUNCTIONS ------------------ */
    const updateTest = (fields: Partial<Test>) => {
        if (!test || isFinal) return;
        setTest(prev => ({ ...prev!, ...fields, status: 'draft' }));
        debouncedUpdateTestFields(test.id, fields);
    };

    const updateQuestion = (questionId: number, fields: Partial<Pick<Question, 'text' | 'type'>>) => {
        if (!test || isFinal) return;
        setTest(prev => ({
            ...prev!,
            questions: prev!.questions.map(q =>
                q.id === questionId ? { ...q, ...fields, status: 'draft' } : q
            ),
        }));
        debouncedUpdateQuestionFields(questionId, fields);
    };

    const updateAnswer = (answerId: number, fields: Partial<Pick<Answer, 'text' | 'is_correct'>>) => {
        if (!test || isFinal) return;
        setTest(prev => ({
            ...prev!,
            questions: prev!.questions.map(q => ({
                ...q,
                answers: q.answers.map(a => a.id === answerId ? { ...a, ...fields } : a),
            })),
        }));
        debouncedUpdateAnswerFields(answerId, fields);
    };

    /* ------------------ CRUD FUNCTIONS ------------------ */
    const addQuestion = async () => {
        if (!test || isFinal) return;
        const q = await safeRequest(() => createQuestion(test.id), 'Не удалось добавить вопрос');
        if (!q) return;
        setTest(prev => ({ ...prev!, questions: [...prev!.questions, { ...q, answers: [] }], status: 'draft' }));
        setActiveQuestionIndex(test.questions.length);
    };

    const removeQuestion = async (questionId: number) => {
        if (!test || isFinal) return;
        setTest(prev => ({ ...prev!, questions: prev!.questions.filter(q => q.id !== questionId) }));
        await safeRequest(() => deleteQuestion(questionId), 'Не удалось удалить вопрос');
    };

    const addAnswer = async (questionId: number) => {
        if (!test || isFinal) return;
        const answer = await safeRequest(() => createAnswer(questionId), 'Не удалось добавить ответ');
        if (!answer) return;
        setTest(prev => ({
            ...prev!,
            questions: prev!.questions.map(q =>
                q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
            ),
        }));
    };

    const removeAnswer = async (answerId: number) => {
        if (!test || isFinal) return;
        setTest(prev => ({
            ...prev!,
            questions: prev!.questions.map(q => ({
                ...q,
                answers: q.answers.filter(a => a.id !== answerId)
            })),
        }));
        await safeRequest(() => deleteAnswer(answerId), 'Не удалось удалить ответ');
    };

    const removeTest = async () => {
        if (!test) return;
        const ok = await safeRequest(() => deleteTest(test.id), 'Не удалось удалить тест');
        if (ok) setTest(null);
    };

    const publishCurrentTest = async (): Promise<Test | null> => {
        if (!test) return;

        try {
            await publishTest(test.id);
            const publishedTest: Test = { ...test, status: 'published' };
            setTest(publishedTest);
            return publishedTest;
        } catch (e: any) {
            const message =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                'Тест не прошёл проверку перед публикацией';

            setError(message);
            return;
        }
    };

    return {
        test,
        loading,
        error,
        isFinal,
        clearError: () => setError(null),
        activeQuestionIndex,
        setActiveQuestionIndex,
        updateTest,
        updateQuestion,
        updateAnswer,
        addQuestion,
        removeQuestion,
        addAnswer,
        removeAnswer,
        removeTest,
        publishCurrentTest,
        testDebounces,
        questionDebounces,
        answerDebounces
    };
};