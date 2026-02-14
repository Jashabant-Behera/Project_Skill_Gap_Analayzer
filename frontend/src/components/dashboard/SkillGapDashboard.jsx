import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { SkillRadarChart } from './SkillRadarChart';
import { GapPriorityCards } from './GapPriorityCards';
import { StatsCards } from './StatsCards';
import { CompetencyDistribution } from './CompetencyDistribution';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Plus } from 'lucide-react';

export const SkillGapDashboard = () => {
    const { assessmentId } = useParams();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, [assessmentId]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await analyticsService.getDashboard(assessmentId);
            setDashboardData(data);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading your results..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
    }

    if (!dashboardData) {
        return null;
    }

    // Separate role-required gaps from additional learning goals
    const roleGaps = dashboardData.skill_gaps.high
        .concat(dashboardData.skill_gaps.medium)
        .concat(dashboardData.skill_gaps.low)
        .filter(gap => !gap.is_additional); // Assuming backend marks additional skills

    const additionalGoals = dashboardData.skill_gaps.high
        .concat(dashboardData.skill_gaps.medium)
        .concat(dashboardData.skill_gaps.low)
        .filter(gap => gap.is_additional);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="glass-card p-6 border-l-4 border-l-brand-orange">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 text-white">
                            Assessment Results
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Target Role: <span className="font-semibold text-brand-orange">{dashboardData.summary.target_role}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">
                            Completed on {new Date(dashboardData.summary.completed_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards summary={dashboardData.summary} />

            {/* Radar Chart */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-6 text-white uppercase tracking-wide">
                    Skills Overview
                </h2>
                <SkillRadarChart data={dashboardData.skill_radar} />
            </div>

            {/* Role-Required Gaps */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-orange rounded-full"></span>
                    Skills Gap Analysis
                </h2>
                <GapPriorityCards
                    highPriority={dashboardData.skill_gaps.high.filter(g => !g.is_additional)}
                    mediumPriority={dashboardData.skill_gaps.medium.filter(g => !g.is_additional)}
                    lowPriority={dashboardData.skill_gaps.low.filter(g => !g.is_additional)}
                />
            </div>

            {/* Additional Learning Goals */}
            {additionalGoals.length > 0 && (
                <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Plus className="w-6 h-6 text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Additional Learning Goals
                        </h2>
                    </div>

                    <p className="text-gray-700 mb-6">
                        Skills you wanted to learn beyond the role requirements. These will be included in your personalized roadmap.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {additionalGoals.map((goal, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg border-2 border-green-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{goal.skill_name}</h3>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        Custom Goal
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current:</span>
                                        <span className="font-medium">{goal.current_level || 'Not assessed'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Target:</span>
                                        <span className="font-medium text-green-700">{goal.required_level}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gap:</span>
                                        <span className="font-medium text-amber-700">
                                            {Math.round(goal.gap_score)}%
                                        </span>
                                    </div>
                                </div>

                                {goal.missing_concepts && goal.missing_concepts.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs text-gray-600 mb-2">To Learn:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {goal.missing_concepts.slice(0, 3).map((concept, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                                                >
                                                    {concept}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Competency Distribution */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-6 text-white uppercase tracking-wide">
                    Competency Distribution
                </h2>
                <CompetencyDistribution data={dashboardData.statistics.competency_distribution} />
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wide">Score by Skill</h3>
                    <div className="space-y-4">
                        {Object.entries(dashboardData.statistics.score_by_skill || {}).map(([skill, score]) => (
                            <div key={skill}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider">{skill}</span>
                                    <span className="font-bold text-white">{Math.round(score)}%</span>
                                </div>
                                <div className="w-full rounded-full h-1.5 bg-white/5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${score >= 80
                                            ? 'bg-brand-cyan shadow-[0_0_10px_rgba(4,222,178,0.4)]'
                                            : score >= 60
                                                ? 'bg-brand-blue shadow-[0_0_10px_rgba(40,155,255,0.4)]'
                                                : score >= 40
                                                    ? 'bg-brand-orange shadow-[0_0_10px_rgba(255,103,2,0.4)]'
                                                    : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                            }`}
                                        style={{ width: `${score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                    <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wide">Assessment Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-gray-400 text-sm">Total Questions</span>
                            <span className="font-bold text-white text-lg">{dashboardData.summary.total_questions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-gray-400 text-sm">Time Taken</span>
                            <span className="font-bold text-white text-lg">{dashboardData.summary.time_taken_minutes || 0} <span className="text-xs text-gray-500 font-normal">min</span></span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-gray-400 text-sm">Average Score</span>
                            <span className="font-bold text-brand-cyan text-lg">{Math.round(dashboardData.statistics.average_score || 0)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-gray-400 text-sm">Skills Assessed</span>
                            <span className="font-bold text-white text-lg">
                                {Object.keys(dashboardData.statistics.score_by_skill || {}).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
