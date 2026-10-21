import { useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import {
  LayoutDashboard,
  Video,
  Upload,
  FileText,
  Users,
  Car,
  BarChart3,
  Camera,
  Bell,
  Building2,
  Map,
  Settings
} from "lucide-react";

export interface WeaponNavItem {
  path: string;
  icon: any;
  label: string;
  class: string;
  threatCapacity: number; // Damage equivalent (0-100)
  speed: number;          // Fire rate equivalent (0-100)
  accuracy: number;       // Accuracy equivalent (0-100)
  range: number;          // Range equivalent (0-100)
  ammoType: string;
}

export const weaponNavItems: WeaponNavItem[] = [
  {
    path: "/app",
    icon: LayoutDashboard,
    label: "Dashboard",
    class: "Command & Control Core (C2)",
    threatCapacity: 25,
    speed: 85,
    accuracy: 99,
    range: 100,
    ammoType: "SYSTEM STATUS: SECURE"
  },
  {
    path: "/app/live-detection",
    icon: Video,
    label: "Live Detection",
    class: "Real-Time Neural Scanner",
    threatCapacity: 95,
    speed: 98,
    accuracy: 97,
    range: 75,
    ammoType: "ACTIVE CAMERAS: 8 CHANNELS"
  },
  {
    path: "/app/upload",
    icon: Upload,
    label: "Upload & Analyze",
    class: "Forensic Media Scan Module",
    threatCapacity: 60,
    speed: 45,
    accuracy: 99,
    range: 90,
    ammoType: "BUFFER: 250 GB/s MAX"
  },
  {
    path: "/app/incidents",
    icon: FileText,
    label: "Incidents",
    class: "Logged Events Database",
    threatCapacity: 45,
    speed: 60,
    accuracy: 100,
    range: 100,
    ammoType: "THREAT ARCHIVE: 1,482 LOGS"
  },
  {
    path: "/app/crowd",
    icon: Users,
    label: "Crowd Intelligence",
    class: "Socio-Density Predictor",
    threatCapacity: 75,
    speed: 90,
    accuracy: 95,
    range: 80,
    ammoType: "SENSORS: 14 SECTORS ACTIVE"
  },
  {
    path: "/app/traffic",
    icon: Car,
    label: "Traffic Surveillance",
    class: "Optical Flow Tracker",
    threatCapacity: 35,
    speed: 95,
    accuracy: 96,
    range: 85,
    ammoType: "GRID: 42 INTERSECTIONS"
  },
  {
    path: "/app/analytics",
    icon: BarChart3,
    label: "Threat Analytics",
    class: "Predictive Threat ML Engine",
    threatCapacity: 90,
    speed: 88,
    accuracy: 98,
    range: 95,
    ammoType: "PROCESSING: 5.4 TFLOPS"
  },
  {
    path: "/app/cameras",
    icon: Camera,
    label: "Camera Management",
    class: "Sensor Grid Hardware Link",
    threatCapacity: 20,
    speed: 75,
    accuracy: 100,
    range: 100,
    ammoType: "SENSORS: 130 ACTIVE NODES"
  },
  {
    path: "/app/alerts",
    icon: Bell,
    label: "Alert Center",
    class: "Instant Emergency Dispatcher",
    threatCapacity: 85,
    speed: 100,
    accuracy: 100,
    range: 100,
    ammoType: "RELAY CAP: INSTANT PUSH"
  },
  {
    path: "/app/city",
    icon: Building2,
    label: "Smart City",
    class: "IoT Civic Integration Panel",
    threatCapacity: 50,
    speed: 80,
    accuracy: 96,
    range: 90,
    ammoType: "INTEGRATION: 1,024 NODES"
  },
  {
    path: "/app/map",
    icon: Map,
    label: "Security Map",
    class: "GIS Tactical Spatial Display",
    threatCapacity: 65,
    speed: 70,
    accuracy: 99,
    range: 100,
    ammoType: "ANTENNA: SAT_LINK_SECURE"
  },
  {
    path: "/app/settings",
    icon: Settings,
    label: "Settings",
    class: "Surveillance Core Controller",
    threatCapacity: 10,
    speed: 100,
    accuracy: 100,
    range: 10,
    ammoType: "KERNEL VERSION: v4.2"
  }
];

export function WeaponScrollBar() {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<WeaponNavItem | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);

  const activeIndex = weaponNavItems.findIndex(item => item.path === location.pathname);
  const activeItem = activeIndex !== -1 ? weaponNavItems[activeIndex] : weaponNavItems[0];
  const currentItem = hoveredItem || activeItem;

  const playHoverSound = () => {
    if (soundMuted) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.05);
      gain.gain.setValueAtTime(0.015, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.05);
    } catch (e) {
      // Ignore
    }
  };

  const playClickSound = () => {
    if (soundMuted) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(400, context.currentTime);
      osc.frequency.setValueAtTime(200, context.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.15);
    } catch (e) {
      // Ignore
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
    playHoverSound();
  };

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 p-2 font-mono select-none flex flex-col gap-1.5 relative z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors duration-300">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-1">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 font-black text-[10px] uppercase tracking-wider rounded">
            SURVEILLANCE HUD
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest hidden md:inline">
            // SELECT DEFENSE OR DETECTION SYSTEM
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            title="Toggle Audio Feedback"
          >
            <Volume2 className="w-3 h-3" />
          </button>
          <div className="text-right">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              {currentItem.ammoType}
            </span>
          </div>
        </div>
      </div>

      {/* Main Selector Container */}
      <div className="flex items-stretch gap-3">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="px-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center cursor-pointer rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Slots */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto flex gap-1.5 py-0.5 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {weaponNavItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={playClickSound}
                onMouseEnter={() => {
                  setHoveredItem(item);
                  playHoverSound();
                }}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex-none w-24 h-16 bg-slate-50/50 dark:bg-slate-950/20 border flex flex-col items-center justify-between p-1.5 transition-all group cursor-pointer rounded-xl ${
                  isActive
                    ? "border-blue-600 dark:border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.06)] bg-blue-50/40 dark:bg-blue-950/10"
                    : "border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-650 hover:bg-slate-100/50 dark:hover:bg-slate-800/20"
                }`}
              >
                {/* Slot index in military format */}
                <div className="w-full flex justify-between items-center">
                  <span className={`text-[8px] font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'}`}>
                    WPN_{String(idx + 1).padStart(2, "0")}
                  </span>
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                  )}
                </div>

                {/* Wireframe Silhouette Icon */}
                <div className="relative my-0.5 flex items-center justify-center">
                  <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
                  <div className={`absolute inset-0 blur-md opacity-20 pointer-events-none transition-all duration-300 ${isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}`} />
                </div>

                {/* Label text */}
                <span className={`text-[9px] font-bold text-center truncate w-full ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white'}`}>
                  {item.label}
                </span>

                {/* Selection indicator border */}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-b-xl" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="px-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center cursor-pointer rounded-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dynamic Compact Stats Panel (2x2 Grid) */}
        <div className="w-96 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-2.5 hidden xl:flex flex-col justify-between gap-1 shadow-sm relative overflow-hidden rounded-xl">
          {/* Weapon Class & Name */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-0.5 mb-0.5 flex justify-between items-baseline gap-2">
            <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase truncate max-w-[150px]">
              CLASS: {currentItem.class}
            </span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate max-w-[120px]">
              {currentItem.label}
            </span>
          </div>

          {/* Stats 2x2 Progress Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 z-10 text-[9px] font-bold">
            {/* Stat 1: Threat Capacity */}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 uppercase truncate w-20">THREAT RESP</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-700 dark:text-slate-300 w-4 text-right font-mono text-[8px]">{currentItem.threatCapacity}</span>
                <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${currentItem.threatCapacity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stat 2: Detection Speed */}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 uppercase truncate w-20">DETECTION SPD</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-700 dark:text-slate-300 w-4 text-right font-mono text-[8px]">{currentItem.speed}</span>
                <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${currentItem.speed}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stat 3: Accuracy */}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 uppercase truncate w-20">ACCURACY</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-700 dark:text-slate-300 w-4 text-right font-mono text-[8px]">{currentItem.accuracy}</span>
                <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${currentItem.accuracy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stat 4: Coverage Range */}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 uppercase truncate w-20">RANGE</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-700 dark:text-slate-300 w-4 text-right font-mono text-[8px]">{currentItem.range}</span>
                <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${currentItem.range}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
