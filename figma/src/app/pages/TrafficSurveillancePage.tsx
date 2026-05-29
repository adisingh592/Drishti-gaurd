import { Car, AlertTriangle, Activity, Gauge, MapPin, TrendingUp } from 'lucide-react';

const vehicles = [
  { plate: 'MH-01-AB-1234', type: 'Sedan', speed: 82, zone: 'Highway A', status: 'normal', color: 'text-cyan-400' },
  { plate: 'DL-05-CD-5678', type: 'Truck', speed: 124, zone: 'Road 5', status: 'rash', color: 'text-red-400' },
  { plate: 'KA-03-EF-9012', type: 'SUV', speed: 45, zone: 'Intersection 3', status: 'normal', color: 'text-cyan-400' },
  { plate: 'TN-07-GH-3456', type: 'Motorcycle', speed: 0, zone: 'Parking B', status: 'parked', color: 'text-gray-400' },
  { plate: 'MH-02-IJ-7890', type: 'Van', speed: 67, zone: 'Ring Road', status: 'normal', color: 'text-cyan-400' },
  { plate: 'DL-12-KL-2345', type: 'Bus', speed: 38, zone: 'Station Rd', status: 'slow', color: 'text-amber-400' },
];

const speedData = [45,62,38,85,72,95,55,80,48,110,65,88];
const congestionData = [20,35,65,80,55,30,45,70,85,60,40,25];

export function TrafficSurveillancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Traffic Surveillance</h1>
        <p className="text-sm text-gray-500 font-mono">AI traffic monitoring • Rash driving alerts • ANPR recognition</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[['482','Vehicles Tracked','text-cyan-400',Car],['3','Rash Driving','text-red-400',AlertTriangle],['2','Accidents','text-orange-400',Activity],['68 km/h','Avg Speed','text-amber-400',Gauge]].map(([v,l,c,I]) => {
          const Icon = I as typeof Car;
          return (<div key={l as string} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5"><div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${c}`} /><span className="text-xs text-gray-500 font-mono">{l}</span></div><div className={`text-2xl font-bold ${c}`}>{v}</div></div>);
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Road visualization */}
        <div className="lg:col-span-2 glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">ROAD NETWORK</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="text-xs font-mono text-gray-500">LIVE</span></div>
          </div>
          {/* Road map mockup */}
          <div className="relative rounded-xl overflow-hidden p-4" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: '1px solid rgba(0,245,255,0.15)', minHeight: '300px' }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Roads */}
            <div className="absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px dashed rgba(255,255,255,0.1)', borderRight: '2px dashed rgba(255,255,255,0.1)' }} />
            <div className="absolute left-0 right-0 top-1/2 h-8 -translate-y-1/2" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '2px dashed rgba(255,255,255,0.1)', borderBottom: '2px dashed rgba(255,255,255,0.1)' }} />
            {/* Vehicle markers */}
            <div className="absolute top-1/4 left-[48%] w-4 h-6 rounded-sm bg-cyan-400/40 border border-cyan-400/60" style={{ boxShadow: '0 0 6px rgba(0,245,255,0.4)' }} />
            <div className="absolute top-2/3 left-[52%] w-4 h-6 rounded-sm bg-red-400/40 border border-red-400/60" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.4)' }} />
            <div className="absolute top-[48%] left-1/4 w-6 h-4 rounded-sm bg-cyan-400/40 border border-cyan-400/60" />
            <div className="absolute top-[52%] right-1/4 w-6 h-4 rounded-sm bg-amber-400/40 border border-amber-400/60" />
            {/* Alerts */}
            <div className="absolute top-[65%] left-[55%]">
              <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center animate-ping" style={{ animationDuration: '1.5s' }}>
                <AlertTriangle className="w-3 h-3 text-red-400" />
              </div>
            </div>
            {/* Labels */}
            <div className="absolute top-2 left-3 text-xs font-mono text-gray-500">HIGHWAY A</div>
            <div className="absolute bottom-2 right-3 text-xs font-mono text-gray-500">ROAD 5</div>
            <div className="absolute top-2 right-3 text-xs font-mono text-red-400 bg-red-900/40 px-2 py-0.5 rounded border border-red-500/20">RASH DRIVING</div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="glass rounded-lg p-3 border border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-2"><span className="text-xs font-mono text-gray-500">SPEED DISTRIBUTION</span><TrendingUp className="w-3 h-3 text-cyan-400" /></div>
              <div className="flex items-end gap-1 h-20">
                {speedData.map((v, i) => (<div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v/120)*100}%`, background: v > 100 ? 'rgba(239,68,68,0.7)' : v > 70 ? 'rgba(249,115,22,0.6)' : 'rgba(0,245,255,0.4)', boxShadow: v > 100 ? '0 0 6px rgba(239,68,68,0.3)' : 'none' }} />))}
              </div>
            </div>
            <div className="glass rounded-lg p-3 border border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-2"><span className="text-xs font-mono text-gray-500">CONGESTION INDEX</span><Activity className="w-3 h-3 text-amber-400" /></div>
              <div className="flex items-end gap-1 h-20">
                {congestionData.map((v, i) => (<div key={i} className="flex-1 rounded-t-sm" style={{ height: `${v}%`, background: v > 70 ? 'rgba(239,68,68,0.6)' : v > 50 ? 'rgba(249,115,22,0.5)' : 'rgba(0,245,255,0.4)' }} />))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle list */}
        <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2 mb-4"><Car className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">TRACKED VEHICLES</span></div>
          <div className="space-y-2">
            {vehicles.map(v => (
              <div key={v.plate} className={`rounded-lg p-3 border ${v.status === 'rash' ? 'border-red-500/30 bg-red-500/5' : v.status === 'slow' ? 'border-amber-500/20 bg-amber-500/5' : 'border-slate-200 dark:border-white/5'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-850 dark:text-white font-semibold">{v.plate}</div>
                    <div className="text-[10px] text-gray-500">{v.type} • {v.zone}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${v.color}`}>{v.speed > 0 ? `${v.speed} km/h` : 'PARKED'}</div>
                    {v.status === 'rash' && <span className="text-[10px] font-mono text-red-400">OVER SPEED LIMIT</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
