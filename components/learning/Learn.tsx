import React, { useState, useMemo } from 'react';
import { VocabularyWord } from '../../types';
import Card from '../Card';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import { Lightbulb } from 'lucide-react';

interface LearnProps {
    words: VocabularyWord[];
    onComplete: () => void;
}

// Helper to normalize and split a sentence into words for comparison
const getComparableWords = (sentence: string): string[] => {
    return sentence.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
};

const Learn: React.FC<LearnProps> = ({ words, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentWord = words[currentIndex];

    const originalWords = useMemo(() => getComparableWords(currentWord.example), [currentWord]);

    const handleCheck = () => {
        const userWords = getComparableWords(userInput);
        if (originalWords.length !== userWords.length) {
            setIsCorrect(false);
            setShowFeedback(true);
            return;
        }

        const allMatch = originalWords.every((word, index) => word === userWords[index]);
        setIsCorrect(allMatch);
        setShowFeedback(true);
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setIsCorrect(false);
            setShowFeedback(false);
        } else {
            onComplete();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
        if (showFeedback) {
            setShowFeedback(false);
        }
        setIsCorrect(false); 
    }

    const renderFeedback = () => {
        if (!showFeedback || isCorrect) return null;
        
        const userWordsForDisplay = userInput.split(/\s+/).filter(Boolean);
        const userComparableWords = getComparableWords(userInput);

        return (
            <div className="mt-3 text-md p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-2">Your attempt:</p>
                <p>
                    {userWordsForDisplay.map((word, index) => {
                        const originalWord = originalWords[index];
                        const isWordCorrect = originalWord === userComparableWords[index];
                        return (
                            <span key={index} className={!isWordCorrect ? 'text-red-500 underline decoration-wavy decoration-red-500' : 'text-green-600'}>
                                {word}{' '}
                            </span>
                        );
                    })}
                </p>
            </div>
        );
    }
    
    return (
        <Card>
            <div className="w-full mb-6">
                <ProgressBar current={currentIndex + 1} total={words.length} label="Learn Step" />
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg mb-4 border border-indigo-200">
                <h2 className="font-bold text-3xl text-indigo-800">{currentWord.word} <span className="font-normal text-gray-500 text-2xl">{currentWord.ipa}</span></h2>
                <p className="text-gray-700 mt-1"><strong className="font-semibold">Meaning:</strong> {currentWord.meaning}</p>
                <p className="text-gray-700 italic mt-2"><strong className="font-semibold not-italic">Example:</strong> "{currentWord.example}"</p>
            </div>
            
            <div className="mt-5">
                <label htmlFor="sentence-input" className="flex items-center text-md font-medium text-gray-800 mb-2">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    Type the example sentence below:
                </label>
                <textarea
                    id="sentence-input"
                    rows={3}
                    value={userInput}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Start typing here..."
                    disabled={isCorrect}
                    aria-label="Type the example sentence"
                />
            </div>
            
            {renderFeedback()}
            
            {showFeedback && isCorrect && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-semibold animate-pulse">
                    Correct! Well done.
                </div>
            )}

            <div className="mt-6 flex justify-end">
                {isCorrect ? (
                    <Button onClick={handleNext}>
                        {currentIndex === words.length - 1 ? "Finish & Go to Practice" : "Next Word"}
                    </Button>
                ) : (
                    <Button onClick={handleCheck} disabled={!userInput.trim()}>
                        Check Answer
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default Learn;