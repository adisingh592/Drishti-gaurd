import { useEffect, useRef, useState } from 'react';
import { Upload, FileVideo, Brain, Download, Clock, Shield, ChevronRight, CheckCircle } from 'lucide-react';

const steps = [
  { icon: Upload, label: 'Upload Footage', desc: 'Drag & drop or browse video files', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { icon: Brain, label: 'AI Processes', desc: 'Neural networks analyze every frame', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { icon: Clock, label: 'Threat Timeline', desc: 'AI generates incident timeline', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Download, label: 'Download Report', desc: 'Export annotated PDF evidence', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const timelineEvents = [
  { time: '00:02:14', type: 'Suspicious Movement', severity: 'MEDIUM', color: 'text-amber-400', dot: 'bg-amber-400' },
  { time: '00:04:38', type: 'Weapon Detected', severity: 'CRITICAL', color: 'text-red-400', dot: 'bg-red-400' },
  { time: '00:04:41', type: 'Person Fleeing', severity: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  { time: '00:07:22', type: 'Crowd Panic', severity: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  { time: '00:11:05', type: 'Area Cleared', severity: 'LOW', color: 'text-emerald-400', dot: 'bg-emerald-400' },
];

export default function UploadAnalyze() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleDemo = () => {
    setAnalyzing(true);
    setProgress(0);
    setAnalyzed(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setAnalyzing(false); setAnalyzed(true); return 100; }
        return p + 2;
      });
    }, 60);
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(14,165,233,0.05), transparent 50%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-xs tracking-widest">UPLOAD & ANALYZE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Analyze Any </span><span className="gradient-text">Footage Instantly</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Upload surveillance footage and get a complete AI-generated threat report with evidence, timeline, and risk score.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12" style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.1s' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-col items-center text-center gap-3 relative">
                <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center transition-transform hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                {i < steps.length - 1 && <div className="absolute top-7 left-[57%] w-[46%] h-px bg-gradient-to-r from-cyan-500/30 to-transparent hidden lg:block" />}
                <div><div className="text-slate-850 dark:text-white font-semibold text-sm">{step.label}</div><div className="text-gray-600 text-xs mt-0.5">{step.desc}</div></div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.7s ease 0.3s' }}>
            <div className={`relative glass-dark rounded-2xl border-2 border-dashed transition-all p-8 text-center cursor-pointer ${dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/25 hover:border-cyan-500/50'}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
              onDrop={() => { setDragging(false); handleDemo(); }} onClick={() => !analyzing && !analyzed && handleDemo()}>
              {(analyzing || dragging) && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" style={{ animation: 'scanLine 1.5s linear infinite' }} />
                </div>
              )}
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${dragging ? 'border-cyan-400 bg-cyan-500/20' : 'border-cyan-500/30 bg-cyan-500/10'}`}>
                  {analyzed ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : <Upload className={`w-8 h-8 ${dragging || analyzing ? 'text-cyan-400' : 'text-gray-500'}`} />}
                </div>
                <div>
                  <div className="text-slate-850 dark:text-white font-semibold mb-1">{analyzed ? 'Analysis Complete!' : analyzing ? 'Processing footage...' : 'Drop video file here'}</div>
                  <div className="text-gray-500 text-sm">{analyzed ? 'Threat report ready for download' : analyzing ? `${progress}% complete` : 'or click to demo analysis'}</div>
                </div>
                {(analyzing || analyzed) && (
                  <div className="w-full">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: analyzed ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #06b6d4, #0ea5e9)', boxShadow: `0 0 8px ${analyzed ? 'rgba(16,185,129,0.5)' : 'rgba(0,245,255,0.5)'}` }} />
                    </div>
                  </div>
                )}
                {!analyzing && !analyzed && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['MP4','AVI','MOV','MKV','RTSP'].map(fmt => (
                      <span key={fmt} className="text-xs font-mono text-gray-600 glass px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">{fmt}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {analyzed && (
              <div className="mt-4 glass-dark rounded-xl p-4 neon-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div><div className="text-slate-850 dark:text-white font-semibold">Threat Score</div><div className="text-xs text-gray-500">5 incidents found</div></div>
                  </div>
                  <div className="text-3xl font-black text-red-400">82/100</div>
                </div>
                <button className="w-full mt-3 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                  <Download className="w-4 h-4" /> Download AI Report (PDF)
                </button>
              </div>
            )}
          </div>

          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.7s ease 0.4s' }}>
            <div className="glass-dark rounded-2xl p-5 neon-border h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">THREAT TIMELINE</span></div>
                {analyzed && <span className="text-xs text-emerald-400 font-mono">COMPLETE</span>}
              </div>
              <div className="relative space-y-3">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent" />
                {timelineEvents.map((event, i) => (
                  <div key={i} className={`relative flex items-start gap-4 pl-10 transition-all ${analyzed ? 'opacity-100' : 'opacity-30'}`} style={{ transitionDelay: analyzed ? `${i*150}ms` : '0ms' }}>
                    <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full ${event.dot} -translate-x-1/2`}
                      style={{ boxShadow: analyzed ? '0 0 8px currentColor' : 'none' }} />
                    <div className={`glass rounded-xl p-3 flex-1 border ${event.severity === 'CRITICAL' ? 'border-red-500/20' : 'border-slate-200 dark:border-white/5'} hover:border-cyan-500/20 transition-all`}>
                      <div className="flex items-start justify-between gap-2">
                        <div><div className="text-white text-sm font-medium">{event.type}</div><div className="text-xs text-gray-600 font-mono mt-0.5">{event.time}</div></div>
                        <div className={`text-xs font-mono px-2 py-0.5 rounded ${
                          event.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          event.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          event.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>{event.severity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!analyzed && (
                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">Upload footage to generate threat timeline</p>
                  <button onClick={handleDemo} className="mt-3 btn-outline text-sm py-2 px-4 flex items-center gap-2 mx-auto">
                    <Brain className="w-4 h-4" /> Run Demo Analysis <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
