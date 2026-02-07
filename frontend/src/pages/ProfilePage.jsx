import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { User, Mail, Briefcase } from 'lucide-react';

export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        current_role: '',
        experience_years: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                current_role: user.current_role || '',
                experience_years: user.experience_years || 0,
            });
        }
    }, [user]);

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

    if (!user) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto animate-fadeIn">
            <div className="card">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    My Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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

                    <div className="flex justify-end pt-4 border-t border-gray-100">
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
    );
};
