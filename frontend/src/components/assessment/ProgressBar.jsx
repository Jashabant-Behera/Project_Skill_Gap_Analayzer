import React from 'react';
import { Trophy, Target } from 'lucide-react';

export const ProgressBar = ({ current, total, score }) => {
    const percentage = (current / total) * 100;
    const isComplete = current === total;

    return (
        <div className="card-glow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                        Assessment Progress
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Question {current} of {total}
                    </p>
                </div>

                {score !== null && score !== undefined && (
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm text-gray-400 mb-1">Current Score</p>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary-400" />
                                <span className="text-3xl font-display font-bold gradient-text">
                                    {Math.round(score)}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Progress Track */}
            <div className="relative">
                {/* Background Track */}
                <div className="w-full h-4 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                    {/* Progress Fill */}
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Percentage Indicator */}
                <div
                    className="absolute -top-8 -translate-x-1/2 transition-all duration-700"
                    style={{ left: `${percentage}%` }}
                >
                    <div className="bg-dark-800 border-2 border-primary-500 rounded-lg px-3 py-1 shadow-neon">
                        <span className="text-sm font-bold text-primary-300">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Text */}
            <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-gray-400">
                    {isComplete ? (
                        <span className="flex items-center gap-2 text-emerald-400">
                            <Trophy className="w-4 h-4" />
                            All questions completed!
                        </span>
                    ) : (
                        `${total - current} question${total - current !== 1 ? 's' : ''} remaining`
                    )}
                </span>

                <span className="font-mono text-primary-400 font-semibold">
                    {Math.round(percentage)}% Complete
                </span>
            </div>

            {/* Milestone Markers */}
            <div className="mt-6 grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((milestone) => {
                    const reached = percentage >= milestone;
                    return (
                        <div
                            key={milestone}
                            className={`text-center p-2 rounded-lg border transition-all ${reached
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-dark-700 bg-dark-850/50'
                                }`}
                        >
                            <div className={`text-xs font-semibold ${reached ? 'text-primary-400' : 'text-gray-500'
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
