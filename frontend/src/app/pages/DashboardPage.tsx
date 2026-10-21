import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Cpu,
  Crosshair,
  Database,
  Download,
  FileText,
  HardDrive,
  Play,
  Radio,
  ShieldCheck,
  Users,
  Wifi,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import { useBackendHealth } from '../hooks/useBackendHealth';

/* ------------------------------------------------------------------ */
/* Sample data — the dashboard is a demo view until live feeds are wired */
/* ------------------------------------------------------------------ */

const stats: { value: string; label: string; sub: string; icon: LucideIcon; tone: 'olive' | 'warn' | 'safe' | 'sand' }[] = [
  { value: '128', label: 'Total Scans', sub: 'Today', icon: Crosshair, tone: 'olive' },
  { value: '07', label: 'Threats Detected', sub: 'Today', icon: AlertTriangle, tone: 'warn' },
  { value: '121', label: 'Safe', sub: 'Today', icon: ShieldCheck, tone: 'safe' },
  { value: '24h', label: 'System Uptime', sub: '99.6%', icon: Clock, tone: 'sand' },
];

const alerts: { title: string; place: string; time: string; level: 'HIGH' | 'MEDIUM' | 'LOW'; icon: LucideIcon }[] = [
  { title: 'Weapon Detected', place: 'Platform 3', time: '10:24 AM', level: 'HIGH', icon: Crosshair },
  { title: 'Overcrowding', place: 'Coach S5', time: '09:58 AM', level: 'MEDIUM', icon: Users },
  { title: 'All Clear', place: 'Gate Check', time: '09:30 AM', level: 'LOW', icon: CheckCircle2 },
];

const toneStyles = {
  olive: 'bg-olive-100 text-olive-600 dark:bg-olive-400/15 dark:text-olive-400',
  warn: 'bg-warn-bg text-warn',
  safe: 'bg-safe-bg text-safe',
  sand: 'bg-[#f1eadb] text-[#8a6a3d] dark:bg-[#d2a45e]/15 dark:text-[#d2a45e]',
};

const alertStyles = {
  HIGH: { card: 'bg-danger-bg border-danger/25', title: 'text-danger', icon: 'bg-danger/10 text-danger', badge: 'bg-danger/10 text-danger' },
  MEDIUM: { card: 'bg-warn-bg border-warn/25', title: 'text-warn', icon: 'bg-warn/10 text-warn', badge: 'bg-warn/10 text-warn' },
  LOW: { card: 'bg-safe-bg border-safe/25', title: 'text-safe', icon: 'bg-safe/10 text-safe', badge: 'bg-safe/10 text-safe' },
};

/* ------------------------------------------------------------------ */

function useLiveConfidence(points = 28) {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: points }, (_, i) => 92 + Math.sin(i / 2.5) * 3 + Math.random() * 2),
  );
  const [fps, setFps] = useState(18);

  useEffect(() => {
    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.min(99.4, Math.max(90, last + (Math.random() - 0.45) * 2.2));
        return [...prev.slice(1), next];
      });
      setFps(17 + Math.round(Math.random() * 2));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return { data, fps, current: data[data.length - 1] };
}

function ConfidenceSparkline({ data }: { data: number[] }) {
  const w = 240;
  const h = 56;
  const min = 88;
  const max = 100;
  const sx = w / (data.length - 1);
  const pts = data.map((v, i) => [i * sx, h - ((v - min) / (max - min)) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-14" aria-hidden="true">
      <defs>
        <linearGradient id="confFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#confFill)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Stylised camera frame (a bag on a platform floor) used as the demo feed. */
function FeedScene() {
  return (
    <svg viewBox="0 0 720 360" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="floor" cx="55%" cy="55%" r="75%">
          <stop offset="0%" stopColor="#6e6b63" />
          <stop offset="100%" stopColor="#35332e" />
        </radialGradient>
        <linearGradient id="bag" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5a5d63" />
          <stop offset="100%" stopColor="#34363b" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0" />
        </filter>
      </defs>
      <rect width="720" height="360" fill="url(#floor)" />
      <path d="M0 40 L120 0 M0 120 L200 0 M60 360 L20 200 L0 180" stroke="#2a2925" strokeWidth="10" opacity=".55" />
      <path d="M40 360 L90 150 L110 0" stroke="#8a877e" strokeWidth="3" opacity=".35" />
      <ellipse cx="365" cy="300" rx="190" ry="26" fill="#1e1d1a" opacity=".45" />
      {/* handles */}
      <path d="M290 150 C290 80 440 80 440 150" stroke="#23252a" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M315 150 C315 100 415 100 415 150" stroke="#2c2e33" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="215" y="140" width="300" height="160" rx="34" fill="url(#bag)" />
      <path d="M232 160 Q365 128 498 160" stroke="#6b6e74" strokeWidth="3" fill="none" opacity=".6" />
      <rect x="215" y="200" width="300" height="24" fill="#1f2125" />
      <rect x="330" y="248" width="70" height="30" rx="5" fill="#5e3f2a" />
      <path d="M232 262 Q365 282 498 262" stroke="#26282c" strokeWidth="2" fill="none" />
      <circle cx="500" cy="212" r="7" fill="#8e8a80" opacity=".6" />
      <rect width="720" height="360" filter="url(#grain)" />
    </svg>
  );
}

function LiveFeedCard() {
  const { data, fps, current } = useLiveConfidence();

  return (
    <section className="card-soft p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-safe animate-soft-pulse" />
          Live Detection Feed
        </h2>
        <span className="text-xs text-muted-foreground">Demo stream</span>
      </div>

      <div className="relative aspect-[4/3] sm:aspect-[16/8] rounded-2xl overflow-hidden bg-[#3a3833]">
        <FeedScene />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6dba0]/70 to-transparent"
          style={{ animation: 'scanLine 3.2s linear infinite' }}
        />

        {/* detection boxes */}
        <div className="absolute left-[24%] right-[24%] top-[11%] bottom-[10%] border-2 border-[#b7d78a]/80 rounded-lg" />
        <div className="absolute left-[29%] right-[29%] top-[30%] bottom-[16%]">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#5f8f30] text-white text-xs font-semibold tracking-wide">
            SAFE
          </span>
          {['top-0 left-0 border-t-4 border-l-4', 'top-0 right-0 border-t-4 border-r-4', 'bottom-0 left-0 border-b-4 border-l-4', 'bottom-0 right-0 border-b-4 border-r-4'].map((c) => (
            <span key={c} className={`absolute w-6 h-6 border-[#b7d78a] ${c}`} />
          ))}
          <div className="absolute inset-0 border-2 border-[#b7d78a]/70" />
        </div>

        <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#4b5d23] text-white text-xs font-semibold tracking-wider shadow">
          LIVE
        </span>
        <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/55 text-white text-xs font-medium backdrop-blur-sm">
          FPS: {fps}
        </span>
      </div>

      <div className="mt-4 grid sm:grid-cols-[1fr_auto_1.4fr] items-center gap-4 rounded-2xl bg-muted/60 p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-olive-100 dark:bg-olive-400/15 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-olive-600 dark:text-olive-400" strokeWidth={1.6} />
          </div>
          <div>
            <div className="text-lg">
              Status: <span className="font-semibold text-safe">Safe</span>
            </div>
            <div className="text-sm text-muted-foreground">No threat detected</div>
          </div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-border" />
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="text-2xl font-semibold text-olive-600 dark:text-olive-400 tabular-nums">{Math.round(current)}%</div>
          </div>
          <div className="flex-1 min-w-0">
            <ConfidenceSparkline data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow() {
  return (
    <section className="card-soft p-3 grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4 min-w-0">
            <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${toneStyles[s.tone]}`}>
              <Icon className="w-6 h-6" strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
              <div className="text-xs text-foreground/80 leading-snug">{s.label}</div>
              <div className={`text-xs leading-snug ${s.tone === 'sand' ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function QuickActions({ onSystemCheck, checking }: { onSystemCheck: () => void; checking: boolean }) {
  const exportData = () => {
    const snapshot = { exportedAt: new Date().toISOString(), stats, alerts };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drishtiguard-snapshot-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btn =
    'flex items-center justify-center sm:justify-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm hover:bg-muted hover:border-olive-300 transition-colors cursor-pointer';

  return (
    <section className="card-soft p-5 bg-muted/40">
      <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/app/live-detection" className={btn}>
          <Play className="w-4 h-4 text-olive-600 dark:text-olive-400" /> Start Scan
        </Link>
        <Link to="/app/incidents" className={btn}>
          <FileText className="w-4 h-4" /> View Reports
        </Link>
        <button onClick={exportData} className={btn}>
          <Download className="w-4 h-4" /> Export Data
        </button>
        <button onClick={onSystemCheck} className={btn} disabled={checking}>
          <Activity className={`w-4 h-4 ${checking ? 'animate-soft-pulse' : ''}`} /> {checking ? 'Checking…' : 'System Check'}
        </button>
      </div>
    </section>
  );
}

function ActiveAlerts() {
  return (
    <section className="card-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Active Alerts</h2>
        <Link to="/app/alerts" className="text-sm text-muted-foreground hover:text-foreground">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {alerts.map((a) => {
          const s = alertStyles[a.level];
          const Icon = a.icon;
          return (
            <div key={a.title} className={`flex items-center gap-4 rounded-2xl border p-4 ${s.card}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${s.icon}`}>
                <Icon className="w-6 h-6" strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold ${s.title}`}>{a.title}</div>
                <div className="text-sm text-foreground/75">
                  {a.place} • {a.time}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${s.badge}`}>{a.level}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SystemStatus({ backend, onCheck, checking }: { backend: 'checking' | 'online' | 'offline'; onCheck: () => void; checking: boolean }) {
  const online = backend === 'online';
  const rows: { label: string; value: string; icon: LucideIcon; ok: boolean }[] = [
    { label: 'Camera', value: 'Online', icon: Camera, ok: true },
    { label: 'AI Model', value: online ? 'Active' : backend === 'checking' ? 'Checking' : 'Unreachable', icon: Cpu, ok: online },
    { label: 'Sensors', value: 'Online', icon: Radio, ok: true },
    { label: 'Storage', value: 'Healthy', icon: HardDrive, ok: true },
    { label: 'Connectivity', value: online ? 'Strong' : backend === 'checking' ? 'Checking' : 'Offline', icon: Wifi, ok: online },
  ];
  const allGreen = rows.every((r) => r.ok);

  return (
    <section className="card-soft p-5">
      <h2 className="text-lg font-semibold mb-4">System Status</h2>
      <ul className="space-y-3.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.label} className="flex items-center gap-3 text-sm">
              <Icon className="w-4 h-4 text-foreground/70" strokeWidth={1.7} />
              <span className="flex-1">{r.label}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? 'bg-safe' : backend === 'checking' ? 'bg-muted-foreground' : 'bg-warn'}`} />
              <span className="w-24 text-right text-foreground/85">{r.value}</span>
            </li>
          );
        })}
      </ul>

      <button
        onClick={onCheck}
        disabled={checking}
        className={`mt-6 w-full flex items-center justify-between rounded-2xl px-6 py-4 font-medium shadow-md transition-all cursor-pointer hover:-translate-y-0.5 ${
          allGreen ? 'bg-primary text-primary-foreground' : 'bg-warn text-white'
        }`}
      >
        <span className="flex-1 text-center">{checking ? 'Running check…' : allGreen ? 'System All Green' : 'Attention Needed'}</span>
        <span className="w-8 h-8 rounded-full border-2 border-current/80 flex items-center justify-center">
          {allGreen ? <CheckCircle2 className="w-5 h-5" /> : <Database className="w-4 h-4" />}
        </span>
      </button>
    </section>
  );
}

export function DashboardPage() {
  const { status, check } = useBackendHealth();
  const [checking, setChecking] = useState(false);

  const runCheck = async () => {
    setChecking(true);
    await Promise.all([check(), new Promise((r) => setTimeout(r, 600))]);
    setChecking(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
      <div className="space-y-6 min-w-0">
        <LiveFeedCard />
        <StatRow />
        <QuickActions onSystemCheck={runCheck} checking={checking} />
      </div>
      <div className="space-y-6">
        <ActiveAlerts />
        <SystemStatus backend={status} onCheck={runCheck} checking={checking} />
      </div>
    </div>
  );
}
