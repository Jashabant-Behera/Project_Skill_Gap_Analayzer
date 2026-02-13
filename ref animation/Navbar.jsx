import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, BarChart3, BookOpen, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = isAuthenticated ? [
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/assessment/start', icon: BookOpen, label: 'Assessments' },
    ] : [];

    return (
        <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-lg border-b border-dark-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-3 group"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:shadow-xl group-hover:shadow-primary-900/60 transition-all">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            <span className="text-gradient">Skill</span>
                            <span className="text-white">Gap</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                {/* Nav Links */}
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                            isActive(link.path)
                                                ? 'bg-primary-900/30 text-primary-300 border border-primary-800/50'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                                        }`}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                ))}

                                {/* User Menu */}
                                <div className="flex items-center gap-3 pl-3 border-l border-dark-700">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium text-gray-200">
                                            {user?.full_name || 'User'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {user?.current_role || 'Member'}
                                        </span>
                                    </div>
                                    
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
                                        {(user?.full_name || 'U')[0].toUpperCase()}
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="btn-secondary px-6 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="btn-primary px-6 py-2 flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Get Started</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-800 rounded-lg transition-all"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-dark-800 bg-dark-900 animate-slideIn">
                    <div className="px-4 py-6 space-y-3">
                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="card mb-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg">
                                        {(user?.full_name || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-200">
                                            {user?.full_name || 'User'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Nav Links */}
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                            isActive(link.path)
                                                ? 'bg-primary-900/30 text-primary-300 border border-primary-800/50'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                                        }`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                ))}

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-secondary w-full py-3 text-center"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Get Started</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
