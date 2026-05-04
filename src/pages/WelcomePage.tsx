import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Atom, Rocket, Sparkles, GraduationCap } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4000); // 4 seconds welcome screen

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center physics-bg overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20"
        >
          <Atom size={400} className="text-primary/20" />
        </motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -bottom-40 -right-40"
        >
          <Sparkles size={500} className="text-blue-500/10" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-xl w-full relative z-10 shadow-2xl border-primary/20 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-40 opacity-80 z-0">
          <img 
            src="https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjlmOTAyOWVhODAwODE5MWJjNjA0NmIzOWYwOTZiNTU6ZmlsZV8wMDAwMDAwMGU4ODQ3MjBjYmE0MDE4MTRkYTM5NWM1ZSIsInRzIjoiMjA1NzciLCJwIjoicHlpIiwiY2lkIjoiMSIsInNpZyI6IjQ0ZGVkNmQ5YjgwYWVlZWM0MGY3NjY0NmRhNzBkNTUzYTA3MmJhOTcyNGRlMjJhMGY0YTY0YWY2OTk2NWNjNTYiLCJ2IjoiMCIsImdpem1vX2lkIjpudWxsLCJjcyI6bnVsbCwiY2RuIjpudWxsLCJmbiI6bnVsbCwiY2QiOm51bGwsImNwIjpudWxsLCJtYSI6bnVsbH0=" 
            alt="Welcome Header" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/95"></div>
        </div>

        <div className="relative z-10 pt-16">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto bg-primary/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-inner backdrop-blur-sm border border-primary/30"
          >
            <GraduationCap className="text-primary" size={48} />
          </motion.div>

          <motion.h1 
            key={user?.full_name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 text-text leading-tight"
          >
            مرحباً بك مجدداً، <span className="text-primary">{user?.full_name?.split(' ')[0]}</span>!
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-text/70 text-lg mb-8 font-medium italic"
          >
            "العلم هو ما نعرفه، والفلسفة هي ما لا نعرفه." - برتراند راسل
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="h-1 bg-primary/30 rounded-full overflow-hidden mb-8"
          >
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-primary"
            />
          </motion.div>

          <div className="flex items-center justify-center gap-6 text-text/40">
            <div className="flex flex-col items-center gap-2">
              <Rocket size={20} className="animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-widest">جاهز للإنطلاق</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">استكشف الجديد</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
