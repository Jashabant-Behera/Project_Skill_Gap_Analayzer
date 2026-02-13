import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/');
        } catch (error) {
            // Error handled in context
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 animate-fadeIn">
            <div className="card">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-10"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full">
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
