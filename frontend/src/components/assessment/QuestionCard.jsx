import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

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

    return (
        <div className="card animate-slideIn">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            {question.skill_name}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {question.difficulty_level}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {question.question_type.replace('_', ' ')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-sm">{formatTime(timeSpent)}</span>
                </div>
            </div>

            {/* Question */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {question.question_text}
                </h3>

                {/* MCQ Options */}
                {question.question_type === 'mcq' && question.options && (
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
                            return (
                                <label
                                    key={index}
                                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedOption === optionLabel
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="mcq-option"
                                        value={option}
                                        checked={selectedOption === option}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="mt-1 mr-3 text-primary-600"
                                    />
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-700 mr-2">
                                            {optionLabel}.
                                        </span>
                                        <span className="text-gray-900">{option}</span>
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
                                        ? 'Write your code here...'
                                        : 'Type your answer here...'
                                }
                                className={`input-field ${question.question_type === 'coding' ? 'font-mono' : ''
                                    }`}
                                rows={question.question_type === 'coding' ? 12 : 6}
                            />
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                <span>{answer.length} characters</span>
                                {answer.length < 50 && (
                                    <div className="flex items-center gap-1 text-amber-600">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Try to provide more detail</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting ||
                        loading ||
                        (question.question_type === 'mcq' ? !selectedOption : !answer.trim())
                    }
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting || loading ? 'Submitting...' : 'Submit Answer'}
                </button>
            </div>

            {/* Helpful Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    {question.question_type === 'scenario' && (
                        <>
                            <li>• Explain your reasoning and approach</li>
                            <li>• Consider real-world implications</li>
                            <li>• Mention trade-offs if applicable</li>
                        </>
                    )}
                    {question.question_type === 'coding' && (
                        <>
                            <li>• Write clean, readable code</li>
                            <li>• Add comments to explain your logic</li>
                            <li>• Consider edge cases</li>
                        </>
                    )}
                    {question.question_type === 'short_answer' && (
                        <>
                            <li>• Be concise but thorough</li>
                            <li>• Use examples when helpful</li>
                            <li>• Demonstrate your understanding</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};
