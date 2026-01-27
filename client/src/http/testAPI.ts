import {$authHost, $host} from "./index";


import {type Answer, type Question, Test} from '../types/test'




// создать болванку теста
export const publishTest = async (
    testId: number
): Promise<Test> => {
    const { data } = await $authHost.post<Test>(`api/test/${testId}/publish`);
    return data;
};

// создать болванку теста
export const createTest = async (
    punctId: number
): Promise<Test> => {
    const { data } = await $authHost.post<Test>('api/test', { punctId });
    return data;
};

// получить один тест целиком
export const getOneTest = async (
    testId: number
): Promise<Test> => {
    const { data } = await $authHost.get<Test>(`api/test/${testId}`);
    return data;
};

// обновить поля теста
export const updateTestFields = async (
    testId: number,
    fields: Partial<Pick<Test, 'title' | 'description' | 'time_limit' | 'status'>>
): Promise<Test> => {
    const { data } = await $authHost.patch<Test>(
        `api/test/${testId}`,
        fields
    );
    return data;
};

// удалить тест
export const deleteTest = async (
    testId: number
): Promise<{ success: true }> => {
    const { data } = await $authHost.delete<{ success: true }>(
        `api/test/${testId}`
    );
    return data;
};


// создать болванку вопроса
export const createQuestion = async (
    testId: number
): Promise<Question> => {
    const { data } = await $authHost.post<Question>('api/test/question', { testId });
    return data;
};

// обновить вопрос
export const updateQuestionFields = async (
    questionId: number,
    fields: Partial<Pick<Question, 'text' | 'type'>>
): Promise<Question> => {
    const { data } = await $authHost.patch<Question>(
        `api/test/question/${questionId}`,
        fields
    );
    return data;
};

// удалить вопрос
export const deleteQuestion = async (
    questionId: number
): Promise<{ success: true }> => {
    const { data } = await $authHost.delete<{ success: true }>(
        `api/test/question/${questionId}`
    );
    return data;
};


// создать болванку ответа
export const createAnswer = async (
    questionId: number
): Promise<Answer> => {
    const { data } = await $authHost.post<Answer>('api/test/answer', { questionId });
    return data;
};

// обновить ответ
export const updateAnswerFields = async (
    answerId: number,
    fields: Partial<Pick<Answer, 'text' | 'is_correct'>>
): Promise<Answer> => {
    const { data } = await $authHost.patch<Answer>(
        `api/test/answer/${answerId}`,
        fields
    );
    return data;
};

// удалить ответ
export const deleteAnswer = async (
    answerId: number
): Promise<{ success: true }> => {
    const { data } = await $authHost.delete<{ success: true }>(
        `api/test/answer/${answerId}`
    );
    return data;
};


/*
export const createTest = async (title, time_limit, puncts) => {
   
    const {data} = await $authHost.post('api/test', {title, time_limit, puncts: puncts} )

    return data;
}
*/

export const updateTestStatistic = async (user_id, test_id, punctsStatistic) => {
   
    const {data} = await $authHost.post('api/test/updateTest', {user_id, test_id, punctsStatistic} )

    return data;
}

export const getTestStatistic = async (user_id, test_id) => {
   
    const {data} = await $authHost.post('api/test/getStatistic', {user_id, test_id} )

    return data;
}

/*
export const remakeTest = async (id, title, time_limit, puncts) => {
    
    const {data} = await $authHost.post(`api/test/remake`, {id: id, title: title, time_limit, puncts: puncts})

    return data;
}
*/
