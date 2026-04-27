import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.signup({ full_name: fullName, email, password });
      toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center physics-bg px-4 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <UserPlus className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-text">إنشاء حساب</h1>
          <p className="text-text/60 font-medium">انضم إلينا لتبدأ رحلتك التعليمية</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-text/70 block text-right font-bold">الاسم الكامل</label>
            <input 
              type="text" 
              className="input-field w-full" 
              placeholder="أدخل اسمك بالكامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text/70 block text-right font-bold">البريد الإلكتروني</label>
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
            <label className="text-sm text-text/70 block text-right font-bold">كلمة المرور</label>
            <input 
              type="password" 
              className="input-field w-full" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text/60 text-sm font-medium">
            لديك حساب بالفعل؟ <Link to="/login" name="login-link" className="text-primary hover:underline font-bold">تسجيل الدخول</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
