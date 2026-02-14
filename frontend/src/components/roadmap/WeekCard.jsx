import React from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Plus } from 'lucide-react';


export const WeekCard = ({ week, isExpanded, onToggle, roadmapId }) => {
    // Check if week contains additional learning goals
    const hasAdditionalSkills = week.skills_to_learn.some(skillId =>
        week.is_additional_skill?.[skillId]
    );

    return (
        <div
            className={`glass-card transition-all duration-300 group ${isExpanded ? 'bg-white/5 border-brand-cyan/30' : 'hover:bg-white/5 border-white/5 hover:border-white/10'
                }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between text-left p-6"
            >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-brand-cyan' : 'text-white group-hover:text-brand-cyan/80'
                            }`}>
                            {week.title}
                        </h3>
                        {hasAdditionalSkills && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 flex items-center gap-1">
                                <Plus className="w-3 h-3" />
                                Custom
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{week.estimated_hours} hrs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{week.skills_to_learn.length} skills</span>
                        </div>
                    </div>
                </div>

                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand-cyan' : 'text-gray-500 group-hover:text-white'}`}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </button>

            {isExpanded && (
                <div className="px-6 pb-6 space-y-6 animate-fadeIn border-t border-white/5 pt-6">
                    {/* Learning Objectives */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Objective</h4>
                        <div className="text-gray-300 text-sm leading-relaxed">
                            {week.learning_objectives}
                        </div>
                    </div>

                    {/* Skills Breakdown */}
                    {week.skills_to_learn && week.skills_to_learn.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {week.skills_to_learn.map((skillId, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${week.is_additional_skill?.[skillId]
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-brand-cyan/30 hover:text-white'
                                            }`}
                                    >
                                        {skillId.replace(/_/g, ' ')}
                                        {week.is_additional_skill?.[skillId] && (
                                            <Plus className="w-3 h-3 inline ml-1" />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Project */}
                    {week.projects && week.projects.title && (
                        <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/20">
                            <h4 className="font-semibold text-brand-purple mb-2 text-sm flex items-center gap-2">
                                <span className="p-1 rounded bg-brand-purple/20">📝</span>
                                {week.projects.title}
                            </h4>
                            <p className="text-sm text-gray-400 mb-3 ml-8">
                                {week.projects.description}
                            </p>
                        </div>
                    )}

                    {/* Success Criteria */}
                    {week.success_criteria && week.success_criteria.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Success Criteria</h4>
                            <ul className="space-y-2">
                                {week.success_criteria.map((criteria, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0" />
                                        <span>{criteria}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
