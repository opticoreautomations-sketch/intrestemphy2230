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
  Settings
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
  Line
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'content' | 'students'>('stats');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalViews: 0,
    totalTests: 0,
    avgScore: 0
  });
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
      setStats({
        totalStudents: data.totalStudents,
        activeStudents: Math.floor(data.totalStudents * 0.8),
        totalViews: data.totalViews,
        totalTests: 450,
        avgScore: 85
      });
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

const StatsView: React.FC<{ stats: any }> = ({ stats }) => {
  const chartData = [
    { name: 'السبت', value: 400 },
    { name: 'الأحد', value: 300 },
    { name: 'الاثنين', value: 600 },
    { name: 'الثلاثاء', value: 800 },
    { name: 'الأربعاء', value: 500 },
    { name: 'الخميس', value: 900 },
    { name: 'الجمعة', value: 200 },
  ];

  const pieData = [
    { name: 'مكتمل', value: 400 },
    { name: 'قيد التقدم', value: 300 },
    { name: 'لم يبدأ', value: 300 },
  ];

  const COLORS = ['#FFC107', '#4CAF50', '#F44336'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="إجمالي الطلاب" value={stats.totalStudents} icon={<Users />} />
        <StatCard title="الطلاب النشطين" value={stats.activeStudents} icon={<CheckCircle />} />
        <StatCard title="مشاهدات الفيديو" value={stats.totalViews} icon={<Eye />} />
        <StatCard title="الاختبارات المنجزة" value={stats.totalTests} icon={<ClipboardCheck size={24} />} />
        <StatCard title="متوسط الدرجات" value={`${stats.avgScore}%`} icon={<BarChart3 />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6">نمو تسجيل الطلاب</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #ffffff20' }} />
                <Line type="monotone" dataKey="value" stroke="#FFC107" strokeWidth={3} dot={{ fill: '#FFC107' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6">إنجاز الدورات</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: any; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="glass-card p-6 flex items-center gap-4">
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
  const [selectedLesson, setSelectedLesson] = useState<'lesson1' | 'lesson2' | 'lesson3' | 'lesson4'>('lesson1');
  const [formData, setFormData] = useState({
    video_url: '',
    pdf_url: '',
    booklet_url: '',
    test_url: ''
  });
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    api.content.get(selectedLesson).then(data => {
      if (data) {
        setFormData({
          video_url: data.video_url || '',
          pdf_url: data.pdf_url || '',
          booklet_url: data.booklet_url || '',
          test_url: data.test_url || ''
        });
      }
    });
  }, [selectedLesson]);

  const handleSave = async () => {
    try {
      await api.content.update({ type: selectedLesson, ...formData });
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      toast.error('فشل حفظ التغييرات');
    }
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
    <div className="glass-card p-8 max-w-3xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {[1, 2, 3, 4].map((num) => (
          <button 
            key={num}
            onClick={() => setSelectedLesson(`lesson${num}` as any)}
            className={`py-3 rounded-xl font-bold transition-all ${selectedLesson === `lesson${num}` ? 'bg-primary text-dark' : 'bg-white/5 text-white/60'}`}
          >
            الدرس {num}
          </button>
        ))}
      </div>

      <div className="space-y-6">
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
        
        <button onClick={handleSave} className="btn-primary w-full mt-8">حفظ التغييرات</button>
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

const ClipboardCheck: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);
