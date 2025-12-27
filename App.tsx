
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Portfolio from './views/Portfolio';
import Journal from './views/Journal';
import Profile from './views/Profile';
import AssessmentFlow from './views/AssessmentFlow';
import AssetDetail from './views/AssetDetail';
import Landing from './views/Landing';
import Auth from './views/Auth';
import { User } from './types';

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Toast Context
interface ToastContextType {
  showToast: (message: string) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: '工作台', icon: 'grid_view' },
    { path: '/portfolio', label: '资产', icon: 'pie_chart' },
    { path: '/journal', label: '日志', icon: 'book' },
    { path: '/profile', label: '设置', icon: 'person' },
  ];

  if (activePath.includes('assessment') || activePath === '/' || activePath === '/auth' || !user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/50 dark:border-white/5 pb-safe shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 w-full transition-all duration-200 active:scale-90 ${
              activePath === item.path ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activePath === item.path ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('ts_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ts_current_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ts_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ToastContext.Provider value={{ showToast }}>
        <Router>
          <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/assessment" element={<ProtectedRoute><AssessmentFlow /></ProtectedRoute>} />
              <Route path="/asset/:id" element={<ProtectedRoute><AssetDetail /></ProtectedRoute>} />
            </Routes>
            <BottomNav />
            
            {/* Global Toast Notification */}
            {toastMessage && (
              <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
                <div className="bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border border-white/10">
                  <span className="material-symbols-outlined text-primary text-xl">info</span>
                  <span className="text-sm font-bold whitespace-nowrap">{toastMessage}</span>
                </div>
              </div>
            )}
          </div>
        </Router>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
