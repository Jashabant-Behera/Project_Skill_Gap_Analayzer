import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, BarChart3, BookOpen, Menu, X, Zap } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    const navLinks = isAuthenticated ? [
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/assessment/start', label: 'Assessments', icon: BookOpen },
    ] : [];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)] shadow-lg' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-10 h-10 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-[var(--bg-primary)]" />
                                </div>
                            </div>
                            <span className="text-xl font-bold">
                                <span className="gradient-text">Skill</span>
                                <span className="text-[var(--text-primary)]">Gap</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {isAuthenticated ? (
                                <>
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        const isActive = isActivePath(link.path);
                                        
                                        return (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                    isActive
                                                        ? 'bg-[var(--bg-tertiary)] text-[var(--accent-primary)] border border-[var(--accent-primary)]'
                                                        : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{link.label}</span>
                                            </Link>
                                        );
                                    })}

                                    {/* User Menu */}
                                    <div className="flex items-center gap-4 pl-4 border-l border-[var(--border-secondary)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                                                <span className="text-sm font-bold text-[var(--bg-primary)]">
                                                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-[var(--text-primary)] hidden lg:block">
                                                {user?.full_name || 'User'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--bg-tertiary)] transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="hidden lg:inline">Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="btn-outline px-6 py-2">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn-primary px-6 py-2">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] animate-slideIn">
                        <div className="px-4 py-4 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-primary)]">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                                            <span className="text-sm font-bold text-[var(--bg-primary)]">
                                                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--text-primary)]">
                                                {user?.full_name || 'User'}
                                            </div>
                                            <div className="text-sm text-[var(--text-muted)]">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        const isActive = isActivePath(link.path);
                                        
                                        return (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                                    isActive
                                                        ? 'bg-[var(--bg-tertiary)] text-[var(--accent-primary)] border border-[var(--accent-primary)]'
                                                        : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{link.label}</span>
                                            </Link>
                                        );
                                    })}

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--error)] hover:bg-[var(--bg-tertiary)] transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full btn-outline text-center py-3"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full btn-primary text-center py-3"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            
            {/* Spacer to prevent content from being hidden under fixed navbar */}
            <div className="h-16" />
        </>
    );
};
