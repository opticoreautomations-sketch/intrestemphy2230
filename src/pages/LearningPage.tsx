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
  ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getEmbedUrl, isVideoFile } from '../lib/utils';

interface ContentData {
  id: string;
  type: string;
  video_url: string;
  pdf_url: string;
  booklet_url: string;
  test_url: string;
}

export const LearningPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleIconClick = (url: string, title: string) => {
    if (!url) {
      toast.error('المحتوى غير متوفر حالياً');
      return;
    }
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
          >
            <ArrowRight size={20} />
            العودة للرئيسية
          </button>
          <h1 className="text-2xl font-bold">
            {content?.title || 'عرض الدرس'}
          </h1>
        </div>

        {/* Video Section */}
        <div className="glass-card overflow-hidden mb-12 aspect-video relative group">
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
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5">
              <PlayCircle size={64} className="text-white/20 mb-4" />
              <p className="text-white/40">الفيديو غير متوفر حالياً</p>
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
    className="glass-card p-6 flex flex-col items-center gap-4 group"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:shadow-lg ${color}`}>
      {icon}
    </div>
    <span className="font-bold text-white/80">{label}</span>
  </motion.button>
);
