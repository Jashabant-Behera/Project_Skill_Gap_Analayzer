PHASE 10: FRONTEND DEVELOPMENT WITH REACT
Complete React Frontend with Skill Addition & Rating Feature

PROJECT STRUCTURE
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProfileSetup.jsx
│   │   ├── profile/
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── SkillManager.jsx
│   │   │   ├── SkillRatingModal.jsx
│   │   │   └── AdditionalSkillsManager.jsx
│   │   ├── assessment/
│   │   │   ├── RoleSelector.jsx
│   │   │   ├── AdditionalSkillsSelector.jsx
│   │   │   ├── AssessmentStart.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── EvaluationFeedback.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── AssessmentComplete.jsx
│   │   ├── dashboard/
│   │   │   ├── SkillGapDashboard.jsx
│   │   │   ├── SkillRadarChart.jsx
│   │   │   ├── GapPriorityCards.jsx
│   │   │   ├── CompetencyDistribution.jsx
│   │   │   └── StatsCards.jsx
│   │   ├── roadmap/
│   │   │   ├── RoadmapGenerator.jsx
│   │   │   ├── RoadmapTimeline.jsx
│   │   │   ├── WeekCard.jsx
│   │   │   ├── ResourceList.jsx
│   │   │   └── ProgressTracker.jsx
│   │   └── layout/
│   │       ├── MainLayout.jsx
│   │       └── AuthLayout.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AssessmentPage.jsx
│   │   ├── ResultsPage.jsx
│   │   ├── RoadmapPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── assessmentService.js
│   │   ├── roadmapService.js
│   │   └── masterDataService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AssessmentContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAssessment.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md

SETUP & INSTALLATION
Step 1: Initialize React Project
bash# Create Vite React app
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom axios recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install react-hot-toast zustand
Step 2: Configure Tailwind CSS
tailwind.config.js
javascript/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in',
        'slideIn': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
postcss.config.js
javascriptexport default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
src/styles/index.css
css@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-outline {
    @apply border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
  }
  
  .card-hover {
    @apply card hover:shadow-md transition-shadow duration-200 cursor-pointer;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

BACKEND UPDATES FOR NEW FEATURE
Updated Assessment Schema
app/schemas/assessment.py (Additional code)
pythonfrom typing import List

class AdditionalSkillRequest(BaseModel):
    """Skill that user wants to learn additionally"""
    skill_id: str
    skill_name: str
    reason: Optional[str] = None  # Why they want to learn it
    desired_proficiency: str = Field(
        default="intermediate",
        pattern="^(beginner|intermediate|advanced)$"
    )

class AssessmentCreate(BaseModel):
    target_role_id: str
    additional_skills_to_learn: List[AdditionalSkillRequest] = []  # NEW: Skills to add as gaps
Updated Assessment Router
app/routers/assessments.py (Modified create_assessment)
python@router.post("", status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_data: AssessmentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Start a new assessment with optional additional skills to learn
    """
    
    # ... existing validation code ...
    
    # Get skills to assess (from role requirements)
    skills_to_assess = []
    for req_skill in target_role.required_skills:
        if req_skill["skill_id"] not in known_skill_ids:
            skills_to_assess.append(req_skill["skill_id"])
    
    # NEW: Add user's additional skills to learn
    additional_skill_ids = []
    for add_skill in assessment_data.additional_skills_to_learn:
        # Validate skill exists
        skill = await Skill.find_one(Skill.skill_id == add_skill.skill_id)
        if skill:
            skills_to_assess.append(add_skill.skill_id)
            additional_skill_ids.append({
                "skill_id": add_skill.skill_id,
                "skill_name": add_skill.skill_name,
                "desired_proficiency": add_skill.desired_proficiency,
                "reason": add_skill.reason
            })
    
    # ... rest of the code ...
    
    # Store additional skills in assessment metadata
    new_assessment = Assessment(
        user_id=current_user.user_id,
        target_role_id=target_role.role_id,
        target_role_name=target_role.role_name,
        status="in_progress",
        additional_learning_goals=additional_skill_ids  # NEW field
    )
Updated Assessment Model
app/models/assessment.py (Add field)
pythonclass Assessment(Document):
    # ... existing fields ...
    
    additional_learning_goals: List[Dict[str, Any]] = []  # NEW: User's custom learning goals

CORE SERVICES
Step 1: API Configuration
src/services/api.js
javascriptimport axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.detail || 'An error occurred';
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default api;
src/services/authService.js
javascriptimport api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.tokens) {
      this.setTokens(response.data.tokens);
      this.setUser(response.data.user);
    }
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.tokens) {
      this.setTokens(response.data.tokens);
      this.setUser(response.data.user);
    }
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    this.setUser(response.data);
    return response.data;
  },

  // Update profile
  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    this.setUser(response.data);
    return response.data;
  },

  // Add user skill
  async addSkill(skillData) {
    const response = await api.post('/users/skills', skillData);
    return response.data;
  },

  // Get user skills
  async getUserSkills() {
    const response = await api.get('/users/skills');
    return response.data;
  },

  // Remove user skill
  async removeSkill(skillId) {
    const response = await api.delete(`/users/skills/${skillId}`);
    return response.data;
  },

  // Check profile completion
  async checkProfileCompletion() {
    const response = await api.get('/users/profile/complete');
    return response.data;
  },

  // Helper methods
  setTokens(tokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
src/services/assessmentService.js
javascriptimport api from './api';

export const assessmentService = {
  // Create new assessment
  async createAssessment(data) {
    const response = await api.post('/assessments', data);
    return response.data;
  },

  // Get next question
  async getNextQuestion(assessmentId) {
    const response = await api.get(`/assessments/${assessmentId}/questions/next`);
    return response.data;
  },

  // Submit answer
  async submitAnswer(assessmentId, answerData) {
    const response = await api.post(`/assessments/${assessmentId}/answers`, answerData);
    return response.data;
  },

  // Get assessment progress
  async getProgress(assessmentId) {
    const response = await api.get(`/assessments/${assessmentId}/progress`);
    return response.data;
  },

  // Complete assessment
  async completeAssessment(assessmentId) {
    const response = await api.post(`/assessments/${assessmentId}/complete`);
    return response.data;
  },

  // Get assessment results
  async getResults(assessmentId) {
    const response = await api.get(`/assessments/${assessmentId}/results`);
    return response.data;
  },

  // List assessments
  async listAssessments(params = {}) {
    const response = await api.get('/assessments', { params });
    return response.data;
  },
};
src/services/roadmapService.js
javascriptimport api from './api';

export const roadmapService = {
  // Generate roadmap
  async generateRoadmap(data) {
    const response = await api.post('/roadmaps', data);
    return response.data;
  },

  // Get roadmap
  async getRoadmap(roadmapId) {
    const response = await api.get(`/roadmaps/${roadmapId}`);
    return response.data;
  },

  // Get roadmap by assessment
  async getRoadmapByAssessment(assessmentId) {
    const response = await api.get(`/roadmaps/by-assessment/${assessmentId}`);
    return response.data;
  },

  // Get specific week
  async getWeek(roadmapId, weekNumber) {
    const response = await api.get(`/roadmaps/${roadmapId}/week/${weekNumber}`);
    return response.data;
  },
};
src/services/masterDataService.js
javascriptimport api from './api';

export const masterDataService = {
  // Get all roles
  async getRoles(params = {}) {
    const response = await api.get('/roles', { params });
    return response.data;
  },

  // Get role details
  async getRole(roleId) {
    const response = await api.get(`/roles/${roleId}`);
    return response.data;
  },

  // Get all skills
  async getSkills(params = {}) {
    const response = await api.get('/skills', { params });
    return response.data;
  },

  // Get skill details
  async getSkill(skillId) {
    const response = await api.get(`/skills/${skillId}`);
    return response.data;
  },

  // Search skills
  async searchSkills(query) {
    const response = await api.get('/skills', {
      params: { search: query, limit: 20 }
    });
    return response.data;
  },
};
src/services/analyticsService.js
javascriptimport api from './api';

export const analyticsService = {
  // Get dashboard data
  async getDashboard(assessmentId) {
    const response = await api.get(`/analytics/dashboard/${assessmentId}`);
    return response.data;
  },

  // Get skill comparison
  async getSkillComparison(assessmentId) {
    const response = await api.get(`/analytics/skill-comparison/${assessmentId}`);
    return response.data;
  },

  // Get progress timeline
  async getProgressTimeline() {
    const response = await api.get('/analytics/progress-timeline');
    return response.data;
  },

  // Export results
  async exportResults(assessmentId, format = 'json') {
    const response = await api.get(`/analytics/export/${assessmentId}`, {
      params: { format }
    });
    return response.data;
  },
};

CONTEXT & STATE MANAGEMENT
src/context/AuthContext.jsx
javascriptimport React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const hasToken = authService.isAuthenticated();

      if (storedUser && hasToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          authService.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
src/context/AssessmentContext.jsx
javascriptimport React, { createContext, useState, useCallback } from 'react';
import { assessmentService } from '../services/assessmentService';
import toast from 'react-hot-toast';

export const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const startAssessment = useCallback(async (data) => {
    try {
      setLoading(true);
      const assessment = await assessmentService.createAssessment(data);
      setCurrentAssessment(assessment);
      toast.success('Assessment started!');
      return assessment;
    } catch (error) {
      toast.error('Failed to start assessment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextQuestion = useCallback(async (assessmentId) => {
    try {
      setLoading(true);
      const question = await assessmentService.getNextQuestion(assessmentId);
      setCurrentQuestion(question);
      return question;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('All questions completed!');
      } else {
        toast.error('Failed to load question');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (assessmentId, answerData) => {
    try {
      setLoading(true);
      const evaluation = await assessmentService.submitAnswer(assessmentId, answerData);
      return evaluation;
    } catch (error) {
      toast.error('Failed to submit answer');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (assessmentId) => {
    try {
      const progressData = await assessmentService.getProgress(assessmentId);
      setProgress(progressData);
      return progressData;
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }, []);

  const completeAssessment = useCallback(async (assessmentId) => {
    try {
      setLoading(true);
      const result = await assessmentService.completeAssessment(assessmentId);
      toast.success('Assessment completed!');
      return result;
    } catch (error) {
      toast.error('Failed to complete assessment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetAssessment = useCallback(() => {
    setCurrentAssessment(null);
    setCurrentQuestion(null);
    setProgress(null);
  }, []);

  const value = {
    currentAssessment,
    currentQuestion,
    progress,
    loading,
    startAssessment,
    getNextQuestion,
    submitAnswer,
    updateProgress,
    completeAssessment,
    resetAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

CUSTOM HOOKS
src/hooks/useAuth.js
javascriptimport { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
src/hooks/useAssessment.js
javascriptimport { useContext } from 'react';
import { AssessmentContext } from '../context/AssessmentContext';

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

COMPONENTS
Common Components
src/components/common/LoadingSpinner.jsx
javascriptimport React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};
src/components/common/ErrorMessage.jsx
javascriptimport React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="flex items-center gap-3 text-red-800">
        <AlertCircle className="w-5 h-5" />
        <p>{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">
          Try Again
        </button>
      )}
    </div>
  );
};
src/components/common/ProtectedRoute.jsx
javascriptimport React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
src/components/common/Navbar.jsx
javascriptimport React from 'react';
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
                  to="/assessments"
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

NEW FEATURE: Additional Skills Components
src/components/profile/AdditionalSkillsManager.jsx
javascriptimport React, { useState, useEffect } from 'react';
import { Plus, X, Star, Trash2, Search } from 'lucide-react';
import { masterDataService } from '../../services/masterDataService';
import toast from 'react-hot-toast';

export const AdditionalSkillsManager = ({ additionalSkills, onSkillsChange }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [desiredProficiency, setDesiredProficiency] = useState('intermediate');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Search skills
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await masterDataService.searchSkills(query);
      setSearchResults(data.skills || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Add additional skill
  const handleAddSkill = () => {
    if (!selectedSkill) {
      toast.error('Please select a skill');
      return;
    }

    // Check if already added
    const exists = additionalSkills.some(s => s.skill_id === selectedSkill.skill_id);
    if (exists) {
      toast.error('Skill already added');
      return;
    }

    const newSkill = {
      skill_id: selectedSkill.skill_id,
      skill_name: selectedSkill.skill_name,
      desired_proficiency: desiredProficiency,
      reason: reason || `Want to learn ${selectedSkill.skill_name} to advance my career`,
    };

    onSkillsChange([...additionalSkills, newSkill]);
    
    // Reset form
    setSelectedSkill(null);
    setSearchQuery('');
    setSearchResults([]);
    setReason('');
    setDesiredProficiency('intermediate');
    setShowAddModal(false);
    
    toast.success(`${selectedSkill.skill_name} added to learning goals`);
  };

  // Remove skill
  const handleRemoveSkill = (skillId) => {
    const updated = additionalSkills.filter(s => s.skill_id !== skillId);
    onSkillsChange(updated);
    toast.success('Skill removed from learning goals');
  };

  // Update proficiency
  const handleUpdateProficiency = (skillId, newProficiency) => {
    const updated = additionalSkills.map(s =>
      s.skill_id === skillId ? { ...s, desired_proficiency: newProficiency } : s
    );
    onSkillsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Additional Skills to Learn
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Add skills you want to learn that aren't part of your target role. These will appear as gaps in your analysis and be included in your learning roadmap.
      </p>

      {/* Current Additional Skills */}
      <div className="space-y-3">
        {additionalSkills.length === 0 ? (
          <div className="card bg-gray-50 text-center py-8">
            <p className="text-gray-500">No additional skills added yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Add skills you want to learn to customize your roadmap
            </p>
          </div>
        ) : (
          additionalSkills.map((skill) => (
            <div key={skill.skill_id} className="card-hover border-l-4 border-primary-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{skill.skill_name}</h4>
                  {skill.reason && (
                    <p className="text-sm text-gray-600 mt-1">{skill.reason}</p>
                  )}
                  
                  {/* Proficiency Selector */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Target Level:</span>
                    <select
                      value={skill.desired_proficiency}
                      onChange={(e) => handleUpdateProficiency(skill.skill_id, e.target.value)}
                      className="input-field text-sm py-1 px-2"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveSkill(skill.skill_id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Add Skill to Learn</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for a skill
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="e.g., R Programming, Docker, AWS..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((skill) => (
                    <button
                      key={skill.skill_id}
                      onClick={() => {
                        setSelectedSkill(skill);
                        setSearchResults([]);
                        setSearchQuery(skill.skill_name);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedSkill?.skill_id === skill.skill_id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{skill.skill_name}</div>
                      <div className="text-sm text-gray-500">{skill.category}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedSkill && (
                <>
                  {/* Selected Skill Info */}
                  <div className="card bg-primary-50 border-primary-200">
                    <div className="font-medium text-gray-900">{selectedSkill.skill_name}</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedSkill.description}</div>
                  </div>

                  {/* Desired Proficiency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Proficiency Level
                    </label>
                    <select
                      value={desiredProficiency}
                      onChange={(e) => setDesiredProficiency(e.target.value)}
                      className="input-field"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to learn this? (Optional)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., Required for data science roles in the market..."
                      className="input-field"
                      rows={3}
                    />
                  </div>

                  {/* Add Button */}
                  <div className="flex gap-3">
                    <button onClick={handleAddSkill} className="btn-primary flex-1">
                      Add to Learning Goals
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSkill(null);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Assessment Flow with Additional Skills
src/components/assessment/AssessmentStart.jsx
javascriptimport React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Plus } from 'lucide-react';
import { masterDataService } from '../../services/masterDataService';
import { useAssessment } from '../../hooks/useAssessment';
import { AdditionalSkillsManager } from '../profile/AdditionalSkillsManager';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AssessmentStart = () => {
  const navigate = useNavigate();
  const { startAssessment, loading } = useAssessment();
  
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleDetails, setRoleDetails] = useState(null);
  const [additionalSkills, setAdditionalSkills] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [step, setStep] = useState(1); // 1: Select Role, 2: Add Skills, 3: Confirm

  // Load roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await masterDataService.getRoles({ limit: 50 });
        setRoles(data.roles || []);
      } catch (error) {
        toast.error('Failed to load roles');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // Load role details when selected
  useEffect(() => {
    if (selectedRole) {
      const fetchRoleDetails = async () => {
        try {
          const details = await masterDataService.getRole(selectedRole);
          setRoleDetails(details);
        } catch (error) {
          toast.error('Failed to load role details');
        }
      };
      fetchRoleDetails();
    }
  }, [selectedRole]);

  const handleStartAssessment = async () => {
    if (!selectedRole) {
      toast.error('Please select a target role');
      return;
    }

    try {
      const assessmentData = {
        target_role_id: selectedRole,
        additional_skills_to_learn: additionalSkills,
      };

      const assessment = await startAssessment(assessmentData);
      navigate(`/assessment/${assessment.assessment_id}`);
    } catch (error) {
      console.error('Failed to start assessment:', error);
    }
  };

  if (loadingRoles) {
    return <LoadingSpinner text="Loading roles..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step > s ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
            Select Role
          </span>
          <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
            Add Skills
          </span>
          <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
            Confirm
          </span>
        </div>
      </div>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="card animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select Your Target Role
          </h2>
          <p className="text-gray-600 mb-6">
            Choose the role you're aiming for. We'll assess your skills against this role's requirements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.role_id}
                onClick={() => setSelectedRole(role.role_id)}
                className={`card-hover text-left p-4 transition-all ${
                  selectedRole === role.role_id
                    ? 'border-2 border-primary-600 bg-primary-50'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.role_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {role.category}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {role.experience_level}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedRole}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Additional Skills */}
      {step === 2 && (
        <div className="card animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Add Skills You Want to Learn
          </h2>
          <p className="text-gray-600 mb-6">
            Want to learn additional skills beyond the role requirements? Add them here and they'll be included in your gap analysis and roadmap.
          </p>

          {roleDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Selected Role</h3>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{roleDetails.role_name}</p>
                <p className="text-gray-600 mt-1">
                  {roleDetails.required_skills.length} required skills
                </p>
              </div>
            </div>
          )}

          <AdditionalSkillsManager
            additionalSkills={additionalSkills}
            onSkillsChange={setAdditionalSkills}
          />

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn-primary">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="card animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Assessment
          </h2>

          {roleDetails && (
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-gray-900 mb-2">Target Role</h3>
                <p className="text-lg font-medium text-primary-900">
                  {roleDetails.role_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {roleDetails.required_skills.length} required skills will be assessed
                </p>
              </div>

              {additionalSkills.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Additional Learning Goals
                  </h3>
                  <ul className="space-y-2">
                    {additionalSkills.map((skill) => (
                      <li key={skill.skill_id} className="flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{skill.skill_name}</span>
                        <span className="text-gray-600">
                          (Target: {skill.desired_proficiency})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What to Expect</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>
                      You'll answer scenario-based questions for each skill
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Questions adapt to your experience level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Get instant feedback on each answer
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Receive a personalized learning roadmap after completion
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary">
              Back
            </button>
            <button
              onClick={handleStartAssessment}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Due to length constraints, I'll provide the remaining critical components in a structured format. Would you like me to continue with:

Assessment Question Flow - QuestionCard, EvaluationFeedback
Dashboard with Gap Analysis - Including additional skills display
Roadmap Display - Showing additional skills in learning path
Main App Setup - Routing, providers, etc.

Let me know which sections you'd like me to complete next, or if you want all of them!yes proceed with the rest1:11 PMCONTINUATION: REMAINING FRONTEND COMPONENTS

ASSESSMENT FLOW COMPONENTS
src/components/assessment/QuestionCard.jsx
javascriptimport React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export const QuestionCard = ({ question, onSubmit, loading }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track time spent on question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    const finalAnswer = question.question_type === 'mcq' ? selectedOption : answer;

    if (!finalAnswer.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      question_id: question.question_id,
      user_answer: finalAnswer,
      time_taken_seconds: timeSpent,
    });
    setIsSubmitting(false);

    // Reset for next question
    setAnswer('');
    setSelectedOption('');
    setTimeSpent(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card animate-slideIn">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {question.skill_name}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {question.difficulty_level}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {question.question_type.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">{formatTime(timeSpent)}</span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {question.question_text}
        </h3>

        {/* MCQ Options */}
        {question.question_type === 'mcq' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
              return (
                <label
                  key={index}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === optionLabel
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="mcq-option"
                    value={optionLabel}
                    checked={selectedOption === optionLabel}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mt-1 mr-3 text-primary-600"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700 mr-2">
                      {optionLabel}.
                    </span>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {/* Text Answer */}
        {(question.question_type === 'short_answer' || 
          question.question_type === 'scenario' || 
          question.question_type === 'coding') && (
          <div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={
                question.question_type === 'coding'
                  ? 'Write your code here...'
                  : 'Type your answer here...'
              }
              className={`input-field ${
                question.question_type === 'coding' ? 'font-mono' : ''
              }`}
              rows={question.question_type === 'coding' ? 12 : 6}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{answer.length} characters</span>
              {answer.length < 50 && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Try to provide more detail</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            loading ||
            (question.question_type === 'mcq' ? !selectedOption : !answer.trim())
          }
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      </div>

      {/* Helpful Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {question.question_type === 'scenario' && (
            <>
              <li>• Explain your reasoning and approach</li>
              <li>• Consider real-world implications</li>
              <li>• Mention trade-offs if applicable</li>
            </>
          )}
          {question.question_type === 'coding' && (
            <>
              <li>• Write clean, readable code</li>
              <li>• Add comments to explain your logic</li>
              <li>• Consider edge cases</li>
            </>
          )}
          {question.question_type === 'short_answer' && (
            <>
              <li>• Be concise but thorough</li>
              <li>• Use examples when helpful</li>
              <li>• Demonstrate your understanding</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
src/components/assessment/EvaluationFeedback.jsx
javascriptimport React from 'react';
import { CheckCircle, XCircle, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';

export const EvaluationFeedback = ({ evaluation, onNext }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const getLevelBadge = (level) => {
    const colors = {
      advanced: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      beginner: 'bg-amber-100 text-amber-800',
    };
    return colors[level] || colors.beginner;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Score Card */}
      <div className={`card ${getScoreBgColor(evaluation.score)} border-2`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your Score
          </h3>
          <div className={`text-6xl font-bold ${getScoreColor(evaluation.score)}`}>
            {Math.round(evaluation.score)}
          </div>
          <div className="mt-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getLevelBadge(evaluation.competency_level)}`}>
              {evaluation.competency_level.charAt(0).toUpperCase() + evaluation.competency_level.slice(1)} Level
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary-600" />
          Feedback
        </h4>
        <p className="text-gray-700 leading-relaxed">{evaluation.feedback}</p>
      </div>

      {/* Strengths */}
      {evaluation.strengths && evaluation.strengths.length > 0 && (
        <div className="card bg-green-50 border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            What You Did Well
          </h4>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-green-800">
                <span className="text-green-600 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {evaluation.gaps && evaluation.gaps.length > 0 && (
        <div className="card bg-amber-50 border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {evaluation.gaps.map((gap, index) => (
              <li key={index} className="flex items-start gap-2 text-amber-800">
                <span className="text-amber-600 mt-1">→</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Concepts */}
      {evaluation.missing_concepts && evaluation.missing_concepts.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-blue-600" />
            Concepts to Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {evaluation.missing_concepts.map((concept, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-center">
        <button onClick={onNext} className="btn-primary flex items-center gap-2">
          <span>Next Question</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
src/components/assessment/ProgressBar.jsx
javascriptimport React from 'react';

export const ProgressBar = ({ current, total, score }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">Assessment Progress</h3>
          <p className="text-sm text-gray-600">
            Question {current} of {total}
          </p>
        </div>
        {score !== null && score !== undefined && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Score</p>
            <p className="text-2xl font-bold text-primary-600">
              {Math.round(score)}%
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 text-sm text-gray-600 text-right">
        {Math.round(percentage)}% Complete
      </div>
    </div>
  );
};

DASHBOARD COMPONENTS WITH ADDITIONAL SKILLS
src/components/dashboard/SkillGapDashboard.jsx
javascriptimport React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { SkillRadarChart } from './SkillRadarChart';
import { GapPriorityCards } from './GapPriorityCards';
import { StatsCards } from './StatsCards';
import { CompetencyDistribution } from './CompetencyDistribution';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Plus } from 'lucide-react';

export const SkillGapDashboard = () => {
  const { assessmentId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [assessmentId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboard(assessmentId);
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your results..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  if (!dashboardData) {
    return null;
  }

  // Separate role-required gaps from additional learning goals
  const roleGaps = dashboardData.skill_gaps.high
    .concat(dashboardData.skill_gaps.medium)
    .concat(dashboardData.skill_gaps.low)
    .filter(gap => !gap.is_additional); // Assuming backend marks additional skills

  const additionalGoals = dashboardData.skill_gaps.high
    .concat(dashboardData.skill_gaps.medium)
    .concat(dashboardData.skill_gaps.low)
    .filter(gap => gap.is_additional);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Assessment Results
        </h1>
        <p className="text-gray-600">
          Target Role: <span className="font-semibold">{dashboardData.summary.target_role}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Completed on {new Date(dashboardData.summary.completed_at).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards summary={dashboardData.summary} />

      {/* Radar Chart */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Skills Overview
        </h2>
        <SkillRadarChart data={dashboardData.skill_radar} />
      </div>

      {/* Role-Required Gaps */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Skills Gap Analysis - Role Requirements
        </h2>
        <GapPriorityCards
          highPriority={dashboardData.skill_gaps.high.filter(g => !g.is_additional)}
          mediumPriority={dashboardData.skill_gaps.medium.filter(g => !g.is_additional)}
          lowPriority={dashboardData.skill_gaps.low.filter(g => !g.is_additional)}
        />
      </div>

      {/* Additional Learning Goals */}
      {additionalGoals.length > 0 && (
        <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Your Additional Learning Goals
            </h2>
          </div>
          
          <p className="text-gray-700 mb-6">
            Skills you wanted to learn beyond the role requirements. These will be included in your personalized roadmap.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalGoals.map((goal, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-2 border-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{goal.skill_name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Custom Goal
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium">{goal.current_level || 'Not assessed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium text-green-700">{goal.required_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gap:</span>
                    <span className="font-medium text-amber-700">
                      {Math.round(goal.gap_score)}%
                    </span>
                  </div>
                </div>

                {goal.missing_concepts && goal.missing_concepts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">To Learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {goal.missing_concepts.slice(0, 3).map((concept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competency Distribution */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Competency Distribution
        </h2>
        <CompetencyDistribution data={dashboardData.statistics.competency_distribution} />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Score by Skill</h3>
          <div className="space-y-3">
            {Object.entries(dashboardData.statistics.score_by_skill || {}).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{skill}</span>
                  <span className="font-semibold text-gray-900">{Math.round(score)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      score >= 80
                        ? 'bg-green-500'
                        : score >= 60
                        ? 'bg-blue-500'
                        : score >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Assessment Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-semibold">{dashboardData.summary.total_questions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Taken:</span>
              <span className="font-semibold">{dashboardData.summary.time_taken_minutes || 0} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score:</span>
              <span className="font-semibold">{Math.round(dashboardData.statistics.average_score || 0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skills Assessed:</span>
              <span className="font-semibold">
                {Object.keys(dashboardData.statistics.score_by_skill || {}).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
src/components/dashboard/GapPriorityCards.jsx
javascriptimport React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const GapPriorityCards = ({ highPriority, mediumPriority, lowPriority }) => {
  const [expandedSections, setExpandedSections] = useState({
    high: true,
    medium: false,
    low: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const GapCard = ({ gap }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900 mb-2">{gap.skill_name}</h4>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <p className="text-gray-600">Current</p>
          <p className="font-medium text-gray-900">{gap.current_level || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">Required</p>
          <p className="font-medium text-primary-600">{gap.required_level}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Gap Score</span>
          <span className="font-semibold text-red-600">{Math.round(gap.gap_score)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${gap.gap_score}%` }}
          />
        </div>
      </div>

      {gap.missing_concepts && gap.missing_concepts.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 mb-2">Key concepts to learn:</p>
          <div className="flex flex-wrap gap-1">
            {gap.missing_concepts.slice(0, 4).map((concept, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {concept}
              </span>
            ))}
            {gap.missing_concepts.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{gap.missing_concepts.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const PrioritySection = ({ title, icon: Icon, color, gaps, section }) => {
    if (!gaps || gaps.length === 0) return null;

    return (
      <div className={`border-2 rounded-xl overflow-hidden ${color.border}`}>
        <button
          onClick={() => toggleSection(section)}
          className={`w-full p-4 flex items-center justify-between ${color.bg} hover:opacity-90 transition-opacity`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${color.text}`} />
            <div className="text-left">
              <h3 className={`text-lg font-bold ${color.text}`}>{title}</h3>
              <p className={`text-sm ${color.subtext}`}>
                {gaps.length} skill{gaps.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {expandedSections[section] ? (
            <ChevronUp className={`w-5 h-5 ${color.text}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${color.text}`} />
          )}
        </button>

        {expandedSections[section] && (
          <div className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gaps.map((gap, index) => (
                <GapCard key={index} gap={gap} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <PrioritySection
        title="High Priority"
        icon={AlertTriangle}
        color={{
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-700',
          subtext: 'text-red-600',
        }}
        gaps={highPriority}
        section="high"
      />

      <PrioritySection
        title="Medium Priority"
        icon={AlertCircle}
        color={{
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          text: 'text-amber-700',
          subtext: 'text-amber-600',
        }}
        gaps={mediumPriority}
        section="medium"
      />

      <PrioritySection
        title="Low Priority"
        icon={Info}
        color={{
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-700',
          subtext: 'text-blue-600',
        }}
        gaps={lowPriority}
        section="low"
      />
    </div>
  );
};
src/components/dashboard/SkillRadarChart.jsx
javascriptimport React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export const SkillRadarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No skill data available
      </div>
    );
  }

  // Transform data for radar chart
  const chartData = data.map((item) => ({
    skill: item.skill.length > 15 ? item.skill.substring(0, 15) + '...' : item.skill,
    Current: item.current,
    Required: item.required,
    fullSkillName: item.skill,
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={90} domain={[0, 3]} />
          <Radar
            name="Current Level"
            dataKey="Current"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.5}
          />
          <Radar
            name="Required Level"
            dataKey="Required"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const levelMap = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 mb-2">
                      {payload[0].payload.fullSkillName}
                    </p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {levelMap[entry.value]}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>1 = Beginner | 2 = Intermediate | 3 = Advanced</p>
      </div>
    </div>
  );
};
src/components/dashboard/StatsCards.jsx
javascriptimport React from 'react';
import { Target, TrendingUp, Clock, Award } from 'lucide-react';

export const StatsCards = ({ summary }) => {
  const stats = [
    {
      label: 'Overall Score',
      value: `${Math.round(summary.overall_score)}%`,
      icon: Award,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'Readiness Score',
      value: `${Math.round(summary.readiness_score)}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Questions Answered',
      value: summary.total_questions || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Time Taken',
      value: `${summary.time_taken_minutes || 0} min`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
src/components/dashboard/CompetencyDistribution.jsx
javascriptimport React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const CompetencyDistribution = ({ data }) => {
  if (!data) return null;

  const chartData = [
    { level: 'Beginner', count: data.beginner || 0 },
    { level: 'Intermediate', count: data.intermediate || 0 },
    { level: 'Advanced', count: data.advanced || 0 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#0ea5e9" name="Number of Skills" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

ROADMAP COMPONENTS WITH ADDITIONAL SKILLS
src/components/roadmap/RoadmapTimeline.jsx
javascriptimport React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapService } from '../../services/roadmapService';
import { WeekCard } from './WeekCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Calendar, Clock, BookOpen, Target, Plus } from 'lucide-react';

export const RoadmapTimeline = () => {
  const { assessmentId, roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);

  useEffect(() => {
    fetchRoadmap();
  }, [assessmentId, roadmapId]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      let data;
      
      if (roadmapId) {
        data = await roadmapService.getRoadmap(roadmapId);
      } else if (assessmentId) {
        data = await roadmapService.getRoadmapByAssessment(assessmentId);
      }
      
      setRoadmap(data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Roadmap not generated yet');
      } else {
        setError('Failed to load roadmap');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your roadmap..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage message={error} />
        {assessmentId && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate(`/roadmap/generate/${assessmentId}`)}
              className="btn-primary"
            >
              Generate Roadmap
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!roadmap) {
    return null;
  }

  // Identify weeks with additional learning goals
  const weeksWithAdditionalSkills = roadmap.weeks.filter(week => 
    week.skills_to_learn.some(skillId => 
      // Check if skill is marked as additional (backend should provide this)
      week.is_additional_skill?.[skillId]
    )
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Learning Roadmap
            </h1>
            <p className="text-gray-700 mb-4">{roadmap.overview}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{roadmap.total_weeks} weeks</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Weekly Commitment</p>
                  <p className="font-semibold text-gray-900">{roadmap.hours_per_week} hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="font-semibold text-gray-900">
                    {roadmap.total_weeks * roadmap.hours_per_week} hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Skills Callout */}
      {weeksWithAdditionalSkills.length > 0 && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-start gap-3">
            <Plus className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Your Custom Learning Goals Included
              </h3>
              <p className="text-green-800 text-sm">
                This roadmap includes the additional skills you wanted to learn. 
                They're integrated into your learning path at optimal points.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Weeks */}
        <div className="space-y-8">
          {roadmap.weeks.map((week, index) => (
            <div key={week.week_number} className="relative">
              {/* Week Number Badge */}
              <div className="absolute left-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg">
                {week.week_number}
              </div>

              {/* Week Card */}
              <div className="ml-24">
                <WeekCard
                  week={week}
                  isExpanded={expandedWeek === week.week_number}
                  onToggle={() => setExpandedWeek(
                    expandedWeek === week.week_number ? null : week.week_number
                  )}
                  roadmapId={roadmap.roadmap_id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-center">
        <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          You've Got This! 🎯
        </h3>
        <p className="text-gray-700">
          Follow this roadmap consistently, and you'll be ready for your target role in {roadmap.total_weeks} weeks.
          Remember, the journey of a thousand miles begins with a single step!
        </p>
      </div>
    </div>
  );
};
src/components/roadmap/WeekCard.jsx
javascriptimport React from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Plus } from 'lucide-react';
import { ResourceList } from './ResourceList';

export const WeekCard = ({ week, isExpanded, onToggle, roadmapId }) => {
  // Check if week contains additional learning goals
  const hasAdditionalSkills = week.skills_to_learn.some(skillId => 
    week.is_additional_skill?.[skillId]
  );

  return (
    <div className={`card border-2 transition-all ${
      isExpanded ? 'border-primary-300 shadow-lg' : 'border-gray-200'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{week.title}</h3>
            {hasAdditionalSkills && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Custom Goal
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{week.estimated_hours} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>{week.skills_to_learn.length} skills</span>
            </div>
          </div>
        </div>

        <div className="text-primary-600">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Learning Objectives */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
            <div className="prose prose-sm max-w-none text-gray-700">
              {week.learning_objectives}
            </div>
          </div>

          {/* Skills Breakdown */}
          {week.skills_to_learn && week.skills_to_learn.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Skills Covered</h4>
              <div className="flex flex-wrap gap-2">
                {week.skills_to_learn.map((skillId, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      week.is_additional_skill?.[skillId]
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-primary-100 text-primary-800'
                    }`}
                  >
                    {skillId.replace(/_/g, ' ')}
                    {week.is_additional_skill?.[skillId] && (
                      <Plus className="w-3 h-3 inline ml-1" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {week.resources && Object.keys(week.resources).length > 0 && (
            <ResourceList resources={week.resources} />
          )}

          {/* Project */}
          {week.projects && week.projects.title && (
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                📝 Week Project: {week.projects.title}
              </h4>
              <p className="text-sm text-purple-800 mb-3">
                {week.projects.description}
              </p>
              {week.projects.skills_applied && (
                <div>
                  <p className="text-xs text-purple-700 mb-2">Skills you'll practice:</p>
                  <div className="flex flex-wrap gap-2">
                    {week.projects.skills_applied.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Criteria */}
          {week.success_criteria && week.success_criteria.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">✅ Success Criteria</h4>
              <ul className="space-y-2">
                {week.success_criteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
src/components/roadmap/ResourceList.jsx
javascriptimport React from 'react';
import { BookOpen, Video, Code, FileText, ExternalLink } from 'lucide-react';

export const ResourceList = ({ resources }) => {
  const resourceTypes = [
    { key: 'documentation', label: 'Documentation', icon: FileText, color: 'blue' },
    { key: 'tutorials', label: 'Tutorials', icon: BookOpen, color: 'green' },
    { key: 'courses', label: 'Courses', icon: Video, color: 'purple' },
    { key: 'practice', label: 'Practice', icon: Code, color: 'amber' },
  ];

  const getColorClasses = (color) => ({
    bg: `bg-${color}-50`,
    text: `text-${color}-700`,
    border: `border-${color}-200`,
  });

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">📚 Learning Resources</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resourceTypes.map(({ key, label, icon: Icon, color }) => {
          const items = resources[key];
          if (!items || items.length === 0) return null;

          return (
            <div
              key={key}
              className={`p-4 rounded-lg border-2 bg-${color}-50 border-${color}-200`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 text-${color}-600`} />
                <h5 className={`font-semibold text-${color}-900`}>{label}</h5>
              </div>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={index} className="text-sm">
                    {typeof item === 'string' ? (
                      item.startsWith('http') ? (
                        
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-${color}-700 hover:text-${color}-900 hover:underline flex items-center gap-1`}
                        >
                          <span className="line-clamp-1">{item}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className={`text-${color}-800`}>{item}</span>
                      )
                    ) : (
                      <span className={`text-${color}-800`}>{JSON.stringify(item)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

MAIN PAGES
src/pages/AssessmentPage.jsx
javascriptimport React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { EvaluationFeedback } from '../components/assessment/EvaluationFeedback';
import { ProgressBar } from '../components/assessment/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AssessmentPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { getNextQuestion, submitAnswer, updateProgress, completeAssessment } = useAssessment();
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    loadQuestion();
    loadProgress();
  }, [assessmentId]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const question = await getNextQuestion(assessmentId);
      setCurrentQuestion(question);
      setShowEvaluation(false);
    } catch (error) {
      if (error.response?.status === 400) {
        // All questions completed
        handleComplete();
      } else {
        toast.error('Failed to load question');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const progressData = await updateProgress(assessmentId);
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const handleSubmitAnswer = async (answerData) => {
    try {
      const evaluationResult = await submitAnswer(assessmentId, answerData);
      setEvaluation(evaluationResult);
      setShowEvaluation(true);
      await loadProgress();
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const handleNextQuestion = async () => {
    await loadQuestion();
  };

  const handleComplete = async () => {
    try {
      await completeAssessment(assessmentId);
      navigate(`/results/${assessmentId}`);
    } catch (error) {
      toast.error('Failed to complete assessment');
    }
  };

  if (loading && !currentQuestion) {
    return <LoadingSpinner text="Loading assessment..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      {progress && (
        <ProgressBar
          current={progress.answered_questions}
          total={progress.total_questions}
          score={progress.overall_score}
        />
      )}

      {/* Question or Evaluation */}
      {showEvaluation ? (
        <EvaluationFeedback
          evaluation={evaluation}
          onNext={handleNextQuestion}
        />
      ) : (
        currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            loading={loading}
          />
        )
      )}
    </div>
  );
};
src/pages/ResultsPage.jsx
javascriptimport React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillGapDashboard } from '../components/dashboard/SkillGapDashboard';
import { ArrowRight } from 'lucide-react';

export const ResultsPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SkillGapDashboard />
      
      <div className="flex justify-center">
        <button
          onClick={() => navigate(`/roadmap/generate/${assessmentId}`)}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
        >
          <span>Generate Learning Roadmap</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
src/pages/RoadmapPage.jsx
javascriptimport React from 'react';
import { RoadmapTimeline } from '../components/roadmap/RoadmapTimeline';

export const RoadmapPage = () => {
  return <RoadmapTimeline />;
};
src/App.jsx
javascriptimport React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AssessmentProvider } from './context/AssessmentContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AssessmentStart } from './components/assessment/AssessmentStart';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { RoadmapPage } from './pages/RoadmapPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssessmentProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/assessment/start"
                  element={
                    <ProtectedRoute>
                      <AssessmentStart />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/assessment/:assessmentId"
                  element={
                    <ProtectedRoute>
                      <AssessmentPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/results/:assessmentId"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/roadmap/:assessmentId"
                  element={
                    <ProtectedRoute>
                      <RoadmapPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AssessmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
src/main.jsx
javascriptimport React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
package.json
json{
  "name": "skill-assessment-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.2",
    "recharts": "^2.10.3",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
.env.example
bashVITE_API_URL=http://localhost:8000/api/v1

FINAL README
README.md
markdown# Skill Assessment Platform - Frontend

React-based frontend for the AI-powered skill assessment and learning roadmap platform.

## Features

- 🔐 User authentication with JWT
- 📝 Profile management with skill tracking
- ➕ **Add custom skills to learn** (NEW!)
- ⭐ **Rate your skill proficiency** (NEW!)
- 📊 Interactive skill assessments
- 📈 Comprehensive gap analysis dashboard
- 🗺️ Personalized learning roadmaps
- 📚 Week-by-week learning plans
- 🎯 Progress tracking

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update API URL in .env
VITE_API_URL=http://localhost:8000/api/v1

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## Project Structure
```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── services/       # API services
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── styles/         # Global styles
```

## Key Features

### Additional Skills Management

Users can add skills they want to learn beyond role requirements:

1. Search and select skills
2. Set target proficiency level
3. Add learning reason
4. Skills appear in gap analysis
5. Integrated into roadmap

### Skill Rating

Users can rate their proficiency in existing skills:
- Beginner
- Intermediate  
- Advanced

### Dashboard

Comprehensive visualization of:
- Overall scores
- Skill gaps by priority
- Radar charts
- Role vs. custom learning goals

### Roadmap

Week-by-week learning plan with:
- Learning objectives
- Resources
- Projects
- Success criteria
- Custom goals highlighted

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

🎉 PROJECT COMPLETE!
You now have a complete full-stack skill assessment platform with:
✅ Backend (FastAPI + MongoDB)

User authentication with JWT
Skill assessment engine
LLM-powered question generation
Answer evaluation
Skill gap analysis
Personalized roadmap generation

✅ Frontend (React + Tailwind)

User authentication
Profile management
Custom skill addition
Skill proficiency rating
Interactive assessments
Rich dashboard with visualizations
Learning roadmap display

✅ NEW FEATURES

Add skills beyond role requirements
Rate skill proficiency
Custom learning goals in dashboard
Integrated additional skills in roadmap
Visual distinction of custom vs required skills