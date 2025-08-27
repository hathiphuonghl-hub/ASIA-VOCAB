import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyWord } from '../../types';
import Card from '../Card';
import ProgressBar from '../ProgressBar';

interface MiniQuizProps {
    words: VocabularyWord[];
    onComplete: () => void;
}

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const MiniQuiz: React.FC<MiniQuizProps> = ({ words, onComplete }) => {
    const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        setShuffledWords(shuffleArray(words));
    }, [words]);

    const currentWord = shuffledWords[currentQuestionIndex];

    const options = useMemo(() => {
        if (!currentWord) return [];
        
        const distractors = words
            .filter(w => w.word !== currentWord.word)
            .map(w => w.meaning);
        
        const shuffledDistractors = shuffleArray(distractors).slice(0, 3);
        
        return shuffleArray([currentWord.meaning, ...shuffledDistractors]);
    }, [currentWord, words]);

    const handleAnswerSelect = (meaning: string) => {
        if (isAnswered) return;

        setSelectedAnswer(meaning);
        setIsAnswered(true);

        setTimeout(() => {
            if (currentQuestionIndex < words.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                onComplete();
            }
        }, 1500); // Wait 1.5 seconds before moving to the next question
    };

    if (shuffledWords.length === 0 || !currentWord) {
        return <div>Loading quiz...</div>;
    }

    const isCorrect = selectedAnswer === currentWord.meaning;

    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return 'bg-white hover:bg-indigo-50 border-gray-300';
        }
        if (option === currentWord.meaning) {
            return 'bg-green-100 border-green-500 text-green-800 scale-105';
        }
        if (option === selectedAnswer && !isCorrect) {
            return 'bg-red-100 border-red-500 text-red-800';
        }
        return 'bg-white border-gray-300 opacity-70';
    };

    return (
        <Card>
            <div className="flex flex-col items-center">
                <div className="w-full mb-8">
                    <ProgressBar current={currentQuestionIndex + 1} total={words.length} label="Mini Quiz" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{currentWord.word}</h2>
                <p className="text-lg text-gray-500 mb-8">Choose the correct meaning:</p>

                <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isAnswered}
                            className={`p-4 rounded-lg border-2 text-center text-lg font-semibold transition-all duration-300 ${getButtonClass(option)}`}
                            aria-live="polite"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default MiniQuiz;
