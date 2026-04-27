import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      toast.success('تم العثور على الحساب، يمكنك الآن تعيين كلمة مرور جديدة');
      setStep('reset');
    } catch (error: any) {
      toast.error(error.message || 'فشل العثور على الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }
    setLoading(true);
    try {
      await api.auth.resetPassword({ email, newPassword });
      toast.success('تم تغيير كلمة المرور بنجاح');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'فشل تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 flex items-center justify-center physics-bg transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-text">استعادة كلمة المرور</h1>
          <p className="text-text/60 font-medium">
            {step === 'request' 
              ? 'أدخل بريدك الإلكتروني للبدء' 
              : 'أدخل كلمة المرور الجديدة لحسابك'}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text/80 block">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full pl-10 pr-4"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-lg shadow-primary/20"
            >
              {loading ? 'جاري التحقق...' : 'متابعة'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text/80 block">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field w-full pl-10 pr-4"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text/80 block">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full pl-10 pr-4"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-lg shadow-primary/20"
            >
              {loading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
              {!loading && <CheckCircle size={20} />}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline font-bold">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
