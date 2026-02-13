import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Zap, Target, TrendingUp, 
  Award, BookOpen, Users, Sparkles 
} from 'lucide-react';

export const LandingPage = () => {
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
        <div className="space-y-20 py-12 animate-fadeIn">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/10 to-transparent pointer-events-none" />
                
                <div className="relative text-center space-y-8 max-w-5xl mx-auto px-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900/30 border border-primary-800/50 rounded-full text-primary-300 text-sm font-medium animate-pulse-slow">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Career Development Platform</span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        <span className="text-gradient">Master Your Skills,</span>
                        <br />
                        <span className="text-white text-shadow-lg">Accelerate Your Career</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Discover skill gaps with AI precision, get personalized learning roadmaps, 
                        and transform your career trajectory in weeks, not years.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <Link 
                            to="/register" 
                            className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-3 group"
                        >
                            <span>Start Free Assessment</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to="/login" 
                            className="btn-secondary text-lg px-10 py-4 flex items-center justify-center gap-3"
                        >
                            <span>Sign In</span>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className="card text-center space-y-2 hover:border-primary-800/50 transition-all"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-gradient">
                                    {stat.number}
                                </div>
                                <div className="text-gray-400 text-sm md:text-base">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Why Choose <span className="text-gradient">SkillGap</span>?
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Everything you need to identify, learn, and master the skills that matter
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="group relative overflow-hidden card-hover"
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            <div className="relative space-y-4">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-full h-full text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Simple 3-Step Process
                    </h2>
                    <p className="text-xl text-gray-400">
                        From assessment to mastery in three easy steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connection lines */}
                    <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-800 via-purple-800 to-primary-800" />

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
                        <div key={index} className="relative">
                            <div className="card text-center space-y-4 h-full">
                                {/* Step number */}
                                <div className="text-6xl font-bold text-gradient opacity-20">
                                    {item.step}
                                </div>
                                
                                {/* Icon */}
                                <div className="text-5xl">
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-white">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4">
                <div className="card bg-gradient-to-br from-primary-900/30 via-purple-900/20 to-primary-900/30 border-primary-800/50 text-center space-y-6 p-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Ready to Transform Your Career?
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Join thousands of professionals who've accelerated their growth with SkillGap
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-flex btn-primary text-lg px-12 py-4 items-center gap-3 group"
                    >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-sm text-gray-400">
                        No credit card required • Start in 2 minutes
                    </p>
                </div>
            </section>
        </div>
    );
};
