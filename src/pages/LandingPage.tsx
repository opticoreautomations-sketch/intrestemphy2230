import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Atom, Zap, Globe, Target, ChevronLeft, ArrowRight, Video, GraduationCap, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user, isTeacher } = useAuth();

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={isTeacher ? "/admin" : "/home"} replace />;
  }

  return (
    <div className="min-h-screen physics-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
            alt="Space Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Atom size={16} className="animate-spin-slow" />
            منصة عالم الفيزياء التعليمية
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
          >
            اكتشف أسرار <span className="text-primary italic">الكون</span> <br />
            من خلال عدسة الفيزياء
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            الفيزياء ليست مجرد مادة دراسية، بل هي لغة الطبيعة التي تفسر كل شيء حولنا، من أصغر الذرات إلى أضخم المجرات. انضم إلينا في رحلة معرفية ممتعة وتفاعلية.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup" className="btn-primary px-10 py-4 text-lg flex items-center gap-2 group">
              ابدأ رحلتك الآن
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-2xl transition-all border border-white/5 text-lg">
              تسجيل الدخول
            </Link>
          </motion.div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] -z-10" />
      </section>

      {/* Physics Bio Section */}
      <section className="py-24 px-4 bg-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                لماذا نتعلم <span className="text-primary">الفيزياء</span>؟
              </h2>
              <div className="space-y-6 text-white/70 text-lg">
                <p>
                  الفيزياء هي العلم الأساسي الذي يدرس المادة والطاقة والتفاعلات بينهما. إنها الأساس لكل العلوم والتقنيات الحديثة، من الهواتف الذكية إلى استكشاف الفضاء.
                </p>
                <p>
                  في منصتنا، لا نقدم مجرد معادلات؛ بل نبني رؤية شاملة لكيفية عمل العالم. نهدف إلى تبسيط المفاهيم المعقدة وجعل التعلم تجربة بصرية وذهنية فريدة.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">الطاقة والقوة</h4>
                      <p className="text-sm">فهم المحركات الأساسية للكون.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">الكون الفسيح</h4>
                      <p className="text-sm">من القوانين الأرضية إلى الأجرام السماوية.</p>
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
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop" 
                  alt="Physics Formulas" 
                  className="rounded-xl w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 glass-card p-6 border-primary/20 -rotate-3 hover:rotate-0 transition-transform duration-500 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark">
                    <Target size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-white/40">تركيز على الفهم العميق</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ماذا تقدم لك المنصة؟</h2>
            <p className="text-white/40 max-w-xl mx-auto">نحن ندمج التكنولوجيا مع العلم لنقدم تجربة تعليمية لا تُنسى.</p>
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
                className="glass-card p-10 hover:border-primary/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-dark transition-all">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 font-bold text-xl">
          <Atom className="text-primary" />
          <span>عالم الفيزياء</span>
        </div>
        <p className="text-white/20 text-sm">© 2026 جميع الحقوق محفوظة لمنصة عالم الفيزياء التعليمية</p>
      </footer>
    </div>
  );
};
