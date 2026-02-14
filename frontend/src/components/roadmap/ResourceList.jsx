import React from 'react';
import { BookOpen, Video, Code, FileText, ExternalLink } from 'lucide-react';

export const ResourceList = ({ resources }) => {
    const resourceTypes = [
        {
            key: 'documentation',
            label: 'Documentation',
            icon: FileText,
            bg: 'bg-brand-blue/10',
            border: 'border-brand-blue/30',
            text: 'text-brand-blue',
            hover: 'group-hover:text-brand-blue'
        },
        {
            key: 'tutorials',
            label: 'Tutorials',
            icon: BookOpen,
            bg: 'bg-brand-cyan/10',
            border: 'border-brand-cyan/30',
            text: 'text-brand-cyan',
            hover: 'group-hover:text-brand-cyan'
        },
        {
            key: 'courses',
            label: 'Courses',
            icon: Video,
            bg: 'bg-purple-500/10', /* Keeping purple as an accent */
            border: 'border-purple-500/30',
            text: 'text-purple-400',
            hover: 'group-hover:text-purple-400'
        },
        {
            key: 'practice',
            label: 'Practice',
            icon: Code,
            bg: 'bg-brand-orange/10',
            border: 'border-brand-orange/30',
            text: 'text-brand-orange',
            hover: 'group-hover:text-brand-orange'
        },
    ];

    return (
        <div className="space-y-6">
            <h4 className="text-xl font-display font-medium text-white flex items-center gap-3">
                <span className="text-2xl">📚</span> Learning Resources
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resourceTypes.map(({ key, label, icon: Icon, bg, border, text, hover }) => {
                    const items = resources?.[key];
                    if (!items || items.length === 0) return null;

                    return (
                        <div
                            key={key}
                            className={`glass-card p-8 border ${border} hover:border-opacity-50 transition-all duration-300 group`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-lg ${bg} ${text}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h5 className="font-medium text-white text-lg">{label}</h5>
                            </div>

                            <ul className="space-y-3">
                                {items.map((item, index) => (
                                    <li key={index} className="text-sm">
                                        {typeof item === 'string' ? (
                                            item.startsWith('http') ? (
                                                <a
                                                    href={item}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group/link"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/link:bg-brand-cyan transition-colors" />
                                                    <span className="line-clamp-1 flex-1 border-b border-transparent group-hover/link:border-brand-cyan/50">{item}</span>
                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-brand-cyan" />
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${text.replace('text-', 'bg-')}`} />
                                                    <span>{item}</span>
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-gray-400">
                                                {JSON.stringify(item)}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
