import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { X, Shield, Volume2, ChevronUp } from "lucide-react";
import { weaponNavItems, WeaponNavItem } from "./WeaponScrollBar";

interface WeaponWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeaponWheel({ isOpen, onClose }: WeaponWheelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Find current active index based on path
  const activePathIdx = weaponNavItems.findIndex(item => item.path === location.pathname);
  const initialIdx = activePathIdx !== -1 ? activePathIdx : 0;

  const [activeIdx, setActiveIdx] = useState<number>(initialIdx);
  const [rotationAngle, setRotationAngle] = useState<number>(-initialIdx * 30);
  const [soundMuted, setSoundMuted] = useState(false);
  const prevIdxRef = useRef<number>(initialIdx);

  const selectedItem = weaponNavItems[activeIdx];

  // Synthesis sound for the mechanical click notches as the wheel spins
  const playNotchClick = () => {
    if (soundMuted) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, context.currentTime); // Low mechanical click
      osc.frequency.exponentialRampToValueAtTime(15, context.currentTime + 0.025);
      
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.025);
      
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.025);
    } catch (e) {
      // Audio fallback
    }
  };

  // Synthesis sound when arming/selecting a system
  const playSelectSound = () => {
    if (soundMuted) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, context.currentTime);
      osc.frequency.setValueAtTime(560, context.currentTime + 0.06);
      
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
      
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.18);
    } catch (e) {
      // Ignore
    }
  };

  // Update rotation angle when active index changes (using shortest path transition math)
  useEffect(() => {
    const prevIdx = prevIdxRef.current;
    if (activeIdx === prevIdx) return;

    let diff = activeIdx - prevIdx;
    
    // Shortest path math for 12 segments (360 degrees / 30 deg steps)
    if (diff > 6) diff -= 12;
    if (diff < -6) diff += 12;

    setRotationAngle((prev) => prev - diff * 30);
    playNotchClick();
    
    prevIdxRef.current = activeIdx;
  }, [activeIdx]);

  // Keyboard navigation listeners (Arrow keys, Escape, Enter, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % 12);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + 12) % 12);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleExecuteSelection(weaponNavItems[activeIdx]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIdx, onClose]);

  // Scroll wheel listener for the physical spinning wheel experience
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setActiveIdx((prev) => (prev + 1) % 12);
    } else {
      setActiveIdx((prev) => (prev - 1 + 12) % 12);
    }
  };

  // Radial hover tracking to rotate the wheel dynamically to match the hovered wedge
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Dynamic deadzone of 70px to 300px
    if (distance > 70 && distance < 300) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      // Align so that index 0 starts exactly at 12 o'clock (top pointer)
      // Since atan2 starts 0 deg at 3 o'clock, we offset by +90 deg
      // We also offset by +15 deg to center the selection on the wedge slot
      let adjustedAngle = (angle + 90 + 15) % 360;
      const idx = Math.floor(adjustedAngle / 30);
      const safeIdx = Math.min(Math.max(idx, 0), 11);

      if (safeIdx !== activeIdx) {
        setActiveIdx(safeIdx);
      }
    }
  };

  const handleExecuteSelection = (item: WeaponNavItem) => {
    playSelectSound();
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-xl select-none font-mono text-slate-800 dark:text-slate-100 transition-colors duration-300"
      onMouseMove={handleMouseMove}
    >
      {/* High-Tech Top Header HUD */}
      <div className="absolute top-8 left-12 right-12 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 z-30">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
          <div>
            <h2 className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none tracking-widest uppercase">
              DRISHTI SPINNING WEAPON WHEEL
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-1">
              // SPINNING RADIAL HUD SELECTION CONTROL SYSTEM
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* HUD controls tip */}
          <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded hidden md:inline-block">
            SCROLL MOUSE WHEEL OR USE ARROW KEYS TO SPIN WHEEL
          </div>
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-1.5 rounded bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Toggle Audio Feedback"
          >
            <Volume2 className={`w-4 h-4 ${soundMuted ? 'opacity-30' : 'opacity-100'}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded bg-slate-200/50 hover:bg-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Spinning Wheel Container */}
      <div
        ref={wheelRef}
        onWheel={handleWheel}
        className="relative w-[520px] h-[520px] flex items-center justify-center rounded-full z-10"
      >
        {/* Fixed Active Pointer Bracket (At 12 o'clock, representing selected slot) */}
        <div className="absolute -top-6 z-30 flex flex-col items-center gap-1">
          <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce" />
          <div className="bg-blue-600 dark:bg-blue-500 text-white font-black text-[9px] px-2 py-0.5 tracking-wider uppercase shadow-[0_0_15px_rgba(37,99,235,0.2)] rounded">
            ACTIVE SYSTEM
          </div>
        </div>

        {/* Dynamic Radar Sweep Background Grid */}
        <div className="absolute w-[450px] h-[450px] rounded-full border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: 'conic-gradient(from 0deg, rgba(37,99,235,0.04), transparent 45%)' }}>
            <div className="w-full h-full animate-radar" style={{ animationDuration: '6s' }} />
          </div>
          {/* Inner ring marker */}
          <div className="w-[300px] h-[300px] rounded-full border border-dashed border-blue-500/15 animate-spin" style={{ animationDuration: '60s' }} />
        </div>

        {/* PHYSICAL SPINNING WHEEL TRACK */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full flex items-center justify-center"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transition: "transform 0.65s cubic-bezier(0.1, 0.8, 0.2, 1)"
          }}
        >
          {weaponNavItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            // Render wedges equally at idx * 30 degrees
            const angle = idx * 30;

            const isCurrentlySelected = activeIdx === idx;

            return (
              <div
                key={item.path}
                onClick={() => handleExecuteSelection(item)}
                style={{
                  transform: `rotate(${angle}deg) translateY(-170px)`
                }}
                className="absolute w-20 h-20 flex items-center justify-center"
              >
                {/* 
                  INVERSE ITEM ROTATION
                  We apply an opposite rotation inside the slot card container so that
                  as the wheel spins, the icons and labels always remain perfectly upright and readable!
                */}
                <div
                  style={{
                    transform: `rotate(${-(rotationAngle + angle)}deg)`,
                    transition: "transform 0.65s cubic-bezier(0.1, 0.8, 0.2, 1)"
                  }}
                  className={`w-18 h-18 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer border ${
                    isCurrentlySelected
                      ? "bg-blue-600 dark:bg-blue-500 text-white border-white scale-115 shadow-[0_0_25px_rgba(37,99,235,0.25)] z-20"
                      : isActive
                      ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-500/50 scale-105 z-10"
                      : "bg-white/95 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-6.5 h-6.5 transition-transform duration-300" />
                  <span className="text-[8px] font-black uppercase mt-1.5 px-0.5 truncate w-full text-center">
                    {item.label}
                  </span>
                  
                  {/* Tactical Wedge Index marker */}
                  <div className="absolute top-1 right-2 text-[7px] opacity-40 font-bold">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stationary Core Center Panel */}
        <div className="absolute w-[190px] h-[190px] rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center p-4 text-center z-25 shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
          {/* Tactical HUD ring overlays */}
          <div className="absolute inset-1 rounded-full border border-dashed border-slate-200/60 dark:border-slate-800/40 animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-blue-500/50" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-blue-500/50" />
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 h-[2px] w-3 bg-blue-500/50" />
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 h-[2px] w-3 bg-blue-500/50" />

          {selectedItem && (
            <div className="flex flex-col items-center justify-center gap-1.5 animate-fadeIn">
              <selectedItem.icon className="w-9 h-9 text-blue-600 dark:text-blue-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 truncate w-32 tracking-wider leading-none">
                  {selectedItem.label}
                </h3>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase truncate w-32 mt-1.5 leading-none">
                  {selectedItem.class}
                </p>
              </div>
              <div className="bg-blue-100/60 dark:bg-blue-950/30 text-[8px] text-blue-600 dark:text-blue-400 px-2 py-0.5 border border-blue-200/30 font-bold uppercase tracking-wider rounded">
                SLOT_{String(activeIdx + 1).padStart(2, "0")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Dynamic Stats Card (GTA V HUD Panel) */}
      <div className="absolute right-12 bottom-12 w-[380px] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-5 shadow-xl z-30 rounded-2xl transition-colors duration-300">
        {/* Selected weapon headers */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
          <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none mb-1">
            SURVEILLANCE SELECTION CORE
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider leading-none">
            {selectedItem.label}
          </div>
          <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-widest mt-1.5 font-bold">
            {selectedItem.class}
          </div>
        </div>

        {/* Weapon Ammo HUD status */}
        <div className="flex justify-between items-center mb-4 bg-slate-50 dark:bg-slate-950/30 p-2 border border-slate-100 dark:border-slate-850 rounded-xl">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">AMMUNITION / STATS CAPACITY</span>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 tracking-wider">{selectedItem.ammoType}</span>
        </div>

        {/* Stats progress bars */}
        <div className="flex flex-col gap-2.5">
          {[
            { label: "THREAT RESPONSE Capacity", value: selectedItem.threatCapacity },
            { label: "DETECTION SPEED Rate", value: selectedItem.speed },
            { label: "AI MODEL ACCURACY Rating", value: selectedItem.accuracy },
            { label: "SENSOR COVERAGE RANGE Limit", value: selectedItem.range }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1 text-[10px] font-bold">
              <div className="flex justify-between items-center uppercase text-slate-500 dark:text-slate-400">
                <span>{stat.label}</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono">{stat.value}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom instructions bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4 text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase text-center tracking-widest">
          SCROLL TO ROTATE WHEEL • CLICK SLOT TO ARM • PRESS ENTER TO SELECT
        </div>
      </div>
    </div>
  );
}
