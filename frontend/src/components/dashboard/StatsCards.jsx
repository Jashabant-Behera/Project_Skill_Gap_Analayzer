import React from 'react';
import { Target, TrendingUp, Clock, Award } from 'lucide-react';

export const StatsCards = ({ summary }) => {
    const stats = [
        {
            label: 'Overall Score',
            value: `${Math.round(summary.overall_score)}%`,
            icon: Award,
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
        },
        {
            label: 'Readiness Score',
            value: `${Math.round(summary.readiness_score)}%`,
            icon: Target,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Questions Answered',
            value: summary.total_questions || 0,
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Time Taken',
            value: `${summary.time_taken_minutes || 0} min`,
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="glass-card p-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-3xl font-display font-bold text-white group-hover:text-brand-cyan transition-colors">
                                {typeof stat.value === 'string' && stat.value.endsWith('%')
                                    ? stat.value.replace('%', '')
                                    : stat.value}
                                {typeof stat.value === 'string' && stat.value.endsWith('%') && <span className="text-lg text-gray-500 ml-0.5">%</span>}
                            </p>
                            {/* Appending unit if needed, logic simplified for visual mostly */}
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-brand-cyan/30 transition-colors">
                            <stat.icon className={`w-6 h-6 text-gray-300 group-hover:text-brand-cyan transition-colors`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
