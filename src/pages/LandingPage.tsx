import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { Atom, Zap, Globe, Target, ChevronLeft, ArrowRight, Video, GraduationCap, FileText, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export const LandingPage: React.FC = () => {
  const { user, isTeacher } = useAuth();
  const { t } = useTranslation();
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', image_url: '', bio: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSupervisors = () => {
    api.supervisors.getAll().then(setSupervisors).catch(console.error);
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.admin.upload(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      toast.error('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher) return;
    try {
      await api.supervisors.create(formData);
      toast.success('تمت إضافة المشرف بنجاح');
      setFormData({ name: '', image_url: '', bio: '' });
      fetchSupervisors();
    } catch (error: any) {
      toast.error(error.message || 'فشل إضافة المشرف');
    }
  };

  const handleDeleteSupervisor = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من حذف هذا المشرف؟')) return;
    try {
      await api.supervisors.delete(id);
      toast.success('تم حذف المشرف بنجاح');
      fetchSupervisors();
    } catch (error: any) {
      toast.error(error.message || 'فشل حذف المشرف');
    }
  };

  return (
    <div className="min-h-screen physics-bg transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 overflow-hidden min-h-[80vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjlmOTBkMmI1NGIwODE5MTg4NDU2YjU1NTQ3Mjg2ZmI6ZmlsZV8wMDAwMDAwMDgwNmM3MjQ2YmIxYzlmODJiOTFiZDAyMyIsInRzIjoiMjA1NzciLCJwIjoicHlpIiwiY2lkIjoiMSIsInNpZyI6ImI5OTFkM2IwMjQ0ZDY4MWY5YjAyMzhkMjYwYTE2NzU2NjM2NjFjYmE4ZWYzNGM5YjQ2NmQ1OTdkN2Y3NzZkZTEiLCJ2IjoiMCIsImdpem1vX2lkIjpudWxsLCJjcyI6bnVsbCwiY2RuIjpudWxsLCJmbiI6bnVsbCwiY2QiOm51bGwsImNwIjpudWxsLCJtYSI6bnVsbH0=" 
            alt="Physics Learning" 
            className="w-full h-full object-cover opacity-100 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg transition-colors duration-1000" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <img 
              src="https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=200" 
              alt="Logo" 
              className="w-8 h-8 rounded-full"
            />
            {t('landing.badge')}
          </motion.div>
          


          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-row flex-wrap justify-center gap-8 mb-16"
          >
            {supervisors.map((supervisor, i) => (
              <motion.div
                key={supervisor.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="group relative flex flex-col items-center justify-center bg-bg/40 backdrop-blur-md rounded-full border border-primary/20 hover:border-primary/50 transition-all shadow-xl overflow-hidden w-24 h-24 md:w-32 md:h-32 cursor-pointer"
              >
                <img 
                  src={supervisor.image_url} 
                  alt={supervisor.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-[10px] md:text-xs font-bold text-white leading-tight">{supervisor.name}</span>
                </div>
                {isTeacher && (
                  <button
                    onClick={(e) => handleDeleteSupervisor(supervisor.id, e)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-sm shadow-lg z-30"
                  >
                    &times;
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-10 items-center w-full px-4"
          >
            <div className="glass-card px-8 md:px-12 py-6 md:py-8 border-primary/20 bg-white/5 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] max-w-5xl mx-auto relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="relative z-10 text-text/90 text-xl md:text-4xl leading-relaxed font-black drop-shadow-2xl tracking-tight">
                {t('landing.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
              {user ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="glass-card px-8 py-4 border-primary/20 shadow-xl bg-bg/40 backdrop-blur-md">
                    <h2 className="text-2xl md:text-3xl font-bold text-text">
                      {t('landing.welcomeBack', 'أهلاً بك مجدداً،')} <span className="text-primary">{user.full_name?.split(' ')[0] || t('landing.student', 'طالبنا العزيز')}</span>
                    </h2>
                  </div>
                  <Link to={isTeacher ? "/admin" : "/home"} className="btn-primary px-12 py-5 text-xl flex items-center gap-3 group shadow-2xl shadow-primary/40">
                    {isTeacher ? t('landing.continueDashboard', 'متابعة لوحة التحكم') : t('landing.continueLearning', 'متابعة التعلم')}
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform rtl:rotate-0 ltr:rotate-180" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/signup" className="btn-primary px-12 py-5 text-xl flex items-center gap-3 group shadow-2xl shadow-primary/40">
                    {t('landing.startJourney', 'ابدأ رحلتك الآن')}
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform rtl:rotate-0 ltr:rotate-180" />
                  </Link>
                  <Link to="/login" className="glass-card bg-bg/40 backdrop-blur-md hover:bg-card/60 text-text px-12 py-5 font-bold transition-all text-xl flex justify-center items-center border-border/50">
                    {t('landing.loginToContinue', 'تسجيل الدخول')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] -z-10" />
      </section>

      {/* Supervisors Corner Section (Form Only) */}
      <section className="py-12 bg-bg/80 relative z-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {isTeacher && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-6"
            >
              <div className="bg-bg/90 backdrop-blur-md p-6 border border-primary/20 rounded-2xl shadow-xl max-w-xs w-[300px]">
                <h3 className="text-lg font-bold mb-4 text-text">{t('landing.addSupervisor', 'إضافة مشرف')}</h3>
                <form onSubmit={handleAddSupervisor} className="space-y-3">
                  <div>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-bg border border-border/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-all"
                      placeholder={t('landing.supervisorName', 'اسم المشرف')}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="url" 
                      value={formData.image_url}
                      onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                      className="flex-1 bg-bg border border-border/50 rounded-xl px-3 py-2 text-xs min-w-0 focus:outline-none focus:border-primary transition-all text-left"
                      placeholder="رابط الصورة"
                      dir="ltr"
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-primary/10 text-primary p-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all shrink-0"
                      title={t('landing.uploadImage', 'رفع صورة من الجهاز')}
                    >
                      <Upload size={16} className={uploading ? 'animate-bounce' : ''} />
                    </button>
                  </div>
                  <div>
                    <textarea
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-bg border border-border/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-all min-h-[60px]"
                      placeholder={t('landing.supervisorBio', 'نبذة عن المشرف')}
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-dark font-bold py-2 text-xs rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
                    {t('landing.add', 'إضافة')}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Physics Bio Section */}
      <section className="py-24 px-4 bg-bg relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase rounded-md">
                {t('landing.missionBadge', 'الرسالة العلمية')}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-text leading-tight">
                {t('landing.missionTitle', 'الفيزياء: رحلة في أعماق')} <span className="text-primary italic">{t('landing.missionTitleHighlight', 'الحقيقة')}</span>
              </h2>
              <div className="space-y-6 text-text/70 text-lg leading-relaxed">
                <p>
                  {t('landing.missionDesc1', 'الفيزياء هي العلم الذي يربط بين الخيال والواقع؛ هي المحاولة البشرية المستمرة لفهم كيف يتحرك الإلكترون حول النواة وكيف تتصادم المجرات في أقاصي الكون.')}
                </p>
                <p>
                  {t('landing.missionDesc2')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-dark transition-colors shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1">{t('landing.missionCard1Title', 'الديناميكا')}</h4>
                      <p className="text-sm text-text/40">{t('landing.missionCard1Desc', 'دراسة الحركة والقوى والمسببات الأساسية للتفاعل.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-dark transition-colors shrink-0">
                      <Atom size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1">{t('landing.missionCard2Title', 'ميكانيكا الكم')}</h4>
                      <p className="text-sm text-text/40">{t('landing.missionCard2Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://t4.ftcdn.net/jpg/01/02/00/87/240_F_102008713_tioUIlZW4RyKo8K6FCZ88BW239zgTdWD.jpg" 
                  alt="Interactive Physics Visualization" 
                  className="rounded-xl w-full h-[450px] object-cover shadow-2xl brightness-110"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 glass-card p-6 border-primary/20 -rotate-3 hover:rotate-0 transition-transform duration-500 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark shadow-lg shadow-primary/20">
                    <Target size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text">100%</div>
                    <div className="text-xs text-text/40 font-bold uppercase tracking-wider">{t('landing.focusBadge')}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-bg/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">{t('landing.featuresTitle')}</h2>
            <p className="text-text/40 max-w-xl mx-auto font-medium">{t('landing.featuresSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Video />, 
                title: t('landing.feature1Title', 'شروحات مرئية'), 
                desc: t('landing.feature1Desc', 'دروس فيديو تفاعلية تشرح أصعب التجارب والمفاهيم بأسلوب مبسط وممتع.') 
              },
              { 
                icon: <FileText />, 
                title: t('landing.feature2Title', 'مذكرات شاملة'), 
                desc: t('landing.feature2Desc', 'مستندات PDF تلخص المحتوى وتوفر تمارين تدريبية لتعزيز الفهم.') 
              },
              { 
                icon: <GraduationCap />, 
                title: t('landing.feature3Title', 'اختبارات تقييمية'), 
                desc: t('landing.feature3Desc', 'قياس مستواك باستمرار من خلال اختبارات ذكية بعد كل درس.') 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-10 hover:border-primary/30 transition-all group hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-dark transition-all">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text">{feature.title}</h3>
                <p className="text-text/60 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border px-4 text-center bg-bg transition-colors duration-500">
        <div className="flex items-center justify-center gap-3 mb-4 font-bold text-xl text-text">
          <img 
            src="https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=200" 
            alt="Logo" 
            className="w-10 h-10 rounded-full"
          />
          <span>{t('landing.titleHighlight')}</span>
        </div>
        <p className="text-text/20 text-sm font-medium mb-4">{t('landing.copyright')}</p>
        <div className="flex justify-center gap-6">
          <Link to="/contact" className="text-sm font-bold text-text/40 hover:text-primary transition-colors">{t('navbar.contact')}</Link>
          <a href="#" className="text-sm font-bold text-text/40 hover:text-primary transition-colors">{t('landing.privacy', 'سياسة الخصوصية')}</a>
          <a href="#" className="text-sm font-bold text-text/40 hover:text-primary transition-colors">{t('landing.terms', 'الشروط والأحكام')}</a>
        </div>
      </footer>
    </div>
  );
};
