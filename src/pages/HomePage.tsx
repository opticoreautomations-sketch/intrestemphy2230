import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Video, VideoOff, GraduationCap, ChevronLeft, ArrowRight, FileText, Link as LinkIcon, X, Clock, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'open' | 'close' | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLessonForModal, setSelectedLessonForModal] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      fetchLessons();
    }
    fetchMaterials();
  }, [selectedCategory]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const data = await api.lessons.getByCategory(selectedCategory!);
      setLessons(data);
    } catch (error) {
      toast.error('فشل تحميل الدروس');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const data = await api.materials.getAll();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to fetch materials');
    }
  };

  const handleLessonClick = async (lesson: any) => {
    setSelectedLessonForModal(lesson);
    setLoadingProgress(true);
    try {
      const progress = await api.progress.getByLesson(lesson.id);
      setLessonProgress(progress);
    } catch (error) {
      console.error('Failed to fetch progress');
    } finally {
      setLoadingProgress(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-text mb-4"
          >
            أهلاً بك، <span className="text-primary">{profile?.full_name || 'طالبنا العزيز'}</span>
          </motion.h1>
          <p className="text-text/60 text-lg max-w-2xl mx-auto font-medium">
            اختر المسار التعليمي الذي ترغب في استكشافه اليوم. رحلة الفيزياء تبدأ من هنا.
          </p>
        </header>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Open Video Path */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCategory('open')}
              className="glass-card overflow-hidden group cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all"
            >
              <div className="h-48 bg-primary/10 flex items-center justify-center relative">
                <Video size={64} className="text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-text">فيديو تفاعلي مفتوح</h2>
                <p className="text-text/60 mb-6 font-medium">
                   استكشف المفاهيم الفيزيائية من خلال تجربة فيديو تفاعلية مفتوحة تتيح لك حرية التنقل.
                </p>
                <div className="btn-primary w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  عرض الدروس
                  <ChevronLeft size={20} />
                </div>
              </div>
            </motion.div>

            {/* Close Video Path */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCategory('close')}
              className="glass-card overflow-hidden group cursor-pointer border-2 border-transparent hover:border-text/20 transition-all"
            >
              <div className="h-48 bg-text/5 flex items-center justify-center relative">
                <VideoOff size={64} className="text-text/40 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-text">فيديو تفاعلي مغلق</h2>
                <p className="text-text/60 mb-6 font-medium">
                  مسار تعليمي محكم يضمن تسلسل الأفكار وبناء المعرفة خطوة بخطوة.
                </p>
                <div className="btn-primary w-full flex items-center justify-center gap-2 shadow-lg shadow-white/10 dark:shadow-none">
                  عرض الدروس
                  <ChevronLeft size={20} />
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-text/60 hover:text-primary transition-colors font-bold"
              >
                <ArrowRight size={20} />
                العودة للمسارات
              </button>
              <h2 className="text-2xl font-bold text-text">
                دروس {selectedCategory === 'open' ? 'الفيديو المفتوح' : 'الفيديو المغلق'}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.length === 0 ? (
                  <div className="col-span-full text-center py-20 glass-card">
                    <p className="text-text/40 font-bold italic">لا توجد دروس مضافة في هذا القسم حالياً</p>
                  </div>
                ) : (
                  lessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="h-32 bg-primary/10 flex items-center justify-center relative">
                        <GraduationCap size={48} className="text-primary group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold mb-2 text-center text-text">{lesson.title}</h2>
                        <p className="text-text/60 text-sm mb-6 text-center line-clamp-2 font-medium">
                          محتوى تعليمي شامل يتضمن فيديو، ملفات، واختبارات.
                        </p>
                        <div className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2 shadow-md shadow-primary/10">
                          تفاصيل الدرس
                          <ChevronLeft size={16} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Lesson Details Modal */}
        <AnimatePresence>
          {selectedLessonForModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
                onClick={() => setSelectedLessonForModal(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-card max-w-lg w-full relative z-10 overflow-hidden shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedLessonForModal(null)}
                  className="absolute top-4 right-4 p-2 bg-text/5 hover:bg-text/10 rounded-lg text-text/40 hover:text-text transition-all z-20"
                >
                  <X size={20} />
                </button>

                <div className="h-40 bg-primary/10 flex items-center justify-center relative">
                  <GraduationCap size={72} className="text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="inline-block px-3 py-1 bg-primary text-dark text-[10px] font-bold rounded-full mb-2">
                      {selectedLessonForModal.category === 'open' ? 'مسار مفتوح' : 'مسار مغلق'}
                    </span>
                    <h2 className="text-2xl font-bold text-text">{selectedLessonForModal.title}</h2>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text/90">عن هذا الدرس</h3>
                    <p className="text-text/60 leading-relaxed font-medium">
                      {selectedLessonForModal.description || 'هذا الدرس مصمم لتعميق فهمك لمبادئ الفيزياء. يتضمن المحتوى شرحاً مرئياً مفصلاً، مذكرات للتحميل، واختباراً تقييمياً لقياس مستوى استيعابك.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-bg rounded-2xl border border-border">
                      <div className="flex items-center gap-2 text-primary mb-2 text-sm font-bold">
                        <Activity size={16} />
                        مرات المشاهدة
                      </div>
                      <div className="text-2xl font-bold text-text">
                        {loadingProgress ? '...' : (lessonProgress?.views || 0)}
                      </div>
                    </div>
                    <div className="p-4 bg-bg rounded-2xl border border-border">
                      <div className="flex items-center gap-2 text-primary mb-2 text-sm font-bold">
                        <Clock size={16} />
                        آخر دخول
                      </div>
                      <div className="text-xs font-bold text-text/80">
                        {loadingProgress ? '...' : (lessonProgress?.last_accessed ? new Date(lessonProgress.last_accessed).toLocaleDateString('ar-EG') : 'لم يبدأ بعد')}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/learning/${selectedLessonForModal.id}`)}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
                  >
                    ابدأ الدرس الآن
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* General Materials Section */}
        {!selectedCategory && materials.length > 0 && (
          <section className="mt-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-text">
               <FileText className="text-primary" />
               المصادر والمذكرات العامة
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {materials.map((item) => (
                 <motion.a
                   key={item.id}
                   whileHover={{ y: -5 }}
                   href={item.url}
                   target="_blank"
                   rel="noreferrer"
                   className="glass-card p-5 flex items-center gap-4 border border-border hover:border-primary/30 transition-all group shadow-sm"
                 >
                   <div className={`p-3 rounded-xl ${item.type === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                     {item.type === 'pdf' ? <FileText size={20} /> : <LinkIcon size={20} />}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors text-text">{item.title}</h4>
                     <p className="text-[10px] text-text/40 mt-1 font-bold">{item.type === 'pdf' ? 'ملف PDF' : 'رابط خارجي'}</p>
                   </div>
                   <ChevronLeft size={16} className="text-text/20 group-hover:text-primary group-hover:translate-x-[-4px] transition-all" />
                 </motion.a>
               ))}
             </div>
          </section>
        )}

        <section className="mt-20">
          <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
             <div className="flex-1">
               <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-text">
                 <GraduationCap className="text-primary" />
                 تقدمك الدراسي
               </h3>
               <p className="text-text/60 font-medium">
                 تابع إنجازاتك ونتائج الاختبارات التي أجريتها مؤخراً.
               </p>
             </div>
             <div className="flex gap-4">
               <div className="text-center p-4 bg-bg rounded-2xl min-w-[120px] border border-border">
                 <div className="text-primary text-3xl font-bold">0</div>
                 <div className="text-xs text-text/40 font-bold uppercase">دروس مكتملة</div>
               </div>
               <div className="text-center p-4 bg-bg rounded-2xl min-w-[120px] border border-border">
                 <div className="text-primary text-3xl font-bold">0</div>
                 <div className="text-xs text-text/40 font-bold uppercase">اختبارات منجزة</div>
               </div>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};
