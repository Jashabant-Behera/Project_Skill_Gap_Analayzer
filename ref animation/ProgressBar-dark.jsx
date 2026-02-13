import React from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';

export const ProgressBar = ({ current, total, score }) => {
    const percentage = (current / total) * 100;
    
    const getScoreColor = () => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--info)';
        if (score >= 40) return 'var(--warning)';
        return 'var(--error)';
    };
    
    const getScoreGrade = () => {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Very Good';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Fair';
        return 'Needs Improvement';
    };

    return (
        <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Progress Info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">Questions</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">
                            {current} <span className="text-base text-[var(--text-tertiary)]">/ {total}</span>
                        </p>
                    </div>
                </div>

                {/* Score Info */}
                {score !== null && score !== undefined && (
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ 
                                 background: `linear-gradient(135deg, ${getScoreColor()}22, ${getScoreColor()}44)`,
                                 border: `2px solid ${getScoreColor()}`
                             }}>
                            <TrendingUp className="w-6 h-6" style={{ color: getScoreColor() }} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--text-muted)] mb-1">Current Score</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold" style={{ color: getScoreColor() }}>
                                    {Math.round(score)}%
                                </p>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                                      style={{ 
                                          background: `${getScoreColor()}22`,
                                          color: getScoreColor(),
                                          border: `1px solid ${getScoreColor()}44`
                                      }}>
                                    {getScoreGrade()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Completion Percentage */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-secondary)] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-muted)] mb-1">Completion</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">
                            {Math.round(percentage)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-[var(--text-secondary)]">
                        Assessment Progress
                    </span>
                    <span className="text-[var(--text-muted)]">
                        {total - current} questions remaining
                    </span>
                </div>
                
                <div className="progress-bar h-3">
                    <div 
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Milestone Indicators */}
                <div className="flex justify-between text-xs text-[var(--text-muted)] pt-1">
                    <span className={percentage >= 0 ? 'text-[var(--accent-primary)]' : ''}>Start</span>
                    <span className={percentage >= 25 ? 'text-[var(--accent-primary)]' : ''}>25%</span>
                    <span className={percentage >= 50 ? 'text-[var(--accent-primary)]' : ''}>50%</span>
                    <span className={percentage >= 75 ? 'text-[var(--accent-primary)]' : ''}>75%</span>
                    <span className={percentage >= 100 ? 'text-[var(--accent-primary)]' : ''}>Complete</span>
                </div>
            </div>

            {/* Motivational Message */}
            {percentage > 0 && percentage < 100 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-lg border border-[var(--accent-primary)]/20">
                    <p className="text-sm text-[var(--text-secondary)] text-center">
                        {percentage < 25 && "🚀 Great start! Keep going!"}
                        {percentage >= 25 && percentage < 50 && "💪 You're making excellent progress!"}
                        {percentage >= 50 && percentage < 75 && "⭐ Halfway there! You've got this!"}
                        {percentage >= 75 && "🎯 Almost done! Finish strong!"}
                    </p>
                </div>
            )}
        </div>
    );
};
