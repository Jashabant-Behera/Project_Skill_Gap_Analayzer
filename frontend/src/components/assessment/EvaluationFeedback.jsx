import React from 'react';
import { CheckCircle, XCircle, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';

export const EvaluationFeedback = ({ evaluation, onNext, isLastQuestion }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-brand-cyan';
        if (score >= 60) return 'text-brand-blue';
        if (score >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-brand-cyan/10 border-brand-cyan/30';
        if (score >= 60) return 'bg-brand-blue/10 border-brand-blue/30';
        if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
        return 'bg-red-500/10 border-red-500/30';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Score Card */}
            <div className={`glass-card p-8 text-center relative overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-cyan to-brand-blue opacity-50"></div>

                <h3 className="text-xl font-medium text-gray-300 mb-4 uppercase tracking-widest text-sm">
                    Performance Score
                </h3>

                <div className="relative inline-block">
                    <div className={`text-6xl font-display font-bold ${getScoreColor(evaluation.score)} drop-shadow-md`}>
                        {Math.round(evaluation.score)}
                    </div>
                </div>

                <div className="mt-6">
                    <span className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${evaluation.competency_level === 'advanced' ? 'bg-brand-cyan/20 border-brand-cyan/40 text-brand-cyan' :
                        evaluation.competency_level === 'intermediate' ? 'bg-brand-blue/20 border-brand-blue/40 text-brand-blue' :
                            'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                        }`}>
                        {evaluation.competency_level} Level
                    </span>
                </div>
            </div>

            {/* Feedback */}
            <div className="glass-card p-10 border-l-4 border-l-brand-blue">
                <h4 className="font-display font-medium text-white text-xl mb-4 flex items-center gap-3">
                    <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue">
                        <Lightbulb className="w-5 h-5" />
                    </div>
                    Feedback
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg font-light">{evaluation.feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                {evaluation.strengths && evaluation.strengths.length > 0 && (
                    <div className="glass-card p-8 bg-brand-cyan/5 border-brand-cyan/20">
                        <h4 className="font-medium text-brand-cyan mb-4 flex items-center gap-2 text-lg">
                            <CheckCircle className="w-5 h-5" />
                            What You Did Well
                        </h4>
                        <ul className="space-y-3">
                            {evaluation.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-300">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Gaps */}
                {evaluation.gaps && evaluation.gaps.length > 0 && (
                    <div className="glass-card p-8 bg-brand-orange/5 border-brand-orange/20">
                        <h4 className="font-medium text-brand-orange mb-4 flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5" />
                            Areas for Improvement
                        </h4>
                        <ul className="space-y-3">
                            {evaluation.gaps.map((gap, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-300">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />
                                    <span>{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Missing Concepts */}
            {evaluation.missing_concepts && evaluation.missing_concepts.length > 0 && (
                <div className="glass-card p-8 border-brand-blue/20">
                    <h4 className="font-medium text-white mb-4 flex items-center gap-2 text-lg">
                        <XCircle className="w-5 h-5 text-brand-blue" />
                        Concepts to Learn
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {evaluation.missing_concepts.map((concept, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-white/5 border border-white/10 text-brand-blue hover:text-white hover:bg-brand-blue/20 transition-colors rounded-lg text-sm"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Button */}
            <div className="flex justify-center pt-8">
                <button onClick={onNext} className="btn-primary flex items-center gap-3 px-10 py-4 text-lg group">
                    <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
