import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { AuthGuard } from './components/AuthGuard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WritingPage } from './pages/WritingPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ArticlesPage } from './pages/ArticlesPage';
import Chatbot from './components/Chatbot';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {!isDashboard && <Navbar />}
      <main className={`flex-1 ${!isDashboard ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/write" 
            element={
              <AuthGuard allowedRoles={['writer', 'admin']}>
                <WritingPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } 
          />
          <Route path="/jobs" element={<JobsPage />} />
          <Route 
            path="/profile" 
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } 
          />
          <Route path="/articles" element={<ArticlesPage />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;