import { useState } from 'react';
import { FileText, Search, Filter, Download, Calendar, AlertTriangle, ChevronDown, Clock, Shield } from 'lucide-react';

type Severity = 'all' | 'emergency' | 'high' | 'warning' | 'safe';

const incidents = [
  { id: 'INC-2847', date: '2026-05-28 14:32', type: 'Weapon Detected', location: 'Sector A - Main Hall', severity: 'emergency' as Severity, status: 'Active', summary: 'AI detected a handgun in Sector A with 97% confidence. Security team dispatched.' },
  { id: 'INC-2846', date: '2026-05-28 14:31', type: 'Intrusion Alert', location: 'Gate B - West Wing', severity: 'emergency' as Severity, status: 'Active', summary: 'Unauthorized perimeter breach detected. Individual tracking active.' },
  { id: 'INC-2845', date: '2026-05-28 14:28', type: 'Crowd Surge', location: 'Central Plaza', severity: 'high' as Severity, status: 'Investigating', summary: 'Anomalous crowd density spike. Panic movement pattern detected in Zone C.' },
  { id: 'INC-2844', date: '2026-05-28 14:22', type: 'Rash Driving', location: 'Road 5 - Highway', severity: 'warning' as Severity, status: 'Logged', summary: 'Vehicle exceeding speed limit by 40km/h. ANPR captured license plate.' },
  { id: 'INC-2843', date: '2026-05-28 13:45', type: 'Perimeter Breach', location: 'Sector C - Admin', severity: 'emergency' as Severity, status: 'Resolved', summary: 'Restricted zone accessed without credentials. Security responded in 2min.' },
  { id: 'INC-2842', date: '2026-05-28 12:18', type: 'Suspicious Movement', location: 'Parking Zone B', severity: 'warning' as Severity, status: 'Resolved', summary: 'Lingering individual flagged by behavior AI. No threat confirmed.' },
  { id: 'INC-2841', date: '2026-05-28 11:05', type: 'Area Cleared', location: 'Stadium Entry', severity: 'safe' as Severity, status: 'Closed', summary: 'Post-event sweep completed. No threats detected. Area secured.' },
  { id: 'INC-2840', date: '2026-05-28 09:32', type: 'Knife Detected', location: 'Gate A - Screening', severity: 'high' as Severity, status: 'Resolved', summary: 'Bladed object detected in bag scan. Item confiscated, individual detained.' },
  { id: 'INC-2839', date: '2026-05-27 22:14', type: 'Vehicle Accident', location: 'Intersection 3', severity: 'high' as Severity, status: 'Resolved', summary: 'Two-vehicle collision detected. Emergency services auto-notified.' },
  { id: 'INC-2838', date: '2026-05-27 18:45', type: 'Normal Activity', location: 'Corridor B', severity: 'safe' as Severity, status: 'Closed', summary: 'False alert triggered by motion sensor. AI confirmed no threat.' },
];

const severityConfig = {
  emergency: { label: 'EMERGENCY', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
  high: { label: 'HIGH ALERT', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400' },
  warning: { label: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  safe: { label: 'SAFE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  all: { label: 'ALL', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-400' },
};

export function IncidentReportsPage() {
  const [filter, setFilter] = useState<Severity>('all');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(inc => {
    const matchFilter = filter === 'all' || inc.severity === filter;
    const matchSearch = search === '' || inc.type.toLowerCase().includes(search.toLowerCase()) || inc.location.toLowerCase().includes(search.toLowerCase()) || inc.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Incident Reports</h1>
          <p className="text-sm text-gray-500 font-mono">{incidents.length} incidents logged • Last 24h</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline text-xs py-2 px-3 flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Export CSV</button>
          <button className="btn-primary text-xs py-2 px-3 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> New Report</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-600" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents..."
            className="w-full bg-slate-200/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all" />
        </div>
        <div className="flex items-center gap-1 glass rounded-lg p-1 border border-slate-200 dark:border-white/10">
          {(['all','emergency','high','warning','safe'] as Severity[]).map(sev => (
            <button key={sev} onClick={() => setFilter(sev)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${filter === sev ? `${severityConfig[sev].bg} ${severityConfig[sev].color} border ${severityConfig[sev].border}` : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-250'}`}>
              {severityConfig[sev].label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {(['emergency','high','warning','safe'] as Severity[]).map(sev => {
          const count = incidents.filter(i => i.severity === sev).length;
          const cfg = severityConfig[sev];
          return (
            <button key={sev} onClick={() => setFilter(filter === sev ? 'all' : sev)}
              className={`glass rounded-xl p-3 border transition-all ${filter === sev ? cfg.border : 'border-slate-200 dark:border-white/5'}`}>
              <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
              <div className="text-xs text-gray-500 font-mono">{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Incident list */}
      <div className="space-y-3">
        {filtered.map(inc => {
          const cfg = severityConfig[inc.severity];
          return (
            <div key={inc.id} className={`glass rounded-xl p-4 border transition-all hover:border-cyan-500/20 ${cfg.border}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${cfg.dot} ${inc.severity === 'emergency' ? 'animate-ping' : ''}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-850 dark:text-white">{inc.type}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{inc.location}</div>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-xl">{inc.summary}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-gray-400 font-mono">{inc.id}</div>
                  <div className="text-[10px] text-gray-600 font-mono">{inc.date}</div>
                  <div className={`text-[10px] font-mono mt-1 ${inc.status === 'Active' ? 'text-red-400' : inc.status === 'Investigating' ? 'text-amber-400' : inc.status === 'Resolved' ? 'text-emerald-400' : 'text-gray-500'}`}>{inc.status}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
