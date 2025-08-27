import React, { useState, useEffect, useContext } from 'react';
import { VocabularyWord } from '../../types';
import Card from '../Card';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import { AppContext } from '../../contexts/AppContext';
import { ArrowRight, PencilLine, Sparkles } from 'lucide-react';

interface Practice3Props {
    words: VocabularyWord[];
    onComplete: () => void;
}

const Practice3: React.FC<Practice3Props> = ({ words, onComplete }) => {
    const context = useContext(AppContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const currentWord = words[currentIndex];

    useEffect(() => {
        if (feedback === 'incorrect') {
            setFeedback(null);
        }
    }, [userInput, feedback]);

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
            setFeedback('correct');
            // Save the sentence to the bank
            context?.addSentenceToBank(currentWord.example);
        } else {
            setFeedback('incorrect');
        }
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserInput('');
            setFeedback(null);
        } else {
            onComplete();
        }
    };

    const getInputClass = () => {
        if (feedback === 'incorrect') return 'border-red-500 ring-red-500 animate-shake';
        if (feedback === 'correct') return 'border-green-500 ring-green-500 bg-green-50';
        return 'border-gray-300 focus:ring-indigo-500';
    };

    return (
        <Card>
            <div className="w-full mb-6">
                <ProgressBar current={currentIndex + 1} total={words.length} label="Practice 3: Recall" />
            </div>

            <div className="text-center">
                <p className="text-gray-600 mb-2">What is the English word for:</p>
                <p className="text-2xl font-semibold text-indigo-700 italic">"{currentWord.meaning}"</p>
            </div>

            <form onSubmit={feedback === 'correct' ? (e) => { e.preventDefault(); handleNext(); } : handleCheck} className="mt-8 flex flex-col items-center">
                <div className="relative w-full max-w-sm">
                    <PencilLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type the word in English"
                        className={`w-full text-center text-lg px-4 py-3 pl-10 bg-white text-gray-900 placeholder-gray-500 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClass()}`}
                        disabled={feedback === 'correct'}
                        aria-label="Your answer"
                        autoFocus
                    />
                </div>

                <div className="mt-6">
                    {feedback === 'correct' ? (
                        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 w-48 justify-center">
                            {currentIndex === words.length - 1 ? "Finish Lesson!" : "Next Word"}
                            <ArrowRight className="inline ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={!userInput.trim()} className="w-48 justify-center">
                            Check
                        </Button>
                    )}
                </div>
            </form>

            {feedback === 'correct' && (
                 <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md">
                    <div className="flex items-center">
                        <Sparkles className="h-6 w-6 text-indigo-500 mr-3" />
                        <div>
                             <p className="font-bold text-green-600">Correct! The word is "{currentWord.word}".</p>
                             <p className="text-gray-700 italic mt-1"><strong>Example:</strong> "{currentWord.example}"</p>
                        </div>
                    </div>
                 </div>
            )}
        </Card>
    );
};

export default Practice3;