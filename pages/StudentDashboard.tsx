import React, { useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { BookMarked, Award, TrendingUp, NotebookPen, PlayCircle, Lock, CheckCircle, BookOpenCheck } from 'lucide-react';
import { Lesson } from '../types';

// Helper to sort lessons properly
const sortLessons = (lessons: Lesson[]): Lesson[] => {
    return lessons.sort((a, b) => {
        if (a.level < b.level) return -1;
        if (a.level > b.level) return 1;
        if (parseInt(a.unit) < parseInt(b.unit)) return -1;
        if (parseInt(a.unit) > parseInt(b.unit)) return 1;
        if (a.lessonNumber < b.lessonNumber) return -1;
        if (a.lessonNumber > b.lessonNumber) return 1;
        return 0;
    });
};

const StudentDashboard: React.FC = () => {
    const context = useContext(AppContext);

    if (!context || !context.user || !context.studentProgress) {
        return <div>Loading student data...</div>;
    }

    const { user, studentProgress, lessons, setActiveLesson, startLearning } = context;
    const { mySentenceBank, completedLessons, badges } = studentProgress;
    const studentClassId = user.id;

    const { lessonsByLevel, lessonStatuses } = useMemo(() => {
        const classLessons = sortLessons(lessons.filter(lesson => lesson.classId === studentClassId));
        
        const lessonsByLevel: { [level: string]: Lesson[] } = {};
        classLessons.forEach(lesson => {
            if (!lessonsByLevel[lesson.level]) {
                lessonsByLevel[lesson.level] = [];
            }
            lessonsByLevel[lesson.level].push(lesson);
        });

        let isNextLessonFound = false;
        const lessonStatuses: { [lessonId: string]: 'completed' | 'unlocked' | 'locked' } = {};
        classLessons.forEach(lesson => {
            if (completedLessons.has(lesson.id)) {
                lessonStatuses[lesson.id] = 'completed';
            } else if (!isNextLessonFound) {
                lessonStatuses[lesson.id] = 'unlocked';
                isNextLessonFound = true;
            } else {
                lessonStatuses[lesson.id] = 'locked';
            }
        });

        return { lessonsByLevel, lessonStatuses };
    }, [lessons, studentClassId, completedLessons]);

    const handleStartLesson = (lessonId: string) => {
        setActiveLesson(lessonId);
        startLearning();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Welcome back, {user.name}!
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* My Learning Path Card */}
                    <div className="lg:col-span-3 space-y-6">
                        {Object.keys(lessonsByLevel).length > 0 ? (
                            Object.entries(lessonsByLevel).map(([level, levelLessons]) => {
                                const completedCount = levelLessons.filter(l => lessonStatuses[l.id] === 'completed').length;
                                return (
                                    <Card key={level} title={`Level ${level}`}>
                                        <div className="mb-4">
                                            <ProgressBar current={completedCount} total={levelLessons.length} label="Level Progress" />
                                        </div>
                                        <ul className="space-y-3">
                                            {levelLessons.map(lesson => {
                                                const status = lessonStatuses[lesson.id];
                                                return (
                                                    <li key={lesson.id} className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${status === 'locked' ? 'bg-gray-100' : 'bg-white'}`}>
                                                        <div className={`flex items-center ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                                                            {status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />}
                                                            {status === 'unlocked' && <PlayCircle className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />}
                                                            {status === 'locked' && <Lock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />}
                                                            <div>
                                                                <h4 className={`font-semibold text-lg ${status === 'completed' && 'line-through'}`}>{lesson.title}</h4>
                                                                <p className="text-sm">Unit {lesson.unit}, Lesson {lesson.lessonNumber} &bull; {lesson.words.length} words</p>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            variant={status === 'unlocked' ? 'primary' : 'secondary'} 
                                                            onClick={() => handleStartLesson(lesson.id)}
                                                            disabled={status !== 'unlocked'}
                                                            className={`flex-shrink-0 ${status === 'unlocked' && 'animate-pulse'}`}
                                                        >
                                                           {status === 'completed' ? 'Completed' : 'Start Lesson'}
                                                        </Button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card className="lg:col-span-3">
                                <div className="text-center py-10 text-gray-500">
                                    <BookOpenCheck className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                    <p className="font-semibold">No lessons found for your class.</p>
                                    <p className="text-sm">Please check back later or contact your teacher.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                    
                    {/* My Sentence Bank Card */}
                    <Card title="My Sentence Bank" className="lg:col-span-2">
                        <div className="flex items-center text-gray-600 mb-4">
                            <BookMarked className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>Sentences you've mastered. Review them anytime!</span>
                        </div>
                        {mySentenceBank.length > 0 ? (
                            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {mySentenceBank.map((sentence, index) => (
                                    <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 italic">
                                        "{sentence}"
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <NotebookPen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <p className="font-semibold">Your sentence bank is empty.</p>
                                <p className="text-sm">Complete a lesson to start saving sentences.</p>
                            </div>
                        )}
                    </Card>

                    {/* Gamification Cards */}
                    <div className="space-y-6">
                        <Card title="My Badges">
                             <div className="flex items-center">
                                <Award className="h-8 w-8 text-yellow-500 mr-4" />
                                <div>
                                    <p className="text-2xl font-bold">{badges.length} Unlocked</p>
                                     {badges.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {badges.map(badge => (
                                                <span key={badge} className="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded-full">{badge}</span>
                                            ))}
                                        </div>
                                    ) : <p className="text-gray-500 text-sm">Complete a level to earn a badge!</p>}
                                </div>
                            </div>
                        </Card>
                         <Card title="My Streak">
                            <div className="flex items-center">
                                <TrendingUp className="h-8 w-8 text-orange-500 mr-4" />
                                <div>
                                    <p className="text-2xl font-bold">{studentProgress.sentenceStreak} Days</p>
                                    <p className="text-gray-500 text-sm">Coming soon!</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;