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
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Your Learning Roadmap
                        </h1>
                        <p className="text-gray-700 mb-4">{roadmap.overview}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                <Calendar className="w-5 h-5 text-primary-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="font-semibold text-gray-900">{roadmap.total_weeks} weeks</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                <Clock className="w-5 h-5 text-primary-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Weekly Commitment</p>
                                    <p className="font-semibold text-gray-900">{roadmap.hours_per_week} hours</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Hours</p>
                                    <p className="font-semibold text-gray-900">
                                        {roadmap.total_weeks * roadmap.hours_per_week} hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate('/')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <span className="font-semibold">Go to Home</span>
                        </button>
                    </div>
                </div>
            </div>


            {/* Additional Skills Callout */}
            {
                weeksWithAdditionalSkills.length > 0 && (
                    <div className="card bg-green-50 border-2 border-green-200">
                        <div className="flex items-start gap-3">
                            <Plus className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-green-900 mb-2">
                                    Your Custom Learning Goals Included
                                </h3>
                                <p className="text-green-800 text-sm">
                                    This roadmap includes the additional skills you wanted to learn.
                                    They're integrated into your learning path at optimal points.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                {/* Weeks */}
                <div className="space-y-8">
                    {roadmap.weeks.map((week, index) => (
                        <div key={week.week_number} className="relative">
                            {/* Week Number Badge */}
                            <div className="absolute left-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg">
                                {week.week_number}
                            </div>

                            {/* Week Card */}
                            <div className="ml-24">
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
                    ))}
                </div>
            </div>

            {/* Completion Message */}
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-center">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    You've Got This! 🎯
                </h3>
                <p className="text-gray-700">
                    Follow this roadmap consistently, and you'll be ready for your target role in {roadmap.total_weeks} weeks.
                    Remember, the journey of a thousand miles begins with a single step!
                </p>
            </div>
        </div >
    );
};
