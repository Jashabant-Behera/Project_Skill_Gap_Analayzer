import React, { useState, useEffect } from 'react';
import { Plus, X, Star, Trash2, Search } from 'lucide-react';
import { masterDataService } from '../../services/masterDataService';
import toast from 'react-hot-toast';

export const AdditionalSkillsManager = ({ additionalSkills, onSkillsChange }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [desiredProficiency, setDesiredProficiency] = useState('intermediate');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Search skills
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const data = await masterDataService.searchSkills(query);
            setSearchResults(data.skills || []);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    // Add additional skill
    const handleAddSkill = () => {
        if (!selectedSkill) {
            toast.error('Please select a skill');
            return;
        }

        // Check if already added
        const exists = additionalSkills.some(s => s.skill_id === selectedSkill.skill_id);
        if (exists) {
            toast.error('Skill already added');
            return;
        }

        const newSkill = {
            skill_id: selectedSkill.skill_id,
            skill_name: selectedSkill.skill_name,
            desired_proficiency: desiredProficiency,
            reason: reason || `Want to learn ${selectedSkill.skill_name} to advance my career`,
        };

        onSkillsChange([...additionalSkills, newSkill]);

        // Reset form
        setSelectedSkill(null);
        setSearchQuery('');
        setSearchResults([]);
        setReason('');
        setDesiredProficiency('intermediate');
        setShowAddModal(false);

        toast.success(`${selectedSkill.skill_name} added to learning goals`);
    };

    // Remove skill
    const handleRemoveSkill = (skillId) => {
        const updated = additionalSkills.filter(s => s.skill_id !== skillId);
        onSkillsChange(updated);
        toast.success('Skill removed from learning goals');
    };

    // Update proficiency
    const handleUpdateProficiency = (skillId, newProficiency) => {
        const updated = additionalSkills.map(s =>
            s.skill_id === skillId ? { ...s, desired_proficiency: newProficiency } : s
        );
        onSkillsChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Additional Skills to Learn
                </h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Skill
                </button>
            </div>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Add skills you want to learn that aren't part of your target role. These will appear as gaps in your analysis and be included in your learning roadmap.
            </p>

            {/* Current Additional Skills */}
            <div className="space-y-3">
                {additionalSkills.length === 0 ? (
                    <div className="card text-center py-8" style={{ background: 'var(--bg-secondary)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No additional skills added yet</p>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                            Add skills you want to learn to customize your roadmap
                        </p>
                    </div>
                ) : (
                    additionalSkills.map((skill) => (
                        <div key={skill.skill_id} className="card-hover border-l-4 border-primary-500" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{skill.skill_name}</h4>
                                    {skill.reason && (
                                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{skill.reason}</p>
                                    )}

                                    {/* Proficiency Selector */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Target Level:</span>
                                        <select
                                            value={skill.desired_proficiency}
                                            onChange={(e) => handleUpdateProficiency(skill.skill_id, e.target.value)}
                                            className="input-field text-sm py-1 px-2"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRemoveSkill(skill.skill_id)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Skill Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-glow">
                        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-primary)' }}>
                            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Add Skill to Learn</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Search for a skill
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="e.g., R Programming, Docker, AWS..."
                                        className="input-field pl-10"
                                    />
                                </div>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="border rounded-lg max-h-60 overflow-y-auto" style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-tertiary)' }}>
                                    {searchResults.map((skill) => (
                                        <button
                                            key={skill.skill_id}
                                            onClick={() => {
                                                setSelectedSkill(skill);
                                                setSearchResults([]);
                                                setSearchQuery(skill.skill_name);
                                            }}
                                            className="w-full text-left px-4 py-3 border-b last:border-b-0 transition-all"
                                            style={{
                                                borderColor: 'var(--border-primary)',
                                                background: selectedSkill?.skill_id === skill.skill_id ? 'var(--bg-secondary)' : 'transparent'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = selectedSkill?.skill_id === skill.skill_id ? 'var(--bg-secondary)' : 'transparent'}
                                        >
                                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{skill.skill_name}</div>
                                            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{skill.category}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedSkill && (
                                <>
                                    {/* Selected Skill Info */}
                                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(124, 58, 237, 0.1))', borderColor: 'var(--accent-primary)' }}>
                                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedSkill.skill_name}</div>
                                        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{selectedSkill.description}</div>
                                    </div>

                                    {/* Desired Proficiency */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                            Target Proficiency Level
                                        </label>
                                        <select
                                            value={desiredProficiency}
                                            onChange={(e) => setDesiredProficiency(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                            Why do you want to learn this? (Optional)
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="e.g., Required for data science roles in the market..."
                                            className="input-field"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Add Button */}
                                    <div className="flex gap-3">
                                        <button onClick={handleAddSkill} className="btn-primary flex-1">
                                            Add to Learning Goals
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedSkill(null);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
