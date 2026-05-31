import { Activity, TrendingUp, Target, Cpu, AlertTriangle, BarChart2 } from 'lucide-react';

const threatCategories = [
  { name: 'Weapons', count: 47, pct: 28, color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'Intrusion', count: 35, pct: 21, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { name: 'Aggression', count: 28, pct: 17, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'Traffic', count: 22, pct: 13, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { name: 'Crowd Panic', count: 18, pct: 11, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Other', count: 16, pct: 10, color: 'text-gray-400', bg: 'bg-gray-500/10' },
];

const dailyData = [35,42,28,55,48,62,45,52,38,65,50,58,42,55];
const weeklyData = [28,35,22,45,38,52,41];
const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const aiModels = [
  { name: 'Weapon Classifier', acc: 99.7, falsePos: 0.08, status: 'ACTIVE' },
  { name: 'Behavior Analysis', acc: 96.2, falsePos: 0.4, status: 'ACTIVE' },
  { name: 'Intrusion Detection', acc: 98.5, falsePos: 0.2, status: 'ACTIVE' },
  { name: 'Crowd Analyzer', acc: 94.8, falsePos: 0.6, status: 'ACTIVE' },
  { name: 'Vehicle Classifier', acc: 97.8, falsePos: 0.3, status: 'ACTIVE' },
];

export function ThreatAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Threat Analytics</h1>
        <p className="text-sm text-gray-500 font-mono">AI threat prediction • Detection trends • Performance insights</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[['166','Total Threats','text-red-400',Target],['99.4%','AI Accuracy','text-cyan-400',Cpu],['< 50ms','Avg Response','text-emerald-400',Activity],['82','Threat Score','text-orange-400',AlertTriangle]].map(([v,l,c,I]) => {
          const Icon = I as typeof Target;
          return (<div key={l as string} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5"><div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${c}`} /><span className="text-xs text-gray-500 font-mono">{l}</span></div><div className={`text-2xl font-bold ${c}`}>{v}</div></div>);
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-4"><span className="text-sm font-mono text-gray-400">DAILY THREAT TREND (2 WEEKS)</span><TrendingUp className="w-4 h-4 text-red-400" /></div>
            <div className="flex items-end gap-2 h-36">
              {dailyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{ height: `${(val/70)*100}%`, background: val > 55 ? 'linear-gradient(180deg, rgba(239,68,68,0.8), rgba(239,68,68,0.3))' : val > 40 ? 'linear-gradient(180deg, rgba(249,115,22,0.7), rgba(249,115,22,0.3))' : 'linear-gradient(180deg, rgba(0,245,255,0.6), rgba(0,245,255,0.2))', boxShadow: val > 55 ? '0 0 8px rgba(239,68,68,0.3)' : 'none' }} />
                  <span className="text-[9px] text-gray-600 font-mono">D{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-4"><span className="text-sm font-mono text-gray-400">WEEKLY COMPARISON</span><BarChart2 className="w-4 h-4 text-cyan-400" /></div>
            <div className="flex items-end gap-3 h-28">
              {weeklyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-mono text-gray-500">{val}</div>
                  <div className="w-full rounded-t-sm" style={{ height: `${(val/60)*100}%`, background: 'linear-gradient(180deg, rgba(0,245,255,0.6), rgba(0,245,255,0.2))' }} />
                  <span className="text-[10px] text-gray-500 font-mono">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <span className="text-sm font-mono text-gray-400 mb-4 block">THREAT CATEGORIES</span>
            <div className="space-y-3">
              {threatCategories.map(cat => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs font-bold ${cat.color}`}>{cat.count}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-800 dark:text-gray-300">{cat.name}</span>
                      <span className={`text-xs font-mono ${cat.color}`}>{cat.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.bg}`} style={{ width: `${cat.pct}%`, background: cat.color.includes('red') ? '#ef4444' : cat.color.includes('orange') ? '#f97316' : cat.color.includes('amber') ? '#f59e0b' : cat.color.includes('yellow') ? '#eab308' : cat.color.includes('blue') ? '#38bdf8' : '#6b7280' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Performance */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4"><Cpu className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">AI MODEL PERFORMANCE</span></div>
            <div className="space-y-3">
              {aiModels.map(model => (
                <div key={model.name} className="glass rounded-lg p-3 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-800 dark:text-gray-300">{model.name}</span>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[10px] font-mono text-emerald-400">{model.status}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div><div className="text-[10px] text-gray-600 font-mono">Accuracy</div><div className="text-sm font-bold text-cyan-400">{model.acc}%</div></div>
                    <div><div className="text-[10px] text-gray-600 font-mono">False Positive</div><div className="text-sm font-bold text-amber-400">{model.falsePos}%</div></div>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full rounded-full" style={{ width: `${model.acc}%`, background: 'linear-gradient(90deg, #00f5ff, #0ea5e9)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threat prediction */}
          <div className="glass rounded-xl p-4 neon-border">
            <span className="text-sm font-mono text-cyan-400">THREAT PREDICTION</span>
            <div className="space-y-3 mt-3">
              {[['Next 1h','LOW','text-emerald-400','15%'],['Next 6h','MEDIUM','text-amber-400','38%'],['Next 24h','ELEVATED','text-orange-400','52%']].map(([t,l,c,p]) => (
                <div key={t as string} className="flex items-center justify-between">
                  <div><div className="text-xs text-slate-800 dark:text-gray-300">{t}</div><div className={`text-xs font-mono ${c}`}>{l}</div></div>
                  <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: p as string, background: c.includes('emerald') ? '#10b981' : c.includes('amber') ? '#f59e0b' : '#f97316' }} /></div><span className="text-xs font-mono text-gray-500">{p}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
