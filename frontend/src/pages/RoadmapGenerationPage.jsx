import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapService } from '../services/roadmapService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Clock, BookOpen, Target, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const RoadmapGenerationPage = () => {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        try {
            setLoading(true);
            await roadmapService.generateRoadmap({
                assessment_id: assessmentId,
                hours_per_week: hoursPerWeek
            });
            toast.success('Roadmap generated successfully!');
            navigate(`/roadmap/${assessmentId}`);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.error('Roadmap already exists');
                navigate(`/roadmap/${assessmentId}`);
            } else {
                toast.error('Failed to generate roadmap');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <LoadingSpinner size="lg" />
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Designing Your Personal Path...</h2>
                    <p className="text-gray-600 animate-pulse">
                        Analyzing your skill gaps and creating an optimal learning schedule.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="card bg-white shadow-xl border-t-4 border-t-primary-600">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Your Learning Roadmap
                    </h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        We'll generate a personalized week-by-week plan to help you bridge your skill gaps efficiently.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Time Commitment Input */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Weekly Time Commitment
                        </label>

                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="2"
                                max="40"
                                step="1"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <span className="inline-flex items-center justify-center w-16 h-10 bg-white border border-gray-300 rounded-lg font-bold text-primary-700 shadow-sm">
                                {hoursPerWeek}h
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Recommended: 10-15 hours for steady progress.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3">
                            <Target className="w-5 h-5 text-green-500 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Goal Focused</h4>
                                <p className="text-sm text-gray-600">Prioritizes high-impact skills first</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3">
                            <BookOpen className="w-5 h-5 text-blue-500 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Curated Resources</h4>
                                <p className="text-sm text-gray-600">Includes best tutorials and projects</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGenerate}
                        className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate My Roadmap
                    </button>
                </div>
            </div>
        </div>
    );
};
