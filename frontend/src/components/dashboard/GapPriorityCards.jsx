import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const GapPriorityCards = ({ highPriority, mediumPriority, lowPriority }) => {
    const [expandedSections, setExpandedSections] = useState({
        high: true,
        medium: false,
        low: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const GapCard = ({ gap }) => (
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">{gap.skill_name}</h4>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                    <p className="text-gray-600">Current</p>
                    <p className="font-medium text-gray-900">{gap.current_level || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-gray-600">Required</p>
                    <p className="font-medium text-primary-600">{gap.required_level}</p>
                </div>
            </div>

            <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Gap Score</span>
                    <span className="font-semibold text-red-600">{Math.round(gap.gap_score)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${gap.gap_score}%` }}
                    />
                </div>
            </div>

            {gap.missing_concepts && gap.missing_concepts.length > 0 && (
                <div>
                    <p className="text-xs text-gray-600 mb-2">Key concepts to learn:</p>
                    <div className="flex flex-wrap gap-1">
                        {gap.missing_concepts.slice(0, 4).map((concept, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                                {concept}
                            </span>
                        ))}
                        {gap.missing_concepts.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{gap.missing_concepts.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const PrioritySection = ({ title, icon: Icon, color, gaps, section }) => {
        if (!gaps || gaps.length === 0) return null;

        return (
            <div className={`border-2 rounded-xl overflow-hidden ${color.border}`}>
                <button
                    onClick={() => toggleSection(section)}
                    className={`w-full p-4 flex items-center justify-between ${color.bg} hover:opacity-90 transition-opacity`}
                >
                    <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${color.text}`} />
                        <div className="text-left">
                            <h3 className={`text-lg font-bold ${color.text}`}>{title}</h3>
                            <p className={`text-sm ${color.subtext}`}>
                                {gaps.length} skill{gaps.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    {expandedSections[section] ? (
                        <ChevronUp className={`w-5 h-5 ${color.text}`} />
                    ) : (
                        <ChevronDown className={`w-5 h-5 ${color.text}`} />
                    )}
                </button>

                {expandedSections[section] && (
                    <div className="p-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gaps.map((gap, index) => (
                                <GapCard key={index} gap={gap} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <PrioritySection
                title="High Priority"
                icon={AlertTriangle}
                color={{
                    bg: 'bg-red-50',
                    border: 'border-red-300',
                    text: 'text-red-700',
                    subtext: 'text-red-600',
                }}
                gaps={highPriority}
                section="high"
            />

            <PrioritySection
                title="Medium Priority"
                icon={AlertCircle}
                color={{
                    bg: 'bg-amber-50',
                    border: 'border-amber-300',
                    text: 'text-amber-700',
                    subtext: 'text-amber-600',
                }}
                gaps={mediumPriority}
                section="medium"
            />

            <PrioritySection
                title="Low Priority"
                icon={Info}
                color={{
                    bg: 'bg-blue-50',
                    border: 'border-blue-300',
                    text: 'text-blue-700',
                    subtext: 'text-blue-600',
                }}
                gaps={lowPriority}
                section="low"
            />
        </div>
    );
};
