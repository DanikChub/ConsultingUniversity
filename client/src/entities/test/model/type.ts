export type TestStatus = 'draft' | 'published' | 'archived';

export type QuestionType = 'single' | 'multiple' | 'text';


/* =========================
   ANSWER
   ========================= */

export interface Answer {
    id: number;
    text: string;
    is_correct: boolean;
    order_index: number;
    questionId: number;
}


/* =========================
   QUESTION
   ========================= */

export interface Question {
    id: number;
    text: string;
    type: QuestionType;
    order_index: number;
    testId: number;

    answers: Answer[];
}


/* =========================
   TEST
   ========================= */

export interface Test {
    id: number;
    title: string | null;
    description: string | null;
    time_limit: number | null;
    status: TestStatus;
    order_index: number;
    punctId: number;

    questions: Question[];
}






export interface ThemePunct {
    test_id?: number | null;
    test_title?: string | null;
}

export interface Theme {
    have_test: boolean;
    puncts: ThemePunct[];
}



export interface TestAttempt {
    id: number;
    testId: number;
    enrollmentId: number;
    score: number;
    passed: boolean;
    createdAt: string;
    updatedAt: string;
    answers: Array<{
        questionId: number;
        selectedAnswers: number[];
        textAnswer?: string;
        isCorrect: boolean;
    }>;
}


export interface SubmitAttemptDto {
    enrollmentId: number;   // текущий enrollment
    answers: Array<{
        questionId: number;
        selected_answer_ids: number[]; // id выбранных ответов
        textAnswer?: string;       // если текстовый ответ
    }>;
}

export interface AttemptResponse {
    attemptId: number;
    score: number;
    passed: 'Complete' | 'Fail'
    questions: {
        id: number;
        answers: Array<{
            id: number;
            text: string;
            is_correct: boolean;
            is_selected: boolean;
            answers?: Array<{id:number,text:string,is_correct:boolean}>
        }>;
    }[];
}