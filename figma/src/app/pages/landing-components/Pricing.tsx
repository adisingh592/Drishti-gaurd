import { useEffect, useRef, useState } from 'react';
import { Check, Zap, Shield, Crown } from 'lucide-react';

const plans = [
  { name: 'Starter', icon: Zap, price: { monthly: 299, annual: 249 }, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: 'rgba(0,245,255,0.1)', popular: false, description: 'For small businesses and startups.', cameras: 'Up to 16 cameras',
    features: ['Real-time weapon detection','Basic crowd monitoring','Email & SMS alerts','Cloud storage 30 days','Standard AI models','Single location','API access'],
    excluded: ['Multi-location support','Custom AI training','White-label reports'] },
  { name: 'Professional', icon: Shield, price: { monthly: 799, annual: 649 }, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'rgba(14,165,233,0.15)', popular: true, description: 'For growing enterprises and city deployments.', cameras: 'Up to 128 cameras',
    features: ['All Starter features','Crowd density heatmaps','Traffic monitoring & ANPR','Intrusion detection zones','AI-generated reports','Multi-location (up to 5)','Cloud storage 90 days','Priority support 24/7','Dashboard analytics'],
    excluded: ['Unlimited locations','Custom AI training'] },
  { name: 'Enterprise', icon: Crown, price: { monthly: null, annual: null }, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'rgba(245,158,11,0.1)', popular: false, description: 'For national deployments and critical infrastructure.', cameras: 'Unlimited cameras',
    features: ['All Professional features','Unlimited locations','Custom AI model training','White-label platform','On-premise deployment','SLA 99.99% uptime','Dedicated support team','Military-grade encryption','Custom integrations','Compliance reporting'],
    excluded: [] },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.03), transparent 50%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-400 font-mono text-xs tracking-widest">PRICING PLANS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-white">Simple, </span><span className="gradient-text">Transparent Pricing</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">Scale from startup to enterprise. No hidden fees.</p>
          <div className="inline-flex items-center gap-3 glass rounded-full p-1 border border-slate-200 dark:border-white/10">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'}`}>
              Annual<span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => { const Icon = plan.icon; const price = annual ? plan.price.annual : plan.price.monthly; return (
            <div key={plan.name} className={`relative glass rounded-2xl border transition-all duration-500 ${plan.popular ? 'border-blue-500/40' : plan.border} hover:scale-[1.02]`}
              style={{ opacity: visible ? 1 : 0, transform: visible ? `translateY(0) ${plan.popular ? 'scale(1.02)' : ''}` : 'translateY(30px)', transition: `all 0.6s ease ${i*0.15}s`, boxShadow: plan.popular ? `0 0 40px ${plan.glow}, 0 20px 40px rgba(0,0,0,0.3)` : `0 0 20px ${plan.glow}` }}>
              {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><div className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-500/30 font-mono tracking-wide">MOST POPULAR</div></div>}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${plan.bg} border ${plan.border} flex items-center justify-center`}><Icon className={`w-5 h-5 ${plan.color}`} /></div>
                  <div><div className="text-slate-800 dark:text-white font-bold text-lg">{plan.name}</div><div className="text-gray-500 text-xs">{plan.description}</div></div>
                </div>
                <div className="mb-2">
                  {price !== null ? <div className="flex items-end gap-1"><span className="text-gray-500 text-sm">$</span><span className={`text-4xl font-black ${plan.color}`}>{price}</span><span className="text-gray-500 text-sm mb-1">/mo</span></div>
                    : <div className={`text-3xl font-black ${plan.color}`}>Custom</div>}
                  <div className="text-xs text-gray-600 font-mono mt-1">{plan.cameras}</div>
                </div>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all mb-6 mt-3 ${plan.popular ? 'btn-primary' : plan.name === 'Enterprise' ? `${plan.bg} ${plan.color} border ${plan.border} hover:bg-amber-500/20` : 'btn-outline'}`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
                <div className="border-t border-slate-200 dark:border-white/5 mb-4" />
                <div className="space-y-2">
                  {plan.features.map(f => (<div key={f} className="flex items-start gap-2.5"><div className={`w-4 h-4 rounded-full ${plan.bg} border ${plan.border} flex items-center justify-center flex-shrink-0 mt-0.5`}><Check className={`w-2.5 h-2.5 ${plan.color}`} /></div><span className="text-sm text-gray-400">{f}</span></div>))}
                  {plan.excluded.map(f => (<div key={f} className="flex items-start gap-2.5 opacity-30"><div className="w-4 h-4 rounded-full bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-gray-600 text-xs">—</span></div><span className="text-sm text-gray-600">{f}</span></div>))}
                </div>
              </div>
            </div>
          ); })}
        </div>

        <div className="text-center mt-12" style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.6s' }}>
          <div className="inline-flex items-center gap-3 glass-blue rounded-2xl px-6 py-3">
            <Shield className="w-5 h-5 text-cyan-400" /><span className="text-gray-400 text-sm">14-day free trial • No credit card required • SOC 2 Type II certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
