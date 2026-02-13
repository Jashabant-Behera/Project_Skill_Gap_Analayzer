import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Brain, TrendingUp, Zap, CheckCircle2, Star } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(var(--border-primary) 1px, transparent 1px),
                                        linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>
                
                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center space-y-8 animate-fadeIn">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-primary)] bg-[var(--bg-secondary)] backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                                AI-Powered Career Acceleration
                            </span>
                        </div>
                        
                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                            Master Your Career
                            <br />
                            <span className="gradient-text">
                                Bridge Skill Gaps Faster
                            </span>
                        </h1>
                        
                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                            Get AI-powered skill assessments, personalized learning roadmaps, 
                            and actionable insights to accelerate your career growth.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link 
                                to="/register" 
                                className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
                            >
                                <span>Start Free Assessment</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                to="/login" 
                                className="btn-outline text-lg px-8 py-4"
                            >
                                Sign In
                            </Link>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text">95%</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Accuracy</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text">30+</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Tech Roles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text">100+</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Skills Tracked</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Three simple steps to unlock your career potential
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'AI Assessment',
                                description: 'Take adaptive skill tests that evaluate your true proficiency across technical and soft skills.',
                                color: 'var(--accent-primary)',
                                gradient: 'from-cyan-500 to-blue-500'
                            },
                            {
                                icon: Target,
                                title: 'Gap Analysis',
                                description: 'Discover exactly what skills you need to reach your target role with detailed insights.',
                                color: 'var(--accent-secondary)',
                                gradient: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Custom Roadmap',
                                description: 'Get a week-by-week learning plan with curated resources tailored to your goals.',
                                color: 'var(--success)',
                                gradient: 'from-green-500 to-emerald-500'
                            }
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="card-hover group animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                                         style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}88)` }}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-[var(--text-secondary)] leading-relaxed flex-grow">
                                        {feature.description}
                                    </p>
                                    
                                    <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
                                        <div className="flex items-center text-sm font-medium" style={{ color: feature.color }}>
                                            <span>Learn more</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
                                <Zap className="w-4 h-4 text-[var(--warning)]" />
                                <span className="text-sm font-medium text-[var(--text-secondary)]">
                                    Why Choose SkillGap?
                                </span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-bold">
                                Accelerate Your
                                <br />
                                <span className="gradient-text">Learning Journey</span>
                            </h2>
                            
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                                Stop guessing what to learn next. Get data-driven insights 
                                and personalized guidance to achieve your career goals faster.
                            </p>
                            
                            <div className="space-y-4 pt-4">
                                {[
                                    'Identify exact skill gaps for your target role',
                                    'Get AI-generated learning paths optimized for you',
                                    'Track progress with detailed analytics',
                                    'Save months of trial and error'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <Link 
                                to="/register" 
                                className="btn-primary inline-flex items-center gap-2 mt-6"
                            >
                                <span>Get Started Now</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        
                        <div className="relative">
                            <div className="card p-8 hover:shadow-glow-strong transition-all">
                                <div className="space-y-6">
                                    {/* Mock Skill Radar */}
                                    <div className="text-center pb-6 border-b border-[var(--border-primary)]">
                                        <h4 className="font-semibold text-lg mb-2">Your Skill Assessment</h4>
                                        <p className="text-sm text-[var(--text-muted)]">Real-time analysis</p>
                                    </div>
                                    
                                    {/* Mock Skills */}
                                    <div className="space-y-4">
                                        {[
                                            { name: 'React', current: 75, required: 90 },
                                            { name: 'Node.js', current: 60, required: 85 },
                                            { name: 'Python', current: 40, required: 75 },
                                        ].map((skill, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">{skill.name}</span>
                                                    <span className="text-[var(--text-muted)]">
                                                        {skill.current}% / {skill.required}%
                                                    </span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-bar-fill"
                                                        style={{ width: `${skill.current}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="pt-4 border-t border-[var(--border-primary)]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[var(--text-muted)]">Overall Readiness</span>
                                            <span className="text-2xl font-bold gradient-text">68%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-20 blur-3xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full opacity-20 blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="card relative overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10" />
                        
                        <div className="relative text-center space-y-6 py-8">
                            <Star className="w-12 h-12 mx-auto text-[var(--accent-primary)]" />
                            
                            <h2 className="text-4xl md:text-5xl font-bold">
                                Ready to Transform
                                <br />
                                <span className="gradient-text">Your Career?</span>
                            </h2>
                            
                            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                                Join thousands of developers who've accelerated their learning 
                                with personalized skill assessments.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                <Link 
                                    to="/register" 
                                    className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
                                >
                                    <span>Start Your Assessment</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                            
                            <p className="text-sm text-[var(--text-muted)] pt-4">
                                No credit card required • Free forever
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
