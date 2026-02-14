import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Plus, CheckCircle, Sparkles, ChevronRight, Search } from 'lucide-react';
import { masterDataService } from '../../services/masterDataService';
import { useAssessment } from '../../hooks/useAssessment';
import { AdditionalSkillsManager } from '../profile/AdditionalSkillsManager';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AssessmentStart = () => {
    const navigate = useNavigate();
    const { startAssessment, loading } = useAssessment();

    const [roles, setRoles] = useState([]);
    const [roleSearchQuery, setRoleSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleDetails, setRoleDetails] = useState(null);
    const [additionalSkills, setAdditionalSkills] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [step, setStep] = useState(1);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            fetchRoleDetails();
        }
    }, [selectedRole]);

    const fetchRoles = async () => {
        try {
            const data = await masterDataService.getRoles({ limit: 50 });
            setRoles(data.roles || []);
        } catch (error) {
            toast.error('Failed to load roles');
        } finally {
            setLoadingRoles(false);
        }
    };

    const fetchRoleDetails = async () => {
        try {
            const details = await masterDataService.getRole(selectedRole);
            setRoleDetails(details);
        } catch (error) {
            toast.error('Failed to load role details');
        }
    };

    const handleStartAssessment = async () => {
        if (!selectedRole) {
            toast.error('Please select a target role');
            return;
        }

        try {
            const assessmentData = {
                target_role_id: selectedRole,
                additional_skills_to_learn: additionalSkills,
            };

            const assessment = await startAssessment(assessmentData);
            navigate(`/assessment/${assessment.assessment_id}`);
        } catch (error) {
            console.error('Failed to start assessment:', error);
        }
    };

    if (loadingRoles) {
        return <LoadingSpinner text="Loading roles..." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all ${step >= s
                                        ? 'bg-gradient-to-br from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-900/50'
                                        : 'bg-dark-800 text-gray-500 border border-dark-700'
                                        }`}
                                >
                                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                                </div>
                                <span className={`text-sm font-medium ${step >= s ? 'text-primary-400' : 'text-gray-500'}`}>
                                    {s === 1 ? 'Select Role' : s === 2 ? 'Add Skills' : 'Confirm'}
                                </span>
                            </div>
                            {s < 3 && (
                                <div className={`w-16 h-1 rounded-full transition-all ${step > s ? 'bg-gradient-to-r from-primary-600 to-purple-600' : 'bg-dark-800'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
                <div className="glass-card animate-fadeIn space-y-6 p-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold text-white">
                            Choose Your Target Role
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">
                            Select the role you're aiming for. We'll assess your skills against this role's requirements.
                        </p>
                    </div>

                    {/* Role Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search for a role..."
                            value={roleSearchQuery}
                            onChange={(e) => setRoleSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/50 transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {roles.filter(role =>
                            role.role_name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
                            role.description.toLowerCase().includes(roleSearchQuery.toLowerCase())
                        ).map((role) => (
                            <button
                                key={role.role_id}
                                onClick={() => setSelectedRole(role.role_id)}
                                className={`text-left p-4 space-y-2 transition-all rounded-xl border group hover:bg-white/5 ${selectedRole === role.role_id
                                    ? 'border-brand-orange bg-brand-orange/10 shadow-[0_4px_20px_rgba(255,103,2,0.15)]'
                                    : 'border-white/10 hover:border-brand-orange/30 bg-transparent'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg transition-colors ${selectedRole === role.role_id
                                        ? 'bg-brand-orange text-white'
                                        : 'bg-white/5 text-gray-400 group-hover:bg-white/10'
                                        }`}>
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-white group-hover:text-brand-orange transition-colors">
                                            {role.role_name}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {role.description}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-gray-400 rounded text-[10px] uppercase tracking-wide">
                                                {role.category}
                                            </span>
                                            <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-gray-400 rounded text-[10px] uppercase tracking-wide">
                                                {role.experience_level}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!selectedRole}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>Continue</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Additional Skills */}
            {step === 2 && (
                <div className="glass-card animate-fadeIn space-y-6 p-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">
                            Add Custom Learning Goals
                        </h2>
                        <p className="text-sm text-gray-400">
                            Want to learn additional skills beyond the role requirements? Add them here for a personalized roadmap.
                        </p>
                    </div>

                    {roleDetails && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="font-semibold text-white mb-2 text-sm">Selected Role</h3>
                            <div className="space-y-3">
                                <p className="font-medium text-gray-200">{roleDetails.role_name}</p>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                                        Required Skills ({roleDetails.required_skills.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {roleDetails.required_skills.map(skill => (
                                            <span
                                                key={skill.skill_id}
                                                className="px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm font-medium text-gray-300"
                                            >
                                                {skill.skill_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <AdditionalSkillsManager
                        additionalSkills={additionalSkills}
                        onSkillsChange={setAdditionalSkills}
                    />

                    <div className="flex justify-between pt-4 border-t border-white/10">
                        <button onClick={() => setStep(1)} className="btn-secondary">
                            Back
                        </button>
                        <button onClick={() => setStep(3)} className="btn-primary flex items-center gap-2">
                            <span>Continue</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
                <div className="glass-card animate-fadeIn space-y-6 p-6">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-cyan to-teal-500 rounded-xl shadow-lg shadow-teal-900/50 mb-2">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Ready to Start Assessment
                        </h2>
                        <p className="text-sm text-gray-400">
                            Review your selections and begin your skill evaluation
                        </p>
                    </div>

                    {roleDetails && (
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-brand-orange/10 to-transparent border border-brand-orange/20">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
                                    <Target className="w-4 h-4 text-brand-orange" />
                                    Target Role
                                </h3>
                                <p className="text-xl font-bold text-gradient-orange">
                                    {roleDetails.role_name}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {roleDetails.required_skills.length} required skills will be assessed
                                </p>
                            </div>

                            {additionalSkills.length > 0 && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-brand-cyan/10 to-transparent border border-brand-cyan/20">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
                                        <Plus className="w-4 h-4 text-brand-cyan" />
                                        Additional Learning Goals
                                    </h3>
                                    <div className="space-y-2">
                                        {additionalSkills.map((skill) => (
                                            <div key={skill.skill_id} className="flex items-center gap-3 text-xs">
                                                <CheckCircle className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0" />
                                                <span className="font-medium text-gray-200">{skill.skill_name}</span>
                                                <span className="text-gray-500">→</span>
                                                <span className="text-brand-cyan">{skill.desired_proficiency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                                    <BookOpen className="w-4 h-4 text-brand-blue" />
                                    What to Expect
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        'Scenario-based questions for each skill',
                                        'Questions adapt to your experience level',
                                        'Detailed analysis of your strengths and gaps',
                                        'Personalized roadmap after completion'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                                            <div className="w-4 h-4 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-brand-blue text-[10px] font-bold">{index + 1}</span>
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-4 border-t border-dark-800">
                        <button onClick={() => setStep(2)} className="btn-secondary">
                            Back
                        </button>
                        <button
                            onClick={handleStartAssessment}
                            disabled={loading}
                            className="btn-primary text-base px-6 py-2 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner w-5 h-5" />
                                    <span>Starting...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Start Assessment</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
