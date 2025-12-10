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
