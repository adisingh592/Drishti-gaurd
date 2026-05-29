import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router';

function AnimatedBG() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(0,245,255,0.08), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(14,165,233,0.06), transparent 60%), var(--background)' }} />
      <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-100" />
      {[
        { top: '20%', left: '15%', d: '0s' }, { top: '70%', left: '80%', d: '2s' },
        { top: '40%', left: '90%', d: '1s' }, { top: '80%', left: '10%', d: '3s' },
      ].map((p, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-cyan-400/40"
          style={{ top: p.top, left: p.left, animation: `float 6s ease-in-out ${p.d} infinite`, filter: 'blur(1px)', boxShadow: '0 0 6px rgba(0,245,255,0.5)' }} />
      ))}
    </div>
  );
}

export function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <AnimatedBG />
      <div className="relative w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8 neon-border">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center neon-glow">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-slate-800 dark:text-white font-bold text-xl tracking-wide">DRISHTI</span>
                <span className="text-cyan-400 text-xs font-mono tracking-[0.2em] -mt-1">GUARD</span>
              </div>
            </Link>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-1">Verify Identity</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Enter the 6-digit code sent to your email</p>

          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, i) => (
              <input key={i} type="text" maxLength={1} value={digit}
                onChange={e => { const newOtp = [...otp]; newOtp[i] = e.target.value; setOtp(newOtp); }}
                className="w-11 h-13 bg-slate-200/40 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-lg text-center text-xl font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                style={{ height: '52px' }} />
            ))}
          </div>

          <Link to="/app">
            <button className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base">
              <Shield className="w-5 h-5" /> Verify & Access
            </button>
          </Link>

          <div className="mt-4 text-center">
            <span className="text-xs text-gray-600">Didn't receive? </span>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Resend Code</button>
          </div>
        </div>
      </div>
    </div>
  );
}
