import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Video, VideoOff, GraduationCap, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            أهلاً بك، <span className="text-primary">{profile?.full_name || 'طالبنا العزيز'}</span>
          </motion.h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            اختر المسار التعليمي الذي ترغب في استكشافه اليوم. رحلة الفيزياء تبدأ من هنا.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((num) => (
            <motion.div
              key={num}
              whileHover={{ scale: 1.02 }}
              className="glass-card overflow-hidden group"
            >
              <div className="h-32 bg-primary/10 flex items-center justify-center relative">
                <GraduationCap size={48} className="text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-center">الدرس {num}</h2>
                <p className="text-white/60 text-sm mb-6 text-center">
                  محتوى تعليمي شامل للدرس {num} يتضمن فيديو، ملفات، واختبارات.
                </p>
                <Link 
                  to={`/learning/lesson${num}`} 
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2"
                >
                  ابدأ الدرس
                  <ChevronLeft size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-20">
          <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <GraduationCap className="text-primary" />
                تقدمك الدراسي
              </h3>
              <p className="text-white/60">
                تابع إنجازاتك ونتائج الاختبارات التي أجريتها مؤخراً.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-white/5 rounded-2xl min-w-[120px]">
                <div className="text-primary text-3xl font-bold">0</div>
                <div className="text-xs text-white/40">دروس مكتملة</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-2xl min-w-[120px]">
                <div className="text-primary text-3xl font-bold">0</div>
                <div className="text-xs text-white/40">اختبارات منجزة</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
