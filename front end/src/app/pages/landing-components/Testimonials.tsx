import { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { name: 'Col. Arjun Mehta', role: 'Chief Security Officer', org: 'National Security Agency', avatar: 'AM', rating: 5, quote: 'Drishti Guard has revolutionized how we approach critical infrastructure protection. The AI detection accuracy is unmatched — we stopped 3 major incidents within the first month.', metric: '3 incidents prevented in month 1' },
  { name: 'Sarah Chen', role: 'Director of Operations', org: 'Smart City Mumbai', avatar: 'SC', rating: 5, quote: 'The crowd intelligence module alone has transformed how we manage large public events. Real-time heatmaps and panic detection have become indispensable.', metric: '40% faster incident response' },
  { name: 'Marcus Reeves', role: 'VP Technology', org: 'Heathrow Security', avatar: 'MR', rating: 5, quote: 'We manage 2,400 cameras across terminals. Drishti Guard handles all seamlessly with AI that actually works. The false positive rate is near zero.', metric: '2,400 cameras managed centrally' },
  { name: 'Dr. Priya Nair', role: 'Head of Smart Infrastructure', org: 'Delhi Metro Rail', avatar: 'PN', rating: 5, quote: "In high-traffic transit environments, seconds matter. Drishti Guard's sub-50ms alert latency and weapon detection have given us unprecedented confidence.", metric: '< 50ms threat alert latency' },
  { name: "James O'Connor", role: 'Security Director', org: 'Wembley Stadium', avatar: 'JO', rating: 5, quote: 'Managing 90,000 fans is an enormous responsibility. The crowd density AI gives us real-time situational awareness that was impossible before.', metric: '90,000 people monitored live' },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndex(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[activeIndex];
  const prev = () => setActiveIndex(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActiveIndex(i => (i + 1) % testimonials.length);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.04), transparent 60%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <Star className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-400 font-mono text-xs tracking-widest">CLIENT TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-white">Trusted by </span><span className="gradient-text">Security Leaders</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Hear from the experts who rely on Drishti Guard every day.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-10" style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.2s' }}>
          <div key={activeIndex} className="glass-dark rounded-2xl p-8 neon-border relative overflow-hidden" style={{ transition: 'all 0.4s ease' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(0,245,255,0.04), transparent 50%)' }} />
            <Quote className="w-10 h-10 text-cyan-400/20 mb-4" />
            <p className="text-white text-xl leading-relaxed mb-6 font-light">"{t.quote}"</p>
            <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /><span className="text-cyan-400 text-sm font-mono">{t.metric}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">{t.avatar}</div>
                <div><div className="text-slate-850 dark:text-white font-semibold">{t.name}</div><div className="text-gray-500 text-sm">{t.role}</div><div className="text-cyan-400 text-xs font-mono">{t.org}</div></div>
              </div>
              <div className="flex gap-1">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-9 h-9 rounded-full glass border border-cyan-500/20 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-2">{testimonials.map((_, i) => <button key={i} onClick={() => setActiveIndex(i)} className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-8 bg-cyan-400' : 'w-1.5 bg-white/20'}`} />)}</div>
            <button onClick={next} className="w-9 h-9 rounded-full glass border border-cyan-500/20 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4" style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.4s' }}>
          {testimonials.slice(0, 3).map((t2, i) => (
            <button key={t2.name} onClick={() => setActiveIndex(i)}
              className={`glass rounded-xl p-4 text-left border transition-all hover:border-cyan-500/30 ${activeIndex === i ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-200 dark:border-white/5'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">{t2.avatar}</div>
                <div><div className="text-xs font-semibold text-slate-850 dark:text-white">{t2.name}</div><div className="text-xs text-gray-600">{t2.org}</div></div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">"{t2.quote}"</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
