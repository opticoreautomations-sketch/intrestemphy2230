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

  if (!user) return null;

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
            {isTeacher && (
              <Link to="/admin" className="text-white/70 hover:text-primary transition-colors flex items-center gap-1">
                <LayoutDashboard size={18} />
                لوحة التحكم
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleSignOut}
            className="text-white/70 hover:text-red-400 transition-colors p-2"
            title="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
