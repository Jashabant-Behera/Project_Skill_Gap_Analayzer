import React from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Plus } from 'lucide-react';
import { ResourceList } from './ResourceList';

export const WeekCard = ({ week, isExpanded, onToggle, roadmapId }) => {
    // Check if week contains additional learning goals
    const hasAdditionalSkills = week.skills_to_learn.some(skillId =>
        week.is_additional_skill?.[skillId]
    );

    return (
        <div className={`card border-2 transition-all ${isExpanded ? 'border-primary-300 shadow-lg' : 'border-gray-200'
            }`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between text-left"
            >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{week.title}</h3>
                        {hasAdditionalSkills && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <Plus className="w-3 h-3" />
                                Custom Goal
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{week.estimated_hours} hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{week.skills_to_learn.length} skills</span>
                        </div>
                    </div>
                </div>

                <div className="text-primary-600">
                    {isExpanded ? (
                        <ChevronUp className="w-6 h-6" />
                    ) : (
                        <ChevronDown className="w-6 h-6" />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className="mt-6 space-y-6 animate-fadeIn">
                    {/* Learning Objectives */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                        <div className="prose prose-sm max-w-none text-gray-700">
                            {week.learning_objectives}
                        </div>
                    </div>

                    {/* Skills Breakdown */}
                    {week.skills_to_learn && week.skills_to_learn.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Skills Covered</h4>
                            <div className="flex flex-wrap gap-2">
                                {week.skills_to_learn.map((skillId, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${week.is_additional_skill?.[skillId]
                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                : 'bg-primary-100 text-primary-800'
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

                    {/* Resources */}
                    {week.resources && Object.keys(week.resources).length > 0 && (
                        <ResourceList resources={week.resources} />
                    )}

                    {/* Project */}
                    {week.projects && week.projects.title && (
                        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2">
                                📝 Week Project: {week.projects.title}
                            </h4>
                            <p className="text-sm text-purple-800 mb-3">
                                {week.projects.description}
                            </p>
                            {week.projects.skills_applied && (
                                <div>
                                    <p className="text-xs text-purple-700 mb-2">Skills you'll practice:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {week.projects.skills_applied.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Success Criteria */}
                    {week.success_criteria && week.success_criteria.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">✅ Success Criteria</h4>
                            <ul className="space-y-2">
                                {week.success_criteria.map((criteria, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
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
