import { useEffect, useRef, useState } from 'react';
import { Shield, Camera, AlertTriangle, Bell, BarChart2, Settings, Activity, User, ChevronRight, TrendingUp } from 'lucide-react';

const sidebarItems = [
  { icon: BarChart2, label: 'Overview', active: true },
  { icon: Camera, label: 'Live Feeds', active: false },
  { icon: AlertTriangle, label: 'Incidents', active: false },
  { icon: Activity, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const incidents = [
  { id: '#INC-2847', type: 'Weapon Detected', cam: 'CAM-001', time: '2m ago', severity: 'CRITICAL', color: 'text-red-400', dot: 'bg-red-400' },
  { id: '#INC-2846', type: 'Intrusion Alert', cam: 'CAM-007', time: '8m ago', severity: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  { id: '#INC-2845', type: 'Crowd Surge', cam: 'CAM-014', time: '15m ago', severity: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  { id: '#INC-2844', type: 'Rash Driving', cam: 'CAM-022', time: '32m ago', severity: 'MEDIUM', color: 'text-amber-400', dot: 'bg-amber-400' },
];

function MiniLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data); const w = 80; const h = 30; const sx = w/(data.length-1);
  const d = data.map((v,i) => `${i===0?'M':'L'} ${i*sx} ${h-(v/max)*h}`).join(' ');
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><path d={d} fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export default function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="dashboard" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,245,255,0.04), transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /><span className="text-cyan-400 font-mono text-xs tracking-widest">CONTROL CENTER</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">AI Dashboard</span><span className="text-white"> Preview</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Centralized command center with real-time analytics and AI-driven surveillance insights.</p>
        </div>

        <div className="glass-dark rounded-2xl overflow-hidden neon-border" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)', transition: 'all 0.8s ease 0.2s', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.08)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/10" style={{ background: 'rgba(0,8,20,0.8)' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /></div>
              <span className="text-xs font-mono text-gray-500 ml-2">DRISHTI_GUARD • CONTROL_CENTER_v4.2</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /><span className="text-xs font-mono text-cyan-400">SECURE</span></div>
              <span className="text-xs font-mono text-gray-600">14:32:07</span>
            </div>
          </div>
          <div className="flex">
            <div className="w-14 md:w-48 border-r border-cyan-500/10 flex flex-col" style={{ background: 'rgba(0,8,20,0.6)', minHeight: '480px' }}>
              <div className="flex items-center gap-3 px-3 py-4 border-b border-cyan-500/10">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0"><Shield className="w-4 h-4 text-cyan-400" /></div>
                <span className="text-sm font-bold text-slate-800 dark:text-white hidden md:block">DRISHTI</span>
              </div>
              <div className="flex-1 py-3 space-y-1 px-2">
                {sidebarItems.map(item => { const Icon = item.icon; return (
                  <div key={item.label} className={`flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-all ${item.active ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" /><span className="text-xs font-medium hidden md:block">{item.label}</span>
                    {item.active && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-auto hidden md:block" />}
                  </div>
                ); })}
              </div>
              <div className="flex items-center gap-2 px-3 py-3 border-t border-cyan-500/10">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-cyan-400" /></div>
                <div className="hidden md:block"><div className="text-xs text-slate-850 dark:text-white font-medium">Admin</div><div className="text-xs text-gray-600 font-mono">Level 5</div></div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[['Active Cameras','128','+2','text-cyan-400',[60,70,65,80,75,90,85,100]],['Total Incidents','2,847','-5%','text-red-400',[90,85,70,80,65,55,60,50]],['Resolved Today','94','+12','text-emerald-400',[40,55,60,75,80,88,92,94]],['AI Accuracy','99.7%','+0.1','text-blue-400',[95,96,97,97,98,99,99,100]]].map(([label,value,trend,color,data]) => (
                  <div key={label as string} className="glass rounded-xl p-3 border border-slate-200 dark:border-white/5">
                    <div className="flex items-start justify-between mb-2"><div className="text-xs text-gray-500">{label}</div><span className="text-xs text-emerald-400 font-mono">{trend}</span></div>
                    <div className={`text-xl font-bold ${color} mb-2`}>{value}</div>
                    <MiniLineChart data={data as number[]} />
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 glass rounded-xl p-3 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Camera className="w-3.5 h-3.5 text-cyan-400" /><span className="text-xs font-mono text-cyan-400">LIVE FEEDS</span></div><span className="text-xs text-gray-600 font-mono">VIEW ALL</span></div>
                  <div className="grid grid-cols-3 gap-2">
                    {[{l:'CAM-001',t:true},{l:'CAM-002',t:false},{l:'CAM-003',t:false}].map(cam => (
                      <div key={cam.l} className="relative rounded-lg overflow-hidden aspect-video" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: cam.t ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(0,245,255,0.1)' }}>
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                        <div className="absolute inset-0 overflow-hidden"><div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${cam.t ? 'via-red-400/60' : 'via-cyan-400/40'} to-transparent`} style={{ animation: 'scanLine 2s linear infinite' }} /></div>
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1" style={{ background: 'rgba(2,8,20,0.9)' }}>
                          <span className="font-mono text-gray-600" style={{ fontSize: '9px' }}>{cam.l}</span>
                          <span className={`font-mono ${cam.t ? 'text-red-400 animate-blink' : 'text-emerald-400'}`} style={{ fontSize: '9px' }}>● {cam.t ? 'ALERT' : 'LIVE'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-xl p-3 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Bell className="w-3.5 h-3.5 text-red-400" /><span className="text-xs font-mono text-red-400">INCIDENTS</span></div><ChevronRight className="w-3.5 h-3.5 text-gray-600" /></div>
                  <div className="space-y-2">
                    {incidents.map(inc => (
                      <div key={inc.id} className="flex items-start gap-2 py-1.5 border-b border-slate-200 dark:border-white/5 last:border-0">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${inc.dot} ${inc.severity==='CRITICAL'?'animate-ping':''}`} />
                        <div className="flex-1 min-w-0"><div className="text-xs text-gray-300 truncate">{inc.type}</div><div className="text-xs text-gray-600 font-mono">{inc.cam} • {inc.time}</div></div>
                        <span className={`text-xs font-mono flex-shrink-0 ${inc.color}`} style={{ fontSize: '9px' }}>{inc.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
