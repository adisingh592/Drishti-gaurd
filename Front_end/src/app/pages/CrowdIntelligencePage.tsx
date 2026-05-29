import { Users, MapPin, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const heatmapData = [
  [10,20,45,80,95,90,70,40,20,10],[15,35,60,85,100,95,75,50,25,12],
  [20,45,75,90,95,85,65,45,30,15],[25,55,80,88,80,72,58,38,22,10],
  [30,50,70,78,72,60,45,30,18,8],[20,38,55,65,60,50,35,22,12,5],
  [12,25,40,50,48,38,28,16,8,3],[8,15,25,35,32,25,18,10,5,2],
];

const zones = [
  { name: 'Main Plaza', density: 95, count: '1,240', status: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { name: 'Entry Gate A', density: 78, count: '890', status: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { name: 'Corridor B', density: 45, count: '420', status: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { name: 'Parking Zone', density: 22, count: '180', status: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { name: 'Stadium West', density: 65, count: '670', status: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
];

const flowData = [30,45,38,62,55,80,95,88,72,85,90,78];

function getHeatColor(v: number) {
  if (v >= 80) return `rgba(239,68,68,${Math.min(1, v/100*1.1)})`;
  if (v >= 60) return `rgba(249,115,22,${v/100*0.85})`;
  if (v >= 40) return `rgba(234,179,8,${v/100*0.8})`;
  if (v >= 20) return `rgba(34,211,238,${v/100*0.7})`;
  return `rgba(0,245,255,${Math.max(0.05, v/100*0.4)})`;
}

export function CrowdIntelligencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Crowd Intelligence</h1>
        <p className="text-sm text-gray-500 font-mono">Real-time density monitoring • Panic detection • Smart city analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[['2,847','Total People','text-cyan-400',Users],['3','High Risk Zones','text-red-400',AlertTriangle],['68%','Avg Density','text-amber-400',Activity],['+12%','Flow Rate','text-emerald-400',TrendingUp]].map(([v,l,c,I]) => {
          const Icon = I as typeof Users;
          return (
            <div key={l as string} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${c}`} /><span className="text-xs text-gray-500 font-mono">{l}</span></div>
              <div className={`text-2xl font-bold ${c}`}>{v}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-2 glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">CROWD HEATMAP</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="text-xs text-gray-500 font-mono">LIVE</span></div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: '1px solid rgba(0,245,255,0.15)' }}>
            <div className="grid gap-1" style={{ gridTemplateRows: 'repeat(8, 1fr)', gridTemplateColumns: 'repeat(10, 1fr)' }}>
              {heatmapData.map((row, ri) => row.map((cell, ci) => (
                <div key={`${ri}-${ci}`} className="rounded-sm" style={{ height: '28px', background: getHeatColor(cell), boxShadow: cell >= 80 ? '0 0 6px rgba(239,68,68,0.4)' : 'none' }} />
              )))}
            </div>
            <div className="absolute top-3 left-3"><div className="text-xs font-mono text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30">ZONE_A: CRITICAL</div></div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600 font-mono">LOW</span>
              <div className="flex gap-0.5">{['rgba(0,245,255,0.3)','rgba(234,179,8,0.5)','rgba(249,115,22,0.6)','rgba(239,68,68,0.8)'].map((c,i) => (<div key={i} className="w-8 h-2.5 rounded-sm" style={{ background: c }} />))}</div>
              <span className="text-xs text-gray-600 font-mono">HIGH</span>
            </div>
          </div>

          {/* Crowd flow chart */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-mono text-gray-500">CROWD FLOW (LAST 12 MIN)</span><TrendingUp className="w-3.5 h-3.5 text-cyan-400" /></div>
            <svg width="100%" viewBox="0 0 280 80" className="overflow-visible">
              <defs><linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(0,245,255,0.3)" /><stop offset="100%" stopColor="rgba(0,245,255,0.01)" /></linearGradient></defs>
              {(() => { const sx = 280/(flowData.length-1); const d = flowData.map((p,i) => `${i===0?'M':'L'} ${i*sx} ${80-(p/100)*80}`).join(' '); return (<><path d={d + ` L 280 80 L 0 80 Z`} fill="url(#cfGrad)" /><path d={d} fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" /></>); })()}
            </svg>
          </div>
        </div>

        {/* Zone details */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <span className="text-sm font-mono text-cyan-400">ZONE ANALYSIS</span>
            <div className="space-y-3 mt-3">
              {zones.map(zone => (
                <div key={zone.name} className={`rounded-xl p-3 border ${zone.bg} ${zone.border}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div><div className="text-sm font-semibold text-slate-850 dark:text-white">{zone.name}</div><div className={`text-xs font-mono ${zone.color}`}>{zone.status}</div></div>
                    <div className="text-right"><div className={`text-lg font-bold ${zone.color}`}>{zone.count}</div><div className="text-[10px] text-gray-600">people</div></div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${zone.density}%`, background: zone.density >= 80 ? 'linear-gradient(90deg,#ef4444,#f97316)' : zone.density >= 60 ? 'linear-gradient(90deg,#f97316,#eab308)' : zone.density >= 40 ? 'linear-gradient(90deg,#eab308,#22d3ee)' : 'linear-gradient(90deg,#22d3ee,#00f5ff)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panic detection */}
          <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-xs font-mono text-red-400">PANIC DETECTION</span><div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping ml-auto" /></div>
            <p className="text-xs text-gray-500 mb-2">Anomalous dispersal pattern in Zone A. Escalation risk: HIGH.</p>
            <button className="w-full text-xs font-mono text-red-400 border border-red-500/30 rounded-lg py-1.5 hover:bg-red-500/10 transition-all">DISPATCH RESPONSE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
