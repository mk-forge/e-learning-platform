export type LectureType = 'text' | 'video' | 'quiz';

export interface BaseLecture {
    id?: number;
    courseId: number;
    title: string;
    type: LectureType;
    order: number;
}

export interface TextLecture extends BaseLecture {
    type: 'text';
    content: string;
}

export interface VideoLecture extends BaseLecture {
    type: 'video';
    videoUrl: string;
    description?: string;
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
}

export type Lecture = TextLecture | VideoLecture | QuizLecture;