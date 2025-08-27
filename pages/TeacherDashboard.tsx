import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { VocabularyWord } from '../types';
import { BookPlus, CheckCircle, AlertTriangle, List, Library, Trash2 } from 'lucide-react';

const isVocabularyWord = (obj: any): obj is VocabularyWord => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.word === 'string' &&
        typeof obj.ipa === 'string' &&
        typeof obj.meaning === 'string' &&
        typeof obj.example === 'string'
    );
};

const TeacherDashboard: React.FC = () => {
    const context = useContext(AppContext);
    const [lessonTitle, setLessonTitle] = useState('');
    const [level, setLevel] = useState('');
    const [unit, setUnit] = useState('');
    const [lessonNumber, setLessonNumber] = useState('');
    const [className, setClassName] = useState('');
    const [classId, setClassId] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const exampleJson = JSON.stringify([
      {"word": "apple", "ipa": "/ˈæp.əl/", "meaning": "quả táo", "example": "I eat an apple every morning."},
      {"word": "run", "ipa": "/rʌn/", "meaning": "chạy", "example": "She runs fast in the park."},
    ], null, 2);

    const handleCreateLesson = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!context) return;

        if (!lessonTitle.trim() || !level.trim() || !unit.trim() || !lessonNumber.trim() || !className.trim() || !classId.trim()) {
            setError("Please fill in all lesson details.");
            return;
        }

        const lessonNum = parseInt(lessonNumber, 10);
        if (isNaN(lessonNum) || lessonNum <= 0) {
            setError("Lesson Number must be a positive number.");
            return;
        }

        let parsedWords: any;
        try {
            parsedWords = JSON.parse(jsonInput);
        } catch (jsonError) {
            setError("Invalid JSON format. Please check your input.");
            return;
        }

        if (!Array.isArray(parsedWords) || parsedWords.length === 0 || !parsedWords.every(isVocabularyWord)) {
            setError("The JSON data must be a non-empty array of objects, each with 'word', 'ipa', 'meaning', and 'example' properties.");
            return;
        }
        
        context.createLesson(lessonTitle, parsedWords as VocabularyWord[], { level, unit, lessonNumber: lessonNum, className, classId });
        setLessonTitle('');
        setLevel('');
        setUnit('');
        setLessonNumber('');
        setClassName('');
        setClassId('');
        setJsonInput('');
    };

    const handleDeleteLesson = (lessonId: string, lessonTitle: string) => {
        if(window.confirm(`Are you sure you want to delete the lesson "${lessonTitle}"? This action cannot be undone.`)) {
            context?.deleteLesson(lessonId);
        }
    }

    const activeLesson = useMemo(() => {
        return context?.lessons.find(l => l.id === context.activeLessonId) || null;
    }, [context?.lessons, context?.activeLessonId]);

    const inputClasses = "w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500";

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Create and Active Lesson Details */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card title="Create New Lesson">
                            <form onSubmit={handleCreateLesson} className="space-y-4">
                               <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                        <input id="level" type="text" placeholder="e.g., A1" value={level} onChange={(e) => setLevel(e.target.value)} className={inputClasses}/>
                                    </div>
                                     <div>
                                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                        <input id="unit" type="text" placeholder="e.g., Unit 1" value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClasses}/>
                                    </div>
                                    <div>
                                        <label htmlFor="lessonNumber" className="block text-sm font-medium text-gray-700 mb-1">Lesson No.</label>
                                        <input id="lessonNumber" type="number" placeholder="e.g., 1" value={lessonNumber} onChange={(e) => setLessonNumber(e.target.value)} className={inputClasses}/>
                                    </div>
                                      <div>
                                        <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                        <input id="className" type="text" placeholder="e.g., Grade 5A" value={className} onChange={(e) => setClassName(e.target.value)} className={inputClasses}/>
                                    </div>
                                      <div>
                                        <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">ID Class</label>
                                        <input id="classId" type="text" placeholder="e.g., G5A-ENG" value={classId} onChange={(e) => setClassId(e.target.value)} className={inputClasses}/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                                    <input id="lessonTitle" type="text" placeholder="e.g., Common Verbs" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} className={inputClasses}/>
                                </div>
                                <div>
                                    <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-1">Vocabulary List (JSON)</label>
                                    <textarea id="jsonInput" rows={8} placeholder={exampleJson} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className={`${inputClasses} font-mono text-sm`}/>
                                </div>
                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start" role="alert">
                                        <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0"/>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}
                                <Button type="submit" className="w-full flex items-center justify-center" disabled={!lessonTitle || !jsonInput || !level || !unit || !lessonNumber || !className || !classId}>
                                    <BookPlus className="h-5 w-5 mr-2" />
                                    Create Lesson
                                </Button>
                            </form>
                        </Card>
                        
                        <Card title="Active Lesson Details">
                           {activeLesson ? (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-indigo-700">{activeLesson.title}</h3>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>Class:</strong> {activeLesson.className} ({activeLesson.classId})</p>
                                        <p><strong>Unit:</strong> {activeLesson.unit} | <strong>Level:</strong> {activeLesson.level}</p>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto pr-2 text-sm pt-2">
                                        <ul className="space-y-2">
                                            {activeLesson.words.map((word, index) => (
                                                <li key={index} className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                                    <p className="font-semibold">{word.word} - <span className="font-normal">{word.meaning}</span></p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                           ) : (
                               <div className="text-center text-gray-500 py-8">
                                   <p>No lesson is currently active for students.</p>
                               </div>
                           )}
                        </Card>
                    </div>

                    {/* Right Column: Lesson Library */}
                    <div className="lg:col-span-2">
                        <Card title="Lesson Library">
                            {context?.lessons && context.lessons.length > 0 ? (
                                <ul className="space-y-3">
                                    {context.lessons.map(lesson => {
                                        const isActive = lesson.id === context.activeLessonId;
                                        return (
                                            <li key={lesson.id} className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-800">{lesson.title}</h4>
                                                    <div className="text-sm text-gray-500 mt-1 space-x-3">
                                                      <span><strong className="font-medium">Class:</strong> {lesson.className}</span>
                                                      <span><strong className="font-medium">Unit:</strong> {lesson.unit}</span>
                                                      <span><strong className="font-medium">Lesson:</strong> {lesson.lessonNumber}</span>
                                                      <span><strong className="font-medium">Words:</strong> {lesson.words.length}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
                                                    <Button variant="secondary" onClick={() => context.setActiveLesson(lesson.id)} disabled={isActive}>
                                                        {isActive ? 'Currently Active' : 'Set Active'}
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteLesson(lesson.id, lesson.title)} aria-label={`Delete lesson ${lesson.title}`}>
                                                        <Trash2 className="h-5 w-5"/>
                                                    </Button>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                                    <Library className="h-12 w-12 text-gray-400 mb-4"/>
                                    <p className="font-semibold">Your lesson library is empty.</p>
                                    <p className="text-sm">Use the form to create your first lesson.</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;