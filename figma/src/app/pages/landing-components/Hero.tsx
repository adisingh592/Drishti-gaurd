import { useEffect, useRef, useState } from 'react';
import { Play, Upload, Shield, Activity, AlertTriangle, Eye, Cpu } from 'lucide-react';
import { Link } from 'react-router';

const floatingCards = [
  { id: 1, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'THREAT DETECTED', value: 'Weapon Alert', sub: 'Sector 7', pulse: true },
  { id: 2, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'CROWD DENSITY', value: '2,847 People', sub: 'High Risk Zone', pulse: false },
  { id: 3, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'ACTIVE CAMERAS', value: '128 / 130', sub: '98.4% Uptime', pulse: false },
  { id: 4, icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'AI CONFIDENCE', value: '99.7%', sub: 'Model v4.2', pulse: false },
];

function RadarAnimation() {
  return (
    <div className="relative w-44 h-44 mx-auto">
      {[1,2,3,4].map(i => (
        <div key={i} className="absolute inset-0 rounded-full border border-cyan-500/20" style={{ margin: `${(4-i)*11}px` }} />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,245,255,0.8)]" />
      </div>
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: 'conic-gradient(from 0deg, rgba(0,245,255,0.3), transparent 60%)' }}>
        <div className="w-full h-full animate-radar" />
      </div>
      <div className="absolute top-8 left-14 w-2 h-2 rounded-full bg-red-400 animate-ping" style={{ animationDuration: '1.5s' }} />
      <div className="absolute top-20 right-10 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDuration: '2s' }} />
    </div>
  );
}

function CameraFeed({ label, threat }: { label: string; threat?: boolean }) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${threat ? 'border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border border-cyan-500/20'}`}>
      <div className="aspect-video relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)' }}>
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" style={{ animation: 'scanLine 2s linear infinite' }} />
        </div>
        {threat && (
          <div className="absolute top-4 left-6 w-12 h-16 border-2 border-red-400 rounded-sm" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}>
            <div className="absolute -top-4 left-0 text-[10px] text-red-400 font-mono whitespace-nowrap bg-red-500/20 px-1">GUN 97%</div>
          </div>
        )}
        {!threat && (
          <>
            <div className="absolute top-8 right-8 w-10 h-14 border border-cyan-400/60 rounded-sm">
              <div className="absolute -top-4 left-0 text-[10px] text-cyan-400 font-mono">PERSON</div>
            </div>
            <div className="absolute top-10 left-10 w-8 h-12 border border-cyan-400/60 rounded-sm">
              <div className="absolute -top-4 left-0 text-[10px] text-cyan-400 font-mono">PERSON</div>
            </div>
          </>
        )}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60" />
      </div>
      <div className="flex items-center justify-between px-2 py-1 bg-[#050d1a]/80 border-t border-cyan-500/10">
        <span className="text-[10px] font-mono text-gray-500">{label}</span>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${threat ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className={`text-[10px] font-mono ${threat ? 'text-red-400' : 'text-emerald-400'}`}>{threat ? 'ALERT' : 'LIVE'}</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 40, y: ((e.clientY - rect.top) / rect.height - 0.5) * 40 });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,245,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(14,165,233,0.06) 0%, transparent 60%), var(--background)' }} />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 pointer-events-none transition-transform duration-700"
        style={{ background: `radial-gradient(600px circle at ${50 + mousePos.x * 0.5}% ${50 + mousePos.y * 0.5}%, rgba(0,245,255,0.04), transparent 50%)` }} />

      {mounted && [
        { top: '15%', left: '10%', s: 8, d: '0s' }, { top: '25%', left: '85%', s: 12, d: '1s' },
        { top: '60%', left: '5%', s: 8, d: '2s' }, { top: '70%', left: '90%', s: 8, d: '0.5s' },
        { top: '40%', left: '92%', s: 6, d: '1.5s' }, { top: '80%', left: '15%', s: 10, d: '3s' },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full bg-cyan-400 opacity-60 pointer-events-none"
          style={{ top: p.top, left: p.left, width: `${p.s}px`, height: `${p.s}px`, animation: `float 6s ease-in-out ${p.d} infinite`, filter: 'blur(1px)', boxShadow: '0 0 8px rgba(0,245,255,0.5)' }} />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-2 text-sm"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.1s' }}>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-mono text-xs tracking-wider">AI SURVEILLANCE SYSTEM v4.2</span>
            </div>
            <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.2s' }}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
                <span className="text-slate-800 dark:text-white">AI-Powered</span><br />
                <span className="gradient-text">Surveillance</span><br />
                <span className="text-slate-800 dark:text-white">& Threat</span><br />
                <span className="gradient-text-red">Detection</span>
              </h1>
            </div>
            <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.35s' }}>
              Real-time weapon detection, crowd intelligence, traffic monitoring, and smart threat analysis powered by advanced AI.
            </p>
            <div className="flex flex-wrap gap-4"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.5s' }}>
              <Link to="/auth/login">
                <button className="btn-primary flex items-center gap-3 text-base"><Play className="w-5 h-5" /> Start Live Detection</button>
              </Link>
              <Link to="/auth/login">
                <button className="btn-outline flex items-center gap-3 text-base"><Upload className="w-5 h-5" /> Upload Video & Analyze</button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-200 dark:border-white/5"
              style={{ opacity: mounted ? 1 : 0, transition: 'all 0.7s ease 0.65s' }}>
              {[['99%','Accuracy','text-cyan-400'],['128','Cameras','text-blue-400'],['50K+','Threats Logged','text-emerald-400']].map(([v,l,c]) => (
                <div key={l} className="text-center">
                  <div className={`text-3xl font-bold ${c}`}>{v}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease 0.3s' }}>
            <div className="relative glass-dark rounded-2xl p-4 neon-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="ml-2 text-xs font-mono text-gray-500">DRISHTI_GUARD_CONTROL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400">SECURE</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <CameraFeed label="CAM_001 • SECTOR_A" threat />
                <CameraFeed label="CAM_002 • ENTRY" />
                <CameraFeed label="CAM_003 • PARKING" />
                <CameraFeed label="CAM_004 • CORRIDOR" />
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-mono text-red-400">WEAPON DETECTED IN SECTOR_A</span>
                </div>
                <span className="text-xs font-mono text-red-300 animate-blink">LIVE</span>
              </div>
            </div>

            {floatingCards.map((card, i) => {
              const Icon = card.icon;
              const pos = ['-top-8 -left-8','-top-8 -right-4','-bottom-8 -left-4','-bottom-8 -right-8'];
              return (
                <div key={card.id} className={`absolute ${pos[i]} glass-dark rounded-xl p-3 min-w-[140px] neon-border`}
                  style={{ animation: `float ${5+i}s ease-in-out ${i*0.7}s infinite` }}>
                  <div className={`flex items-center gap-2 mb-1.5 ${card.bg} rounded-md p-1.5 w-fit`}>
                    <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                    {card.pulse && <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{card.label}</div>
                  <div className={`text-sm font-bold ${card.color}`}>{card.value}</div>
                  <div className="text-xs text-gray-600">{card.sub}</div>
                </div>
              );
            })}

            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 glass-dark rounded-2xl p-4 neon-border"
              style={{ animation: 'float 7s ease-in-out 1s infinite', minWidth: '180px' }}>
              <div className="text-xs font-mono text-cyan-400 text-center mb-2">AI SCAN RADAR</div>
              <RadarAnimation />
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="text-center"><div className="text-xs font-mono text-red-400">3</div><div className="text-xs text-gray-600">Threats</div></div>
                <div className="text-center"><div className="text-xs font-mono text-cyan-400">12</div><div className="text-xs text-gray-600">Tracked</div></div>
              </div>
            </div>
            <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: 'radial-gradient(ellipse, rgba(0,245,255,0.08) 0%, transparent 70%)' }} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs font-mono text-gray-600 tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-cyan-400/40 to-transparent" />
      </div>
    </section>
  );
}
