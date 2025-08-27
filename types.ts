export interface VocabularyWord {
    word: string;
    ipa: string;
    meaning: string;
    example: string;
}

export interface Lesson {
    id: string;
    title: string;
    words: VocabularyWord[];
    level: string;
    unit: string;
    lessonNumber: number;
    classId: string;
    className: string;
}

export type Role = 'teacher' | 'student';

export interface User {
    name: string;
    id?: string; // Teacher ID or Student's Class ID
}

export interface StudentProgress {
    completedLessons: Set<string>;
    sentenceStreak: number;
    badges: string[];
    mySentenceBank: string[];
    errorStats: {
        spelling: number;
        meaning: number;
        wordChoice: number;
    };
}

export interface AppState {
    role: Role | null;
    user: User | null;
    lessons: Lesson[];
    activeLessonId: string | null;
    view: 'landing' | 'teacher_dashboard' | 'student_learning' | 'student_dashboard';
    studentProgress: StudentProgress | null;
}

export type LearningStep = 'mini_quiz' | 'learn' | 'practice1' | 'practice2' | 'practice3' | 'completed';