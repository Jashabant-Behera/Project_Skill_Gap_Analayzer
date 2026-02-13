import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { User, Mail, Briefcase, Plus, X } from 'lucide-react';
import { masterDataService } from '../services/masterDataService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        current_role: '',
        experience_years: 0,
    });
    const [loading, setLoading] = useState(false);

    const [userSkills, setUserSkills] = useState([]);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                current_role: user.current_role || '',
                experience_years: user.experience_years || 0,
            });
            fetchUserSkills();
        }
    }, [user]);

    const fetchUserSkills = async () => {
        try {
            // We need a service method to get user skills. 
            // authServiceMock? No, authService.js has getUserSkills
            const skills = await authService.getUserSkills();
            setUserSkills(skills);
        } catch (error) {
            console.error('Failed to fetch user skills', error);
        }
    }

    // ... handle search and add skill ...


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser(formData);
        } catch (error) {
            // toast.error handled in context
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            // Need to import masterDataService
            const data = await masterDataService.searchSkills(query);
            setSearchResults(data.skills || []);
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddSkill = async (skill) => {
        try {
            await authService.addSkill({
                skill_id: skill.skill_id,
                skill_name: skill.skill_name,
                proficiency_level: "intermediate",
                years_of_experience: 1
            });
            toast.success("Skill added!");
            fetchUserSkills();
            setShowSkillModal(false);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            toast.error("Failed to add skill");
        }
    }

    const handleRemoveSkill = async (skillId) => {
        try {
            // Correct API endpoint for removing skill is likely DELETE /users/skills/{skillId}
            // authService.removeSkill handles this
            await authService.removeSkill(skillId);
            toast.success("Skill removed");
            fetchUserSkills();
        } catch (error) {
            toast.error("Failed to remove skill");
        }
    }

    if (!user) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Form */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <User className="w-6 h-6" />
                            My Profile
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Existing form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.current_role}
                                            onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.experience_years}
                                        onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="input-field pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary disabled:opacity-70"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Skills */}
                <div className="lg:col-span-1">
                    <div className="card h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>My Skills</h2>
                            <button onClick={() => setShowSkillModal(true)} className="text-primary-600 hover:bg-primary-50 p-2 rounded-full">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {userSkills.map(skill => (
                                <div key={skill.skill_id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                                    <div>
                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{skill.skill_name}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{skill.proficiency_level}</p>
                                    </div>
                                    <button onClick={() => handleRemoveSkill(skill.skill_id)} className="text-red-400 hover:text-red-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {userSkills.length === 0 && (
                                <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No skills added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Skill Modal - Simplified */}
            {showSkillModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card max-w-md w-full">
                        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-primary)' }}>
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Add Skill</h3>
                            <button onClick={() => setShowSkillModal(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Search skills..."
                                className="input-field mb-4"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {searchResults.map(skill => (
                                    <button
                                        key={skill.skill_id}
                                        onClick={() => handleAddSkill(skill)}
                                        className="w-full text-left p-2 rounded border border-transparent transition-all"
                                        style={{ color: 'var(--text-primary)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-secondary)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                    >
                                        {skill.skill_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
