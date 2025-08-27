import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { GraduationCap, User as UserIcon } from 'lucide-react';

const LandingPage: React.FC = () => {
    const context = useContext(AppContext);
    const [teacherName, setTeacherName] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentClassId, setStudentClassId] = useState('');

    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (teacherName && teacherId && context) {
            context.login('teacher', { name: teacherName, id: teacherId });
        }
    };

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (studentName && studentClassId && context) {
            context.login('student', { name: studentName, id: studentClassId });
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
            <header className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-indigo-700">
                    Welcome to ASIA Vocabulary
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Your journey to mastering English starts here.</p>
            </header>

            <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Teacher Login Card */}
                <Card className="transform hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-indigo-100 p-4 rounded-full mb-4">
                            <GraduationCap className="h-10 w-10 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Teacher Login</h2>
                        <form onSubmit={handleTeacherLogin} className="w-full flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Teacher Name"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
                                aria-label="Teacher Name"
                            />
                            <input
                                type="text"
                                placeholder="Teacher ID"
                                value={teacherId}
                                onChange={(e) => setTeacherId(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
                                aria-label="Teacher ID"
                            />
                            <Button type="submit" disabled={!teacherName || !teacherId}>
                                Login as Teacher
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Student Login Card */}
                <Card className="transform hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col items-center text-center">
                         <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <UserIcon className="h-10 w-10 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Student Login</h2>
                        <form onSubmit={handleStudentLogin} className="w-full flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-purple-500 text-gray-900 placeholder-gray-400 transition duration-200"
                                aria-label="Your Name"
                            />
                            <input
                                type="text"
                                placeholder="Class ID"
                                value={studentClassId}
                                onChange={(e) => setStudentClassId(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-purple-500 text-gray-900 placeholder-gray-400 transition duration-200"
                                aria-label="Class ID"
                            />
                            <Button type="submit" disabled={!studentName || !studentClassId} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
                                Start Learning
                            </Button>
                        </form>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default LandingPage;