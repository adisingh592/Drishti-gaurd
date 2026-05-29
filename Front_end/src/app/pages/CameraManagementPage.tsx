import { useState } from 'react';
import { Camera, Plus, Settings, MapPin, Signal, Circle, Trash2, RefreshCw } from 'lucide-react';

const cameraList = [
  { id: 'CAM-001', name: 'Sector A - Main Hall', location: 'Building A, Floor 1', status: 'online', resolution: '4K', fps: 30, type: 'PTZ', ip: '192.168.1.101' },
  { id: 'CAM-002', name: 'Entry Gate Alpha', location: 'Gate A, Exterior', status: 'online', resolution: '4K', fps: 30, type: 'Fixed', ip: '192.168.1.102' },
  { id: 'CAM-003', name: 'Parking Zone B', location: 'Lot B, Level 2', status: 'online', resolution: '1080p', fps: 25, type: 'PTZ', ip: '192.168.1.103' },
  { id: 'CAM-004', name: 'Central Plaza', location: 'Plaza, Ground Level', status: 'online', resolution: '4K', fps: 30, type: '360°', ip: '192.168.1.104' },
  { id: 'CAM-005', name: 'Highway Road 5', location: 'Road 5, Pole 12', status: 'online', resolution: '1080p', fps: 25, type: 'Fixed', ip: '192.168.1.105' },
  { id: 'CAM-006', name: 'Gate B - West Wing', location: 'Gate B, Exterior', status: 'alert', resolution: '4K', fps: 30, type: 'PTZ', ip: '192.168.1.106' },
  { id: 'CAM-007', name: 'Corridor B', location: 'Building B, Floor 2', status: 'online', resolution: '1080p', fps: 25, type: 'Fixed', ip: '192.168.1.107' },
  { id: 'CAM-008', name: 'Stadium Entry', location: 'Stadium, Gate 1', status: 'online', resolution: '4K', fps: 30, type: 'PTZ', ip: '192.168.1.108' },
  { id: 'CAM-009', name: 'Sector C - Admin', location: 'Admin Wing, Floor 3', status: 'offline', resolution: '1080p', fps: 0, type: 'Fixed', ip: '192.168.1.109' },
  { id: 'CAM-010', name: 'Intersection 3', location: 'Road 3, Signal Post', status: 'online', resolution: '1080p', fps: 25, type: 'PTZ', ip: '192.168.1.110' },
  { id: 'CAM-011', name: 'Lab Wing East', location: 'Lab, Floor 1', status: 'degraded', resolution: '720p', fps: 15, type: 'Fixed', ip: '192.168.1.111' },
  { id: 'CAM-012', name: 'Server Room', location: 'Data Center, B2', status: 'online', resolution: '4K', fps: 30, type: 'Fixed', ip: '192.168.1.112' },
];

const statusConfig = {
  online: { label: 'ONLINE', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  alert: { label: 'ALERT', color: 'text-red-400', dot: 'bg-red-400' },
  degraded: { label: 'DEGRADED', color: 'text-amber-400', dot: 'bg-amber-400' },
  offline: { label: 'OFFLINE', color: 'text-gray-500', dot: 'bg-gray-500' },
};

export function CameraManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const onlineCount = cameraList.filter(c => c.status === 'online').length;
  const alertCount = cameraList.filter(c => c.status === 'alert').length;
  const offlineCount = cameraList.filter(c => c.status === 'offline').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Camera Management</h1>
          <p className="text-sm text-gray-500 font-mono">{cameraList.length} devices • {onlineCount} online</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Camera
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[['128','Total Cameras','text-cyan-400',Camera],[`${onlineCount}`,'Online','text-emerald-400',Signal],[`${alertCount}`,'Alerts','text-red-400',Circle],[`${offlineCount}`,'Offline','text-gray-400',Circle]].map(([v,l,c,I]) => {
          const Icon = I as typeof Camera;
          return (<div key={l as string} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5"><div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${c}`} /><span className="text-xs text-gray-500 font-mono">{l}</span></div><div className={`text-2xl font-bold ${c}`}>{v}</div></div>);
        })}
      </div>

      {/* Camera grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameraList.map(cam => {
          const cfg = statusConfig[cam.status as keyof typeof statusConfig];
          return (
            <div key={cam.id} className={`glass rounded-xl p-4 border transition-all hover:border-cyan-500/20 ${cam.status === 'alert' ? 'border-red-500/20' : cam.status === 'offline' ? 'border-gray-500/10' : 'border-slate-200 dark:border-white/5'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center`}>
                    <Camera className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-850 dark:text-white">{cam.name}</div>
                    <div className="text-[10px] text-gray-600 font-mono">{cam.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cam.status === 'alert' ? 'animate-ping' : ''}`} />
                  <span className={`text-[10px] font-mono ${cfg.color}`}>{cfg.label}</span>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs"><MapPin className="w-3 h-3 text-gray-600" /><span className="text-gray-500">{cam.location}</span></div>
                <div className="flex items-center gap-2 text-xs"><Signal className="w-3 h-3 text-gray-600" /><span className="text-gray-500">{cam.resolution} • {cam.fps} FPS • {cam.type}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 glass rounded-lg py-1.5 text-xs text-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all border border-slate-200 dark:border-white/5">Preview</button>
                <button className="glass rounded-lg p-1.5 border border-slate-200 dark:border-white/5 text-gray-500 hover:text-cyan-400 transition-all"><Settings className="w-3.5 h-3.5" /></button>
                <button className="glass rounded-lg p-1.5 border border-slate-200 dark:border-white/5 text-gray-500 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative glass-dark rounded-2xl p-6 neon-border w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Add New Camera</h3>
            <div className="space-y-3">
              {[
                { label: 'CAMERA NAME', placeholder: 'CAM-013 - New Location' },
                { label: 'IP ADDRESS', placeholder: '192.168.1.113' },
                { label: 'LOCATION', placeholder: 'Building C, Floor 1' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 tracking-wider">{field.label}</label>
                  <input type="text" placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1 tracking-wider">TYPE</label>
                <select className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all">
                  <option>PTZ</option><option>Fixed</option><option>360°</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 btn-outline text-sm py-2">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Camera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
