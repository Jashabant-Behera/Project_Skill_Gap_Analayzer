import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, BarChart3, BookOpen } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                SkillGap
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="hidden sm:inline">{user?.full_name || 'Profile'}</span>
                                </Link>

                                <Link
                                    to="/assessment/start"
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span className="hidden sm:inline">Assessments</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-outline">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
