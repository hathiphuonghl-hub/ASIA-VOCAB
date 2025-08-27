import React, { useState, useMemo } from 'react';
import { VocabularyWord } from '../../types';
import Card from '../Card';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import { ArrowRight, Shuffle, CheckCircle } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const Practice1: React.FC<{ words: VocabularyWord[]; onComplete: () => void }> = ({ words, onComplete }) => {
    const [activity, setActivity] = useState<'match' | 'sentence_builder'>('match');

    // --- State & Logic for Match Activity ---
    const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
    const [incorrectAttempt, setIncorrectAttempt] = useState<string | null>(null);

    const shuffledMeanings = useMemo(() => shuffleArray(words.map(w => w.meaning)), [words]);

    const handleWordSelect = (word: VocabularyWord) => {
        if (matchedPairs.has(word.word) || selectedWord?.word === word.word) {
            setSelectedWord(null);
            return;
        };
        setSelectedWord(word);
    };

    const handleMeaningSelect = (meaning: string) => {
        if (!selectedWord) return;

        if (selectedWord.meaning === meaning) {
            setMatchedPairs(prev => new Set(prev).add(selectedWord.word));
        } else {
            setIncorrectAttempt(meaning);
            setTimeout(() => setIncorrectAttempt(null), 800);
        }
        setSelectedWord(null);
    };

    const allMatched = matchedPairs.size === words.length;

    // --- State & Logic for Sentence Builder ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [builtSentence, setBuiltSentence] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const currentWordData = words[currentIndex];
    const originalSentenceWords = useMemo(() => currentWordData.example.replace(/[.,!?]/g, '').split(' '), [currentWordData]);
    
    const wordBank = useMemo(() => {
        const sentenceWords = originalSentenceWords.map((word, index) => ({ word, id: `${word}-${index}` }));
        const builtWords = builtSentence.map(item => item);
        return shuffleArray(sentenceWords).filter(item => {
            const indexInBuilt = builtWords.findIndex(builtItem => builtItem === item.id);
            if (indexInBuilt > -1) {
                builtWords.splice(indexInBuilt, 1);
                return false;
            }
            return true;
        });
    }, [originalSentenceWords, builtSentence]);

    const handleCheckSentence = () => {
        const builtString = builtSentence.map(id => id.split('-')[0]).join(' ');
        const originalString = originalSentenceWords.join(' ');
        if (builtString === originalString) {
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
            setTimeout(() => {
                setFeedback(null);
            }, 1000);
        }
    };

    const handleNextSentence = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setBuiltSentence([]);
            setFeedback(null);
        } else {
            onComplete();
        }
    };

    const renderMatchActivity = () => (
        <Card title="Practice 1: Match the Words">
            <div className="w-full mb-6">
                 <ProgressBar current={matchedPairs.size} total={words.length} label="Words Matched" />
            </div>
            {allMatched ? (
                 <div className="text-center py-10 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800">Great Job!</h3>
                    <p className="text-gray-600 mb-6">You've matched all the words.</p>
                    <Button onClick={() => setActivity('sentence_builder')} className="animate-pulse">
                        Continue to Sentence Builder <ArrowRight className="inline ml-2 h-5 w-5"/>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Words Column */}
                    <div className="flex flex-col space-y-3">
                        {words.map(word => {
                            const isMatched = matchedPairs.has(word.word);
                            const isSelected = selectedWord?.word === word.word;
                            return (
                                <button key={word.word} onClick={() => handleWordSelect(word)} disabled={isMatched} className={`p-3 text-left rounded-lg border-2 transition-all duration-200 ${isMatched ? 'bg-green-100 border-green-300 text-gray-400 line-through' : isSelected ? 'bg-indigo-100 border-indigo-400 scale-105 shadow-lg' : 'bg-white hover:bg-gray-50 border-gray-300'}`}>
                                    <span className="font-semibold text-lg">{word.word}</span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Meanings Column */}
                    <div className="flex flex-col space-y-3">
                        {shuffledMeanings.map(meaning => {
                            const isIncorrect = incorrectAttempt === meaning;
                            return (
                                <button key={meaning} onClick={() => handleMeaningSelect(meaning)} disabled={!selectedWord} className={`p-3 text-left rounded-lg border-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isIncorrect ? 'bg-red-100 border-red-400 animate-shake' : 'bg-white hover:bg-indigo-50 border-gray-300'}`}>
                                    <span className="text-md">{meaning}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </Card>
    );

    const renderSentenceBuilder = () => (
        <Card title="Practice 1: Sentence Builder">
            <div className="w-full mb-6">
                <ProgressBar current={currentIndex + 1} total={words.length} label="Sentences Built" />
            </div>
            <div className="text-center mb-4">
                <p className="text-gray-600">Arrange the words to form the example sentence for:</p>
                <h3 className="text-3xl font-bold text-indigo-700">{currentWordData.word}</h3>
            </div>

            {/* Construction Area */}
            <div className={`min-h-[60px] bg-gray-100 rounded-lg p-3 flex flex-wrap gap-2 items-center justify-center border-2 ${feedback === 'incorrect' ? 'border-red-400 animate-shake' : 'border-gray-200'}`}>
                {builtSentence.length === 0 && <span className="text-gray-400">Click words below to build the sentence</span>}
                {builtSentence.map((id, index) => (
                    <button key={id} onClick={() => setBuiltSentence(bs => bs.filter((_, i) => i !== index))} className="bg-white px-3 py-1 rounded-md shadow-sm border border-gray-300 text-lg">
                        {id.split('-')[0]}
                    </button>
                ))}
            </div>

            {/* Word Bank */}
            <div className="min-h-[60px] mt-4 p-3 flex flex-wrap gap-2 items-center justify-center">
                {wordBank.map(({ word, id }) => (
                    <button key={id} onClick={() => setBuiltSentence(bs => [...bs, id])} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md shadow-sm border border-indigo-200 hover:bg-indigo-200 transform hover:scale-105 transition-transform text-lg">
                        {word}
                    </button>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                {feedback === 'correct' ? (
                    <Button onClick={handleNextSentence} className="bg-green-600 hover:bg-green-700">
                        {currentIndex === words.length - 1 ? "Finish Practice" : "Next Sentence"} <ArrowRight className="inline ml-2 h-5 w-5"/>
                    </Button>
                ) : (
                    <Button onClick={handleCheckSentence} disabled={builtSentence.length === 0}>
                        Check Sentence
                    </Button>
                )}
            </div>
        </Card>
    );

    return activity === 'match' ? renderMatchActivity() : renderSentenceBuilder();
};

export default Practice1;