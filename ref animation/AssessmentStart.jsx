import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Plus, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import { masterDataService } from '../../services/masterDataService';
import { useAssessment } from '../../hooks/useAssessment';
import { AdditionalSkillsManager } from '../profile/AdditionalSkillsManager';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AssessmentStart = () => {
    const navigate = useNavigate();
    const { startAssessment, loading } = useAssessment();

    const [roles, setRoles] = useState([]);
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
        <div className="max-w-5xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                                        step >= s
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
                                <div className={`w-16 h-1 rounded-full transition-all ${
                                    step > s ? 'bg-gradient-to-r from-primary-600 to-purple-600' : 'bg-dark-800'
                                }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
                <div className="card animate-fadeIn space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Choose Your Target Role
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Select the role you're aiming for. We'll assess your skills against this role's requirements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles.map((role) => (
                            <button
                                key={role.role_id}
                                onClick={() => setSelectedRole(role.role_id)}
                                className={`card-hover text-left p-5 space-y-3 transition-all group ${
                                    selectedRole === role.role_id
                                        ? 'border-primary-600 bg-primary-900/10 shadow-lg shadow-primary-900/30'
                                        : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${
                                        selectedRole === role.role_id 
                                            ? 'bg-primary-600 text-white' 
                                            : 'bg-dark-800 text-gray-400 group-hover:bg-dark-700'
                                    }`}>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">
                                            {role.role_name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                            {role.description}
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <span className="px-2 py-1 bg-dark-800 text-gray-400 rounded text-xs">
                                                {role.category}
                                            </span>
                                            <span className="px-2 py-1 bg-dark-800 text-gray-400 rounded text-xs">
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
                <div className="card animate-fadeIn space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Add Custom Learning Goals
                        </h2>
                        <p className="text-gray-400">
                            Want to learn additional skills beyond the role requirements? Add them here for a personalized roadmap.
                        </p>
                    </div>

                    {roleDetails && (
                        <div className="card bg-dark-800 border-dark-700">
                            <h3 className="font-semibold text-white mb-3">Selected Role</h3>
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
                                                className="px-3 py-1.5 bg-dark-900 border border-dark-700 rounded-lg text-sm font-medium text-gray-300"
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

                    <div className="flex justify-between pt-4 border-t border-dark-800">
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
                <div className="card animate-fadeIn space-y-6">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg shadow-green-900/50 mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">
                            Ready to Start Assessment
                        </h2>
                        <p className="text-gray-400">
                            Review your selections and begin your skill evaluation
                        </p>
                    </div>

                    {roleDetails && (
                        <div className="space-y-4">
                            <div className="card bg-gradient-to-br from-primary-900/20 to-purple-900/10 border-primary-800/50">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary-400" />
                                    Target Role
                                </h3>
                                <p className="text-2xl font-bold text-gradient">
                                    {roleDetails.role_name}
                                </p>
                                <p className="text-gray-400 mt-2">
                                    {roleDetails.required_skills.length} required skills will be assessed
                                </p>
                            </div>

                            {additionalSkills.length > 0 && (
                                <div className="card bg-gradient-to-br from-green-900/20 to-emerald-900/10 border-green-800/50">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-400" />
                                        Additional Learning Goals
                                    </h3>
                                    <div className="space-y-2">
                                        {additionalSkills.map((skill) => (
                                            <div key={skill.skill_id} className="flex items-center gap-3 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                <span className="font-medium text-gray-200">{skill.skill_name}</span>
                                                <span className="text-gray-500">→</span>
                                                <span className="text-green-400">{skill.desired_proficiency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="card bg-dark-800 border-dark-700">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary-400" />
                                    What to Expect
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        'Scenario-based questions for each skill',
                                        'Questions adapt to your experience level',
                                        'Detailed analysis of your strengths and gaps',
                                        'Personalized roadmap after completion'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-primary-900/30 border border-primary-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-primary-400 text-xs font-bold">{index + 1}</span>
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
                            className="btn-primary text-lg px-8 py-3 disabled:opacity-50 flex items-center gap-2"
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
