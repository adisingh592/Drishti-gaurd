import { useEffect, useRef, useState } from 'react';
import { Shield, Globe, Award, Zap, Building2, Star } from 'lucide-react';

const stats = [
  { icon: Shield, value: 50000, suffix: '+', label: 'Threats Neutralized', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Globe, value: 48, suffix: '', label: 'Countries Deployed', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Building2, value: 1200, suffix: '+', label: 'Enterprise Clients', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Award, value: 99.7, suffix: '%', label: 'Detection Accuracy', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Zap, value: 50, suffix: 'ms', label: 'Alert Latency', color: 'text-red-400', bg: 'bg-red-500/10' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Client Rating', color: 'text-sky-400', bg: 'bg-sky-500/10' },
];

const trustedBy = ['INTERPOL','SMART CITIES','METRO RAIL','AIRPORTS','DEFENSE','STADIUMS','HOSPITALS','BANKS'];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60; const inc = target / steps; let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(parseFloat(cur.toFixed(target % 1 !== 0 ? 1 : 0)));
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  const display = target >= 1000 ? `${Math.floor(count / 1000)}K` : count.toString();
  return <div ref={ref} className="text-3xl md:text-4xl font-black">{display}{suffix}</div>;
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'linear-gradient(180deg, var(--background), var(--card) 50%, var(--background))' }} />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {stats.map((s, i) => { const Icon = s.icon; return (
            <div key={s.label} className="glass rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-200 dark:border-white/5 hover:border-cyan-500/20 transition-all group"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.6s ease ${i*0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} border border-current/10 flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <CountUp target={s.value} suffix={s.suffix} />
              <div className="text-xs text-slate-500 dark:text-gray-500 mt-1 font-mono leading-tight">{s.label}</div>
            </div>
          ); })}
        </div>
        <div className="text-center" style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.5s' }}>
          <div className="text-sm font-mono text-slate-500 dark:text-gray-600 tracking-widest mb-8">TRUSTED BY WORLD-CLASS ORGANIZATIONS</div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustedBy.map((org, i) => (
              <div key={org} className="glass rounded-lg px-5 py-2.5 border border-slate-200 dark:border-slate-200 dark:border-white/5 hover:border-cyan-500/20 transition-all hover:bg-cyan-500/5"
                style={{ opacity: visible ? 1 : 0, transition: `all 0.5s ease ${0.6+i*0.05}s` }}>
                <span className="text-sm font-mono font-semibold text-slate-600 dark:text-gray-400 tracking-wider">{org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
