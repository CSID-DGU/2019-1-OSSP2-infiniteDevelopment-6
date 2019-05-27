export interface IUser {
    name: string;
    pw: string;
}

export interface IProblem {
    number: string;
    type: string;
    question: string;
    answer: string;
}

export interface IFile {
    name: string;
    isDirectory: boolean;
    ext?: string;
    size?: number;
    files?: Array<IFile>;
    data?: any;
}