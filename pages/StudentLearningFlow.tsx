import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { LearningStep } from '../types';
import Header from '../components/Header';
import MiniQuiz from '../components/learning/MiniQuiz';
import Learn from '../components/learning/Learn';
import Practice1 from '../components/learning/Practice1';
import Practice2 from '../components/learning/Practice2';
import Practice3 from '../components/learning/Practice3';
import Button from '../components/Button';
import { CheckCircle, ArrowRight } from 'lucide-react';


const StudentLearningFlow: React.FC = () => {
    const context = useContext(AppContext);
    const [step, setStep] = useState<LearningStep>('mini_quiz');

    const lesson = useMemo(() => {
        if (!context || !context.activeLessonId) return null;
        return context.lessons.find(l => l.id === context.activeLessonId);
    }, [context]);

    useEffect(() => {
        if (step === 'completed' && lesson && context) {
            context.completeLesson(lesson.id);
        }
    }, [step, lesson, context]);

    if (!lesson) {
        return (
            <div>
                <Header />
                <main className="p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">No active lesson found.</h2>
                    <p className="text-gray-500">Please wait for your teacher to set an active lesson, or check your dashboard.</p>
                </main>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 'mini_quiz':
                return <MiniQuiz words={lesson.words} onComplete={() => setStep('learn')} />;
            case 'learn':
                return <Learn words={lesson.words} onComplete={() => setStep('practice1')} />;
            case 'practice1':
                return <Practice1 words={lesson.words} onComplete={() => setStep('practice2')} />;
            case 'practice2':
                 return <Practice2 words={lesson.words} onComplete={() => setStep('practice3')} />;
            case 'practice3':
                 return <Practice3 words={lesson.words} onComplete={() => setStep('completed')} />;
            case 'completed':
                return (
                    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-pulse" />
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Lesson Complete!</h2>
                        <p className="text-lg text-gray-700">You have finished the lesson "{lesson.title}".</p>
                        <p className="text-gray-600 mt-2 font-semibold text-indigo-600">You have unlocked the next lesson!</p>
                        <Button onClick={context?.viewDashboard} className="mt-6">
                            Back to Dashboard <ArrowRight className="inline ml-2 h-5 w-5"/>
                        </Button>
                    </div>
                );
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                {renderStep()}
            </main>
        </div>
    );
};

export default StudentLearningFlow;