
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';

const Header: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return null;
    const { user, role, logout, view, startLearning, viewDashboard, activeLessonId } = context;

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-indigo-600">ASIA Vocabulary</h1>
            {user && (
                <div className="flex items-center space-x-4">
                    {role === 'student' && view !== 'student_learning' && activeLessonId && (
                         <button onClick={startLearning} className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                            <BookOpen className="h-5 w-5 mr-1" />
                            <span>Start Lesson</span>
                        </button>
                    )}
                     {role === 'student' && view !== 'student_dashboard' && (
                        <button onClick={viewDashboard} className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                            <LayoutDashboard className="h-5 w-5 mr-1" />
                            <span>My Dashboard</span>
                        </button>
                    )}
                    <div className="flex items-center text-gray-700">
                        <User className="h-5 w-5 mr-2 text-indigo-500" />
                        <span>{user.name}</span>
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-full">{role}</span>
                    </div>
                    <button onClick={logout} className="flex items-center text-red-500 hover:text-red-700 transition-colors">
                        <LogOut className="h-5 w-5 mr-1" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;