export type LectureType = 'text' | 'video' | 'quiz';

export interface BaseLecture {
    id?: number;
    courseId: number;
    title: string;
    type: LectureType;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TextLecture extends BaseLecture {
    type: 'text';
    content: string;
    videoUrl?: null;
    questions?: null;
}

export interface VideoLecture extends BaseLecture {
    type: 'video';
    videoUrl: string;
    content?: null;
    questions?: null;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    type: 'multiple' | 'text';
    correctAnswers?: number[];
    correctText?: string;
}


export interface QuizLecture extends BaseLecture {
    type: 'quiz';
    questions: QuizQuestion[];
    content?: null;
    videoUrl?: null;
}

export type Lecture = TextLecture | VideoLecture | QuizLecture;