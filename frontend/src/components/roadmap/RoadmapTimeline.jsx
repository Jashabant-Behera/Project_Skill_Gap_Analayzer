import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapService } from '../../services/roadmapService';
import { WeekCard } from './WeekCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Calendar, Clock, BookOpen, Target, Plus } from 'lucide-react';

export const RoadmapTimeline = () => {
    const { assessmentId, roadmapId } = useParams();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedWeek, setExpandedWeek] = useState(1);

    useEffect(() => {
        fetchRoadmap();
    }, [assessmentId, roadmapId]);

    const fetchRoadmap = async () => {
        try {
            setLoading(true);
            let data;

            if (roadmapId) {
                data = await roadmapService.getRoadmap(roadmapId);
            } else if (assessmentId) {
                data = await roadmapService.getRoadmapByAssessment(assessmentId);
            }

            setRoadmap(data);
            setError(null);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Roadmap not generated yet');
            } else {
                setError('Failed to load roadmap');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading your roadmap..." />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <ErrorMessage message={error} />
                {assessmentId && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate(`/roadmap/generate/${assessmentId}`)}
                            className="btn-primary"
                        >
                            Generate Roadmap
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (!roadmap) {
        return null;
    }

    // Identify weeks with additional learning goals
    const weeksWithAdditionalSkills = roadmap.weeks.filter(week =>
        week.skills_to_learn.some(skillId =>
            // Check if skill is marked as additional (backend should provide this)
            week.is_additional_skill?.[skillId]
        )
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="glass-card p-8 border-l-4 border-l-brand-cyan relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-brand-cyan" />
                            <h2 className="text-sm font-medium text-brand-cyan uppercase tracking-wider">Learning Roadmap</h2>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Your Journey to Success
                        </h1>
                        <p className="text-gray-400 max-w-2xl">{roadmap.overview}</p>

                        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <Calendar className="w-4 h-4 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                                    <p className="font-semibold text-white">{roadmap.total_weeks} weeks</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <Clock className="w-4 h-4 text-brand-orange" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Weekly Time</p>
                                    <p className="font-semibold text-white">{roadmap.hours_per_week} hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 rounded-lg bg-white/5 hover:bg-white/10"
                    >
                        Back to Home
                    </button>
                </div>
            </div>


            {/* Additional Skills Callout */}
            {
                weeksWithAdditionalSkills.length > 0 && (
                    <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 flex items-start gap-4">
                        <div className="p-2 rounded-full bg-brand-cyan/10">
                            <Plus className="w-5 h-5 text-brand-cyan" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-brand-cyan mb-1">
                                Custom Goals Included
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Your roadmap has been personalized with the additional skills you requested.
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Timeline */}
            <div className="relative pl-4">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/10" />

                <div className="space-y-2">
                    {roadmap.weeks.map((week, index) => (
                        <div key={week.week_number} className="relative group">
                            <div className="flex items-start gap-8">
                                {/* Week Node */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center transition-all duration-300 ${expandedWeek === week.week_number
                                        ? 'bg-brand-cyan text-black scale-110 shadow-[0_0_15px_rgba(4,222,178,0.4)]'
                                        : 'bg-dark-800 text-gray-500 border-white/10 group-hover:border-brand-cyan/50'
                                        }`}>
                                        <span className="text-sm font-bold">{week.week_number}</span>
                                    </div>
                                </div>

                                {/* Week Card */}
                                <div className="flex-1 pb-8">
                                    <WeekCard
                                        week={week}
                                        isExpanded={expandedWeek === week.week_number}
                                        onToggle={() => setExpandedWeek(
                                            expandedWeek === week.week_number ? null : week.week_number
                                        )}
                                        roadmapId={roadmap.roadmap_id}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completion Message */}
            <div className="glass-card p-8 text-center border-t-4 border-t-green-500/50">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                    Goal in Sight!
                </h3>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Consistency is key. Follow this plan for {roadmap.total_weeks} weeks and you'll be interview-ready.
                </p>
            </div>
        </div >
    );
};
