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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
