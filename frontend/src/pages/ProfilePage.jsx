import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { User, Mail, Briefcase, Plus, X, Search, Trash2, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
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
    const [saving, setSaving] = useState(false);

    // Skills State
    const [userSkills, setUserSkills] = useState([]);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const [skillSearchResults, setSkillSearchResults] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(false);

    // Role Search State
    const [roles, setRoles] = useState([]);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                current_role: user.current_role || '',
                experience_years: user.experience_years || 0,
            });
            fetchUserSkills();
        }
        fetchRoles();
    }, [user]);

    const fetchRoles = async () => {
        try {
            const data = await masterDataService.getRoles({ limit: 100 });
            setRoles(data.roles || []);
        } catch (error) {
            console.error('Failed to load roles');
        }
    };

    const fetchUserSkills = async () => {
        try {
            const skills = await authService.getUserSkills();
            setUserSkills(skills);
        } catch (error) {
            console.error('Failed to fetch user skills', error);
        }
    };

    // --- Role Logic ---

    const handleRoleSelect = async (role) => {
        const newRoleName = role.role_name;
        setFormData(prev => ({ ...prev, current_role: newRoleName }));
        setShowRoleDropdown(false);

        // Auto-populate skills if professional role
        if (newRoleName.toLowerCase() !== 'student') {
            await autoPopulateSkills(role);
        }
    };

    const handleStudentRole = () => {
        setFormData(prev => ({ ...prev, current_role: 'Student' }));
        setShowRoleDropdown(false);
        toast.success("Role set to Student. No specific skills required.");
    };

    const autoPopulateSkills = async (role) => {
        try {
            const toastId = toast.loading(`Fetching skills for ${role.role_name}...`);
            const roleDetails = await masterDataService.getRole(role.role_id);

            if (roleDetails.required_skills && roleDetails.required_skills.length > 0) {
                let addedCount = 0;
                const currentSkillIds = new Set(userSkills.map(s => s.skill_id));

                for (const reqSkill of roleDetails.required_skills) {
                    // Normalize skill object/ID
                    const skillId = typeof reqSkill === 'object' ? reqSkill.skill_id : reqSkill;
                    const skillName = typeof reqSkill === 'object' ? reqSkill.skill_name : 'Unknown Skill';

                    if (!currentSkillIds.has(skillId)) {
                        try {
                            await authService.addSkill({
                                skill_id: skillId,
                                skill_name: skillName,
                                proficiency_level: "intermediate",
                                years_of_experience: 1
                            });
                            addedCount++;
                        } catch (e) {
                            console.error(`Skipping duplicate or error for ${skillName}`);
                        }
                    }
                }

                if (addedCount > 0) {
                    toast.success(`Added ${addedCount} skills for ${role.role_name}`, { id: toastId });
                    fetchUserSkills();
                } else {
                    toast.success('Your skills are already up to date!', { id: toastId });
                }
            } else {
                toast.success('No default skills found for this role', { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to auto-populate skills');
        }
    };

    // --- Form Handling ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateUser(formData);
            toast.success('Profile updated successfully');
        } catch (error) {
            // Error managed by context/service usually
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // --- Skill Management ---

    const handleSkillSearch = async (query) => {
        setSkillSearchQuery(query);
        if (query.length < 2) {
            setSkillSearchResults([]);
            return;
        }
        setLoadingSkills(true);
        try {
            const data = await masterDataService.searchSkills(query);
            setSkillSearchResults(data.skills || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSkills(false);
        }
    };

    const handleAddSkill = async (skill) => {
        try {
            await authService.addSkill({
                skill_id: skill.skill_id,
                skill_name: skill.skill_name,
                proficiency_level: "intermediate",
                years_of_experience: 1
            });
            toast.success(`Added ${skill.skill_name}`);
            fetchUserSkills();
            // Don't close modal to allow valid flow
        } catch (error) {
            toast.error("Failed to add skill");
        }
    };

    const handleRemoveSkill = async (skillId) => {
        if (!window.confirm('Are you sure you want to remove this skill?')) return;
        try {
            await authService.removeSkill(skillId);
            toast.success("Skill removed");
            fetchUserSkills();
        } catch (error) {
            toast.error("Failed to remove skill");
        }
    };

    if (!user) return <LoadingSpinner />;

    // Filter roles for dropdown
    const filteredRoles = roles.filter(r =>
        r.role_name.toLowerCase().includes(formData.current_role.toLowerCase()) &&
        r.role_name.toLowerCase() !== formData.current_role.toLowerCase() // Hide if already selected exact match
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 rounded-2xl border border-brand-orange/20">
                    <User className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">My Profile</h1>
                    <p className="text-gray-400">Manage your persona and expertise</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Basic Info (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-white">
                            <Briefcase className="w-5 h-5 text-brand-blue" />
                            <h2 className="text-xl font-bold">Basic Info</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="input-field pl-10"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Current Role</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.current_role}
                                        onChange={(e) => {
                                            setFormData({ ...formData, current_role: e.target.value });
                                            setShowRoleDropdown(true);
                                        }}
                                        onFocus={() => setShowRoleDropdown(true)}
                                        className="input-field pl-10"
                                        placeholder="Search role or type 'Student'"
                                    />
                                </div>

                                {/* Dropdown */}
                                {showRoleDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                                        <div className="p-1.5 space-y-0.5">
                                            {/* Student Special Option */}
                                            <button
                                                type="button"
                                                onClick={handleStudentRole}
                                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm flex items-center gap-3 group transition-all"
                                            >
                                                <div className="p-1.5 bg-brand-cyan/10 rounded-md text-brand-cyan group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="block text-gray-200 font-medium group-hover:text-white">Student</span>
                                                    <span className="text-xs text-gray-500">I'm currently learning</span>
                                                </div>
                                            </button>

                                            <div className="h-px bg-white/5 my-1" />

                                            {/* Roles List */}
                                            {filteredRoles.map(role => (
                                                <button
                                                    key={role.role_id}
                                                    type="button"
                                                    onClick={() => handleRoleSelect(role)}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm flex items-center gap-3 group transition-all"
                                                >
                                                    <div className="p-1.5 bg-brand-blue/10 rounded-md text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                                        <Briefcase className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-gray-300 group-hover:text-white">{role.role_name}</span>
                                                </button>
                                            ))}

                                            {filteredRoles.length === 0 && formData.current_role && (
                                                <div className="px-3 py-3 text-xs text-center text-gray-500">
                                                    No matching roles found.<br />
                                                    Custom role will be saved.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {/* Overlay */}
                                {showRoleDropdown && (
                                    <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Experience (Years)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience_years}
                                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                                    className="input-field"
                                />
                            </div>

                            {/* Email (Read only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="input-field pl-10 opacity-50 cursor-not-allowed bg-black/20"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full btn-primary mt-4 flex justify-center items-center gap-2"
                            >
                                {saving ? <div className="spinner w-4 h-4" /> : 'Save Profile'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Skills (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card p-6 min-h-[600px] flex flex-col">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <Sparkles className="w-5 h-5 text-brand-cyan" />
                                    My Skills
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Managed skills: <span className="text-brand-cyan font-mono">{userSkills.length}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowSkillModal(true);
                                    setSkillSearchQuery('');
                                    setSkillSearchResults([]);
                                }}
                                className="btn-secondary flex items-center gap-2 hover:bg-brand-cyan/10 hover:border-brand-cyan/50 hover:text-brand-cyan transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Skill
                            </button>
                        </div>

                        {/* Skills Grid */}
                        {userSkills.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
                                {userSkills.map(skill => (
                                    <div
                                        key={skill.skill_id}
                                        className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:border-brand-cyan/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 relative"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-brand-cyan/20 to-brand-cyan/5 border border-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform shadow-lg shadow-brand-cyan/5">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-sm text-gray-200 group-hover:text-brand-cyan transition-colors truncate" title={skill.skill_name}>
                                                        {skill.skill_name}
                                                    </h3>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium bg-white/5 px-1.5 py-0.5 rounded inline-block mt-1">
                                                        {skill.proficiency_level || 'Intermediate'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSkill(skill.skill_id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-2 flex-shrink-0"
                                                title="Remove skill"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/5/50">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <Briefcase className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-300 mb-2">No skills added yet</h3>
                                <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                                    Start building your profile by adding skills manually, or select a <span className="text-brand-blue">Professional Role</span> to automatically populate relevant skills.
                                </p>
                                <button onClick={() => setShowSkillModal(true)} className="btn-secondary">
                                    Add Your First Skill
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Skill Modal */}
            {showSkillModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="glass-card max-w-2xl w-full flex flex-col max-h-[85vh] animate-scale-in border-t-brand-cyan/20 shadow-2xl shadow-brand-cyan/10">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-brand-cyan" />
                                    Add Skills
                                </h3>
                                <p className="text-sm text-gray-400">Search our database to add to your profile</p>
                            </div>
                            <button
                                onClick={() => setShowSkillModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-cyan transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search for skills (e.g. Python, React, Machine Learning)..."
                                    className="input-field pl-12 py-4 text-lg"
                                    value={skillSearchQuery}
                                    onChange={(e) => handleSkillSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {/* Results */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[300px] pr-2">
                                {loadingSkills ? (
                                    <div className="flex items-center justify-center h-40 gap-2 text-gray-500">
                                        <div className="spinner w-5 h-5" />
                                        <span>Searching...</span>
                                    </div>
                                ) : skillSearchResults.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {skillSearchResults.map(skill => {
                                            const isAlreadyAdded = userSkills.some(s => s.skill_id === skill.skill_id);
                                            return (
                                                <button
                                                    key={skill.skill_id}
                                                    onClick={() => !isAlreadyAdded && handleAddSkill(skill)}
                                                    disabled={isAlreadyAdded}
                                                    className={`text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${isAlreadyAdded
                                                        ? 'bg-brand-cyan/5 border-brand-cyan/20 opacity-60 cursor-not-allowed'
                                                        : 'bg-white/5 border-white/10 hover:border-brand-cyan/50 hover:bg-brand-cyan/5'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start relative z-10">
                                                        <div>
                                                            <h4 className={`font-semibold ${isAlreadyAdded ? 'text-brand-cyan' : 'text-gray-200 group-hover:text-white'}`}>
                                                                {skill.skill_name}
                                                            </h4>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                                {skill.category}
                                                            </span>
                                                        </div>
                                                        {isAlreadyAdded ? (
                                                            <div className="p-1 rounded bg-brand-cyan/20">
                                                                <CheckCircle className="w-5 h-5 text-brand-cyan" />
                                                            </div>
                                                        ) : (
                                                            <div className="p-1 rounded bg-white/5 group-hover:bg-brand-cyan/20 transition-colors">
                                                                <Plus className="w-5 h-5 text-gray-500 group-hover:text-brand-cyan" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 py-12">
                                        {skillSearchQuery.length > 1 ? (
                                            <>
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                                    <AlertCircle className="w-8 h-8 opacity-50" />
                                                </div>
                                                <p>No skills found matching "{skillSearchQuery}"</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                                    <Search className="w-8 h-8 opacity-50" />
                                                </div>
                                                <p>Type at least 2 characters to search</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                            <button onClick={() => setShowSkillModal(false)} className="btn-primary px-8">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
