import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, Send, MapPin, Facebook, Instagram, Youtube, Globe, MessageCircle } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

export const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('يرجى ملء كافة الحقول الأساسية');
      return;
    }

    setLoading(true);
    try {
      await api.contact.sendMessage(formData);
      toast.success('تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('فشل إرسال الرسالة، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 physics-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-primary/20 rounded-2xl mb-4"
          >
            <MessageSquare size={32} className="text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-text mb-4"
          >
            تواصل معنا
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text/60 max-w-2xl mx-auto font-medium"
          >
            نحن هنا لمساعدتك في رحلتك العلمية. لديك سؤال أو اقتراح؟ لا تتردد في مراسلتنا.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 border-primary/20 shadow-xl">
              <h2 className="text-2xl font-bold text-text mb-8 border-r-4 border-primary pr-4">معلومات الاتصال</h2>
              
              <div className="space-y-6">
                <ContactInfoItem 
                  icon={<MessageCircle className="text-primary" size={24} />} 
                  title="واتساب" 
                  value="054 341 8667" 
                  href="https://wa.me/966543418667"
                />
                <ContactInfoItem 
                  icon={<Mail className="text-primary" size={24} />} 
                  title="البريد الإلكتروني" 
                  value="support@physics-platform.com" 
                />
                <ContactInfoItem 
                  icon={<MapPin className="text-primary" size={24} />} 
                  title="المقر الرئيسي" 
                  value="القاهرة، مصر" 
                />
              </div>

              <div className="mt-12">
                <h3 className="text-sm font-bold text-text/40 uppercase tracking-widest mb-6">تابعنا على</h3>
                <div className="flex gap-4">
                  <SocialIcon icon={<Facebook size={20} />} href="#" />
                  <SocialIcon icon={<Instagram size={20} />} href="#" />
                  <SocialIcon icon={<Youtube size={20} />} href="#" />
                  <SocialIcon icon={<Globe size={20} />} href="#" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-primary/5 border border-primary/10">
              <p className="text-sm text-text/70 italic leading-relaxed text-center font-medium">
                "الذكاء ليس مجرد معرفة، بل هو أيضاً القدرة على تطبيق المعرفة في الممارسة العملية."
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 border-border/50 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60 pr-2">الاسم بالكامل</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-text/5 border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors text-right"
                    placeholder="أدخل اسمك..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60 pr-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-text/5 border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors text-right font-mono"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text/60 pr-2">الموضوع</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-text/5 border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors text-right"
                  placeholder="كيف يمكننا مساعدتك؟"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text/60 pr-2">الرسالة</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-text/5 border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors min-h-[150px] resize-none text-right"
                  placeholder="اكتب تفاصيل رسالتك هنا..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? 'جاري الإرسال...' : (
                  <>
                    <span>إرسال الرسالة</span>
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ContactInfoItem: React.FC<{ icon: React.ReactNode; title: string; value: string; href?: string }> = ({ icon, title, value, href }) => {
  const content = (
    <div className="flex items-start gap-4 cursor-pointer group">
      <div className="p-3 bg-text/5 rounded-xl border border-border/50 group-hover:border-primary/30 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-text/40 mb-1">{title}</h4>
        <p className="text-text font-bold text-lg">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
  }

  return content;
};

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a 
    href={href} 
    className="p-3 bg-text/5 hover:bg-primary hover:text-dark text-text/60 rounded-xl transition-all border border-border/50 hover:border-primary"
  >
    {icon}
  </a>
);
