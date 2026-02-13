import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Code, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const QuestionCard = ({ question, onSubmit, loading }) => {
    const [answer, setAnswer] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [timeSpent, setTimeSpent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track time spent on question
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async () => {
        const finalAnswer = question.question_type === 'mcq' ? selectedOption : answer;

        if (!finalAnswer.trim()) {
            return;
        }

        setIsSubmitting(true);
        await onSubmit({
            question_id: question.question_id,
            user_answer: finalAnswer,
            time_taken_seconds: timeSpent,
        });
        setIsSubmitting(false);

        // Reset for next question
        setAnswer('');
        setSelectedOption('');
        setTimeSpent(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getQuestionTypeIcon = () => {
        switch (question.question_type) {
            case 'mcq':
                return <CheckCircle2 className="w-5 h-5" />;
            case 'coding':
                return <Code className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'advanced':
                return 'from-red-500 to-orange-500';
            case 'intermediate':
                return 'from-amber-500 to-yellow-500';
            default:
                return 'from-green-500 to-emerald-500';
        }
    };

    return (
        <div className="card-glow animate-scale-in">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-dark-700/50">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="badge badge-primary flex items-center gap-2">
                        {getQuestionTypeIcon()}
                        <span className="font-semibold">{question.skill_name}</span>
                    </div>

                    <div className={`badge bg-gradient-to-r ${getDifficultyColor(question.difficulty_level)} border-0 text-white`}>
                        {question.difficulty_level}
                    </div>

                    <div className="badge bg-dark-800 text-gray-300 border-dark-600">
                        {question.question_type.replace('_', ' ')}
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 rounded-xl border border-dark-700">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span className="font-mono text-lg font-semibold text-primary-300">
                        {formatTime(timeSpent)}
                    </span>
                </div>
            </div>

            {/* Question */}
            <div className="mb-8">
                <h3 className="text-2xl font-display font-semibold text-white mb-6 leading-relaxed">
                    {question.question_text}
                </h3>

                {/* MCQ Options */}
                {question.question_type === 'mcq' && question.options && (
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const optionLabel = String.fromCharCode(65 + index);
                            const isSelected = selectedOption === option;

                            return (
                                <label
                                    key={index}
                                    className={`group relative flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                                            ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                                            : 'border-dark-700 hover:border-primary-500/50 bg-dark-850/50 hover:bg-dark-800'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="mcq-option"
                                        value={option}
                                        checked={isSelected}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="sr-only"
                                    />

                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center mr-4 transition-all ${isSelected
                                            ? 'border-primary-500 bg-primary-500 text-white'
                                            : 'border-dark-600 group-hover:border-primary-500/50'
                                        }`}>
                                        <span className="font-bold">{optionLabel}</span>
                                    </div>

                                    <div className="flex-1">
                                        <span className={`text-base leading-relaxed ${isSelected ? 'text-white font-medium' : 'text-gray-300'
                                            }`}>
                                            {option}
                                        </span>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </label>
                            );
                        })}
                    </div>
                )}

                {/* Text Answer */}
                {(question.question_type === 'short_answer' ||
                    question.question_type === 'scenario' ||
                    question.question_type === 'coding') && (
                        <div className="space-y-3">
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder={
                                    question.question_type === 'coding'
                                        ? '// Write your code here...\n'
                                        : 'Type your answer here...'
                                }
                                className={`input-field min-h-[200px] ${question.question_type === 'coding' ? 'font-mono text-sm' : ''
                                    }`}
                                rows={question.question_type === 'coding' ? 12 : 6}
                            />

                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">
                                        {answer.length} characters
                                    </span>
                                    {answer.length > 0 && answer.length < 50 && (
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Consider adding more detail</span>
                                        </div>
                                    )}
                                </div>

                                {answer.length >= 50 && (
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Good length!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-dark-700/50">
                <button
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting ||
                        loading ||
                        (question.question_type === 'mcq' ? !selectedOption : !answer.trim())
                    }
                    className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting || loading ? (
                        <>
                            <div className="spinner w-5 h-5" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Answer</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>

            {/* Helpful Tips */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💡</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Tips for Success:</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            {question.question_type === 'scenario' && (
                                <>
                                    <li>• Explain your reasoning and thought process</li>
                                    <li>• Consider real-world implications and trade-offs</li>
                                    <li>• Mention any assumptions you're making</li>
                                </>
                            )}
                            {question.question_type === 'coding' && (
                                <>
                                    <li>• Write clean, readable code with good variable names</li>
                                    <li>• Add comments to explain complex logic</li>
                                    <li>• Consider edge cases and error handling</li>
                                </>
                            )}
                            {question.question_type === 'short_answer' && (
                                <>
                                    <li>• Be concise but thorough in your explanation</li>
                                    <li>• Use examples when they help clarify your point</li>
                                    <li>• Demonstrate deep understanding, not just surface knowledge</li>
                                </>
                            )}
                            {question.question_type === 'mcq' && (
                                <>
                                    <li>• Read all options carefully before selecting</li>
                                    <li>• Eliminate obviously wrong answers first</li>
                                    <li>• Choose the most complete and accurate option</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
