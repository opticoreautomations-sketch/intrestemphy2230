import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Target, 
  FileText, 
  BookOpen, 
  ClipboardCheck, 
  ArrowRight,
  PlayCircle,
  ExternalLink,
  Star,
  Send,
  X
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getEmbedUrl, isVideoFile } from '../lib/utils';

interface ContentData {
  id: number;
  type: string;
  title: string;
  video_url: string;
  pdf_url: string;
  booklet_url: string;
  test_url: string;
}

export const LearningPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (lessonId) {
      fetchContent();
      trackView();
    }
  }, [lessonId]);

  const fetchContent = async () => {
    try {
      const data = await api.lessons.getById(lessonId!);
      setContent(data);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast.error('فشل تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (!user || !lessonId) return;
    try {
      await api.progress.trackView(lessonId);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }
    setSubmitting(true);
    try {
      await api.feedback.submit({
        lesson_id: Number(lessonId),
        rating,
        comment
      });
      toast.success('شكرًا لتقييمك!');
      setShowFeedback(false);
    } catch (error) {
      toast.error('فشل إرسال التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIconClick = (url: string, title: string) => {
    if (!url) {
      toast.error('المحتوى غير متوفر حالياً');
      return;
    }
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text/60 hover:text-primary transition-colors font-bold"
          >
            <ArrowRight size={20} />
            العودة للرئيسية
          </button>
          <h1 className="text-2xl font-bold text-text">
            {content?.title || 'عرض الدرس'}
          </h1>
        </div>

        {/* Video Section */}
        <div className="glass-card overflow-hidden mb-12 aspect-video relative group shadow-2xl">
          {content?.video_url ? (
            isVideoFile(content.video_url) ? (
              <video 
                src={content.video_url} 
                className="w-full h-full" 
                controls 
                autoPlay
              />
            ) : (
              <iframe 
                src={getEmbedUrl(content.video_url)} 
                className="w-full h-full"
                allowFullScreen
                title="Physics Lesson"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-bg/50">
              <PlayCircle size={64} className="text-text/20 mb-4" />
              <p className="text-text/40 font-bold italic">الفيديو غير متوفر حالياً</p>
            </div>
          )}
        </div>

        {/* Interactive Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <IconButton 
            icon={<FileText size={32} />}
            label="ملف PDF"
            onClick={() => handleIconClick(content?.pdf_url || '', 'ملف PDF')}
            color="bg-blue-500/20 text-blue-400"
          />
          <IconButton 
            icon={<BookOpen size={32} />}
            label="الكتيب (Booklet)"
            onClick={() => handleIconClick(content?.booklet_url || '', 'الكتيب')}
            color="bg-primary/20 text-primary"
          />
          <IconButton 
            icon={<ClipboardCheck size={32} />}
            label="الاختبار (Test)"
            onClick={() => handleIconClick(content?.test_url || '', 'الاختبار')}
            color="bg-purple-500/20 text-purple-400"
          />
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setShowFeedback(true)}
            className="btn-primary py-4 px-12 text-lg flex items-center gap-3 shadow-lg shadow-primary/20"
          >
            أنهيت الدرس (تقييم)
            <Star size={20} />
          </button>
        </div>

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
              onClick={() => setShowFeedback(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card max-w-lg w-full relative z-10 p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowFeedback(false)}
                className="absolute top-4 right-4 text-text/40 hover:text-text transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-text">ما رأيك في هذا الدرس؟</h2>
              
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className={`p-2 transition-all ${rating >= s ? 'text-primary scale-110' : 'text-text/20 hover:text-text/40'}`}
                  >
                    <Star size={40} fill={rating >= s ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>

              <textarea 
                className="input-field w-full min-h-[120px] py-4 mb-6" 
                placeholder="اترك تعليقك هنا (اختياري)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button 
                onClick={handleFeedbackSubmit}
                disabled={submitting}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                <Send size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const IconButton: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  color: string;
}> = ({ icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="glass-card p-6 flex flex-col items-center gap-4 group hover:shadow-lg transition-all"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:shadow-lg ${color}`}>
      {icon}
    </div>
    <span className="font-bold text-text/80">{label}</span>
  </motion.button>
);
