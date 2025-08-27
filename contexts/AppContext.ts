import { createContext } from 'react';
import type { VocabularyWord, AppState, Role, User, Lesson } from '../types';

interface AppContextType extends AppState {
    login: (role: Role, user: User) => void;
    logout: () => void;
    createLesson: (title: string, words: VocabularyWord[], details: { level: string; unit: string; lessonNumber: number; classId: string; className: string; }) => void;
    setActiveLesson: (lessonId: string) => void;
    deleteLesson: (lessonId: string) => void;
    startLearning: () => void;
    viewDashboard: () => void;
    addSentenceToBank: (sentence: string) => void;
    completeLesson: (lessonId: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);