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
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Elements from Brand Design */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3"></div>

            {/* Floating Shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm animate-float blur-xl -z-10"></div>
            <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full border border-brand-cyan/10 bg-brand-cyan/5 backdrop-blur-sm animate-float blur-xl -z-10" style={{ animationDelay: '2s' }}></div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-12 px-4">
                <div className="relative max-w-5xl mx-auto">
                    <div className="text-center space-y-8 animate-fade-in relative z-10">
                        {/* Internal Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 backdrop-blur-md animate-pulse-glow hover:bg-brand-cyan/10 transition-colors cursor-default">
                            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                            <span className="text-xs font-semibold text-brand-cyan tracking-wider uppercase">
                                Intelligent Career Synchronization
                            </span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-tight">
                            Sync Your Skills<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-cyan to-brand-blue animate-gradient-x">
                                To Your Goals
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white/80 font-light">
                            <strong className="text-white font-medium">SkillSync</strong> bridges the gap between where you are and where you want to be.
                            Leverage AI-driven insights to analyze, plan, and master your career path with precision.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                            {isAuthenticated ? (
                                <Link
                                    to="/assessment/start"
                                    className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-3 group shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all duration-300"
                                >
                                    <span>Sync Your Profile</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-3 group shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all duration-300"
                                    >
                                        <span>Start Free Synchronization</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="btn-secondary text-lg px-10 py-4 flex items-center justify-center backdrop-blur-md hover:bg-white/10"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-24 animate-bounce opacity-60 hidden md:block">
                            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                                <div className="w-1.5 h-2 bg-brand-cyan rounded-full animate-scroll-down"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section (Black Break) */}
            <section className="py-12 bg-black/40 border-y border-white/5 backdrop-blur-md relative z-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center space-y-2 animate-scale-in group cursor-default"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 group-hover:from-brand-cyan group-hover:to-brand-blue transition-all duration-500">
                                    {stat.number}
                                </div>
                                <div className="text-xs md:text-sm text-brand-cyan/80 uppercase tracking-widest font-semibold">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                            Why <span className="text-brand-orange">SkillSync</span>?
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                            Data-driven intelligence to power your professional evolution.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-6 group hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-brand-cyan group-hover:text-brand-orange transition-colors duration-300" />
                                    </div>

                                    <h3 className="text-xl font-medium text-white mb-4">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-white/60 leading-relaxed flex-grow">
                                        {feature.description}
                                    </p>

                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center text-brand-cyan group-hover:text-brand-orange transition-colors">
                                        <span className="text-xs font-medium uppercase tracking-wide">Learn more</span>
                                        <ArrowRight className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 relative">
                <div className="max-w-3xl mx-auto">
                    <div className="glass-card text-center p-10 relative overflow-hidden">
                        {/* Background Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-blue/10 opacity-30"></div>

                        <div className="relative z-10 space-y-6">
                            <Sparkles className="w-10 h-10 mx-auto text-brand-orange opacity-80" />

                            <h2 className="text-3xl md:text-4xl font-display font-medium text-white">
                                Ready to Transform Your Career?
                            </h2>

                            <p className="text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
                                Join thousands of professionals who've accelerated their growth with SkillGap
                            </p>

                            <div className="pt-6">
                                {isAuthenticated ? (
                                    <Link
                                        to="/assessment/start"
                                        className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <Link
                                        to="/register"
                                        className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2"
                                    >
                                        <span>Get Started Free</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
