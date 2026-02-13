import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Briefcase, Sparkles, CheckCircle } from 'lucide-react';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        experience: 0
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ 
                full_name: formData.name, 
                email: formData.email, 
                password: formData.password, 
                current_role: formData.role,
                experience_years: formData.experience
            });
            navigate('/');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const features = [
        'AI-powered skill assessment',
        'Personalized learning roadmaps',
        'Progress tracking & analytics',
        'Curated learning resources'
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                {/* Left Side - Features */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900/30 border border-primary-800/50 rounded-full text-primary-300 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Start Your Journey Today</span>
                        </div>
                        
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            Transform Your
                            <span className="text-gradient block mt-2">Career Path</span>
                        </h1>
                        
                        <p className="text-xl text-gray-400">
                            Join thousands of professionals leveling up their skills with AI-powered guidance
                        </p>
                    </div>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-3 text-gray-300"
                            >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 pt-8">
                        {[
                            { value: '50+', label: 'Roles' },
                            { value: '100+', label: 'Skills' },
                            { value: '24/7', label: 'Support' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-gradient">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex flex-col justify-center">
                    <div className="card space-y-6">
                        {/* Header */}
                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-white">
                                Create Account
                            </h2>
                            <p className="text-gray-400">
                                Get started with your free account
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="input-field pl-12"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="input-field pl-12"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Current Role */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Current Role <span className="text-gray-500">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => handleChange('role', e.target.value)}
                                        className="input-field pl-12"
                                        placeholder="e.g., Software Engineer"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className="input-field pl-12"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Must be at least 8 characters with 1 uppercase and 1 digit
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary w-full text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner w-5 h-5" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <div className="text-center pt-4 border-t border-dark-700">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Note - Mobile */}
                    <p className="text-center text-xs text-gray-500 mt-6">
                        By signing up, you agree to our{' '}
                        <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                            Terms
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
