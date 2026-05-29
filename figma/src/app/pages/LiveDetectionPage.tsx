import { useState } from 'react';
import { Camera, AlertTriangle, Activity, Maximize2, Grid3x3, LayoutGrid, Eye, Target } from 'lucide-react';

const cameras = [
  { id: 'CAM-001', name: 'Sector A - Main', status: 'threat', threat: 'WEAPON DETECTED' },
  { id: 'CAM-002', name: 'Entry Gate', status: 'live', threat: null },
  { id: 'CAM-003', name: 'Parking Zone', status: 'live', threat: null },
  { id: 'CAM-004', name: 'Central Plaza', status: 'live', threat: null },
  { id: 'CAM-005', name: 'Road 5 - Highway', status: 'alert', threat: 'RASH DRIVING' },
  { id: 'CAM-006', name: 'Gate B - West', status: 'threat', threat: 'INTRUSION' },
  { id: 'CAM-007', name: 'Corridor B', status: 'live', threat: null },
  { id: 'CAM-008', name: 'Stadium Entry', status: 'live', threat: null },
  { id: 'CAM-009', name: 'Sector C - Admin', status: 'alert', threat: 'CROWD SURGE' },
];

const alerts = [
  { time: '14:32:07', type: 'WEAPON', cam: 'CAM-001', level: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { time: '14:31:45', type: 'INTRUSION', cam: 'CAM-006', level: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { time: '14:30:22', type: 'RASH DRIVING', cam: 'CAM-005', level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { time: '14:28:15', type: 'CROWD SURGE', cam: 'CAM-009', level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

type GridLayout = '2x2' | '3x3' | '1+5';

function CameraFeed({ cam, large }: { cam: typeof cameras[0]; large?: boolean }) {
  const isThreat = cam.status === 'threat';
  const isAlert = cam.status === 'alert';

  return (
    <div className={`relative rounded-lg overflow-hidden transition-all ${large ? 'col-span-2 row-span-2' : ''}`}
      style={{ border: isThreat ? '1px solid rgba(239,68,68,0.5)' : isAlert ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(0,245,255,0.15)',
        boxShadow: isThreat ? '0 0 15px rgba(239,68,68,0.2)' : isAlert ? '0 0 10px rgba(249,115,22,0.15)' : 'none' }}>
      <div className={`relative overflow-hidden ${large ? 'aspect-video' : 'aspect-video'}`}
        style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', minHeight: large ? '280px' : '160px' }}>
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${isThreat ? 'via-red-500/80' : 'via-cyan-400/50'} to-transparent`}
            style={{ animation: `scanLine ${isThreat ? '1.5' : '2.5'}s linear infinite` }} />
        </div>
        {/* Detection boxes */}
        {isThreat && (
          <div className="absolute top-6 left-6 w-16 h-20 border-2 border-red-400 rounded-sm"
            style={{ boxShadow: '0 0 10px rgba(239,68,68,0.6)', animation: 'glowPulse 1s ease-in-out infinite' }}>
            <div className="absolute -top-4 left-0 text-xs text-red-400 font-mono bg-red-900/50 px-1 whitespace-nowrap">
              {cam.threat} 97%
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-300" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-300" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-300" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-300" />
          </div>
        )}
        {!isThreat && !isAlert && (
          <>
            <div className="absolute top-6 right-6 w-10 h-14 border border-cyan-400/50 rounded-sm">
              <div className="absolute -top-3 left-0 text-[10px] text-cyan-400 font-mono">PERSON</div>
            </div>
            <div className="absolute bottom-10 left-8 w-8 h-12 border border-cyan-400/50 rounded-sm">
              <div className="absolute -top-3 left-0 text-[10px] text-cyan-400 font-mono">PERSON</div>
            </div>
          </>
        )}
        {isAlert && (
          <div className="absolute top-6 right-6 w-20 h-10 border-2 border-orange-400 rounded-sm">
            <div className="absolute -top-4 left-0 text-[10px] text-orange-400 font-mono bg-orange-900/50 px-1">{cam.threat}</div>
          </div>
        )}
        {/* Corner markers */}
        <div className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${isThreat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${isThreat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className={`absolute bottom-6 left-1 w-4 h-4 border-b-2 border-l-2 ${isThreat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        <div className={`absolute bottom-6 right-1 w-4 h-4 border-b-2 border-r-2 ${isThreat ? 'border-red-400/60' : 'border-cyan-400/40'}`} />
        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1" style={{ background: 'rgba(2,8,20,0.9)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500">{cam.id}</span>
            <span className="text-[10px] text-gray-600 hidden sm:inline">{cam.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-cyan-400 transition-colors"><Maximize2 className="w-3 h-3" /></button>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isThreat ? 'bg-red-400 animate-ping' : isAlert ? 'bg-orange-400' : 'bg-emerald-400'}`} />
              <span className={`text-[10px] font-mono ${isThreat ? 'text-red-400 animate-blink' : isAlert ? 'text-orange-400' : 'text-emerald-400'}`}>
                {isThreat ? 'ALERT' : isAlert ? 'WARNING' : 'LIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveDetectionPage() {
  const [gridLayout, setGridLayout] = useState<GridLayout>('3x3');
  const [showRadar, setShowRadar] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Live Detection</h1>
          <p className="text-sm text-gray-500 font-mono">Real-time AI monitoring • 9 cameras active</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 glass rounded-lg p-1 border border-slate-200 dark:border-white/10">
            {([['2x2','2x2'],['3x3','3x3'],['1+5','1+5']] as [GridLayout, string][]).map(([val, label]) => (
              <button key={val} onClick={() => setGridLayout(val)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${gridLayout === val ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowRadar(!showRadar)}
            className={`glass rounded-lg px-3 py-1.5 text-xs font-mono border transition-all ${showRadar ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-450 hover:text-slate-800 dark:hover:text-gray-200'}`}>
            <Target className="w-3.5 h-3.5 inline mr-1" /> Radar
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className={`grid gap-2 ${gridLayout === '2x2' ? 'grid-cols-2' : gridLayout === '3x3' ? 'grid-cols-3' : 'grid-cols-3'}`}>
            {cameras.slice(0, gridLayout === '2x2' ? 4 : 9).map((cam, i) => (
              <CameraFeed key={cam.id} cam={cam} large={gridLayout === '1+5' && i === 0} />
            ))}
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { icon: Camera, label: 'Feeds', value: '9', color: 'text-cyan-400' },
              { icon: Target, label: 'Tracked', value: '47', color: 'text-blue-400' },
              { icon: AlertTriangle, label: 'Alerts', value: '3', color: 'text-red-400' },
              { icon: Activity, label: 'FPS', value: '30', color: 'text-emerald-400' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass rounded-lg p-3 text-center border border-slate-200 dark:border-white/5">
                  <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-gray-600 font-mono">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Radar */}
          {showRadar && (
            <div className="glass rounded-xl p-4 neon-border">
              <div className="text-xs font-mono text-cyan-400 text-center mb-3">AI RADAR</div>
              <div className="relative w-40 h-40 mx-auto">
                {[1,2,3].map(i => <div key={i} className="absolute inset-0 rounded-full border border-cyan-500/20" style={{ margin: `${(3-i)*15}px` }} />)}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
                </div>
                <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: 'conic-gradient(from 0deg, rgba(0,245,255,0.25), transparent 60%)' }}>
                  <div className="w-full h-full animate-radar" />
                </div>
                <div className="absolute top-6 left-10 w-2 h-2 rounded-full bg-red-400 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="absolute top-16 right-8 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          )}

          {/* Alert feed */}
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-mono text-red-400">LIVE ALERTS</span>
            </div>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.time + alert.cam} className={`rounded-lg p-2.5 border ${alert.bg} ${alert.border}`}>
                  <div className="flex items-start justify-between gap-1">
                    <div><div className={`text-xs font-bold font-mono ${alert.color}`}>{alert.type}</div><div className="text-[10px] text-gray-500">{alert.cam}</div></div>
                    <span className={`text-[10px] font-mono ${alert.color}`}>{alert.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI detection log */}
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-400">DETECTION LOG</span>
            </div>
            <div className="space-y-1.5">
              {['Person x3 • CAM-002','Vehicle x2 • CAM-005','Person x5 • CAM-004','Bag • CAM-007','Person x2 • CAM-008'].map((log, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-mono">{log}</span>
                  <span className="text-gray-600">{14 - i * 2}s ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
