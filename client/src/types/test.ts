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




export interface TestAnswer {
    id?: number;
    value: string;
}

export interface TestPunct {
    id: number;
    question: string;
    answers: string[];
    correct_answer: number[];
    several_answers: boolean;
}

export interface ThemePunct {
    test_id?: number | null;
    test_title?: string | null;
}

export interface Theme {
    have_test: boolean;
    puncts: ThemePunct[];
}

export interface CreateTestProps {
    show: { show: boolean; i: number; j: number; remake?: number };
    setShow: (value: any) => void;
    themesArray: Theme[];
    setThemesArray: (value: Theme[]) => void;
    counter: number;
    setCounter: (value: number | ((prev: number) => number)) => void;
}
