import React from 'react';
import { BookOpen, Video, Code, FileText, ExternalLink } from 'lucide-react';

export const ResourceList = ({ resources }) => {
    const resourceTypes = [
        { key: 'documentation', label: 'Documentation', icon: FileText, color: 'blue' },
        { key: 'tutorials', label: 'Tutorials', icon: BookOpen, color: 'green' },
        { key: 'courses', label: 'Courses', icon: Video, color: 'purple' },
        { key: 'practice', label: 'Practice', icon: Code, color: 'amber' },
    ];

    const getColorClasses = (color) => ({
        bg: `bg-${color}-50`,
        text: `text-${color}-700`,
        border: `border-${color}-200`,
    });

    return (
        <div>
            <h4 className="font-semibold text-gray-900 mb-3">📚 Learning Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resourceTypes.map(({ key, label, icon: Icon, color }) => {
                    const items = resources[key];
                    if (!items || items.length === 0) return null;

                    return (
                        <div
                            key={key}
                            className={`p-4 rounded-lg border-2 bg-${color}-50 border-${color}-200`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Icon className={`w-5 h-5 text-${color}-600`} />
                                <h5 className={`font-semibold text-${color}-900`}>{label}</h5>
                            </div>
                            <ul className="space-y-2">
                                {items.map((item, index) => (
                                    <li key={index} className="text-sm">
                                        {typeof item === 'string' ? (
                                            item.startsWith('http') ? (
                                                <a
                                                    href={item}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-${color}-700 hover:text-${color}-900 hover:underline flex items-center gap-1`}
                                                >
                                                    <span className="line-clamp-1">{item}</span>
                                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                            ) : (
                                                <span className={`text-${color}-800`}>{item}</span>
                                            )
                                        ) : (
                                            <span className={`text-${color}-800`}>{JSON.stringify(item)}</span>
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
