import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, LayoutDashboard, BookOpen, Sun, Moon, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isTeacher, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/welcome') return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=200" 
              alt="Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
            />
            <span className="text-primary font-bold text-xl">عالم الفيزياء</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-text/70 hover:text-primary transition-colors font-medium">الرئيسية</Link>
            {user && isTeacher && (
              <Link to="/admin" className="text-text/70 hover:text-primary transition-colors flex items-center gap-1 font-medium">
                <LayoutDashboard size={18} />
                لوحة التحكم
              </Link>
            )}
            <Link to="/contact" className="text-text/70 hover:text-primary transition-colors flex items-center gap-1 font-medium">
              <MessageSquare size={18} />
              تواصل معنا
            </Link>
            {user && !isTeacher && (
              <Link to="/home" className="text-text/70 hover:text-primary transition-colors flex items-center gap-1 font-medium">
                <BookOpen size={18} />
                دروسي
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-card border border-border text-text/70 hover:text-primary transition-all active:scale-90"
            title={theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <button 
              onClick={handleSignOut}
              className="group flex items-center gap-2 bg-card hover:bg-red-500/10 text-text/70 hover:text-red-400 px-4 py-2 rounded-xl transition-all border border-border"
            >
              <LogOut size={18} />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-text/70 hover:text-text px-4 py-2 font-medium">دخول</Link>
              <Link to="/signup" className="btn-primary px-6 py-2 text-sm">تسجيل</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
