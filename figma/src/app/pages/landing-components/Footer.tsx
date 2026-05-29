import { Shield, Github, Twitter, Linkedin, Youtube, Mail, Phone } from 'lucide-react';

const links = {
  Product: ['Live Detection','AI Analytics','Threat Detection','Crowd Intelligence','Dashboard','API Docs'],
  Company: ['About Us','Careers','Press Kit','Partners','Blog','Contact'],
  Security: ['SOC 2 Compliance','GDPR Policy','Data Security','Certifications','Penetration Testing','Bug Bounty'],
  Support: ['Documentation','Developer API','Status Page','Community','FAQs','Contact Support'],
};

const socials = [
  { icon: Twitter, label: 'Twitter', color: 'hover:text-sky-400' },
  { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
  { icon: Github, label: 'GitHub', color: 'hover:text-white' },
  { icon: Youtube, label: 'YouTube', color: 'hover:text-red-400' },
];

const certs = ['SOC 2','ISO 27001','GDPR','FedRAMP','NDAA'];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 dark:border-cyan-500/10 overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }} />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center neon-glow"><Shield className="w-5 h-5 text-cyan-400" /></div>
              <div className="flex flex-col leading-tight"><span className="text-slate-800 dark:text-slate-800 dark:text-white font-bold text-lg tracking-wide">DRISHTI</span><span className="text-cyan-400 text-xs font-mono tracking-[0.2em] -mt-0.5">GUARD</span></div>
            </div>
            <p className="text-slate-600 dark:text-gray-500 text-sm leading-relaxed mb-5">Next-generation AI surveillance platform protecting cities, enterprises, and critical infrastructure worldwide.</p>
            <div className="flex gap-3 mb-5">
              {socials.map(s => { const Icon = s.icon; return (
                <button key={s.label} className={`w-8 h-8 rounded-lg glass border border-slate-200 dark:border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-gray-500 ${s.color} transition-all hover:border-cyan-500/20`} aria-label={s.label}>
                  <Icon className="w-4 h-4" />
                </button>
              ); })}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-600"><Mail className="w-3.5 h-3.5" /><span>security@drishti.ai</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-600"><Phone className="w-3.5 h-3.5" /><span>+1 (888) 474-7484</span></div>
            </div>
          </div>
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-slate-800 dark:text-slate-850 dark:text-white font-semibold text-sm mb-3 font-mono tracking-wider">{cat.toUpperCase()}</h4>
              <ul className="space-y-2">{items.map(item => <li key={item}><a href="#" className="text-slate-600 dark:text-gray-600 text-sm hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">{item}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-8 py-5 border-y border-slate-200 dark:border-slate-200 dark:border-white/5">
          <span className="text-xs text-slate-500 dark:text-gray-600 font-mono tracking-widest">CERTIFIED:</span>
          {certs.map(c => <div key={c} className="glass rounded-md px-3 py-1 border border-slate-200 dark:border-slate-200 dark:border-white/5"><span className="text-xs font-mono text-slate-600 dark:text-gray-400">{c}</span></div>)}
          <div className="ml-auto flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs font-mono text-emerald-400">ALL SYSTEMS OPERATIONAL</span></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-gray-600">&copy; 2026 Drishti Guard Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4">{['Privacy Policy','Terms of Service','Cookie Policy'].map(item => <a key={item} href="#" className="text-xs text-slate-500 dark:text-gray-600 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">{item}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}
