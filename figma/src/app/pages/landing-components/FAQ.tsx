import { useEffect, useRef, useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How accurate is the weapon detection AI?', a: 'Our weapon detection model achieves 99.7% accuracy in real-world deployments, trained on over 10 million annotated frames. False positive rate is under 0.1%.' },
  { q: 'What is the alert latency from detection to notification?', a: 'Drishti Guard delivers alerts in under 50 milliseconds from detection to notification. Our distributed edge-processing architecture ensures near-zero latency.' },
  { q: 'Can it integrate with existing security systems?', a: 'Yes. We provide REST APIs, webhooks, and native integrations with leading PSIM, VMS, and access control systems with white-glove integration support.' },
  { q: 'Is video data stored securely?', a: 'All video data is encrypted with AES-256 at rest and TLS 1.3 in transit. We support on-premise deployment for strict data residency requirements.' },
  { q: 'How many cameras can the platform support?', a: 'Our cloud infrastructure scales horizontally to support unlimited camera feeds. Current deployments include cities managing over 10,000 simultaneous feeds.' },
  { q: 'What happens during a detected threat?', a: 'Upon detection, Drishti Guard instantly sends multi-channel alerts, captures annotated evidence frames, assigns a threat score, and logs the incident with a full AI-generated summary.' },
  { q: 'Is there a free trial?', a: 'Yes. All plans include a 14-day free trial with full feature access. No credit card required. Enterprise clients receive a dedicated 30-day POC pilot.' },
  { q: 'What compliance certifications do you hold?', a: 'We are SOC 2 Type II, ISO 27001, GDPR, and NDAA compliant. For government and defense, we hold FedRAMP Ready and NATO STANAG compliance.' },
];

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,245,255,0.03), transparent 50%)' }} />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /><span className="text-cyan-400 font-mono text-xs tracking-widest">FREQUENTLY ASKED</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-white">Got </span><span className="gradient-text">Questions?</span></h2>
          <p className="text-gray-500 text-lg">Everything you need to know about Drishti Guard.</p>
        </div>
        <div className="space-y-3" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.2s' }}>
          {faqs.map((faq, i) => (
            <div key={i} className={`glass rounded-xl border transition-all ${openIndex === i ? 'border-cyan-500/25 bg-cyan-500/5' : 'border-slate-200 dark:border-white/5 hover:border-cyan-500/15'}`}>
              <button className="w-full flex items-center justify-between px-5 py-4 text-left gap-4" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span className={`text-sm font-medium transition-colors ${openIndex === i ? 'text-white' : 'text-gray-300'}`}>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openIndex === i ? '200px' : '0px' }}>
                <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
