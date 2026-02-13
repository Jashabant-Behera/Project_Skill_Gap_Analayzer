import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, BarChart3, BookOpen, Menu, X, Sparkles, Home } from 'lucide-react';

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
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-dark-900/95 backdrop-blur-xl shadow-dark border-b border-dark-700/50'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500 rounded-lg blur group-hover:blur-md transition-all" />
                                <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-2 rounded-lg">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-display font-bold">
                                <span className="gradient-text">Skill</span>
                                <span className="text-white">Gap</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {isAuthenticated ? (
                                <>
                                    <NavLink
                                        to="/"
                                        icon={Home}
                                        active={isActive('/')}
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink
                                        to="/profile"
                                        icon={User}
                                        active={isActive('/profile')}
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink
                                        to="/assessment/start"
                                        icon={BookOpen}
                                        active={isActive('/assessment/start')}
                                    >
                                        Assessments
                                    </NavLink>

                                    {/* User Menu */}
                                    <div className="ml-4 pl-4 border-l border-dark-700 flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-white">
                                                {user?.full_name || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {user?.current_role || 'No role set'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="btn-ghost flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-ghost">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="btn-primary ml-2">
                                        <Sparkles className="w-4 h-4 mr-2 inline" />
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden btn-ghost p-2"
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
                    <div className="md:hidden border-t border-dark-700/50 bg-dark-900/95 backdrop-blur-xl">
                        <div className="px-4 py-4 space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <MobileNavLink
                                        to="/"
                                        icon={Home}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Home
                                    </MobileNavLink>
                                    <MobileNavLink
                                        to="/profile"
                                        icon={User}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </MobileNavLink>
                                    <MobileNavLink
                                        to="/assessment/start"
                                        icon={BookOpen}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Assessments
                                    </MobileNavLink>

                                    <div className="pt-4 mt-4 border-t border-dark-700">
                                        <div className="px-4 py-2 mb-2">
                                            <div className="text-sm font-medium text-white">
                                                {user?.full_name || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {user?.email}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block w-full btn-ghost text-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full btn-primary text-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

// Desktop Nav Link Component
const NavLink = ({ to, icon: Icon, children, active }) => (
    <Link
        to={to}
        className={`nav-link flex items-center gap-2 ${active ? 'text-primary-400 bg-primary-500/10' : ''
            }`}
    >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
    </Link>
);

// Mobile Nav Link Component
const MobileNavLink = ({ to, icon: Icon, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{children}</span>
    </Link>
);
