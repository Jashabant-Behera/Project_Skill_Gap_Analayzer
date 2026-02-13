import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, Code, FileText } from 'lucide-react';

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

        setAnswer('');
        setSelectedOption('');
        setTimeSpent(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getQuestionIcon = () => {
        if (question.question_type === 'coding') return Code;
        return FileText;
    };

    const QuestionIcon = getQuestionIcon();

    return (
        <div className="card animate-fadeIn relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="badge badge-primary flex items-center gap-2">
                        <QuestionIcon className="w-4 h-4" />
                        {question.skill_name}
                    </span>
                    <span className={`badge ${
                        question.difficulty_level === 'advanced' ? 'badge-error' :
                        question.difficulty_level === 'intermediate' ? 'badge-warning' :
                        'badge-success'
                    }`}>
                        {question.difficulty_level}
                    </span>
                    <span className="px-3 py-1 bg-[var(--bg-elevated)] rounded-full text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-secondary)]">
                        {question.question_type.replace('_', ' ')}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-secondary)]">
                    <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="font-mono text-sm font-semibold">{formatTime(timeSpent)}</span>
                </div>
            </div>

            {/* Question */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 leading-relaxed">
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
                                    className={`group flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${
                                        isSelected
                                            ? 'border-[var(--accent-primary)] bg-[var(--bg-tertiary)] shadow-[0_0_20px_rgba(0,245,255,0.2)]'
                                            : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                                    }`}
                                >
                                    <div className="flex items-start gap-4 w-full">
                                        {/* Radio Input */}
                                        <div className="relative flex-shrink-0 mt-1">
                                            <input
                                                type="radio"
                                                name="mcq-option"
                                                value={option}
                                                checked={isSelected}
                                                onChange={(e) => setSelectedOption(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                                                isSelected
                                                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
                                                    : 'border-[var(--border-secondary)] group-hover:border-[var(--accent-primary)]'
                                            }`}>
                                                {isSelected && (
                                                    <div className="w-full h-full rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-[var(--bg-primary)]" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Option Content */}
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-3">
                                                <span className={`font-bold text-lg ${
                                                    isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'
                                                }`}>
                                                    {optionLabel}.
                                                </span>
                                                <span className="text-[var(--text-primary)] leading-relaxed">
                                                    {option}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Selected Indicator */}
                                        {isSelected && (
                                            <CheckCircle className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}

                {/* Text Answer */}
                {(question.question_type === 'short_answer' ||
                    question.question_type === 'scenario' ||
                    question.question_type === 'coding') && (
                        <div>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder={
                                    question.question_type === 'coding'
                                        ? '// Write your code here...'
                                        : 'Type your answer here...'
                                }
                                className={`input-field resize-none ${
                                    question.question_type === 'coding' 
                                        ? 'font-mono text-sm' 
                                        : ''
                                }`}
                                rows={question.question_type === 'coding' ? 16 : 8}
                            />
                            <div className="flex justify-between items-center mt-3 px-1">
                                <span className="text-sm text-[var(--text-muted)]">
                                    {answer.length} characters
                                </span>
                                {answer.length < 50 && answer.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-[var(--warning)]">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Try to provide more detail</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-[var(--border-primary)]">
                <button
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting ||
                        loading ||
                        (question.question_type === 'mcq' ? !selectedOption : !answer.trim())
                    }
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
                >
                    {isSubmitting || loading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                        </span>
                    ) : (
                        'Submit Answer'
                    )}
                </button>
            </div>

            {/* Helpful Tips */}
            <div className="mt-6 p-5 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl border border-[var(--accent-primary)]/20">
                <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>Tips:</span>
                </h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                    {question.question_type === 'scenario' && (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Explain your reasoning and approach</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Consider real-world implications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Mention trade-offs if applicable</span>
                            </li>
                        </>
                    )}
                    {question.question_type === 'coding' && (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Write clean, readable code</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Add comments to explain your logic</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Consider edge cases</span>
                            </li>
                        </>
                    )}
                    {question.question_type === 'short_answer' && (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Be concise but thorough</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Use examples when helpful</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Demonstrate your understanding</span>
                            </li>
                        </>
                    )}
                    {question.question_type === 'mcq' && (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Read all options carefully before selecting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                                <span>Consider context and edge cases</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};
