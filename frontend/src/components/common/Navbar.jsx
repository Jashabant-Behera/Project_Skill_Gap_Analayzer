import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, BarChart3, BookOpen, Menu, X, Sparkles, Home, ArrowRight } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-transparent backdrop-blur-md border-b border-white/5 shadow-glass'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-2xl font-display font-medium text-white group-hover:text-brand-cyan transition-colors duration-300">
                            Skill Gap Analyzer
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-12">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-8">
                                    <NavLink to="/" active={isActive('/')}>Home</NavLink>
                                    <NavLink to="/profile" active={isActive('/profile')}>Profile</NavLink>
                                    <NavLink to="/assessment/start" active={isActive('/assessment/start')}>Assessments</NavLink>
                                </div>

                                {/* User Menu */}
                                <div className="flex items-center gap-6 ml-4">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-sm font-medium text-white">
                                            {user?.full_name || 'User'}
                                        </div>
                                        <div className="text-xs text-brand-cyan">
                                            {user?.current_role || 'Learner'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white/60 hover:text-red-400 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-8">
                                    <NavLink to="/" active={isActive('/')}>Home</NavLink>
                                    <NavLink to="/about" active={isActive('/about')}>About Us</NavLink>
                                    <NavLink to="/services" active={isActive('/services')}>Services</NavLink>
                                </div>

                                <div className="flex items-center gap-6">
                                    <Link to="/login" className="text-white hover:text-brand-cyan font-medium transition-colors">
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium hover:scale-105 transition-transform duration-200"
                                    >
                                        Start Project
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2"
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
                <div className="md:hidden fixed inset-0 top-20 bg-brand-black/95 backdrop-blur-xl z-40 animate-fade-in">
                    <div className="px-6 py-8 space-y-6">
                        {isAuthenticated ? (
                            <>
                                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                                <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</MobileNavLink>
                                <MobileNavLink to="/assessment/start" onClick={() => setMobileMenuOpen(false)}>Assessments</MobileNavLink>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="mb-4">
                                        <div className="text-lg font-medium text-white">
                                            {user?.full_name || 'User'}
                                        </div>
                                        <div className="text-sm text-brand-cyan">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                                <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
                                <MobileNavLink to="/services" onClick={() => setMobileMenuOpen(false)}>Services</MobileNavLink>

                                <div className="pt-8 space-y-4">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center text-white py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full btn-primary text-center py-3 rounded-xl"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Start Project
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

// Desktop Nav Link Component
const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`relative text-base font-medium transition-colors duration-300 py-2 group ${active ? 'text-brand-orange' : 'text-white hover:text-brand-cyan'
            }`}
    >
        {children}
        <span className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
    </Link>
);

// Mobile Nav Link Component
const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block text-2xl font-medium text-white hover:text-brand-cyan transition-colors"
    >
        {children}
    </Link>
);
