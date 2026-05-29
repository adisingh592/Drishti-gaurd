import { useState, useEffect } from 'react';
import { Shield, Menu, X, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { ThemeToggle } from '../../components/ThemeToggle';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Live Detection', href: '#live-detection' },
  { label: 'AI Analytics', href: '#ai-analytics' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center neon-glow transition-all group-hover:bg-cyan-500/20">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-slate-800 dark:text-slate-800 dark:text-white font-bold text-lg tracking-wide">DRISHTI</span>
              <span className="text-cyan-400 text-xs font-mono tracking-[0.2em] -mt-1">GUARD</span>
            </div>
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} onClick={() => setActiveLink(link.label)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${activeLink === link.label ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                {link.label}
                <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${activeLink === link.label ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth/login">
              <button className="btn-outline text-sm py-2 px-5">Sign In</button>
            </Link>
            <Link to="/auth/signup">
              <button className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Get Started
              </button>
            </Link>
          </div>
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button className="text-gray-400 hover:text-cyan-400 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="glass-dark border-t border-cyan-500/10 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => { setActiveLink(link.label); setMobileOpen(false); }}
              className="block px-4 py-3 text-sm text-slate-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/5 rounded-lg transition-all">{link.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
