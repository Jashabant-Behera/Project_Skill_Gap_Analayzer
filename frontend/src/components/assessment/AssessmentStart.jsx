import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Plus } from 'lucide-react';
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
    const [step, setStep] = useState(1); // 1: Select Role, 2: Add Skills, 3: Confirm

    // Load roles
    useEffect(() => {
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
        fetchRoles();
    }, []);

    // Load role details when selected
    useEffect(() => {
        if (selectedRole) {
            const fetchRoleDetails = async () => {
                try {
                    const details = await masterDataService.getRole(selectedRole);
                    setRoleDetails(details);
                } catch (error) {
                    toast.error('Failed to load role details');
                }
            };
            fetchRoleDetails();
        }
    }, [selectedRole]);

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
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-16 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                        Select Role
                    </span>
                    <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                        Add Skills
                    </span>
                    <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                        Confirm
                    </span>
                </div>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
                <div className="card animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Select Your Target Role
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Choose the role you're aiming for. We'll assess your skills against this role's requirements.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roles.map((role) => (
                            <button
                                key={role.role_id}
                                onClick={() => setSelectedRole(role.role_id)}
                                className={`card-hover text-left p-4 transition-all ${selectedRole === role.role_id
                                    ? 'border-2 border-primary-600 bg-primary-50'
                                    : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <Target className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{role.role_name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {role.category}
                                            </span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {role.experience_level}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!selectedRole}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Additional Skills */}
            {step === 2 && (
                <div className="card animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Add Skills You Want to Learn
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Want to learn additional skills beyond the role requirements? Add them here and they'll be included in your gap analysis and roadmap.
                    </p>

                    {roleDetails && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Selected Role</h3>
                            <div className="text-sm text-gray-700">
                                <p className="font-medium">{roleDetails.role_name}</p>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                                        Required Skills ({roleDetails.required_skills.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {roleDetails.required_skills.map(skill => (
                                            <span
                                                key={skill.skill_id}
                                                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 shadow-sm"
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

                    <div className="flex justify-between mt-6">
                        <button onClick={() => setStep(1)} className="btn-secondary">
                            Back
                        </button>
                        <button onClick={() => setStep(3)} className="btn-primary">
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
                <div className="card animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to Start Assessment
                    </h2>

                    {roleDetails && (
                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <h3 className="font-semibold text-gray-900 mb-2">Target Role</h3>
                                <p className="text-lg font-medium text-primary-900">
                                    {roleDetails.role_name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {roleDetails.required_skills.length} required skills will be assessed
                                </p>
                            </div>

                            {additionalSkills.length > 0 && (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Additional Learning Goals
                                    </h3>
                                    <ul className="space-y-2">
                                        {additionalSkills.map((skill) => (
                                            <li key={skill.skill_id} className="flex items-center gap-2 text-sm">
                                                <Plus className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">{skill.skill_name}</span>
                                                <span className="text-gray-600">
                                                    (Target: {skill.desired_proficiency})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">What to Expect</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span>
                                            You'll answer scenario-based questions for each skill
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span>Questions adapt to your experience level</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span>
                                            Get instant feedback on each answer
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span>
                                            Receive a personalized learning roadmap after completion
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button onClick={() => setStep(2)} className="btn-secondary">
                            Back
                        </button>
                        <button
                            onClick={handleStartAssessment}
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Starting...' : 'Start Assessment'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
