import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    ArrowRight, CheckCircle, Zap, Target, TrendingUp,
    Award, BookOpen, Users, Sparkles
} from 'lucide-react';

export const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: Zap,
            title: 'AI-Powered Assessment',
            description: 'Advanced algorithms analyze your responses to provide accurate skill evaluation',
            color: 'from-yellow-500 to-orange-500',
            gradient: 'from-yellow-900/20 to-orange-900/20'
        },
        {
            icon: Target,
            title: 'Gap Analysis',
            description: 'Identify exactly what you need to learn to reach your career goals',
            color: 'from-blue-500 to-cyan-500',
            gradient: 'from-blue-900/20 to-cyan-900/20'
        },
        {
            icon: TrendingUp,
            title: 'Personalized Roadmaps',
            description: 'Week-by-week learning plans tailored to your pace and objectives',
            color: 'from-green-500 to-emerald-500',
            gradient: 'from-green-900/20 to-emerald-900/20'
        },
        {
            icon: Award,
            title: 'Track Progress',
            description: 'Monitor your improvement with detailed analytics and insights',
            color: 'from-purple-500 to-pink-500',
            gradient: 'from-purple-900/20 to-pink-900/20'
        },
        {
            icon: BookOpen,
            title: 'Curated Resources',
            description: 'Access handpicked tutorials, courses, and practice materials',
            color: 'from-indigo-500 to-blue-500',
            gradient: 'from-indigo-900/20 to-blue-900/20'
        },
        {
            icon: Users,
            title: 'Industry Standards',
            description: 'Aligned with real-world job requirements from top companies',
            color: 'from-red-500 to-pink-500',
            gradient: 'from-red-900/20 to-pink-900/20'
        }
    ];

    const stats = [
        { number: '50+', label: 'Tech Roles' },
        { number: '100+', label: 'Skills Tracked' },
        { number: '1000+', label: 'Questions' },
        { number: '24/7', label: 'AI Support' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-grid" />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center space-y-8 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm animate-pulse-glow"
                            style={{
                                borderColor: 'var(--accent-primary)',
                                background: 'var(--bg-secondary)'
                            }}>
                            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                AI-Powered Career Development Platform
                            </span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                            <span className="gradient-text">Master Your Skills,</span>
                            <br />
                            <span className="text-white text-shadow">Accelerate Your Career</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}>
                            Discover skill gaps with AI precision, get personalized learning roadmaps,
                            and transform your career trajectory in weeks, not years.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            {isAuthenticated ? (
                                <Link
                                    to="/assessment/start"
                                    className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-3 group"
                                >
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-3 group"
                                    >
                                        <span>Start Free Assessment</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="btn-outline text-lg px-10 py-4"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats - Enhanced with staggered animations */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="card-hover text-center space-y-2 animate-scale-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-3xl md:text-4xl font-bold gradient-text">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm md:text-base" style={{ color: 'var(--text-muted)' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Why Choose <span className="gradient-text">SkillGap</span>?
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                            Everything you need to identify, learn, and master the skills that matter
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            // Map colors to CSS variables for consistency
                            const colorMap = {
                                'from-yellow-500 to-orange-500': 'var(--warning)',
                                'from-blue-500 to-cyan-500': 'var(--accent-primary)',
                                'from-green-500 to-emerald-500': 'var(--success)',
                                'from-purple-500 to-pink-500': 'var(--accent-secondary)',
                                'from-indigo-500 to-blue-500': '#6366f1',
                                'from-red-500 to-pink-500': '#f87171'
                            };

                            return (
                                <div
                                    key={index}
                                    className="card-hover group animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex flex-col h-full">
                                        {/* Icon with gradient background */}
                                        <div className={`w-14 h-14 rounded-xl p-3 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br ${feature.color}`}>
                                            <feature.icon className="w-full h-full text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                            {feature.title}
                                        </h3>

                                        <p className="leading-relaxed flex-grow" style={{ color: 'var(--text-secondary)' }}>
                                            {feature.description}
                                        </p>

                                        {/* Learn more link */}
                                        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                                            <div className="flex items-center text-sm font-medium text-primary-400">
                                                <span>Learn more</span>
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                            Three simple steps to unlock your career potential
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-50" />

                        {[
                            {
                                step: '01',
                                title: 'Take Assessment',
                                description: 'Answer AI-generated questions tailored to your target role',
                                icon: '🎯'
                            },
                            {
                                step: '02',
                                title: 'Get Analysis',
                                description: 'Receive detailed skill gap analysis and readiness score',
                                icon: '📊'
                            },
                            {
                                step: '03',
                                title: 'Follow Roadmap',
                                description: 'Learn with personalized week-by-week action plan',
                                icon: '🗺️'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="card hover:shadow-glow transition-all h-full text-center space-y-4">
                                    {/* Step number */}
                                    <div className="text-6xl font-bold gradient-text opacity-20">
                                        {item.step}
                                    </div>

                                    {/* Icon */}
                                    <div className="text-5xl">
                                        {item.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="card relative overflow-hidden text-center space-y-6 p-12">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-primary-600" />
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <Sparkles className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--accent-primary)' }} />

                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to <span className="gradient-text">Transform Your Career?</span>
                            </h2>

                            <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                                Join thousands of professionals who've accelerated their growth with SkillGap
                            </p>

                            {isAuthenticated ? (
                                <Link
                                    to="/assessment/start"
                                    className="inline-flex btn-primary text-lg px-12 py-4 items-center gap-3 group"
                                >
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="inline-flex btn-primary text-lg px-12 py-4 items-center gap-3 group"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}

                            <p className="text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                                No credit card required • Start in 2 minutes
                            </p>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-600 to-primary-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
                    </div>
                </div>
            </section>
        </div>
    );
};
