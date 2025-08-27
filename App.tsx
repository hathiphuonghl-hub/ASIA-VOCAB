import React, { useState, useMemo, useCallback } from 'react';
import { AppContext } from './contexts/AppContext';
import type { User, VocabularyWord, Lesson, AppState, Role, StudentProgress } from './types';
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLearningFlow from './pages/StudentLearningFlow';
import StudentDashboard from './pages/StudentDashboard';

const initialStudentProgress: StudentProgress = {
    completedLessons: new Set(),
    sentenceStreak: 0,
    badges: [],
    mySentenceBank: [],
    errorStats: { spelling: 0, meaning: 0, wordChoice: 0 },
};

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>({
        role: null,
        user: null,
        lessons: [],
        activeLessonId: null,
        view: 'landing',
        studentProgress: null,
    });

    const login = useCallback((role: Role, user: User) => {
        const studentView = 'student_dashboard';
        setAppState(prev => ({ 
            ...prev, 
            role, 
            user, 
            view: role === 'teacher' ? 'teacher_dashboard' : studentView,
            studentProgress: role === 'student' ? initialStudentProgress : null
        }));
    }, []);

    const logout = useCallback(() => {
        // Keep lessons when logging out, but reset user state
        setAppState(prev => ({ ...prev, role: null, user: null, view: 'landing', studentProgress: null, activeLessonId: null }));
    }, []);

    const createLesson = useCallback((title: string, words: VocabularyWord[], details: { level: string, unit: string, lessonNumber: number, classId: string, className: string }) => {
        const newLesson: Lesson = {
            id: `lesson-${Date.now()}`,
            words,
            title,
            ...details
        };
        setAppState(prev => ({ ...prev, lessons: [...prev.lessons, newLesson] }));
    }, []);

    const setActiveLesson = useCallback((lessonId: string) => {
        setAppState(prev => ({...prev, activeLessonId: lessonId}));
    }, []);

    const deleteLesson = useCallback((lessonId: string) => {
        setAppState(prev => {
            const newLessons = prev.lessons.filter(l => l.id !== lessonId);
            const newActiveLessonId = prev.activeLessonId === lessonId ? null : prev.activeLessonId;
            return {
                ...prev,
                lessons: newLessons,
                activeLessonId: newActiveLessonId
            };
        });
    }, []);

    const startLearning = useCallback(() => {
        if (appState.activeLessonId) {
            setAppState(prev => ({ ...prev, view: 'student_learning' }));
        }
    }, [appState.activeLessonId]);
    
    const viewDashboard = useCallback(() => {
        if (appState.role === 'student') {
             setAppState(prev => ({ ...prev, view: 'student_dashboard'}));
        }
    }, [appState.role]);

    const addSentenceToBank = useCallback((sentence: string) => {
        setAppState(prev => {
            if (!prev.studentProgress) return prev;
            if (prev.studentProgress.mySentenceBank.includes(sentence)) {
                return prev;
            }
            return {
                ...prev,
                studentProgress: {
                    ...prev.studentProgress,
                    mySentenceBank: [...prev.studentProgress.mySentenceBank, sentence],
                }
            }
        })
    }, []);

    const completeLesson = useCallback((lessonId: string) => {
        setAppState(prev => {
            if (!prev.studentProgress || !prev.user) return prev;

            // Add lesson to completed set
            const newCompletedLessons = new Set(prev.studentProgress.completedLessons);
            newCompletedLessons.add(lessonId);

            const completedLesson = prev.lessons.find(l => l.id === lessonId);
            if (!completedLesson) return prev;
            
            // Check for level completion and award badge
            const studentClassId = prev.user.id;
            const lessonsInLevel = prev.lessons.filter(l => l.level === completedLesson.level && l.classId === studentClassId);
            const allInLevelCompleted = lessonsInLevel.every(l => newCompletedLessons.has(l.id));
            
            let newBadges = [...prev.studentProgress.badges];
            const badgeName = `Level ${completedLesson.level} Master`;
            if (allInLevelCompleted && !newBadges.includes(badgeName)) {
                newBadges.push(badgeName);
            }

            return {
                ...prev,
                studentProgress: {
                    ...prev.studentProgress,
                    completedLessons: newCompletedLessons,
                    badges: newBadges
                }
            };
        });
    }, []);

    const appContextValue = useMemo(() => ({
        ...appState,
        login,
        logout,
        createLesson,
        setActiveLesson,
        deleteLesson,
        startLearning,
        viewDashboard,
        addSentenceToBank,
        completeLesson,
    }), [appState, login, logout, createLesson, setActiveLesson, deleteLesson, startLearning, viewDashboard, addSentenceToBank, completeLesson]);

    const renderContent = () => {
        switch (appState.view) {
            case 'teacher_dashboard':
                return <TeacherDashboard />;
            case 'student_learning':
                return <StudentLearningFlow />;
            case 'student_dashboard':
                 return <StudentDashboard />;
            case 'landing':
            default:
                return <LandingPage />;
        }
    };

    return (
        <AppContext.Provider value={appContextValue}>
            <div className="min-h-screen font-sans text-gray-800">
                {renderContent()}
            </div>
        </AppContext.Provider>
    );
};

export default App;