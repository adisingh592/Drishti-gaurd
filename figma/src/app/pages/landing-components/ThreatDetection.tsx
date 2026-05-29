import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Target, Crosshair, TrendingUp, Zap } from 'lucide-react';

const threats = [
  { id: 1, type: 'FIREARM', emoji: '🔫', confidence: 97, level: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: 'rgba(239,68,68,0.3)', desc: 'Handgun detected, suspect in sector A' },
  { id: 2, type: 'KNIFE', emoji: '🔪', confidence: 94, level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'rgba(249,115,22,0.3)', desc: 'Blade object near entry gate' },
  { id: 3, type: 'AGGRESSION', emoji: '⚡', confidence: 88, level: 'HIGH', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', glow: 'rgba(245,158,11,0.25)', desc: 'Violent movement pattern detected' },
  { id: 4, type: 'INTRUSION', emoji: '🚨', confidence: 99, level: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: 'rgba(239,68,68,0.3)', desc: 'Unauthorized perimeter breach' },
  { id: 5, type: 'RASH DRIVING', emoji: '🚗', confidence: 91, level: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: 'rgba(234,179,8,0.25)', desc: 'Speeding detected on main road' },
  { id: 6, type: 'CROWD PANIC', emoji: '👥', confidence: 85, level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'rgba(249,115,22,0.25)', desc: 'Panic dispersal pattern in plaza' },
];

const weeklyData = [40,65,30,80,55,90,45,70,35,85,60,95,50,75];

function ThreatCard({ threat, index }: { threat: typeof threats[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setVisible(true), index * 100); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className={`relative glass rounded-xl p-4 border transition-all duration-500 cursor-pointer ${threat.border}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)', transition: `opacity 0.5s ease ${index*0.08}s, transform 0.5s ease ${index*0.08}s, box-shadow 0.3s ease`, boxShadow: hovered ? `0 0 25px ${threat.glow}` : 'none' }}>
      <div className="absolute top-0 right-0 mt-3 mr-3">
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${threat.bg} ${threat.color} border ${threat.border}`}>{threat.level}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${threat.bg} border ${threat.border} flex items-center justify-center text-lg`}>{threat.emoji}</div>
        <div><div className={`text-sm font-bold font-mono ${threat.color}`}>{threat.type}</div><div className="text-xs text-gray-600">{threat.desc}</div></div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs"><span className="text-gray-500 font-mono">AI CONFIDENCE</span><span className={`font-mono font-bold ${threat.color}`}>{threat.confidence}%</span></div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: visible ? `${threat.confidence}%` : '0%', background: threat.color.includes('red') ? 'linear-gradient(90deg, #ef4444, transparent)' : threat.color.includes('orange') ? 'linear-gradient(90deg, #f97316, transparent)' : 'linear-gradient(90deg, #eab308, transparent)' }} />
        </div>
      </div>
      {hovered && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/60 to-transparent" style={{ animation: 'scanLine 1.5s linear infinite' }} />
        </div>
      )}
    </div>
  );
}

function MiniBarChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-end gap-1 h-16">
      {weeklyData.map((val, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: visible ? `${val}%` : '0%', transitionDelay: `${i*50}ms`, background: val > 80 ? 'rgba(239,68,68,0.7)' : val > 60 ? 'rgba(249,115,22,0.6)' : 'rgba(0,245,255,0.4)', boxShadow: val > 80 ? '0 0 8px rgba(239,68,68,0.4)' : 'none' }} />
      ))}
    </div>
  );
}

export default function ThreatDetection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="ai-analytics" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(239,68,68,0.04), transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0,245,255,0.04), transparent 50%)' }} />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Target className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400 font-mono text-xs tracking-widest">THREAT INTELLIGENCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text-red">AI Threat </span><span className="text-white">Detection Engine</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Multi-layer neural networks trained on millions of real-world incidents to detect and classify threats with sub-second precision.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-4">
              {threats.map((t, i) => <ThreatCard key={t.id} threat={t} index={i} />)}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.7s ease 0.3s' }}>
            <div className="glass-dark rounded-2xl p-5 neon-border">
              <div className="flex items-center justify-between mb-4"><span className="text-sm font-mono text-gray-400">THREAT SCORE</span><Crosshair className="w-4 h-4 text-red-400" /></div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#tg)" strokeWidth="10" strokeDasharray={`${2*Math.PI*50*0.82} ${2*Math.PI*50*0.18}`} strokeLinecap="round" />
                  <defs><linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="text-3xl font-black text-red-400">82</div><div className="text-xs text-gray-500 font-mono">HIGH RISK</div></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['3','Critical'],['5','High'],['8','Medium']].map(([n,l]) => (
                  <div key={l} className="glass rounded-lg py-2"><div className="text-lg font-bold text-red-400">{n}</div><div className="text-xs text-gray-600 font-mono">{l}</div></div>
                ))}
              </div>
            </div>
            <div className="glass-dark rounded-2xl p-5 neon-border">
              <div className="flex items-center justify-between mb-3"><span className="text-sm font-mono text-gray-400">WEEKLY INCIDENTS</span><TrendingUp className="w-4 h-4 text-cyan-400" /></div>
              <MiniBarChart />
              <div className="flex justify-between mt-2"><span className="text-xs text-gray-600 font-mono">MON</span><span className="text-xs text-gray-600 font-mono">TODAY</span></div>
            </div>
            <div className="glass-dark rounded-2xl p-5 neon-border">
              <div className="flex items-center gap-2 mb-3"><Zap className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">AI MODEL STATUS</span></div>
              <div className="space-y-3">
                {[['Weapon Classifier',99.7],['Behavior Analysis',96.2],['Face Recognition',98.1]].map(([name,acc]) => (
                  <div key={name as string} className="flex items-center justify-between">
                    <div><div className="text-xs text-gray-300">{name}</div><div className="text-xs text-gray-600 font-mono">{acc}% accuracy</div></div>
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs font-mono text-emerald-400">ACTIVE</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
