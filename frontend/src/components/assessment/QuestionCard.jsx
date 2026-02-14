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
        <div className="glass-card animate-scale-in p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-medium">
                        {getQuestionTypeIcon()}
                        <span className="font-semibold uppercase tracking-wide text-xs">{question.skill_name}</span>
                    </div>

                    <div className={`px-3 py-1 rounded-full border text-xs font-medium uppercase tracking-wide ${question.difficulty_level === 'advanced' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        question.difficulty_level === 'intermediate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                            'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan'
                        }`}>
                        {question.difficulty_level}
                    </div>

                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium uppercase tracking-wide">
                        {question.question_type.replace('_', ' ')}
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-brand-blue" />
                    <span className="font-mono text-lg font-semibold text-white">
                        {formatTime(timeSpent)}
                    </span>
                </div>
            </div>

            {/* Question */}
            <div className="mb-8">
                <h3 className="text-2xl font-display font-medium text-white mb-6 leading-snug">
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
                                    className={`group relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${isSelected
                                        ? 'border-brand-orange bg-brand-orange/10 shadow-[0_0_15px_rgba(255,103,2,0.1)]'
                                        : 'border-white/10 hover:border-brand-orange/30 bg-white/5 hover:bg-white/10'
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

                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 ${isSelected
                                        ? 'border-brand-orange bg-brand-orange text-white transform scale-105'
                                        : 'border-white/20 text-white/50 group-hover:border-brand-orange/50 group-hover:text-white'
                                        }`}>
                                        <span className="font-bold text-sm font-display">{optionLabel}</span>
                                    </div>

                                    <div className="flex-1">
                                        <span className={`text-base transition-colors duration-300 ${isSelected ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'
                                            }`}>
                                            {option}
                                        </span>
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={`w-3 h-3 rounded-full ml-4 transition-all duration-300 ${isSelected ? 'bg-brand-cyan shadow-[0_0_8px_rgba(4,222,178,0.3)] scale-100' : 'bg-transparent scale-0'}`} />
                                </label>
                            );
                        })}
                    </div>
                )}

                {/* Text Answer */}
                {(question.question_type === 'short_answer' ||
                    question.question_type === 'scenario' ||
                    question.question_type === 'coding') && (
                        <div className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder={
                                        question.question_type === 'coding'
                                            ? '// Write your code here...\n'
                                            : 'Type your answer here...'
                                    }
                                    className={`input-field min-h-[240px] resize-y ${question.question_type === 'coding' ? 'font-mono text-sm' : 'text-lg'
                                        }`}
                                    rows={question.question_type === 'coding' ? 12 : 8}
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-white/30 pointer-events-none">
                                    {question.question_type === 'coding' ? 'JavaScript' : 'Markdown supported'}
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm px-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-white/50">
                                        {answer.length} characters
                                    </span>
                                </div>

                                {answer.length >= 50 && (
                                    <div className="flex items-center gap-2 text-brand-cyan animate-fade-in">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Good length!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8 border-t border-white/10">
                <button
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting ||
                        loading ||
                        (question.question_type === 'mcq' ? !selectedOption : !answer.trim())
                    }
                    className="btn-primary flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isSubmitting || loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Answer</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>

            {/* Helpful Tips */}
            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-blue/20 rounded-xl flex items-center justify-center border border-brand-blue/30 text-brand-blue">
                        <span className="text-xl">💡</span>
                    </div>
                    <div>
                        <h4 className="font-medium text-white mb-3">Tips for Success</h4>
                        <ul className="text-sm text-gray-400 space-y-2">
                            {question.question_type === 'scenario' && (
                                <>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Explain your reasoning and thought process</li>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Consider real-world implications and trade-offs</li>
                                </>
                            )}
                            {question.question_type === 'coding' && (
                                <>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Write clean, readable code with good variable names</li>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Add comments to explain complex logic</li>
                                </>
                            )}
                            {question.question_type === 'short_answer' && (
                                <>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Be concise but thorough in your explanation</li>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Use examples when they help clarify your point</li>
                                </>
                            )}
                            {question.question_type === 'mcq' && (
                                <>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Read all options carefully before selecting</li>
                                    <li className="flex items-start gap-2"><span className="text-brand-blue mt-1">•</span> Eliminate obviously wrong answers first</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
