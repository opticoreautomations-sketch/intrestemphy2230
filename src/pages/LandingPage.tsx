import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { Atom, Zap, Globe, Target, ChevronLeft, ArrowRight, Video, GraduationCap, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export const LandingPage: React.FC = () => {
  const { user, isTeacher } = useAuth();
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', image_url: '' });

  const fetchSupervisors = () => {
    api.supervisors.getAll().then(setSupervisors).catch(console.error);
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const handleAddSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher) return;
    try {
      await api.supervisors.create(formData);
      toast.success('تمت إضافة المشرف بنجاح');
      setFormData({ name: '', image_url: '' });
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-1000">
          <img 
            src="https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjlmOTAyODYyNTI0ODE5MTgwNzUyYzE4ZjgzYmZlMDk6ZmlsZV8wMDAwMDAwMDE3NTQ3MWY0ODY3MTJmNWY3NjU3ZDJiNyIsInRzIjoiMjA1NzciLCJwIjoicHlpIiwiY2lkIjoiMSIsInNpZyI6IjMxZTBjNjhiNGFlNzQ4Y2FhN2I3MWVhMzhjNGFiMTA4MGM0MWU1Mjg3YWEwMGUzOGZjMGI1N2M2ZTE4NTRiNzUiLCJ2IjoiMCIsImdpem1vX2lkIjpudWxsLCJjcyI6bnVsbCwiY2RuIjpudWxsLCJmbiI6bnVsbCwiY2QiOm51bGwsImNwIjpudWxsLCJtYSI6bnVsbH0=" 
            alt="Physics Learning" 
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/80 to-bg transition-colors duration-1000" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
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
            منصة عالم الفيزياء التعليمية
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-text mb-6 leading-tight tracking-tight drop-shadow-md"
          >
            مرحباً بكم في <span className="text-primary">عالم الفيزياء</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text/80 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-bold drop-shadow-sm"
          >
            أهلاً وسهلاً بكم في منصتكم التعليمية. استكشف، تفاعل، وافهم الفيزياء بأسلوب ممتع وشيق!
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-6 justify-center items-center"
          >
            {user ? (
              <div className="flex flex-col items-center gap-6">
                <div className="glass-card px-8 py-4 border-primary/20 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-bold text-text">
                    أهلاً بك مجدداً، <span className="text-primary">{user.full_name?.split(' ')[0] || 'طالبنا العزيز'}</span>
                  </h2>
                </div>
                <Link to={isTeacher ? "/admin" : "/home"} className="btn-primary px-10 py-4 text-lg flex items-center gap-2 group shadow-lg shadow-primary/20">
                  متابعة {isTeacher ? "لوحة التحكم" : "التعلم"}
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary px-10 py-4 text-lg flex items-center gap-2 group shadow-lg shadow-primary/20">
                  ابدأ رحلتك الآن
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="glass-card hover:bg-card/50 text-text px-10 py-4 font-bold transition-all text-lg flex justify-center items-center">
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] -z-10" />
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
                الرسالة العلمية
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-text leading-tight">
                الفيزياء: رحلة في أعماق <span className="text-primary italic">الحقيقة</span>
              </h2>
              <div className="space-y-6 text-text/70 text-lg leading-relaxed">
                <p>
                  الفيزياء هي العلم الذي يربط بين الخيال والواقع؛ هي المحاولة البشرية المستمرة لفهم كيف يتحرك الإلكترون حول النواة وكيف تتصادم المجرات في أقاصي الكون.
                </p>
                <p>
                  في "عالم الفيزياء"، نسعى لتحويل المعادلات الجافة إلى تجارب بصرية نابضة بالحياة. نؤمن أن الفهم الحقيقي يبدأ عندما نرى العلم وليس فقط عندما نسمع عنه. انضم إلينا لتكتشف القوى التي تحرك حياتك وتصيغ مستقبلك.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-dark transition-colors shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1">الديناميكا</h4>
                      <p className="text-sm text-text/40">دراسة الحركة والقوى والمسببات الأساسية للتفاعل.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-dark transition-colors shrink-0">
                      <Atom size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1">ميكانيكا الكم</h4>
                      <p className="text-sm text-text/40">استكشاف العالم المجهري وأسرار الجزيئات تحت الذرية.</p>
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
                  src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=2000" 
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
                    <div className="text-xs text-text/40 font-bold uppercase tracking-wider">تركيز على الفهم العميق</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">ماذا تقدم لك المنصة؟</h2>
            <p className="text-text/40 max-w-xl mx-auto font-medium">نحن ندمج التكنولوجيا مع العلم لنقدم تجربة تعليمية لا تُنسى.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Video />, 
                title: 'شروحات مرئية', 
                desc: 'دروس فيديو تفاعلية تشرح أصعب التجارب والمفاهيم بأسلوب مبسط وممتع.' 
              },
              { 
                icon: <FileText />, 
                title: 'مذكرات شاملة', 
                desc: 'مستندات PDF تلخص المحتوى وتوفر تمارين تدريبية لتعزيز الفهم.' 
              },
              { 
                icon: <GraduationCap />, 
                title: 'اختبارات تقييمية', 
                desc: 'قياس مستواك باستمرار من خلال اختبارات ذكية بعد كل درس.' 
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

      {/* Supervisors Section */}
      <section className="py-24 px-4 bg-bg relative overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">المشرفون وصناع المحتوى</h2>
            <p className="text-text/40 max-w-xl mx-auto font-medium">فريق من الخبراء لدعم رحلتك التعليمية</p>
          </div>

          {isTeacher && (
              <div className="mb-16 glass-card p-8 border border-border max-w-2xl mx-auto relative z-20">
                <h3 className="text-2xl font-bold mb-6 text-text">إضافة مشرف جديد</h3>
                <form onSubmit={handleAddSupervisor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div>
                      <label className="block text-sm font-bold text-text/80 mb-2">اسم المشرف</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                        placeholder="أدخل اسم المشرف"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text/80 mb-2">رابط الصورة</label>
                      <input 
                        type="url" 
                        required
                        value={formData.image_url}
                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-left"
                        placeholder="https://example.com/image.jpg"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-4 bg-primary text-dark font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
                    إضافة المشرف
                  </button>
                </form>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-12 relative z-10">
              {supervisors.map((supervisor, i) => (
                <motion.div
                  key={supervisor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center group relative cursor-pointer"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-bg shadow-xl mb-6 relative group-hover:border-primary transition-colors duration-300">
                    <img 
                      src={supervisor.image_url} 
                      alt={supervisor.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">{supervisor.name}</h3>
                  {isTeacher && (
                    <button
                      onClick={(e) => handleDeleteSupervisor(supervisor.id, e)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-lg shadow-lg z-30 hover:scale-110"
                      title="حذف المشرف"
                    >
                      &times;
                    </button>
                  )}
                </motion.div>
              ))}
              {supervisors.length === 0 && !isTeacher && (
                <div className="col-span-full py-12 text-center text-text/40 font-bold italic">
                  لا يوجد مشرفين حالياً
                </div>
              )}
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
          <span>عالم الفيزياء</span>
        </div>
        <p className="text-text/20 text-sm font-medium mb-4">© 2026 جميع الحقوق محفوظة لمنصة عالم الفيزياء التعليمية</p>
        <div className="flex justify-center gap-6">
          <Link to="/contact" className="text-sm font-bold text-text/40 hover:text-primary transition-colors">تواصل معنا</Link>
          <a href="#" className="text-sm font-bold text-text/40 hover:text-primary transition-colors">سياسة الخصوصية</a>
          <a href="#" className="text-sm font-bold text-text/40 hover:text-primary transition-colors">الشروط والأحكام</a>
        </div>
      </footer>
    </div>
  );
};
