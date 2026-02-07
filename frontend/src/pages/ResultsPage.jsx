import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillGapDashboard } from '../components/dashboard/SkillGapDashboard';
import { ArrowRight } from 'lucide-react';

export const ResultsPage = () => {
    const { assessmentId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <SkillGapDashboard />

            <div className="flex justify-center">
                <button
                    onClick={() => navigate(`/roadmap/generate/${assessmentId}`)}
                    className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
                >
                    <span>Generate Learning Roadmap</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
