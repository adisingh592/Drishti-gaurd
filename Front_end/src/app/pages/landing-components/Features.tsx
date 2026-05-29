import { useEffect, useRef, useState } from 'react';
import { Shield, Camera, Brain, Activity, AlertTriangle, Car, Users, MapPin, FileText, Zap, Lock } from 'lucide-react';

const features = [
  { icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: 'rgba(0,245,255,0.15)', title: 'Weapon Detection', description: 'Real-time detection of firearms, knives, and other weapons with 99.7% accuracy using multi-layer neural networks.', tags: ['Guns','Knives','Objects'] },
  { icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'rgba(14,165,233,0.15)', title: 'AI Threat Analysis', description: 'Advanced behavioral analysis algorithms detect suspicious movements and predict threat escalation before incidents occur.', tags: ['Behavior','Pattern','Prediction'] },
  { icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'rgba(16,185,129,0.15)', title: 'Crowd Intelligence', description: 'Monitor crowd density, detect panic movements, and generate real-time heatmaps for smart crowd management.', tags: ['Density','Heatmaps','Panic'] },
  { icon: Car, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'rgba(245,158,11,0.15)', title: 'Traffic Monitoring', description: 'Automated vehicle tracking, rash driving detection, license plate recognition, and traffic flow optimization.', tags: ['Vehicles','Speed','ANPR'] },
  { icon: Camera, color: 'text-cyan-300', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', glow: 'rgba(0,245,255,0.12)', title: 'Multi-Camera Control', description: 'Centralized management of 1000+ cameras with intelligent auto-pan, zoom, and tracking capabilities.', tags: ['PTZ','Multi-Feed','Tracking'] },
  { icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'rgba(239,68,68,0.15)', title: 'Intrusion Detection', description: 'Virtual perimeter security with instant alerts for unauthorized access to restricted zones and facilities.', tags: ['Perimeter','Zones','Alerts'] },
  { icon: FileText, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', glow: 'rgba(14,165,233,0.12)', title: 'AI Report Generation', description: 'Automated incident reports with annotated evidence, threat timelines, and downloadable documentation.', tags: ['Reports','Evidence','Timeline'] },
  { icon: MapPin, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'rgba(244,63,94,0.12)', title: 'Geo-Fencing', description: 'Dynamic location-based security zones with real-time tracking and smart alert systems.', tags: ['Location','Zones','GPS'] },
  { icon: Lock, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: 'rgba(139,92,246,0.12)', title: 'Encrypted Security', description: 'Military-grade AES-256 encryption for all video feeds, data storage, and communications.', tags: ['AES-256','Zero-Trust','Compliant'] },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setVisible(true), index * 80); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative glass rounded-xl p-6 border transition-all duration-500 cursor-pointer group"
      style={{
        borderColor: hovered ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.06)',
        boxShadow: hovered ? `0 0 30px ${feature.glow}, inset 0 0 30px ${feature.glow}` : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}>
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-transparent group-hover:border-cyan-500/40 transition-all" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-transparent group-hover:border-cyan-500/40 transition-all" />
      <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 transition-all group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${feature.color}`} />
      </div>
      <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-2 group-hover:text-cyan-50 transition-colors">{feature.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{feature.description}</p>
      <div className="flex flex-wrap gap-2">
        {feature.tags.map(tag => (
          <span key={tag} className={`text-xs font-mono px-2 py-0.5 rounded ${feature.bg} ${feature.color} border ${feature.border}`}>{tag}</span>
        ))}
      </div>
      <div className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)`, opacity: hovered ? 1 : 0 }} />
    </div>
  );
}

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.04), transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-xs tracking-widest">CORE CAPABILITIES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Enterprise-Grade </span><span className="gradient-text">AI Features</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">A complete surveillance intelligence platform engineered for smart cities, enterprises, and critical infrastructure.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
        </div>
        <div className="text-center mt-16" style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.5s' }}>
          <div className="glass-dark inline-flex items-center gap-8 rounded-2xl px-8 py-5 neon-border flex-wrap justify-center">
            {[['99.7%','Detection Accuracy','text-cyan-400'],['<50ms','Alert Latency','text-blue-400'],['24/7','Monitoring','text-emerald-400'],['1000+','Camera Support','text-amber-400']].map(([v,l,c]) => (
              <div key={l} className="text-center">
                <div className={`text-2xl font-bold ${c}`}>{v}</div>
                <div className="text-xs text-gray-500 font-mono">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
