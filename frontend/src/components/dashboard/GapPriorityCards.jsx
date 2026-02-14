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

    const GapCard = ({ gap, colors }) => (
        <div className={`glass-card p-4 rounded-xl border border-white/5 ${colors.hoverBorder} transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-white text-lg">{gap.skill_name}</h4>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder} border`}>
                    Gap: {Math.round(gap.gap_score)}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Current</p>
                    <p className="font-medium text-white">{gap.current_level || 'N/A'}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Required</p>
                    <p className={`font-medium ${colors.text}`}>{gap.required_level}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`${colors.progressBar} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${gap.gap_score}%` }}
                    />
                </div>
            </div>

            {gap.missing_concepts && gap.missing_concepts.length > 0 && (
                <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Key Concepts</p>
                    <div className="flex flex-wrap gap-2">
                        {gap.missing_concepts.slice(0, 4).map((concept, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 bg-white/5 text-gray-300 border border-white/10 text-xs rounded-md"
                            >
                                {concept}
                            </span>
                        ))}
                        {gap.missing_concepts.length > 4 && (
                            <span className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-md">
                                +{gap.missing_concepts.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const PrioritySection = ({ title, icon: Icon, color, gaps, section }) => {
        if (!gaps || gaps.length === 0) return null;

        const isExpanded = expandedSections[section];

        return (
            <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-white/5' : ''}`}>
                <button
                    onClick={() => toggleSection(section)}
                    className={`w-full p-4 flex items-center justify-between rounded-xl transition-all duration-300 ${isExpanded
                            ? `${color.bg} border ${color.border}`
                            : `hover:bg-white/5 border border-transparent`
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${color.iconBg}`}>
                            <Icon className={`w-5 h-5 ${color.text}`} />
                        </div>
                        <div className="text-left">
                            <h3 className={`text-lg font-bold text-white`}>{title}</h3>
                            <p className="text-sm text-gray-400">
                                {gaps.length} skill{gaps.length !== 1 ? 's' : ''} require attention
                            </p>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className={`w-5 h-5 ${color.text}`} />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                {isExpanded && (
                    <div className="p-4 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gaps.map((gap, index) => (
                                <GapCard
                                    key={index}
                                    gap={gap}
                                    colors={color}
                                />
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
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    text: 'text-red-500',
                    iconBg: 'bg-red-500/10',
                    hoverBorder: 'hover:border-red-500/50',
                    badgeBg: 'bg-red-500/10',
                    badgeText: 'text-red-500',
                    badgeBorder: 'border-red-500/20',
                    progressBar: 'bg-red-500'
                }}
                gaps={highPriority}
                section="high"
            />

            <PrioritySection
                title="Medium Priority"
                icon={AlertCircle}
                color={{
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    text: 'text-amber-500',
                    iconBg: 'bg-amber-500/10',
                    hoverBorder: 'hover:border-amber-500/50',
                    badgeBg: 'bg-amber-500/10',
                    badgeText: 'text-amber-500',
                    badgeBorder: 'border-amber-500/20',
                    progressBar: 'bg-amber-500'
                }}
                gaps={mediumPriority}
                section="medium"
            />

            <PrioritySection
                title="Low Priority"
                icon={Info}
                color={{
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/30',
                    text: 'text-blue-500',
                    iconBg: 'bg-blue-500/10',
                    hoverBorder: 'hover:border-blue-500/50',
                    badgeBg: 'bg-blue-500/10',
                    badgeText: 'text-blue-500',
                    badgeBorder: 'border-blue-500/20',
                    progressBar: 'bg-blue-500'
                }}
                gaps={lowPriority}
                section="low"
            />
        </div>
    );
};
