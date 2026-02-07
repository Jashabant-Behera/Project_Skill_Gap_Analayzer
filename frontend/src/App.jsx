import React from 'react';
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
