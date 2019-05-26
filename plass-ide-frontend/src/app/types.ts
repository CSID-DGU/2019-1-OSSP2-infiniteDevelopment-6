export interface ProblemContent {
    number: string;
    type: string;
    question: string;
    answer: string;
}

export interface Problem {
    id: number;
    name: string;
    content?: string;
    input?: string;
    output?: string;
    rank: number;
    created: string;
    category: string;
    isSolve?: boolean;
    testCases?: Array<TestCase>;
}

export interface TestCase {
    id: number;
    input: string;
    output: string;
}

export interface AccordionEvent {
    index: number;
    originalEvent: MouseEvent;
}
