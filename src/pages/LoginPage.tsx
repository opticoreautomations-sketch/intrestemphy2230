import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login({ email, password });
      toast.success(t('login.success', 'تم تسجيل الدخول بنجاح'));
      navigate(userData.role === 'teacher' ? '/admin' : '/welcome');
    } catch (error: any) {
      toast.error(error.message || t('login.error', 'فشل تسجيل الدخول'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center physics-bg px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <LogIn className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-text">{t('login.title', 'تسجيل الدخول')}</h1>
          <p className="text-text/60 font-medium">{t('login.subtitle', 'أهلاً بك في منصة الفيزياء التعليمية')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-text/70 block font-bold">{t('login.email', 'البريد الإلكتروني')}</label>
            <input 
              type="email" 
              className="input-field w-full" 
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text/70 block font-bold">{t('login.password', 'كلمة المرور')}</label>
            <input 
              type="password" 
              className="input-field w-full" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" name="forgot-password" className="text-xs text-primary hover:underline font-bold">
                {t('login.forgotPassword', 'نسيت كلمة المرور؟')}
              </Link>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? t('login.loading', 'جاري التحميل...') : t('login.submit', 'دخول')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-text/60 text-sm font-medium">
            {t('login.noAccount', 'ليس لديك حساب؟')} <Link to="/signup" name="signup-link" className="text-primary hover:underline font-bold">{t('login.createAccount', 'إنشاء حساب جديد')}</Link>
          </p>
          <div className="pt-4 border-t border-border">
            <Link to="/admin-login" name="admin-login-link" className="text-text/40 text-xs flex items-center justify-center gap-1 hover:text-primary transition-colors font-bold">
              <ShieldCheck size={14} />
              {t('login.teacherLogin', 'دخول المعلم')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
