import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول');
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
          <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
          <p className="text-white/60">أهلاً بك في منصة الفيزياء التعليمية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70 block">البريد الإلكتروني</label>
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
            <label className="text-sm text-white/70 block">كلمة المرور</label>
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
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'جاري التحميل...' : 'دخول'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-white/60 text-sm">
            ليس لديك حساب؟ <Link to="/signup" className="text-primary hover:underline">إنشاء حساب جديد</Link>
          </p>
          <div className="pt-4 border-t border-white/10">
            <Link to="/admin-login" className="text-white/40 text-xs flex items-center justify-center gap-1 hover:text-primary transition-colors">
              <ShieldCheck size={14} />
              دخول المعلم
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
