import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Eye, Activity, Wifi, Video, Target, ChevronRight } from 'lucide-react';

const alerts = [
  { id: 1, type: 'WEAPON', sector: 'CAM_001 • Sector A', time: '0s ago', level: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 2, type: 'INTRUSION', sector: 'CAM_007 • Gate B', time: '12s ago', level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 3, type: 'CROWD SURGE', sector: 'CAM_014 • Plaza', time: '45s ago', level: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 4, type: 'RASH DRIVING', sector: 'CAM_022 • Road 5', time: '2m ago', level: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 5, type: 'PERSON DOWN', sector: 'CAM_031 • Corridor', time: '5m ago', level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

const stats = [
  { label: 'Active Feeds', value: '128', icon: Video, color: 'text-cyan-400' },
  { label: 'Objects Tracked', value: '2,847', icon: Target, color: 'text-blue-400' },
  { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-red-400' },
  { label: 'Uptime', value: '99.4%', icon: Wifi, color: 'text-emerald-400' },
];

function PulsingFeed({ threat, label }: { threat?: boolean; label: string }) {
  return (
    <div className={`relative rounded-lg overflow-hidden`} style={{ border: threat ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(0,245,255,0.2)', boxShadow: threat ? '0 0 15px rgba(239,68,68,0.2)' : '0 0 10px rgba(0,245,255,0.05)' }}>
      <div className="w-full h-full min-h-[120px] relative overflow-hidden rounded-lg" style={{ background: 'linear-gradient(135deg, #071222, #0a192f)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${threat ? 'via-red-500/80' : 'via-cyan-400/60'} to-transparent`}
            style={{ animation: `scanLine ${threat ? '1.5' : '2.5'}s linear infinite` }} />
        </div>
        {!threat && (
          <>
            <div className="absolute bottom-4 left-8 w-4 h-10 rounded-t-full bg-cyan-400/20 border border-cyan-400/30" />
            <div className="absolute bottom-4 left-16 w-4 h-8 rounded-t-full bg-cyan-400/15 border border-cyan-400/20" />
            <div className="absolute bottom-4 right-12 w-4 h-12 rounded-t-full bg-cyan-400/20 border border-cyan-400/30" />
          </>
        )}
        {threat && (
          <div className="absolute top-6 left-8 w-14 h-20 border-2 border-red-400 rounded-sm" style={{ boxShadow: '0 0 10px rgba(239,68,68,0.5)', animation: 'glowPulse 1s ease-in-out infinite' }}>
            <div className="absolute -top-5 left-0 text-xs font-mono text-red-400 bg-red-900/50 px-1 whitespace-nowrap">WEAPON 97%</div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-300" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-300" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-300" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-300" />
          </div>
        )}
        <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${threat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${threat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${threat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${threat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1" style={{ background: 'rgba(2,8,20,0.8)' }}>
          <span className="text-xs font-mono text-gray-500">{label}</span>
          <span className={`text-xs font-mono ${threat ? 'text-red-400 animate-blink' : 'text-emerald-400'}`}>● {threat ? 'ALERT' : 'LIVE'}</span>
        </div>
      </div>
    </div>
  );
}

export default function LiveDetection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setAlertIndex(i => (i + 1) % alerts.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="live-detection" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(14,165,233,0.05), transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="text-red-400 font-mono text-xs tracking-widest">LIVE MONITORING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Real-Time </span><span className="gradient-text">Detection System</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Monitor all camera feeds simultaneously with AI detection overlays and real-time alerts.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.7s ease 0.2s' }}>
            <div className="glass-dark rounded-2xl p-4 neon-border h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">MULTI-FEED SURVEILLANCE</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400 animate-ping" /><span className="text-xs font-mono text-red-400">THREAT ACTIVE</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PulsingFeed threat label="CAM_001 • SECTOR_A" />
                <PulsingFeed label="CAM_002 • ENTRY" />
                <PulsingFeed label="CAM_003 • PARKING" />
                <PulsingFeed label="CAM_004 • PLAZA" />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {stats.map(s => { const Icon = s.icon; return (
                  <div key={s.label} className="glass rounded-lg p-3 text-center">
                    <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                    <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-600 font-mono">{s.label}</div>
                  </div>
                ); })}
              </div>
            </div>
          </div>

          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.7s ease 0.3s' }}>
            <div className="glass-dark rounded-2xl p-4 neon-border h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-sm font-mono text-red-400">LIVE ALERTS</span></div>
                <span className="text-xs font-mono text-gray-500">{alerts.length} ACTIVE</span>
              </div>
              <div className="space-y-2 flex-1">
                {alerts.map((alert, i) => (
                  <div key={alert.id} className={`relative rounded-lg p-3 border transition-all ${alert.bg} ${alert.border} ${i === alertIndex ? 'scale-[1.02] shadow-lg' : 'scale-100'}`}>
                    {i === alertIndex && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-current rounded-l-lg" />}
                    <div className="flex items-start justify-between gap-2">
                      <div><div className={`text-xs font-bold font-mono ${alert.color}`}>{alert.type}</div><div className="text-xs text-gray-400 mt-0.5">{alert.sector}</div></div>
                      <div className="text-right shrink-0"><div className={`text-xs font-mono px-1.5 py-0.5 rounded ${alert.bg} ${alert.color} border ${alert.border}`}>{alert.level}</div><div className="text-xs text-gray-600 mt-1">{alert.time}</div></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <button className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-2"><Activity className="w-3.5 h-3.5" /> View All Incidents</button>
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-all">
                  <span>DISPATCH RESPONSE</span><ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
