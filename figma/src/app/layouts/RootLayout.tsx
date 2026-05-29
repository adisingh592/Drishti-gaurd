import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router";
import { Shield, Cpu, LayoutGrid, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import { WeaponScrollBar } from "../components/WeaponScrollBar";
import { WeaponWheel } from "../components/WeaponWheel";

export function RootLayout() {
  const [wheelOpen, setWheelOpen] = useState(false);
  const [scrollBarOpen, setScrollBarOpen] = useState(false);

  // Global event listener for keyboard shortcuts:
  // - TAB toggles the spinning radial wheel
  // - 'S' key toggles the compact bottom scrollbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent default focus cycling
        setWheelOpen((prev) => !prev);
      } else if (e.key === "s" || e.key === "S") {
        // Do not toggle if user is typing in form fields
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setScrollBarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated premium adaptive background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/50 dark:from-slate-950 dark:via-slate-900/40 dark:to-blue-950/20 opacity-80 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/10 via-transparent to-purple-100/10 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none" />

      {/* High-Tech Premium Silver-White Header */}
      <header className="relative z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between text-slate-800 dark:text-slate-100 select-none shadow-sm transition-colors duration-300">
        {/* Logo and branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-pulse" />
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-30 pointer-events-none" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-lg font-black tracking-wider uppercase text-slate-900 dark:text-white">Drishti Guard</h1>
            <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono tracking-[0.2em] font-bold">AI SURVEILLANCE MATRIX</span>
          </div>
        </Link>

        {/* Tactical Shortcut Display (Armed Tab Trigger) */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setWheelOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider cursor-pointer transition-all animate-pulse"
          >
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>RADIAL WHEEL</span>
            <span className="bg-blue-600 dark:bg-blue-500 text-white px-1.5 py-0.5 rounded font-black text-[9px]">TAB</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setScrollBarOpen((prev) => !prev)}
            className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider cursor-pointer transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>SLOT DECK</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-black text-[9px]">S</span>
          </motion.button>
        </div>

        {/* Global theme controls & active state */}
        <div className="flex items-center gap-4">
          {/* AI Active Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-800/60 rounded-lg">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-mono font-bold">AI SYSTEM ONLINE</span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Tactical Dashboard Viewport */}
      <main className="flex-1 overflow-auto relative z-20 bg-background/10 p-6 md:p-8">
        <Outlet />
      </main>

      {/* High-Tech Tactical Floating HUD Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {/* Compact quick visual label that slides out */}
        <AnimatePresence>
          {!scrollBarOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase py-1 px-3 rounded-lg shadow-sm backdrop-blur-md hidden sm:inline"
            >
              TOGGLE DECK [S]
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScrollBarOpen((prev) => !prev)}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg backdrop-blur-md border transition-all duration-300 ${
            scrollBarOpen
              ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          }`}
          title="Toggle Navigation HUD Slot Deck [S]"
        >
          <AnimatePresence mode="wait">
            {scrollBarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5.5 h-5.5" />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LayoutGrid className="w-5.5 h-5.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Horizontal Weapon Selector Navigation (Animates up from bottom) */}
      <AnimatePresence>
        {scrollBarOpen && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="w-full relative z-40"
          >
            <WeaponScrollBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Weapon Wheel Radial Selector Overlay */}
      <AnimatePresence>
        {wheelOpen && (
          <WeaponWheel isOpen={wheelOpen} onClose={() => setWheelOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
