import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { WelcomePage } from './pages/WelcomePage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-bg text-text font-sans transition-colors duration-300">
              <Navbar />
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin-login" element={<LoginPage />} /> {/* Reusing login for now */}

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/learning/:lessonId" element={<LearningPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute role="teacher" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'glass-card text-text border border-border',
              style: {
                background: 'var(--color-card)',
                color: 'var(--color-text)',
                backdropFilter: 'blur(8px)',
              },
            }}
          />
        </div>
      </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
