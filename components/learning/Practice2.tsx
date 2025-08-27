import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyWord } from '../../types';
import Card from '../Card';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import { BrainCircuit, ArrowRight } from 'lucide-react';

// Helper function to shuffle the letters of a word
const shuffleString = (s: string): string => {
    const arr = s.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    // Ensure the shuffled string is not the same as the original, unless it's a very short word
    if (arr.join('') === s && s.length > 2) {
        return shuffleString(s);
    }
    return arr.join('');
};

interface Practice2Props {
    words: VocabularyWord[];
    onComplete: () => void;
}

const Practice2: React.FC<Practice2Props> = ({ words, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const currentWord = words[currentIndex];
    const jumbledLetters = useMemo(() => shuffleString(currentWord.word), [currentWord]);

    useEffect(() => {
        // Reset incorrect feedback when user starts typing again
        if (feedback === 'incorrect') {
            setFeedback(null);
        }
    }, [userInput, feedback]);

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
            setFeedback('correct');
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
    }

    return (
        <Card>
            <div className="w-full mb-6">
                <ProgressBar current={currentIndex + 1} total={words.length} label="Practice 2: Jumbled Words" />
            </div>
            
            <div className="text-center">
                <p className="text-gray-600 mb-2">Unscramble the letters to form the word for:</p>
                <p className="text-2xl font-semibold text-indigo-700 italic">"{currentWord.meaning}"</p>
            </div>

            <div className="my-8 flex justify-center items-center gap-2 flex-wrap">
                {jumbledLetters.split('').map((letter, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-md shadow-sm select-none">
                        {letter.toUpperCase()}
                    </span>
                ))}
            </div>
            
            <form onSubmit={feedback === 'correct' ? (e) => {e.preventDefault(); handleNext()} : handleCheck} className="mt-6 flex flex-col items-center">
                <div className="relative w-full max-w-sm">
                    <BrainCircuit className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer"
                        className={`w-full text-center text-lg px-4 py-3 pl-10 bg-white text-gray-900 placeholder-gray-500 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClass()}`}
                        disabled={feedback === 'correct'}
                        aria-label="Your answer for the jumbled word"
                        autoFocus
                    />
                </div>

                <div className="mt-6">
                    {feedback === 'correct' ? (
                        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 w-48 justify-center">
                            {currentIndex === words.length - 1 ? "Finish Practice" : "Next Word"}
                            <ArrowRight className="inline ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={!userInput.trim()} className="w-48 justify-center">
                            Check
                        </Button>
                    )}
                </div>
            </form>

             {feedback === 'incorrect' && (
                <p className="text-center text-red-500 font-semibold mt-4">Not quite, try again!</p>
            )}
            {feedback === 'correct' && (
                <p className="text-center text-green-600 font-semibold mt-4">Correct! Well done.</p>
            )}
        </Card>
    );
};

export default Practice2;