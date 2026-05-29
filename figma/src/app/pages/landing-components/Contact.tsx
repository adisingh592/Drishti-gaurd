import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', org: '', message: '' });
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.04), transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /><span className="text-cyan-400 font-mono text-xs tracking-widest">GET IN TOUCH</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-white">Ready to </span><span className="gradient-text">Deploy?</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Speak with our security specialists to architect the perfect AI surveillance solution.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.7s ease 0.2s' }}>
            <div className="space-y-4 mb-8">
              {[{icon:Mail,label:'Email',value:'security@drishti.ai',color:'text-cyan-400'},{icon:Phone,label:'Phone',value:'+1 (888) 474-7484',color:'text-blue-400'},{icon:MapPin,label:'HQ',value:'San Francisco, CA',color:'text-emerald-400'},{icon:Clock,label:'Support',value:'24/7 Global Operations',color:'text-amber-400'}].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5 flex items-center gap-4 hover:border-cyan-500/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0"><Icon className={`w-5 h-5 ${item.color}`} /></div>
                    <div><div className="text-xs text-gray-600 font-mono">{item.label}</div><div className="text-sm text-slate-850 dark:text-white font-medium">{item.value}</div></div>
                  </div>
                );
              })}
            </div>
            <div className="glass-dark rounded-xl p-4 neon-border">
              <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs font-mono text-emerald-400">LIVE INCIDENT FEED</span></div>
              <div className="space-y-2">
                {[{msg:'Weapon alert resolved — CAM_001',time:'2m ago',color:'text-red-400'},{msg:'Crowd density normalized — Plaza',time:'8m ago',color:'text-amber-400'},{msg:'New camera registered — CAM_131',time:'15m ago',color:'text-cyan-400'},{msg:'AI model updated to v4.2.1',time:'1h ago',color:'text-blue-400'}].map((item,i) => (
                  <div key={i} className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-white/5 pb-2 last:border-0">
                    <span className={`text-xs ${item.color} flex-1`}>{item.msg}</span><span className="text-xs text-gray-600 font-mono flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.7s ease 0.3s' }}>
            <div className="glass-dark rounded-2xl p-8 neon-border">
              <h3 className="text-slate-800 dark:text-white font-bold text-xl mb-6">Request a Demo</h3>
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-emerald-400" /></div>
                  <div className="text-slate-850 dark:text-white font-semibold text-lg mb-2">Message Sent!</div>
                  <p className="text-gray-500 text-sm">Our team will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-mono text-gray-500 mb-1.5 tracking-wider">FULL NAME</label>
                      <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Smith" required className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all" /></div>
                    <div><label className="block text-xs font-mono text-gray-500 mb-1.5 tracking-wider">EMAIL</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@company.com" required className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all" /></div>
                  </div>
                  <div><label className="block text-xs font-mono text-gray-500 mb-1.5 tracking-wider">ORGANIZATION</label>
                    <input type="text" value={form.org} onChange={e => setForm({...form, org: e.target.value})} placeholder="City of Mumbai / Enterprise Name" className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all" /></div>
                  <div><label className="block text-xs font-mono text-gray-500 mb-1.5 tracking-wider">MESSAGE</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your surveillance requirements..." rows={5} required className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none" /></div>
                  <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3 py-3.5 text-base"><Send className="w-4 h-4" /> Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
