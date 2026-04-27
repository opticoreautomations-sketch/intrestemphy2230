import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Eye, 
  CheckCircle, 
  BarChart3, 
  Plus, 
  Trash2, 
  FileUp, 
  Link as LinkIcon,
  Video,
  Settings,
  TrendingUp,
  ClipboardCheck,
  BarChart2,
  PieChart as PieChartIcon,
  UserCheck,
  Activity,
  MessageSquare,
  Star as StarIcon
} from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'content' | 'students' | 'materials' | 'feedback'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getStats();
      setStudents(data.students || []);
      setStats(data);
      
      const feedbackData = await api.feedback.getAll();
      setFeedback(feedbackData);
    } catch (error) {
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    try {
      await api.admin.deleteStudent(id);
      toast.success('تم حذف الطالب بنجاح');
      fetchDashboardData();
    } catch (error) {
      toast.error('فشل حذف الطالب');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-text">
            <Settings className="text-primary" />
            لوحة تحكم المعلم
          </h1>
          
          <div className="flex bg-text/5 p-1 rounded-xl flex-wrap justify-center border border-border/50">
            <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="الإحصائيات" icon={<BarChart3 size={18} />} />
            <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} label="الدروس" icon={<Video size={18} />} />
            <TabButton active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} label="المصادر الخارجية" icon={<FileUp size={18} />} />
            <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} label="آراء الطلاب" icon={<MessageSquare size={18} />} />
            <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} label="الطلاب" icon={<Users size={18} />} />
          </div>
        </div>

        {activeTab === 'stats' && <StatsView stats={stats} />}
        {activeTab === 'content' && <ContentView />}
        {activeTab === 'materials' && <MaterialsView />}
        {activeTab === 'feedback' && <FeedbackView feedback={feedback} />}
        {activeTab === 'students' && <StudentsView students={students} onDelete={deleteStudent} />}
      </div>
    </div>
  );
};

const FeedbackView: React.FC<{ feedback: any[] }> = ({ feedback }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedback.length === 0 ? (
        <div className="glass-card p-12 text-center col-span-full shadow-lg">
          <MessageSquare className="mx-auto text-text/10 mb-4" size={48} />
          <p className="text-text/40 font-bold italic">لا يوجد تقييمات بعد</p>
        </div>
      ) : (
        feedback.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon 
                      key={s} 
                      size={16} 
                      fill={item.rating >= s ? 'currentColor' : 'none'} 
                      className={item.rating >= s ? 'text-primary' : 'text-text/10'}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-text/40 font-bold font-mono">
                  {new Date(item.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
              
              <h4 className="font-bold text-sm mb-1 text-text">{item.student_name}</h4>
              <p className="text-xs text-primary mb-3 font-bold">درس: {item.lesson_title}</p>
              
              <p className="text-text/70 text-sm italic leading-relaxed border-r-2 border-primary/20 pr-4 font-medium">
                "{item.comment || 'بدون تعليق'}"
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold ${active ? 'bg-primary text-dark' : 'text-text/60 hover:text-text hover:bg-text/5'}`}
  >
    {icon}
    {label}
  </button>
);

const COLORS = ['#00E676', '#00B0FF', '#FF5252', '#FFD600', '#AA00FF'];

const StatsView: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الطلاب" value={stats.totalStudents} icon={<Users />} color="border-primary" />
        <StatCard title="إجمالي المشاهدات" value={stats.totalViews} icon={<Eye />} color="border-blue-500" />
        <StatCard title="متوسط المشاهدات" value={(stats.totalViews / (stats.totalStudents || 1)).toFixed(1)} icon={<TrendingUp />} color="border-purple-500" />
        <StatCard title="نشاط اليوم" value={stats.recentActivity?.length || 0} icon={<Activity />} color="border-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Views by Lesson Chart */}
        <div className="glass-card p-6 shadow-lg border border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-text">
            <BarChart2 className="text-primary" size={20} />
            المشاهدات حسب الدرس
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.viewsByLesson}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="title" stroke="currentColor" className="text-text/50" fontSize={10} tick={false} />
                <YAxis stroke="currentColor" className="text-text/50" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                />
                <Bar dataKey="views" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6 shadow-lg border border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-text">
            <PieChartIcon className="text-blue-500" size={20} />
            توزيع المشاهدات (مفتوح vs مغلق)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="views"
                  nameKey="category"
                >
                  {stats.categoryStats?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Students */}
        <div className="glass-card p-6 lg:col-span-1 shadow-lg border border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-text">
            <UserCheck className="text-yellow-500" size={20} />
            الطلاب الأكثر تفاعلاً
          </h3>
          <div className="space-y-4">
            {stats.topStudents?.map((student: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-text/5 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-bold text-text">{student.full_name}</span>
                </div>
                <span className="text-[10px] font-bold text-text/60 px-2 py-0.5 bg-text/5 rounded-full">{student.total_views} مشاهدة</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 lg:col-span-2 shadow-lg border border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-text">
            <Activity className="text-purple-500" size={20} />
            آخر النشاطات
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-text/40 text-xs border-b border-border">
                  <th className="pb-3 font-bold">الطالب</th>
                  <th className="pb-3 font-bold">الدرس</th>
                  <th className="pb-3 font-bold">الوقت</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentActivity?.map((act: any, idx: number) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-text/5 transition-colors group">
                    <td className="py-3 font-bold text-text group-hover:text-primary transition-colors">{act.full_name}</td>
                    <td className="py-3 text-text/60 font-medium">{act.title}</td>
                    <td className="py-3 text-xs text-text/40 font-mono font-bold">
                      {new Date(act.last_accessed).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: any; icon: React.ReactNode; color?: string }> = ({ title, value, icon, color = "border-primary" }) => (
  <div className={`glass-card p-6 flex items-center gap-4 border-l-4 shadow-md ${color}`}>
    <div className="bg-primary/10 p-3 rounded-xl text-primary shadow-inner">
      {icon}
    </div>
    <div>
      <div className="text-text/40 text-xs font-bold uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold text-text">{value}</div>
    </div>
  </div>
);

const ContentView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'open' | 'close'>('open');
  const [lessons, setLessons] = useState<any[]>([]);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    pdf_url: '',
    booklet_url: '',
    test_url: ''
  });
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, [selectedCategory]);

  const fetchLessons = async () => {
    try {
      const data = await api.lessons.getByCategory(selectedCategory);
      setLessons(data);
    } catch (error) {
      toast.error('فشل تحميل الدروس');
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('يرجى إدخال عنوان الدرس');
      return;
    }
    try {
      await api.lessons.save({ 
        id: editingLesson?.id,
        category: selectedCategory, 
        ...formData 
      });
      toast.success(editingLesson ? 'تم تحديث الدرس' : 'تم إضافة الدرس بنجاح');
      setFormData({ title: '', description: '', video_url: '', pdf_url: '', booklet_url: '', test_url: '' });
      setEditingLesson(null);
      fetchLessons();
    } catch (error) {
      toast.error('فشل حفظ الدرس');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      await api.lessons.delete(id.toString());
      toast.success('تم حذف الدرس');
      fetchLessons();
    } catch (error) {
      toast.error('فشل حذف الدرس');
    }
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      pdf_url: lesson.pdf_url || '',
      booklet_url: lesson.booklet_url || '',
      test_url: lesson.test_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (field: keyof typeof formData, file: File) => {
    setUploading(field);
    try {
      const { url } = await api.admin.upload(file);
      setFormData(prev => ({ ...prev, [field]: url }));
      toast.success('تم رفع الملف بنجاح');
    } catch (error) {
      toast.error('فشل رفع الملف');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 max-w-3xl mx-auto shadow-xl border border-border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
          <Plus className="text-primary" />
          {editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}
        </h2>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => { setSelectedCategory('open'); setEditingLesson(null); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-sm ${selectedCategory === 'open' ? 'bg-primary text-dark' : 'bg-text/5 text-text/60 border border-border/50'}`}
          >
            الفيديو المفتوح
          </button>
          <button 
            onClick={() => { setSelectedCategory('close'); setEditingLesson(null); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-sm ${selectedCategory === 'close' ? 'bg-primary text-dark' : 'bg-text/5 text-text/60 border border-border/50'}`}
          >
            الفيديو المغلق
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-text/70 block font-bold">عنوان الدرس</label>
            <input 
              type="text" 
              className="input-field w-full" 
              placeholder="مثال: مقدمة في الميكانيكا"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text/70 block font-bold">وصف الدرس</label>
            <textarea 
              className="input-field w-full min-h-[100px] py-4" 
              placeholder="اكتب وصفاً موجزاً لمحتوى الدرس..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <InputGroup 
            label="ملف الفيديو (Video)" 
            icon={<Video size={18} />} 
            value={formData.video_url} 
            onChange={(v) => setFormData({...formData, video_url: v})}
            onUpload={(file) => handleFileUpload('video_url', file)}
            isUploading={uploading === 'video_url'}
            accept="video/*"
          />
          <InputGroup 
            label="ملف الـ PDF" 
            icon={<FileUp size={18} />} 
            value={formData.pdf_url} 
            onChange={(v) => setFormData({...formData, pdf_url: v})}
            onUpload={(file) => handleFileUpload('pdf_url', file)}
            isUploading={uploading === 'pdf_url'}
            accept=".pdf"
          />
          <InputGroup 
            label="ملف الكتيب (Booklet)" 
            icon={<FileUp size={18} />} 
            value={formData.booklet_url} 
            onChange={(v) => setFormData({...formData, booklet_url: v})}
            onUpload={(file) => handleFileUpload('booklet_url', file)}
            isUploading={uploading === 'booklet_url'}
            accept=".pdf,.doc,.docx"
          />
          <InputGroup 
            label="رابط الاختبار (Test)" 
            icon={<LinkIcon size={18} />} 
            value={formData.test_url} 
            onChange={(v) => setFormData({...formData, test_url: v})} 
            onUpload={(file) => handleFileUpload('test_url', file)}
            isUploading={uploading === 'test_url'}
          />
          
          <div className="flex gap-4">
            <button onClick={handleSave} className="btn-primary flex-1 shadow-lg shadow-primary/20">
              {editingLesson ? 'تحديث الدرس' : 'إضافة الدرس'}
            </button>
            {editingLesson && (
              <button 
                onClick={() => { setEditingLesson(null); setFormData({ title: '', description: '', video_url: '', pdf_url: '', booklet_url: '', test_url: '' }); }}
                className="bg-text/10 hover:bg-text/20 text-text px-6 py-3 rounded-xl transition-all font-bold"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 max-w-5xl mx-auto shadow-lg border border-border">
        <h3 className="text-xl font-bold mb-6 text-text">قائمة الدروس الحالية ({selectedCategory === 'open' ? 'المفتوحة' : 'المغلقة'})</h3>
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <p className="text-center text-text/40 py-8 italic font-bold">لا توجد دروس مضافة بعد في هذا القسم</p>
          ) : (
            lessons.map(lesson => (
              <div key={lesson.id} className="flex items-center justify-between p-4 bg-text/5 rounded-xl border border-border/50 hover:border-primary/50 transition-all group">
                <div>
                  <h4 className="font-bold text-lg text-text group-hover:text-primary transition-colors">{lesson.title}</h4>
                  <p className="text-[10px] text-text/40 font-bold">تاريخ الإضافة: {new Date(lesson.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(lesson)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all shadow-sm"
                    title="تعديل"
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(lesson.id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all shadow-sm"
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ 
  label: string; 
  icon: React.ReactNode; 
  value: string; 
  onChange: (v: string) => void;
  onUpload?: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
}> = ({ label, icon, value, onChange, onUpload, isUploading, accept }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm text-text/70 flex items-center justify-between font-bold">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {onUpload && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`text-[10px] px-3 py-1 rounded-lg flex items-center gap-1 transition-all font-bold ${isUploading ? 'bg-primary/20 text-primary shadow-inner' : 'bg-text/5 hover:bg-text/10 text-text/60 hover:text-text border border-border/50 shadow-sm'}`}
          >
            <FileUp size={12} />
            {isUploading ? 'جاري الرفع...' : 'رفع ملف'}
          </button>
        )}
      </label>
      <div className="relative">
        <input 
          type="text" 
          className="input-field w-full pr-10" 
          placeholder="أدخل الرابط هنا أو ارفع ملفاً..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {onUpload && (
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        )}
      </div>
    </div>
  );
};

const MaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', url: '', type: 'pdf' as 'pdf' | 'link' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await api.materials.getAll();
      setMaterials(data);
    } catch (error) {
      toast.error('فشل تحميل المصادر');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    try {
      await api.materials.create(formData);
      toast.success('تم إضافة المصدر بنجاح');
      setFormData({ title: '', url: '', type: 'pdf' });
      fetchMaterials();
    } catch (error) {
      toast.error('فشل إضافة المصدر');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المصدر؟')) return;
    try {
      await api.materials.delete(id);
      toast.success('تم حذف المصدر');
      fetchMaterials();
    } catch (error) {
      toast.error('فشل حذف المصدر');
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await api.admin.upload(file);
      setFormData(prev => ({ ...prev, url, type: 'pdf' }));
      toast.success('تم رفع الملف بنجاح');
    } catch (error) {
      toast.error('فشل رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 max-w-3xl mx-auto shadow-xl border border-border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
          <Plus className="text-primary" />
          إضافة مصدر خارجي (PDF أو رابط)
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-text/70 block font-bold">عنوان المصدر</label>
            <input 
              type="text" 
              className="input-field w-full" 
              placeholder="مثال: ملخص قوانين الميكانيكا"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setFormData({...formData, type: 'pdf'})}
              className={`flex-1 py-2 rounded-lg text-sm transition-all shadow-sm ${formData.type === 'pdf' ? 'bg-primary text-dark font-bold' : 'bg-text/5 text-text/60 border border-border/50'}`}
            >
              ملف PDF
            </button>
            <button 
              onClick={() => setFormData({...formData, type: 'link'})}
              className={`flex-1 py-2 rounded-lg text-sm transition-all shadow-sm ${formData.type === 'link' ? 'bg-primary text-dark font-bold' : 'bg-text/5 text-text/60 border border-border/50'}`}
            >
              رابط خارجي
            </button>
          </div>

          {formData.type === 'pdf' ? (
            <InputGroup 
              label="ملف الـ PDF" 
              icon={<FileUp size={18} />} 
              value={formData.url} 
              onChange={(v) => setFormData({...formData, url: v})}
              onUpload={handleFileUpload}
              isUploading={uploading}
              accept=".pdf"
            />
          ) : (
            <InputGroup 
              label="الرابط" 
              icon={<LinkIcon size={18} />} 
              value={formData.url} 
              onChange={(v) => setFormData({...formData, url: v})}
            />
          )}

          <button onClick={handleSave} className="btn-primary w-full py-3 shadow-lg shadow-primary/20">
            حفظ المصدر
          </button>
        </div>
      </div>

      <div className="glass-card p-6 max-w-5xl mx-auto shadow-lg border border-border">
        <h3 className="text-xl font-bold mb-6 text-text">المصادر المضافة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.length === 0 ? (
            <p className="text-center text-text/40 py-8 col-span-full italic font-bold">لا توجد مصادر مضافة بعد</p>
          ) : (
            materials.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-text/5 rounded-xl border border-border/50 hover:border-primary/50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg shadow-inner ${item.type === 'pdf' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {item.type === 'pdf' ? <FileUp size={20} /> : <LinkIcon size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-text group-hover:text-primary transition-colors">{item.title}</h4>
                    <span className="text-[10px] text-text/40 font-bold uppercase tracking-wider">{item.type === 'pdf' ? 'ملف PDF' : 'رابط'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={item.url.startsWith('/') ? item.url : item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all shadow-sm"
                  >
                    <Eye size={18} />
                  </a>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StudentsView: React.FC<{ students: any[]; onDelete: (id: string) => void }> = ({ students, onDelete }) => (
  <div className="glass-card overflow-hidden shadow-lg border border-border">
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead className="bg-text/5 border-b border-border">
          <tr>
            <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">اسم الطالب</th>
            <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">البريد الإلكتروني</th>
            <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">تاريخ الانضمام</th>
            <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {students.map(student => (
            <tr key={student.id} className="hover:bg-text/5 transition-colors group">
              <td className="p-4 font-bold text-text group-hover:text-primary transition-colors">{student.full_name}</td>
              <td className="p-4 text-text/60 font-medium">{student.email || 'غير متوفر'}</td>
              <td className="p-4 text-text/40 text-sm font-bold font-mono">{new Date(student.created_at).toLocaleDateString('ar-EG')}</td>
              <td className="p-4">
                <button 
                  onClick={() => onDelete(student.id)}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={4} className="p-12 text-center text-text/40 italic font-bold">لا يوجد طلاب مسجلين حالياً</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
