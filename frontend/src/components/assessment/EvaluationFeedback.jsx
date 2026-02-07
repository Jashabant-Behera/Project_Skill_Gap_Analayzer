import React from 'react';
import { CheckCircle, XCircle, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';

export const EvaluationFeedback = ({ evaluation, onNext }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-amber-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-blue-100';
        if (score >= 40) return 'bg-amber-100';
        return 'bg-red-100';
    };

    const getLevelBadge = (level) => {
        const colors = {
            advanced: 'bg-green-100 text-green-800',
            intermediate: 'bg-blue-100 text-blue-800',
            beginner: 'bg-amber-100 text-amber-800',
        };
        return colors[level] || colors.beginner;
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Score Card */}
            <div className={`card ${getScoreBgColor(evaluation.score)} border-2`}>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your Score
                    </h3>
                    <div className={`text-6xl font-bold ${getScoreColor(evaluation.score)}`}>
                        {Math.round(evaluation.score)}
                    </div>
                    <div className="mt-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getLevelBadge(evaluation.competency_level)}`}>
                            {evaluation.competency_level.charAt(0).toUpperCase() + evaluation.competency_level.slice(1)} Level
                        </span>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <div className="card">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary-600" />
                    Feedback
                </h4>
                <p className="text-gray-700 leading-relaxed">{evaluation.feedback}</p>
            </div>

            {/* Strengths */}
            {evaluation.strengths && evaluation.strengths.length > 0 && (
                <div className="card bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        What You Did Well
                    </h4>
                    <ul className="space-y-2">
                        {evaluation.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-green-800">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Gaps */}
            {evaluation.gaps && evaluation.gaps.length > 0 && (
                <div className="card bg-amber-50 border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                        Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                        {evaluation.gaps.map((gap, index) => (
                            <li key={index} className="flex items-start gap-2 text-amber-800">
                                <span className="text-amber-600 mt-1">→</span>
                                <span>{gap}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Missing Concepts */}
            {evaluation.missing_concepts && evaluation.missing_concepts.length > 0 && (
                <div className="card bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-blue-600" />
                        Concepts to Learn
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {evaluation.missing_concepts.map((concept, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Button */}
            <div className="flex justify-center">
                <button onClick={onNext} className="btn-primary flex items-center gap-2">
                    <span>Next Question</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
