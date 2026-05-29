import { Bell, AlertTriangle, Shield, Clock, Phone, ChevronRight, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const activeAlerts = [
  { id: 'ALT-001', type: 'WEAPON DETECTED', location: 'Sector A - Main Hall', time: '14:32:07', severity: 'CRITICAL', status: 'active', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'ALT-002', type: 'INTRUSION ALERT', location: 'Gate B - West Wing', time: '14:31:45', severity: 'CRITICAL', status: 'active', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'ALT-003', type: 'RASH DRIVING', location: 'Road 5 - Highway', time: '14:30:22', severity: 'HIGH', status: 'escalated', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'ALT-004', type: 'CROWD SURGE', location: 'Central Plaza', time: '14:28:15', severity: 'HIGH', status: 'investigating', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'ALT-005', type: 'SUSPICIOUS MOVEMENT', location: 'Parking Zone B', time: '14:15:03', severity: 'MEDIUM', status: 'monitoring', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
];

const resolvedAlerts = [
  { id: 'ALT-R01', type: 'Perimeter Breach', time: '13:45', resolvedBy: 'Team Alpha', resolvedAt: '13:47' },
  { id: 'ALT-R02', type: 'Knife Detected', time: '12:18', resolvedBy: 'Team Bravo', resolvedAt: '12:21' },
  { id: 'ALT-R03', type: 'Vehicle Accident', time: '09:32', resolvedBy: 'Emergency Services', resolvedAt: '09:40' },
];

const emergencyContacts = [
  { name: 'Security HQ', phone: '+1-800-SEC-001', type: 'Primary', color: 'text-cyan-400' },
  { name: 'Police Control', phone: '+1-800-POL-911', type: 'Emergency', color: 'text-red-400' },
  { name: 'Fire Department', phone: '+1-800-FIR-911', type: 'Emergency', color: 'text-orange-400' },
  { name: 'Medical Response', phone: '+1-800-MED-911', type: 'Medical', color: 'text-emerald-400' },
];

export function AlertCenterPage() {
  const [alerts, setAlerts] = useState(activeAlerts);

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Alert Center</h1>
          <p className="text-sm text-gray-500 font-mono">{alerts.length} active alerts • Emergency response</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="text-xs font-mono text-red-400">LIVE MONITORING</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[['2','Critical','text-red-400'],['2','High','text-orange-400'],['1','Medium','text-amber-400'],['3','Resolved','text-emerald-400']].map(([v,l,c]) => (
          <div key={l} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5"><div className={`text-2xl font-bold ${c}`}>{v}</div><div className="text-xs text-gray-500 font-mono">{l}</div></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active alerts */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-2"><Bell className="w-4 h-4 text-red-400" /><span className="text-sm font-mono text-red-400">ACTIVE ALERTS</span></div>
          {alerts.map(alert => (
            <div key={alert.id} className={`glass rounded-xl p-4 border ${alert.border} transition-all hover:border-cyan-500/30`}
              style={{ boxShadow: alert.severity === 'CRITICAL' ? '0 0 20px rgba(239,68,68,0.15)' : 'none' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${alert.bg} flex items-center justify-center flex-shrink-0`}>
                    <AlertTriangle className={`w-4 h-4 ${alert.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${alert.color}`}>{alert.type}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${alert.bg} ${alert.color} border ${alert.border}`}>{alert.severity}</span>
                    </div>
                    <div className="text-xs text-gray-500">{alert.location}</div>
                    <div className="text-[10px] text-gray-600 font-mono mt-1">{alert.time} • Status: {alert.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => resolveAlert(alert.id)}
                    className="glass rounded-lg p-1.5 border border-slate-200 dark:border-white/5 text-gray-500 hover:text-emerald-400 transition-all">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="glass rounded-lg p-1.5 border border-slate-200 dark:border-white/5 text-gray-500 hover:text-cyan-400 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="glass rounded-xl p-8 border border-emerald-500/20 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <div className="text-slate-850 dark:text-white font-semibold">All Clear</div>
              <div className="text-gray-500 text-sm">No active alerts</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Emergency contacts */}
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3"><Phone className="w-4 h-4 text-red-400" /><span className="text-sm font-mono text-red-400">EMERGENCY CONTACTS</span></div>
            <div className="space-y-2">
              {emergencyContacts.map(contact => (
                <div key={contact.name} className="glass rounded-lg p-3 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div><div className="text-xs text-slate-800 dark:text-gray-300">{contact.name}</div><div className="text-[10px] text-gray-650 dark:text-gray-500 font-mono">{contact.type}</div></div>
                  <span className={`text-xs font-mono ${contact.color}`}>{contact.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolved */}
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-emerald-400" /><span className="text-sm font-mono text-emerald-400">RECENTLY RESOLVED</span></div>
            <div className="space-y-2">
              {resolvedAlerts.map(a => (
                <div key={a.id} className="flex items-start gap-2 py-1.5 border-b border-slate-200 dark:border-white/5 last:border-0">
                  <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-800 dark:text-gray-300">{a.type}</div>
                    <div className="text-[10px] text-gray-650 dark:text-gray-500 font-mono">{a.time} → {a.resolvedAt} • {a.resolvedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live feed */}
          <div className="glass rounded-xl p-4 neon-border">
            <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">LIVE ALERT FEED</span></div>
            <div className="space-y-1.5">
              {['Weapon alert dispatched → Team Alpha','Crowd surge monitoring → Zone C active','Perimeter breach resolved → 2min response','Rash driving logged → ANPR captured','AI model update → v4.2.1 deployed'].map((msg, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-[10px]">
                  <span className="text-gray-400">{msg}</span>
                  <span className="text-gray-600 font-mono flex-shrink-0">{i+1}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
