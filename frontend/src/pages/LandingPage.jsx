import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="space-y-16 py-8 animate-fadeIn">
            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                    Master Your Career with <br />
                    <span className="text-primary-600">AI-Powered Skill Assessment</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Discover your skill gaps, get personalized learning roadmaps, and accelerate your career growth with our intelligent platform.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="btn-outline text-lg px-8 py-3">
                        Login
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {[
                    {
                        title: 'Smart Assessment',
                        description: 'Adaptive questions that evaluate your actual proficiency level.',
                    },
                    {
                        title: 'Gap Analysis',
                        description: 'Detailed insights into what you know and what you need to learn.',
                    },
                    {
                        title: 'Custom Roadmaps',
                        description: 'Week-by-week learning plans tailored to your goals.',
                    },
                ].map((feature, i) => (
                    <div key={i} className="card hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};
