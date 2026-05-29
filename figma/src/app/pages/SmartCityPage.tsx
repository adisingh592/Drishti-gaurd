import { Globe, Camera, AlertTriangle, Users, Car, MapPin, Activity } from 'lucide-react';

const cityZones = [
  { name: 'Zone A - Central', threats: 2, cameras: 24, crowd: 'HIGH', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { name: 'Zone B - North', threats: 0, cameras: 18, crowd: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'Zone C - South', threats: 1, cameras: 32, crowd: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { name: 'Zone D - East', threats: 0, cameras: 22, crowd: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'Zone E - West', threats: 1, cameras: 28, crowd: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

export function SmartCityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Smart City Monitoring</h1>
        <p className="text-sm text-gray-500 font-mono">City-wide surveillance • Integrated analytics • Real-time overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[['5','Zones','text-cyan-400',Globe],['128','Cameras','text-blue-400',Camera],['4','Threats','text-red-400',AlertTriangle],['2,847','People','text-amber-400',Users],['482','Vehicles','text-emerald-400',Car]].map(([v,l,c,I]) => {
          const Icon = I as typeof Globe;
          return (<div key={l as string} className="glass rounded-xl p-3 border border-slate-200 dark:border-white/5 text-center"><Icon className={`w-4 h-4 ${c} mx-auto mb-1`} /><div className={`text-lg font-bold ${c}`}>{v}</div><div className="text-[10px] text-gray-500 font-mono">{l}</div></div>);
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* City map */}
        <div className="lg:col-span-2 glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">CITY MAP OVERVIEW</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="text-xs font-mono text-gray-500">LIVE</span></div>
          </div>
          <div className="relative rounded-xl overflow-hidden p-6" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: '1px solid rgba(0,245,255,0.15)', minHeight: '400px' }}>
            {/* Grid */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Zone indicators */}
            {[
              { top: '20%', left: '30%', name: 'A', threat: true },
              { top: '15%', left: '60%', name: 'B', threat: false },
              { top: '55%', left: '25%', name: 'C', threat: true },
              { top: '50%', left: '65%', name: 'D', threat: false },
              { top: '75%', left: '45%', name: 'E', threat: true },
            ].map(zone => (
              <div key={zone.name} className="absolute" style={{ top: zone.top, left: zone.left }}>
                <div className={`relative w-12 h-12 rounded-full ${zone.threat ? 'bg-red-500/20 border-2 border-red-400/50' : 'bg-cyan-500/10 border-2 border-cyan-400/30'} flex items-center justify-center`}
                  style={{ boxShadow: zone.threat ? '0 0 20px rgba(239,68,68,0.3)' : '0 0 10px rgba(0,245,255,0.2)' }}>
                  <span className={`text-sm font-bold ${zone.threat ? 'text-red-400' : 'text-cyan-400'}`}>{zone.name}</span>
                  {zone.threat && <div className="absolute inset-0 rounded-full border-2 border-red-400/40 animate-ping" style={{ animationDuration: '2s' }} />}
                </div>
              </div>
            ))}

            {/* Road lines */}
            <div className="absolute top-0 bottom-0 left-[40%] w-px bg-white/10" />
            <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/10" />
            <div className="absolute left-0 right-0 top-[40%] h-px bg-white/10" />
            <div className="absolute left-0 right-0 top-[60%] h-px bg-white/10" />

            {/* Camera dots */}
            {[
              { top: '22%', left: '35%' }, { top: '18%', left: '55%' }, { top: '40%', left: '30%' },
              { top: '60%', left: '70%' }, { top: '75%', left: '50%' }, { top: '30%', left: '45%' },
              { top: '45%', left: '20%' }, { top: '65%', left: '60%' },
            ].map((cam, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/60" style={{ top: cam.top, left: cam.left, boxShadow: '0 0 4px rgba(0,245,255,0.4)' }} />
            ))}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 space-y-1">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] text-gray-500 font-mono">Threat Active</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-[10px] text-gray-500 font-mono">Zone Clear</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" /><span className="text-[10px] text-gray-500 font-mono">Camera</span></div>
            </div>
          </div>
        </div>

        {/* Zone details */}
        <div className="space-y-4">
          {cityZones.map(zone => (
            <div key={zone.name} className={`glass rounded-xl p-4 border ${zone.border} transition-all hover:border-cyan-500/30`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${zone.color}`} />
                  <span className="text-sm font-semibold text-slate-850 dark:text-white">{zone.name}</span>
                </div>
                {zone.threats > 0 && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${zone.bg} ${zone.color} border ${zone.border}`}>
                    {zone.threats} THREAT{zone.threats > 1 ? 'S' : ''}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><div className="text-xs text-gray-600 font-mono">Cameras</div><div className="text-sm font-bold text-blue-400">{zone.cameras}</div></div>
                <div><div className="text-xs text-gray-600 font-mono">Crowd</div><div className={`text-sm font-bold ${zone.color}`}>{zone.crowd}</div></div>
                <div><div className="text-xs text-gray-600 font-mono">Status</div><div className={`text-sm font-bold ${zone.threats > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{zone.threats > 0 ? 'ALERT' : 'CLEAR'}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
