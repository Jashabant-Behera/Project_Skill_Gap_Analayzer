import React, { useState, useEffect } from 'react';
import { Plus, X, Star, Trash2, Search } from 'lucide-react';
import { masterDataService } from '../../services/masterDataService';
import toast from 'react-hot-toast';

export const AdditionalSkillsManager = ({ additionalSkills, onSkillsChange }) => {
    const [allSkills, setAllSkills] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingSkills, setLoadingSkills] = useState(true);

    useEffect(() => {
        fetchAllSkills();
    }, []);

    const fetchAllSkills = async () => {
        try {
            const data = await masterDataService.getSkills({ limit: 100 });
            setAllSkills(data.skills || []);
        } catch (error) {
            console.error('Failed to load skills');
        } finally {
            setLoadingSkills(false);
        }
    };

    const handleToggleSkill = (skill) => {
        const exists = additionalSkills.some(s => s.skill_id === skill.skill_id);

        if (exists) {
            // Remove
            onSkillsChange(additionalSkills.filter(s => s.skill_id !== skill.skill_id));
            toast.success('Skill removed');
        } else {
            // Add
            const newSkill = {
                skill_id: skill.skill_id,
                skill_name: skill.skill_name,
                desired_proficiency: 'intermediate',
                reason: `Want to learn ${skill.skill_name}`,
            };
            onSkillsChange([...additionalSkills, newSkill]);
            toast.success('Skill added');
        }
    };

    const filteredSkills = allSkills.filter(skill =>
        skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                    Additional Skills to Learn
                </h3>
                <p className="text-sm text-gray-400">
                    Select any extra skills you want to include in your roadmap.
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search for skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all outline-none"
                />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingSkills ? (
                    <div className="col-span-full text-center text-gray-500 py-8">Loading skills...</div>
                ) : filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => {
                        const isSelected = additionalSkills.some(s => s.skill_id === skill.skill_id);
                        return (
                            <button
                                key={skill.skill_id}
                                onClick={() => handleToggleSkill(skill)}
                                className={`text-left p-3 rounded-lg border transition-all group relative overflow-hidden ${isSelected
                                        ? 'bg-brand-cyan/20 border-brand-cyan shadow-[0_0_15px_rgba(4,222,178,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:border-brand-cyan/30 hover:bg-white/10'
                                    }`}
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                            {skill.skill_name}
                                        </span>
                                        {isSelected && <Star className="w-3.5 h-3.5 text-brand-cyan fill-brand-cyan" />}
                                    </div>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                        {skill.category}
                                    </span>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">No skills found matching "{searchQuery}"</div>
                )}
            </div>

            {/* Selected Skills Summary */}
            {additionalSkills.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-medium text-white mb-3">Selected Skills ({additionalSkills.length})</h4>
                    <div className="flex flex-wrap gap-2">
                        {additionalSkills.map(skill => (
                            <div key={skill.skill_id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs text-brand-cyan">
                                <span>{skill.skill_name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleSkill(skill); }}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
