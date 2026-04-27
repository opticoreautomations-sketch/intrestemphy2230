import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isTeacher, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-primary font-bold text-xl flex items-center gap-2">
            <span className="bg-primary text-dark w-8 h-8 rounded-lg flex items-center justify-center">P</span>
            فيزياء
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/70 hover:text-primary transition-colors">الرئيسية</Link>
            {user && isTeacher && (
              <Link to="/admin" className="text-white/70 hover:text-primary transition-colors flex items-center gap-1">
                <LayoutDashboard size={18} />
                لوحة التحكم
              </Link>
            )}
            {user && !isTeacher && (
              <Link to="/home" className="text-white/70 hover:text-primary transition-colors flex items-center gap-1">
                <BookOpen size={18} />
                دروسي
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={handleSignOut}
              className="group flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 px-4 py-2 rounded-xl transition-all border border-white/5"
            >
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-white/70 hover:text-white px-4 py-2">دخول</Link>
              <Link to="/signup" className="btn-primary px-6 py-2 text-sm">تسجيل</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
