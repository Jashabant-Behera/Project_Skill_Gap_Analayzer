import React from 'react';
import { Trophy, Target } from 'lucide-react';

export const ProgressBar = ({ current, total, score }) => {
    const percentage = (current / total) * 100;
    const isComplete = current === total;

    return (
        <div className="glass-card p-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-display font-bold text-white mb-1">
                        Assessment Progress
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4" />
                        Question {current} of {total}
                    </p>
                </div>

                {score !== null && score !== undefined && (
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Current Score</p>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-brand-orange" />
                                <span className="text-2xl font-display font-bold text-gradient-orange">
                                    {Math.round(score)}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Progress Track */}
            <div className="relative pt-6 pb-2">
                {/* Background Track */}
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    {/* Progress Fill */}
                    <div
                        className="h-full bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Percentage Indicator */}
                <div
                    className="absolute top-0 -translate-x-1/2 transition-all duration-700"
                    style={{ left: `${percentage}%` }}
                >
                    <div className="bg-brand-orange text-white border border-brand-orange/50 rounded px-2 py-0.5 shadow-lg">
                        <span className="text-xs font-bold">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Text */}
            <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                    {isComplete ? (
                        <span className="flex items-center gap-2 text-brand-cyan">
                            <Trophy className="w-3 h-3" />
                            All questions completed!
                        </span>
                    ) : (
                        `${total - current} question${total - current !== 1 ? 's' : ''} remaining`
                    )}
                </span>
            </div>

            {/* Milestone Markers */}
            <div className="mt-4 grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((milestone) => {
                    const reached = percentage >= milestone;
                    return (
                        <div
                            key={milestone}
                            className={`text-center py-1.5 rounded border transition-all ${reached
                                ? 'border-brand-orange/30 bg-brand-orange/10'
                                : 'border-white/5 bg-white/5'
                                }`}
                        >
                            <div className={`text-[10px] font-semibold ${reached ? 'text-brand-orange' : 'text-gray-500'
                                }`}>
                                {milestone}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
