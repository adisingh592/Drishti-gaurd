import { Camera, AlertTriangle, Users, Car, Activity, TrendingUp, Shield, Cpu, Clock, ChevronRight } from 'lucide-react';

const statCards = [
  { label: 'Active Cameras', value: '128', trend: '+2', icon: Camera, color: 'text-cyan-400', bg: 'bg-cyan-500/10', data: [60,70,65,80,75,90,85,100] },
  { label: 'Active Threats', value: '3', trend: '-1', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', data: [90,70,80,65,55,60,50,30] },
  { label: 'Crowd Density', value: '2,847', trend: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', data: [40,55,60,75,80,88,92,94] },
  { label: 'Vehicles Tracked', value: '482', trend: '+8', icon: Car, color: 'text-emerald-400', bg: 'bg-emerald-500/10', data: [50,60,55,70,65,75,80,85] },
];

const incidents = [
  { id: '#INC-2847', type: 'Weapon Detected', cam: 'CAM-001', time: '2m ago', severity: 'CRITICAL', color: 'text-red-400', dot: 'bg-red-400' },
  { id: '#INC-2846', type: 'Intrusion Alert', cam: 'CAM-007', time: '8m ago', severity: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  { id: '#INC-2845', type: 'Crowd Surge', cam: 'CAM-014', time: '15m ago', severity: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  { id: '#INC-2844', type: 'Rash Driving', cam: 'CAM-022', time: '32m ago', severity: 'MEDIUM', color: 'text-amber-400', dot: 'bg-amber-400' },
  { id: '#INC-2843', type: 'Perimeter Breach', cam: 'CAM-009', time: '1h ago', severity: 'CRITICAL', color: 'text-red-400', dot: 'bg-red-400' },
];

const hourlyData = [12,8,15,22,35,42,38,55,72,68,45,52];
const weeklyThreats = [28,35,22,45,38,52,41];
const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const w = 80, h = 30, sx = w / (data.length - 1);
  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * sx} ${h - (v / max) * h}`).join(' ');
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

function BarChart({ data, labels, maxVal = 60 }: { data: number[]; labels: string[]; maxVal?: number }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm transition-all" style={{
            height: `${(val / maxVal) * 100}%`,
            background: val > 40 ? 'linear-gradient(180deg, rgba(239,68,68,0.8), rgba(239,68,68,0.3))' : val > 25 ? 'linear-gradient(180deg, rgba(249,115,22,0.7), rgba(249,115,22,0.3))' : 'linear-gradient(180deg, rgba(0,245,255,0.6), rgba(0,245,255,0.2))',
            boxShadow: val > 40 ? '0 0 8px rgba(239,68,68,0.3)' : 'none',
          }} />
          <span className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Command Center</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-mono">Real-time surveillance overview • Last updated 2s ago</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400">ALL SYSTEMS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5 hover:border-cyan-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} border border-current/10 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-xs text-emerald-400 font-mono">{card.trend}</span>
              </div>
              <div className={`text-2xl font-bold ${card.color} mb-1`}>{card.value}</div>
              <div className="text-xs text-slate-500 dark:text-gray-500 mb-2">{card.label}</div>
              <MiniSparkline data={card.data} color={card.color === 'text-cyan-400' ? '#00f5ff' : card.color === 'text-red-400' ? '#ef4444' : card.color === 'text-blue-400' ? '#38bdf8' : '#10b981'} />
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live feeds */}
        <div className="lg:col-span-2 glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-400">LIVE SURVEILLANCE FEEDS</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-gray-500 font-mono">128 ACTIVE</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'CAM-001 • Sector A', threat: true },
              { label: 'CAM-002 • Entry', threat: false },
              { label: 'CAM-003 • Parking', threat: false },
              { label: 'CAM-004 • Plaza', threat: false },
              { label: 'CAM-005 • Road 5', threat: false },
              { label: 'CAM-006 • Gate B', threat: true },
            ].map(cam => (
              <div key={cam.label} className="relative rounded-lg overflow-hidden aspect-video"
                style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: cam.threat ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(0,245,255,0.1)' }}>
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                <div className="absolute inset-0 overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${cam.threat ? 'via-red-400/60' : 'via-cyan-400/40'} to-transparent`} style={{ animation: 'scanLine 2s linear infinite' }} />
                </div>
                {cam.threat && (
                  <div className="absolute top-3 left-4 w-8 h-12 border-2 border-red-400/70 rounded-sm">
                    <div className="absolute -top-3 left-0 text-[8px] text-red-400 font-mono bg-red-900/50 px-0.5">GUN</div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1" style={{ background: 'rgba(2,8,20,0.9)' }}>
                  <span className="text-[9px] font-mono text-gray-600">{cam.label}</span>
                  <span className={`text-[9px] font-mono ${cam.threat ? 'text-red-400 animate-blink' : 'text-emerald-400'}`}>● {cam.threat ? 'ALERT' : 'LIVE'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents + Threat Score */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-slate-500 dark:text-gray-400">THREAT SCORE</span>
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#dsGrad)" strokeWidth="8"
                  strokeDasharray={`${2*Math.PI*50*0.82} ${2*Math.PI*50*0.18}`} strokeLinecap="round" />
                <defs><linearGradient id="dsGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-black text-red-400">82</div>
                <div className="text-[10px] text-gray-500 font-mono">HIGH</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['3','Critical','text-red-400'],['5','High','text-orange-400'],['8','Medium','text-amber-400']].map(([n,l,c]) => (
                <div key={l} className="glass rounded-lg py-1.5"><div className={`text-sm font-bold ${c}`}>{n}</div><div className="text-[10px] text-gray-600 font-mono">{l}</div></div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-slate-500 dark:text-gray-400">RECENT INCIDENTS</span>
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div className="space-y-2">
              {incidents.map(inc => (
                <div key={inc.id} className="flex items-start gap-2 py-1.5 border-b border-slate-100 dark:border-slate-200 dark:border-white/5 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${inc.dot} ${inc.severity === 'CRITICAL' ? 'animate-ping' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-700 dark:text-gray-300 truncate">{inc.type}</div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">{inc.cam} • {inc.time}</div>
                  </div>
                  <span className={`text-[10px] font-mono flex-shrink-0 ${inc.color}`}>{inc.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-slate-500 dark:text-gray-400">HOURLY ALERTS</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <BarChart data={hourlyData} labels={hourlyData.map((_, i) => `${i + 8}h`)} />
        </div>
        <div className="glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-slate-500 dark:text-gray-400">WEEKLY THREATS</span>
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <BarChart data={weeklyThreats} labels={weekDays} maxVal={60} />
        </div>
      </div>

      {/* AI status */}
      <div className="glass rounded-xl p-4 border border-slate-200 dark:border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono text-cyan-400">AI MODEL STATUS</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Weapon Classifier', acc: 99.7, status: 'ACTIVE', color: 'text-emerald-400' },
            { name: 'Behavior Analysis', acc: 96.2, status: 'ACTIVE', color: 'text-emerald-400' },
            { name: 'Face Recognition', acc: 98.1, status: 'ACTIVE', color: 'text-emerald-400' },
            { name: 'Vehicle Classifier', acc: 97.8, status: 'ACTIVE', color: 'text-emerald-400' },
          ].map(model => (
            <div key={model.name} className="glass rounded-lg p-3 border border-slate-200 dark:border-slate-200 dark:border-white/5">
              <div className="text-xs text-slate-700 dark:text-gray-300 mb-1">{model.name}</div>
              <div className="text-xs text-slate-500 dark:text-gray-500 font-mono mb-2">{model.acc}% accuracy</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className={`text-[10px] font-mono ${model.color}`}>{model.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
