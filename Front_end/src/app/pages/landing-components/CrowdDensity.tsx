import { useEffect, useRef, useState } from 'react';
import { Users, TrendingUp, AlertTriangle, MapPin, Activity } from 'lucide-react';

const heatmapData = [
  [10,20,45,80,95,90,70,40,20,10],[15,35,60,85,100,95,75,50,25,12],
  [20,45,75,90,95,85,65,45,30,15],[25,55,80,88,80,72,58,38,22,10],
  [30,50,70,78,72,60,45,30,18,8],[20,38,55,65,60,50,35,22,12,5],
  [12,25,40,50,48,38,28,16,8,3],[8,15,25,35,32,25,18,10,5,2],
];

const zones = [
  { name: 'Main Plaza', density: 95, count: '1,240', status: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { name: 'Entry Gate A', density: 78, count: '890', status: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { name: 'Corridor B', density: 45, count: '420', status: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { name: 'Parking Zone', density: 22, count: '180', status: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
];

function getHeatColor(value: number): string {
  if (value >= 80) return `rgba(239,68,68,${Math.min(1, value/100*1.1)})`;
  if (value >= 60) return `rgba(249,115,22,${value/100*0.85})`;
  if (value >= 40) return `rgba(234,179,8,${value/100*0.8})`;
  if (value >= 20) return `rgba(34,211,238,${value/100*0.7})`;
  return `rgba(0,245,255,${Math.max(0.05, value/100*0.4)})`;
}

function CrowdLineChart({ visible }: { visible: boolean }) {
  const points = [30,45,38,62,55,80,95,88,72,85,90,78];
  const max = 100; const w = 280; const h = 80; const sx = w/(points.length-1);
  const pathD = points.map((p,i) => `${i===0?'M':'L'} ${i*sx} ${h-(p/max)*h}`).join(' ');
  const areaD = pathD + ` L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(0,245,255,0.3)" /><stop offset="100%" stopColor="rgba(0,245,255,0.01)" /></linearGradient></defs>
      <path d={areaD} fill="url(#ag)" />
      <path d={pathD} fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="1000" strokeDashoffset={visible ? '0' : '1000'} style={{ transition: 'stroke-dashoffset 2s ease' }} />
      {visible && points.map((p,i) => (
        <circle key={i} cx={i*sx} cy={h-(p/max)*h} r="2.5" fill="#00f5ff" style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.8))' }} />
      ))}
    </svg>
  );
}

export default function CrowdDensity() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="crowd-density" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(0,245,255,0.04), transparent 50%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <Users className="w-3.5 h-3.5 text-cyan-400" /><span className="text-cyan-400 font-mono text-xs tracking-widest">CROWD INTELLIGENCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-white">Smart </span><span className="gradient-text">Crowd Density</span><span className="text-white"> Analysis</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Real-time crowd intelligence with AI-powered heatmaps, panic detection, and predictive density modeling.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.7s ease 0.2s' }}>
            <div className="glass-dark rounded-2xl p-5 neon-border h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">REAL-TIME CROWD HEATMAP</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="text-xs font-mono text-gray-500">LIVE</span></div>
              </div>
              <div className="relative rounded-xl overflow-hidden p-3" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: '1px solid rgba(0,245,255,0.15)' }}>
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative grid gap-1" style={{ gridTemplateRows: 'repeat(8, 1fr)', gridTemplateColumns: 'repeat(10, 1fr)' }}>
                  {heatmapData.map((row, ri) => row.map((cell, ci) => (
                    <div key={`${ri}-${ci}`} className="rounded-sm transition-all" style={{ height: '28px', background: visible ? getHeatColor(cell) : 'transparent', transitionDelay: `${(ri*10+ci)*15}ms`, boxShadow: cell >= 80 ? '0 0 6px rgba(239,68,68,0.4)' : 'none' }} />
                  )))}
                </div>
                <div className="absolute top-3 left-3"><div className="text-xs font-mono text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30">ZONE_A: CRITICAL</div></div>
                <div className="absolute top-3 right-3"><div className="text-xs font-mono text-amber-400 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/30">ZONE_B: MEDIUM</div></div>
                <div className="absolute top-8 left-16 w-4 h-4 rounded-full border-2 border-red-400 animate-ping opacity-60" />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-mono">LOW</span>
                  <div className="flex gap-0.5">{['rgba(0,245,255,0.3)','rgba(234,179,8,0.5)','rgba(249,115,22,0.6)','rgba(239,68,68,0.8)'].map((c,i) => (<div key={i} className="w-6 h-2.5 rounded-sm" style={{ background: c }} />))}</div>
                  <span className="text-xs text-gray-600 font-mono">HIGH</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[['2,847','Total People','text-cyan-400',Users],['3','High Risk Zones','text-red-400',AlertTriangle],['68%','Avg Density','text-amber-400',Activity]].map(([v,l,c,I]) => {
                  const Icon = I as typeof Users;
                  return (<div key={l} className="glass rounded-lg p-3"><div className="flex items-center gap-2 mb-1"><Icon className={`w-3.5 h-3.5 ${c}`} /><span className="text-xs text-gray-500 font-mono">{l}</span></div><div className={`text-xl font-bold ${c}`}>{v}</div></div>);
                })}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2"><span className="text-xs font-mono text-gray-500">CROWD FLOW (LAST 12 MIN)</span><TrendingUp className="w-3.5 h-3.5 text-cyan-400" /></div>
                <CrowdLineChart visible={visible} />
              </div>
            </div>
          </div>

          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.7s ease 0.3s' }}>
            <div className="glass-dark rounded-2xl p-5 neon-border h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">ZONE ANALYSIS</span></div>
              <div className="space-y-3 flex-1">
                {zones.map((zone,i) => (
                  <div key={zone.name} className={`rounded-xl p-4 border ${zone.bg} ${zone.border} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-start justify-between mb-2">
                      <div><div className="text-sm font-semibold text-slate-850 dark:text-white">{zone.name}</div><div className={`text-xs font-mono ${zone.color}`}>{zone.status}</div></div>
                      <div className="text-right"><div className={`text-lg font-bold ${zone.color}`}>{zone.count}</div><div className="text-xs text-gray-600">people</div></div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: visible ? `${zone.density}%` : '0%', transitionDelay: `${i*150+400}ms`, background: zone.density>=80?'linear-gradient(90deg,#ef4444,#f97316)':zone.density>=60?'linear-gradient(90deg,#f97316,#eab308)':zone.density>=40?'linear-gradient(90deg,#eab308,#22d3ee)':'linear-gradient(90deg,#22d3ee,#00f5ff)' }} />
                    </div>
                    <div className="flex justify-between mt-1"><span className="text-xs text-gray-600 font-mono">Density</span><span className={`text-xs font-mono ${zone.color}`}>{zone.density}%</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl p-4 bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-xs font-mono text-red-400">PANIC DETECTION</span><div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping ml-auto" /></div>
                <p className="text-xs text-gray-500">Anomalous dispersal pattern detected in Zone A. Monitoring for escalation.</p>
                <button className="mt-2 w-full text-xs font-mono text-red-400 border border-red-500/30 rounded-lg py-1.5 hover:bg-red-500/10 transition-all">ALERT RESPONSE TEAM</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
