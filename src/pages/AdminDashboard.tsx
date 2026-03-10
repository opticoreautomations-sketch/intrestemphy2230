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
  Activity
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
  const [activeTab, setActiveTab] = useState<'stats' | 'content' | 'students'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
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
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="text-primary" />
            لوحة تحكم المعلم
          </h1>
          
          <div className="flex bg-white/5 p-1 rounded-xl">
            <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="الإحصائيات" icon={<BarChart3 size={18} />} />
            <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} label="إدارة المحتوى" icon={<FileUp size={18} />} />
            <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} label="الطلاب" icon={<Users size={18} />} />
          </div>
        </div>

        {activeTab === 'stats' && <StatsView stats={stats} />}
        {activeTab === 'content' && <ContentView />}
        {activeTab === 'students' && <StudentsView students={students} onDelete={deleteStudent} />}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${active ? 'bg-primary text-dark font-bold' : 'text-white/60 hover:text-white'}`}
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
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart2 className="text-primary" size={20} />
            المشاهدات حسب الدرس
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.viewsByLesson}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="title" stroke="rgba(255,255,255,0.5)" fontSize={10} tick={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00E676' }}
                />
                <Bar dataKey="views" fill="#00E676" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Students */}
        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserCheck className="text-yellow-500" size={20} />
            الطلاب الأكثر تفاعلاً
          </h3>
          <div className="space-y-4">
            {stats.topStudents?.map((student: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium">{student.full_name}</span>
                </div>
                <span className="text-xs text-white/60">{student.total_views} مشاهدة</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity className="text-purple-500" size={20} />
            آخر النشاطات
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-white/40 text-xs border-b border-white/10">
                  <th className="pb-3 font-medium">الطالب</th>
                  <th className="pb-3 font-medium">الدرس</th>
                  <th className="pb-3 font-medium">الوقت</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentActivity?.map((act: any, idx: number) => (
                  <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3">{act.full_name}</td>
                    <td className="py-3 text-white/60">{act.title}</td>
                    <td className="py-3 text-xs text-white/40">
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
  <div className={`glass-card p-6 flex items-center gap-4 border-l-4 ${color}`}>
    <div className="bg-primary/10 p-3 rounded-xl text-primary">
      {icon}
    </div>
    <div>
      <div className="text-white/40 text-xs">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  </div>
);

const ContentView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'open' | 'close'>('open');
  const [lessons, setLessons] = useState<any[]>([]);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
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
      setFormData({ title: '', video_url: '', pdf_url: '', booklet_url: '', test_url: '' });
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
      <div className="glass-card p-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="text-primary" />
          {editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}
        </h2>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => { setSelectedCategory('open'); setEditingLesson(null); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedCategory === 'open' ? 'bg-primary text-dark' : 'bg-white/5 text-white/60'}`}
          >
            الفيديو المفتوح
          </button>
          <button 
            onClick={() => { setSelectedCategory('close'); setEditingLesson(null); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedCategory === 'close' ? 'bg-primary text-dark' : 'bg-white/5 text-white/60'}`}
          >
            الفيديو المغلق
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-white/70">عنوان الدرس</label>
            <input 
              type="text" 
              className="input-field w-full" 
              placeholder="مثال: مقدمة في الميكانيكا"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <InputGroup 
            label="رابط الفيديو (Video)" 
            icon={<Video size={18} />} 
            value={formData.video_url} 
            onChange={(v) => setFormData({...formData, video_url: v})}
            onUpload={(file) => handleFileUpload('video_url', file)}
            isUploading={uploading === 'video_url'}
          />
          <InputGroup 
            label="رابط ملف الـ PDF" 
            icon={<FileUp size={18} />} 
            value={formData.pdf_url} 
            onChange={(v) => setFormData({...formData, pdf_url: v})}
            onUpload={(file) => handleFileUpload('pdf_url', file)}
            isUploading={uploading === 'pdf_url'}
          />
          <InputGroup 
            label="رابط الكتيب (Booklet)" 
            icon={<FileUp size={18} />} 
            value={formData.booklet_url} 
            onChange={(v) => setFormData({...formData, booklet_url: v})}
            onUpload={(file) => handleFileUpload('booklet_url', file)}
            isUploading={uploading === 'booklet_url'}
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
            <button onClick={handleSave} className="btn-primary flex-1">
              {editingLesson ? 'تحديث الدرس' : 'إضافة الدرس'}
            </button>
            {editingLesson && (
              <button 
                onClick={() => { setEditingLesson(null); setFormData({ title: '', video_url: '', pdf_url: '', booklet_url: '', test_url: '' }); }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 max-w-5xl mx-auto">
        <h3 className="text-xl font-bold mb-6">قائمة الدروس الحالية ({selectedCategory === 'open' ? 'المفتوحة' : 'المغلقة'})</h3>
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <p className="text-center text-white/40 py-8">لا توجد دروس مضافة بعد في هذا القسم</p>
          ) : (
            lessons.map(lesson => (
              <div key={lesson.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-all group">
                <div>
                  <h4 className="font-bold text-lg">{lesson.title}</h4>
                  <p className="text-xs text-white/40">تاريخ الإضافة: {new Date(lesson.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(lesson)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
                    title="تعديل"
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(lesson.id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
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
}> = ({ label, icon, value, onChange, onUpload, isUploading }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70 flex items-center justify-between">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {onUpload && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-1 transition-colors disabled:opacity-50"
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

const StudentsView: React.FC<{ students: any[]; onDelete: (id: string) => void }> = ({ students, onDelete }) => (
  <div className="glass-card overflow-hidden">
    <table className="w-full text-right">
      <thead className="bg-white/5 border-b border-white/10">
        <tr>
          <th className="p-4">اسم الطالب</th>
          <th className="p-4">البريد الإلكتروني</th>
          <th className="p-4">تاريخ الانضمام</th>
          <th className="p-4">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-4 font-bold">{student.full_name}</td>
            <td className="p-4 text-white/60">{student.email || 'غير متوفر'}</td>
            <td className="p-4 text-white/40 text-sm">{new Date(student.created_at).toLocaleDateString('ar-EG')}</td>
            <td className="p-4">
              <button 
                onClick={() => onDelete(student.id)}
                className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;
