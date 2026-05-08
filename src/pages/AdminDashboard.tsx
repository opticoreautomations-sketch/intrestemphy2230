import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
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
  Star as StarIcon,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Upload
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
  const [activeTab, setActiveTab] = useState<'stats' | 'content' | 'students' | 'materials' | 'feedback' | 'supervisors'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await api.admin.getStats();
      const studentsList = statsData.students || [];
      const pendingCount = studentsList.filter((s: any) => !s.access_open && !s.access_close).length;
      setStats({ ...statsData, pendingCount });
      setStudents(studentsList);
      
      const allLessons = await api.lessons.getAll ? await api.lessons.getAll() : await api.lessons.getByCategory('open'); // Fallback
      setLessons(Array.isArray(allLessons) ? allLessons : []);

      const allMaterials = await api.materials.getAll();
      setMaterials(allMaterials);
      
      const feedbackData = await api.feedback.getAll();
      setFeedback(feedbackData);

      const supervisorsData = await api.supervisors.getAll();
      setSupervisors(supervisorsData);
    } catch (error) {
      console.error(error);
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

  const updateStudentAccess = async (id: string, access: { access_open: boolean; access_close: boolean }) => {
    try {
      await api.admin.updateStudentAccess(id, access);
      toast.success('تم تحديث صلاحيات الوصول');
      fetchDashboardData();
    } catch (error) {
      toast.error('فشل تحديث الصلاحيات');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Persistent Sidebar / Quick Info */}
          <aside className="lg:w-80 space-y-6">
            <div className="glass-card p-6 shadow-xl border border-border flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=200" 
                  alt="Logo" 
                  className="w-20 h-20 rounded-full border-4 border-primary/20 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-dark p-1.5 rounded-full shadow-md">
                  <UserCheck size={14} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-text mb-1">{user?.full_name || 'الأستاذ'}</h2>
              <p className="text-text/40 text-xs font-bold uppercase tracking-widest mb-4">المسؤول الرئيسي</p>
              
              <div className="w-full grid grid-cols-2 gap-2 mb-4">
                <div className="bg-text/5 p-3 rounded-xl border border-border/50">
                  <div className="text-primary font-bold text-lg">{students.length || 0}</div>
                  <div className="text-[10px] text-text/40 font-bold uppercase">طالب</div>
                </div>
                <div className="bg-text/5 p-3 rounded-xl border border-border/50">
                  <div className="text-blue-400 font-bold text-lg">{lessons.length || 0}</div>
                  <div className="text-[10px] text-text/40 font-bold uppercase">درس</div>
                </div>
              </div>

              <div className="w-full space-y-4 pt-4 border-t border-border/50">
                <div className="text-right">
                  <h4 className="text-[10px] font-bold text-text/30 uppercase mb-2">أحدث الدروس</h4>
                  <div className="space-y-2">
                    {lessons.slice(0, 3).map(l => (
                      <div key={l.id} className="flex items-center gap-2 text-right">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[11px] text-text/70 font-bold truncate">{l.title}</span>
                      </div>
                    ))}
                    {lessons.length === 0 && <p className="text-[10px] text-text/20 italic">لا يوجد دروس بعد</p>}
                  </div>
                </div>
                
                <div className="text-right">
                  <h4 className="text-[10px] font-bold text-text/30 uppercase mb-2">أحدث الطلاب</h4>
                  <div className="space-y-2">
                    {students.slice(0, 3).map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-right">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-[11px] text-text/70 font-bold truncate">{s.full_name}</span>
                      </div>
                    ))}
                    {students.length === 0 && <p className="text-[10px] text-text/20 italic">لا يوجد طلاب بعد</p>}
                  </div>
                </div>
              </div>
            </div>

            <nav className="glass-card overflow-hidden shadow-lg border border-border">
              <div className="p-4 border-b border-border bg-text/5">
                <h3 className="text-xs font-bold text-text/40 uppercase tracking-wider">القائمة الرئيسية</h3>
              </div>
              <div className="p-2 space-y-1">
                <NavButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="الإحصائيات العامة" icon={<BarChart3 size={18} />} />
                <NavButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} label="إدارة الدروس" icon={<Video size={18} />} />
                <NavButton active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} label="المصادر الخارجية" icon={<FileUp size={18} />} />
                <NavButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} label="آراء الطلاب" icon={<MessageSquare size={18} />} />
                <NavButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} label="قائمة الطلاب" icon={<Users size={18} />} />
                <NavButton active={activeTab === 'supervisors'} onClick={() => setActiveTab('supervisors')} label="إدارة المشرفين" icon={<Users size={18} />} />
              </div>
            </nav>

            <div className="glass-card p-4 shadow-md border border-border bg-primary/5">
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <div className="flex items-center gap-2 text-primary">
                  <Activity size={16} />
                  <span className="text-xs font-bold">مزامنة البيانات</span>
                </div>
              </div>
              <p className="text-[10px] text-text/40 mb-3 font-medium">مزامنة الدروس والمصادر من منصة خارجية.</p>
              <button 
                onClick={async () => {
                  const url = "https://intrestemphy2230-4568.onrender.com/admin";
                  toast.loading('جاري مزامنة البيانات...', { id: 'sync' });
                  try {
                    const res = await (api.admin as any).importFromExternal(url);
                    toast.success(res.message, { id: 'sync' });
                    fetchDashboardData();
                  } catch (e) {
                    toast.error('فشل المزامنة. تأكد من أن المنصة الخارجية متاحة.', { id: 'sync' });
                  }
                }}
                className="w-full py-2 bg-text/5 hover:bg-text/10 text-text/80 rounded-lg text-[11px] font-bold border border-border/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} className="text-primary" />
                استيراد من المنصة السابقة
              </button>
            </div>

            <div className="glass-card p-4 shadow-md border border-border bg-primary/5">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Activity size={18} />
                <span className="text-sm font-bold">الحالة النظام</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-text/60">يعمل بكفاءة</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-3 text-text mb-2">
                {activeTab === 'stats' && <BarChart3 className="text-primary" />}
                {activeTab === 'content' && <Video className="text-primary" />}
                {activeTab === 'materials' && <FileUp className="text-primary" />}
                {activeTab === 'feedback' && <MessageSquare className="text-primary" />}
                {activeTab === 'students' && <Users className="text-primary" size={24} />}
                {activeTab === 'supervisors' && <span className="text-primary"><Users size={24} /></span>}
                {activeTab === 'stats' ? 'نظرة عامة على الإحصائيات' : 
                 activeTab === 'content' ? 'إدارة محتوى الدروس' :
                 activeTab === 'materials' ? 'إدارة المصادر الخارجية' :
                 activeTab === 'supervisors' ? 'إدارة المشرفين' :
                 activeTab === 'feedback' ? 'متابعة تقييمات الطلاب' : 'إدارة الطلاب المستفيدين'}
              </h1>
              <p className="text-text/60 font-medium">أهلاً بك مجدداً، استمر في مراقبة وتطوير منصتك التعليمية.</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'stats' && <StatsView stats={stats} />}
                {activeTab === 'content' && <ContentView lessons={lessons} onRefresh={fetchDashboardData} />}
                {activeTab === 'materials' && <MaterialsView materials={materials} onRefresh={fetchDashboardData} />}
                {activeTab === 'feedback' && <FeedbackView feedback={feedback} />}
                {activeTab === 'students' && <StudentsView students={students} onDelete={deleteStudent} onUpdateAccess={updateStudentAccess} />}
                {activeTab === 'supervisors' && <SupervisorsView supervisors={supervisors} onRefresh={fetchDashboardData} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold group ${active ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-text/60 hover:text-text hover:bg-text/5'}`}
  >
    <span className={`${active ? 'text-dark' : 'text-primary group-hover:scale-110 transition-transform'}`}>{icon}</span>
    <span className="text-sm">{label}</span>
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
        <StatCard title="بانتظار التفعيل" value={stats.pendingCount || 0} icon={<ShieldAlert className="text-red-500" />} color="border-red-500" />
        <StatCard title="إجمالي المشاهدات" value={stats.totalViews} icon={<Eye />} color="border-blue-500" />
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

const ContentView: React.FC<{ lessons: any[]; onRefresh: () => void }> = ({ lessons: allLessons, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<'open' | 'close'>('open');
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
  const [sortBy, setSortBy] = useState<string>('newest');

  const lessons = allLessons.filter(l => l.category === selectedCategory);

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
      onRefresh();
    } catch (error) {
      toast.error('فشل حفظ الدرس');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      await api.lessons.delete(id.toString());
      toast.success('تم حذف الدرس');
      onRefresh();
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text">قائمة الدروس الحالية ({selectedCategory === 'open' ? 'المفتوحة' : 'المغلقة'})</h3>
          
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-text/5 border border-border/50 text-text text-xs rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-primary/50 font-bold cursor-pointer"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="title-asc">الاسم (أ-ي)</option>
              <option value="title-desc">الاسم (ي-أ)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-4">
          {lessons.length === 0 ? (
            <p className="text-center text-text/40 py-8 italic font-bold">لا توجد دروس مضافة بعد في هذا القسم</p>
          ) : (
            [...lessons]
              .sort((a, b) => {
                if (sortBy === 'title-asc') return a.title.localeCompare(b.title, 'ar');
                if (sortBy === 'title-desc') return b.title.localeCompare(a.title, 'ar');
                if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                return 0;
              })
              .map(lesson => (
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

const MaterialsView: React.FC<{ materials: any[]; onRefresh: () => void }> = ({ materials, onRefresh }) => {
  const [formData, setFormData] = useState({ title: '', url: '', type: 'pdf' as 'pdf' | 'link' | 'test' });
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    try {
      await api.materials.create(formData);
      toast.success('تم إضافة المصدر بنجاح');
      setFormData({ title: '', url: '', type: 'pdf' });
      onRefresh();
    } catch (error) {
      toast.error('فشل إضافة المصدر');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المصدر؟')) return;
    try {
      await api.materials.delete(id);
      toast.success('تم حذف المصدر');
      onRefresh();
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
          إضافة مصدر خارجي (PDF، رابط، أو اختبار)
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
            <button 
              onClick={() => setFormData({...formData, type: 'test'})}
              className={`flex-1 py-2 rounded-lg text-sm transition-all shadow-sm ${formData.type === 'test' ? 'bg-primary text-dark font-bold' : 'bg-text/5 text-text/60 border border-border/50'}`}
            >
              اختبار
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
          ) : formData.type === 'link' ? (
            <InputGroup 
              label="الرابط" 
              icon={<LinkIcon size={18} />} 
              value={formData.url} 
              onChange={(v) => setFormData({...formData, url: v})}
            />
          ) : (
            <InputGroup 
              label="رابط الاختبار (Google Forms, Microsoft Forms...)" 
              icon={<Activity size={18} />} 
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
                  <div className={`p-2 rounded-lg shadow-inner ${item.type === 'pdf' ? 'bg-red-500/10 text-red-500' : item.type === 'test' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {item.type === 'pdf' ? <FileUp size={20} /> : item.type === 'test' ? <Activity size={20} /> : <LinkIcon size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-text group-hover:text-primary transition-colors">{item.title}</h4>
                    <span className="text-[10px] text-text/40 font-bold uppercase tracking-wider">{item.type === 'pdf' ? 'ملف PDF' : item.type === 'test' ? 'اختبار' : 'رابط'}</span>
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

const StudentsView: React.FC<{ students: any[]; onDelete: (id: string) => void; onUpdateAccess: (id: string, access: { access_open: boolean; access_close: boolean }) => void }> = ({ students, onDelete, onUpdateAccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const isInactive = !s.access_open && !s.access_close;
    if (filter === 'pending') return matchesSearch && isInactive;
    if (filter === 'active') return matchesSearch && !isInactive;
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 border border-border bg-text/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text/30" size={18} />
          <input
            type="text"
            placeholder="بحث عن طالب باسمه أو بريده..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg border border-border/50 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-primary transition-all text-right"
          />
        </div>
        <div className="flex bg-bg p-1 rounded-xl border border-border/50">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-primary text-dark shadow-sm' : 'text-text/40 hover:text-text'}`}
          >الكل</button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${filter === 'pending' ? 'bg-red-500 text-white shadow-sm' : 'text-text/40 hover:text-text'}`}
          >بانتظار التفعيل</button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${filter === 'active' ? 'bg-blue-500 text-white shadow-sm' : 'text-text/40 hover:text-text'}`}
          >النشطاء</button>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-text/5 border-b border-border">
              <tr>
                <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">اسم الطالب</th>
                <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">البريد الإلكتروني</th>
                <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs text-center">الفيديو المفتوح</th>
                <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs text-center">الفيديو المغلق</th>
                <th className="p-4 text-text/50 font-bold uppercase tracking-wider text-xs">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-text/5 transition-colors group">
                  <td className="p-4 font-bold text-text group-hover:text-primary transition-colors">
                    <div className="flex flex-col">
                      <span>{student.full_name}</span>
                      <span className="text-[10px] text-text/30 font-normal">{new Date(student.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text/60 font-medium">{student.email || 'غير متوفر'}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onUpdateAccess(student.id, { access_open: !student.access_open, access_close: !!student.access_close })}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${student.access_open ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-text/5 text-text/40 border border-border/50'}`}
                    >
                      {student.access_open ? 'مفعل' : 'معطل'}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onUpdateAccess(student.id, { access_open: !!student.access_open, access_close: !student.access_close })}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${student.access_close ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-text/5 text-text/40 border border-border/50'}`}
                    >
                      {student.access_close ? 'مفعل' : 'معطل'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUpdateAccess(student.id, { access_open: true, access_close: true })}
                        title="تفعيل كامل للوصول"
                        className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-dark rounded-lg transition-all"
                      >
                        <ShieldCheck size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(student.id)}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text/40 italic font-bold">لا يوجد نتائج لهذا البحث أو الفلتر</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SupervisorsView: React.FC<{ supervisors: any[]; onRefresh: () => void }> = ({ supervisors, onRefresh }) => {
  const [formData, setFormData] = useState({ name: '', image_url: '', bio: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.supervisors.create(formData);
      toast.success('تمت إضافة المشرف بنجاح');
      setFormData({ name: '', image_url: '', bio: '' });
      onRefresh();
    } catch (error) {
      toast.error('فشل إضافة المشرف');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشرف؟')) return;
    try {
      await api.supervisors.delete(id);
      toast.success('تم حذف المشرف');
      onRefresh();
    } catch (error) {
      toast.error('فشل حذف المشرف');
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="glass-card shadow-lg border border-border p-6">
        <h3 className="text-xl font-bold mb-4 text-text">إضافة مشرف جديد</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text/80 mb-2">اسم المشرف</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-bg border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 mb-2">رابط صورة المشرف (URL)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-bg border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all text-left"
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
                  className="bg-primary/10 text-primary p-2 py-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all shrink-0"
                  title="رفع صورة من الجهاز"
                >
                  <Upload size={18} className={uploading ? 'animate-bounce' : ''} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-text/80 mb-2">نبذة عن المشرف (Bio)</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-bg border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all text-right min-h-[100px]"
              placeholder="اكتب نبذة مختصرة هنا..."
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-primary text-dark font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all">
            إضافة مشرف
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {supervisors.map(sup => (
          <div key={sup.id} className="glass-card p-4 border border-border flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20 shrink-0">
              <img src={sup.image_url} alt={sup.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-text mb-2 text-center">{sup.name}</h4>
            {sup.bio && <p className="text-sm text-text/60 text-center mb-4 line-clamp-3">{sup.bio}</p>}
            <button 
              onClick={() => handleDelete(sup.id)}
              className="mt-auto px-4 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-sm font-bold w-full"
            >
              حذف
            </button>
          </div>
        ))}
        {supervisors.length === 0 && (
          <div className="col-span-full py-12 text-center text-text/40 font-bold italic">
            لا يوجد مشرفين حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
