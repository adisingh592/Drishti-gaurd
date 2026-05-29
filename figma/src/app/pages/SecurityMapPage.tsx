import { MapPin, AlertTriangle, Camera, Shield, Crosshair } from 'lucide-react';

const threatMarkers = [
  { id: 1, type: 'WEAPON', lat: 40, lng: 30, severity: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-400/50' },
  { id: 2, type: 'INTRUSION', lat: 25, lng: 60, severity: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-400/50' },
  { id: 3, type: 'RASH DRIVING', lat: 55, lng: 50, severity: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-400/50' },
  { id: 4, type: 'CROWD SURGE', lat: 70, lng: 70, severity: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-400/50' },
];

const cameras = [
  { id: 'CAM-001', lat: 35, lng: 25, status: 'threat' },
  { id: 'CAM-006', lat: 22, lng: 65, status: 'threat' },
  { id: 'CAM-005', lat: 52, lng: 48, status: 'alert' },
  { id: 'CAM-002', lat: 18, lng: 40, status: 'online' },
  { id: 'CAM-003', lat: 60, lng: 35, status: 'online' },
  { id: 'CAM-004', lat: 45, lng: 72, status: 'online' },
  { id: 'CAM-007', lat: 72, lng: 28, status: 'online' },
  { id: 'CAM-008', lat: 65, lng: 75, status: 'online' },
  { id: 'CAM-009', lat: 78, lng: 55, status: 'offline' },
  { id: 'CAM-010', lat: 30, lng: 85, status: 'online' },
];

const perimeterZones = [
  { name: 'Alpha', top: '10%', left: '10%', width: '35%', height: '40%', color: 'border-red-400/30', bg: 'bg-red-500/5' },
  { name: 'Bravo', top: '10%', left: '55%', width: '35%', height: '40%', color: 'border-cyan-400/20', bg: 'bg-cyan-500/3' },
  { name: 'Charlie', top: '55%', left: '10%', width: '35%', height: '35%', color: 'border-cyan-400/20', bg: 'bg-cyan-500/3' },
  { name: 'Delta', top: '55%', left: '55%', width: '35%', height: '35%', color: 'border-orange-400/20', bg: 'bg-orange-500/3' },
];

export function SecurityMapPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Security Map</h1>
          <p className="text-sm text-gray-500 font-mono">Tactical view • Live threat locations • Camera positions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 border border-red-500/20">
            <Crosshair className="w-3 h-3 text-red-400" />
            <span className="text-xs font-mono text-red-400">4 ACTIVE THREATS</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">TACTICAL MAP</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="text-xs font-mono text-gray-500">LIVE</span></div>
          </div>
          <div className="relative rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #050d1a, #071222)', border: '1px solid rgba(0,245,255,0.15)', minHeight: '500px' }}>
            {/* Grid */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Perimeter zones */}
            {perimeterZones.map(zone => (
              <div key={zone.name} className={`absolute border-2 ${zone.color} rounded-xl ${zone.bg}`}
                style={{ top: zone.top, left: zone.left, width: zone.width, height: zone.height }}>
                <span className="absolute top-2 left-2 text-[10px] font-mono text-gray-500">ZONE {zone.name}</span>
              </div>
            ))}

            {/* Threat markers */}
            {threatMarkers.map(marker => (
              <div key={marker.id} className="absolute" style={{ top: `${marker.lat}%`, left: `${marker.lng}%` }}>
                <div className={`relative w-8 h-8 rounded-full ${marker.bg} border-2 ${marker.border} flex items-center justify-center`}
                  style={{ boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}>
                  <AlertTriangle className={`w-4 h-4 ${marker.color}`} />
                  <div className="absolute inset-0 rounded-full border-2 border-red-400/30 animate-ping" style={{ animationDuration: '1.5s' }} />
                </div>
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono ${marker.color} bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap`}>{marker.type}</div>
              </div>
            ))}

            {/* Camera markers */}
            {cameras.map(cam => (
              <div key={cam.id} className="absolute" style={{ top: `${cam.lat}%`, left: `${cam.lng}%` }}>
                <div className={`w-3 h-3 rounded-full ${cam.status === 'threat' ? 'bg-red-400' : cam.status === 'alert' ? 'bg-orange-400' : cam.status === 'offline' ? 'bg-gray-500' : 'bg-cyan-400'}`}
                  style={{ boxShadow: `0 0 4px ${cam.status === 'threat' ? 'rgba(239,68,68,0.5)' : 'rgba(0,245,255,0.4)'}` }} />
                <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-gray-600 whitespace-nowrap">{cam.id}</span>
              </div>
            ))}

            {/* Radar overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
              <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: 'conic-gradient(from 0deg, rgba(0,245,255,0.1), transparent 30%)' }}>
                <div className="w-full h-full animate-radar" />
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 space-y-1 bg-black/40 p-2 rounded">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] text-gray-400 font-mono">Threat</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-[10px] text-gray-400 font-mono">Alert</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-[10px] text-gray-400 font-mono">Camera</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500" /><span className="text-[10px] text-gray-400 font-mono">Offline</span></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-red-400" /><span className="text-sm font-mono text-red-400">THREAT LOCATIONS</span></div>
            <div className="space-y-2">
              {threatMarkers.map(marker => (
                <div key={marker.id} className={`rounded-lg p-2.5 border ${marker.bg} ${marker.border}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono ${marker.color}`}>{marker.type}</span>
                    <span className={`text-[10px] font-mono ${marker.color}`}>{marker.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-3"><Camera className="w-4 h-4 text-cyan-400" /><span className="text-sm font-mono text-cyan-400">CAMERA POSITIONS</span></div>
            <div className="space-y-1.5">
              {cameras.map(cam => (
                <div key={cam.id} className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-mono">{cam.id}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${cam.status === 'threat' ? 'bg-red-400' : cam.status === 'alert' ? 'bg-orange-400' : cam.status === 'offline' ? 'bg-gray-500' : 'bg-cyan-400'}`} />
                    <span className="text-gray-500 uppercase">{cam.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
