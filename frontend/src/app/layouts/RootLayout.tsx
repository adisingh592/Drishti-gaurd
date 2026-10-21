import { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router";
import {
  Home,
  MonitorPlay,
  Upload,
  Crosshair,
  Bell,
  LineChart,
  Users,
  Car,
  Map,
  Building2,
  Cpu,
  Settings,
  Info,
  User,
  Menu,
  X,
  ShieldCheck,
  Server,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { BrandMark } from "../components/brand/BrandMark";
import { WeaponScrollBar } from "../components/navigation/WeaponScrollBar";
import { WeaponWheel } from "../components/navigation/WeaponWheel";
import { useBackendHealth } from "../hooks/useBackendHealth";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const navSections: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { to: "/app", label: "Dashboard", icon: Home, end: true },
      { to: "/app/live-detection", label: "Live Monitor", icon: MonitorPlay },
      { to: "/app/upload", label: "Upload & Analyze", icon: Upload },
      { to: "/app/incidents", label: "Detections", icon: Crosshair },
      { to: "/app/alerts", label: "Alerts", icon: Bell },
      { to: "/app/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { to: "/app/crowd", label: "Crowd", icon: Users },
      { to: "/app/traffic", label: "Traffic", icon: Car },
      { to: "/app/map", label: "Security Map", icon: Map },
      { to: "/app/city", label: "Smart City", icon: Building2 },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/app/cameras", label: "Device", icon: Cpu },
      { to: "/app/settings", label: "Settings", icon: Settings },
      { to: "/", label: "About", icon: Info, end: true },
    ],
  },
];

function TrainIllustration() {
  return (
    <svg viewBox="0 0 220 90" fill="none" className="w-full h-auto text-olive-500/40" aria-hidden="true">
      <path d="M0 62c22-14 40-18 58-10s30 4 46-6 36-10 56 0 38 10 60 2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0 72c30-8 60-6 90 0s70 6 130-4" stroke="currentColor" strokeWidth="1" opacity=".7" />
      <path d="M150 40l8-14 8 14M176 44l6-10 6 10" stroke="currentColor" strokeWidth="1" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M22 76V44c0-8 6-14 14-14h58c10 0 20 8 24 18l6 14v14H22Z" />
        <path d="M30 40h18v14H30zM54 40h14v14H54zM74 40h14v14H74zM94 40h10l6 14H94z" />
        <path d="M22 62h102M124 62h86v14H124" />
        <path d="M130 50h74v12M138 54h10M156 54h10M174 54h10M192 54h10" />
      </g>
      <g stroke="currentColor" strokeWidth="1.2">
        <circle cx="42" cy="78" r="4" />
        <circle cx="62" cy="78" r="4" />
        <circle cx="96" cy="78" r="4" />
        <circle cx="150" cy="78" r="4" />
        <circle cx="190" cy="78" r="4" />
      </g>
      <path d="M0 84h220" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <Link to="/" onClick={onNavigate} className="flex flex-col items-center text-center gap-1 px-4 pt-7 pb-6 group">
        <BrandMark className="w-16 h-12 text-olive-600 dark:text-olive-400 transition-transform group-hover:scale-105" />
        <span className="text-[1.6rem] font-bold tracking-tight text-foreground leading-tight">DrishtiGuard</span>
        <span className="text-sm text-muted-foreground">Smart Vision. Safer India.</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-5" aria-label="Main">
        {navSections.map((section, i) => (
          <div key={i} className="space-y-1">
            {section.title && (
              <div className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-2xl px-4 py-3 text-[0.95rem] transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-foreground/85 hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={1.7} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl bg-sidebar-accent/70 border border-sidebar-border overflow-hidden">
          <div className="flex items-start gap-3 p-4 pb-1">
            <div className="w-12 h-12 rounded-full bg-olive-200/70 dark:bg-olive-400/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-olive-600 dark:text-olive-400" strokeWidth={1.7} />
            </div>
            <div className="pt-0.5">
              <div className="text-sm font-semibold text-olive-600 dark:text-olive-400">Mission</div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Safer journeys.
                <br />
                Stronger security.
              </p>
            </div>
          </div>
          <div className="px-2">
            <TrainIllustration />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceCard() {
  const { status, latencyMs } = useBackendHealth();
  const tone =
    status === "online"
      ? { dot: "bg-safe", label: "Backend Connected", sub: latencyMs != null ? `All systems operational · ${latencyMs} ms` : "All systems operational" }
      : status === "offline"
        ? { dot: "bg-warn", label: "Backend Offline", sub: "Start the API on :8000" }
        : { dot: "bg-muted-foreground animate-soft-pulse", label: "Connecting…", sub: "Checking /api/health" };

  return (
    <div className="hidden md:flex items-center gap-4 card-soft rounded-2xl px-4 py-3 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <Server className="w-6 h-6 text-olive-600 dark:text-olive-400" strokeWidth={1.6} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm text-foreground/85">
          <span className={`w-2 h-2 rounded-full ${tone.dot}`} />
          {tone.label}
        </div>
        <div className="font-medium text-foreground truncate">Detection Engine · Unit 01</div>
        <div className="text-xs text-muted-foreground truncate">{tone.sub}</div>
      </div>
    </div>
  );
}

export function RootLayout() {
  const [wheelOpen, setWheelOpen] = useState(false);
  const [scrollBarOpen, setScrollBarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // Keyboard shortcuts: TAB opens the radial module wheel, S toggles the module deck.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "Tab" && !typing && !e.shiftKey) {
        e.preventDefault();
        setWheelOpen((prev) => !prev);
      } else if ((e.key === "s" || e.key === "S") && !typing && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setScrollBarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[270px] shrink-0 flex-col bg-sidebar border-r border-sidebar-border rounded-r-[28px] shadow-[4px_0_24px_-18px_rgba(60,64,40,0.35)] z-20">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-sidebar border-r border-sidebar-border lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 pt-6 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-11 h-11 rounded-xl card-soft flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-base sm:text-lg text-foreground/80">Welcome back,</p>
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-2xl sm:text-[2.1rem] font-bold tracking-tight leading-tight truncate min-w-0">DrishtiGuard</h1>
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2.2} />
                </span>
              </div>
              <p className="hidden sm:block text-sm sm:text-base text-muted-foreground mt-1 truncate">
                Real-time protection against weapons, crowd risks &amp; safety threats.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <DeviceCard />
            <ThemeToggle />
            <Link
              to="/app/settings"
              aria-label="Profile and settings"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl card-soft flex items-center justify-center hover:bg-muted"
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-10 pb-10 pt-2">
          <Outlet />
        </main>

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
      </div>

      <AnimatePresence>
        {wheelOpen && <WeaponWheel isOpen={wheelOpen} onClose={() => setWheelOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
