import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AssessmentProvider } from './context/AssessmentContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { BackgroundAnimation } from './components/common/BackgroundAnimation';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AssessmentStart } from './components/assessment/AssessmentStart';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { RoadmapGenerationPage } from './pages/RoadmapGenerationPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssessmentProvider>
          <div className="min-h-screen text-white font-body selection:bg-brand-orange selection:text-white relative">
            <BackgroundAnimation />
            <Navbar />

            <main className="pt-24 min-h-screen">
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

                <Route
                  path="/roadmap/generate/:assessmentId"
                  element={
                    <ProtectedRoute>
                      <RoadmapGenerationPage />
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
                  background: 'rgba(5, 5, 5, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1rem',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#04DEB2', // Brand Cyan
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#FF6702', // Brand Orange matches typical warning/error tone better than red in this design
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
