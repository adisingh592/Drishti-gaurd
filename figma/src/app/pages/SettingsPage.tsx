import { useState } from 'react';
import { Shield, Bell, Camera, Cpu, Sliders, Monitor, Lock, Palette } from 'lucide-react';

type Tab = 'ai' | 'alerts' | 'cameras' | 'display' | 'security';

function SettingToggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-white/5 last:border-0">
      <div><div className="text-sm text-slate-800 dark:text-white">{label}</div><div className="text-xs text-gray-600">{description}</div></div>
      <button onClick={() => setOn(!on)} className={`w-10 h-5 rounded-full transition-all ${on ? 'bg-cyan-500/30 border border-cyan-500/50' : 'bg-white/10 border border-slate-200 dark:border-white/10'}`}>
        <div className={`w-4 h-4 rounded-full transition-all ${on ? 'bg-cyan-400 translate-x-5' : 'bg-gray-500 translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function SettingSlider({ label, value, unit, min, max }: { label: string; value: number; unit: string; min: number; max: number }) {
  const [val, setVal] = useState(value);
  return (
    <div className="py-3 border-b border-slate-200 dark:border-white/5 last:border-0">
      <div className="flex items-center justify-between mb-2"><span className="text-sm text-slate-800 dark:text-white">{label}</span><span className="text-sm font-mono text-cyan-400">{val}{unit}</span></div>
      <input type="range" min={min} max={max} value={val} onChange={e => setVal(parseInt(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,245,255,0.5)]" />
    </div>
  );
}

const tabs: { id: Tab; icon: typeof Shield; label: string }[] = [
  { id: 'ai', icon: Cpu, label: 'AI Settings' },
  { id: 'alerts', icon: Bell, label: 'Alert Config' },
  { id: 'cameras', icon: Camera, label: 'Camera Prefs' },
  { id: 'display', icon: Palette, label: 'Display' },
  { id: 'security', icon: Lock, label: 'Security' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('ai');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 font-mono">Platform configuration • AI sensitivity • Security controls</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="glass rounded-xl p-2 border border-slate-200 dark:border-white/5 space-y-0.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeTab === tab.id ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'}`}>
                <Icon className="w-4 h-4" /><span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 glass rounded-xl p-6 border border-slate-200 dark:border-white/5">
          {activeTab === 'ai' && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">AI Configuration</h3>
              <p className="text-xs text-gray-500 mb-6">Adjust AI model sensitivity and detection parameters</p>
              <SettingSlider label="Weapon Detection Sensitivity" value={95} unit="%" min={50} max={100} />
              <SettingSlider label="Behavior Analysis Threshold" value={80} unit="%" min={50} max={100} />
              <SettingSlider label="Crowd Density Alert Level" value={70} unit="%" min={30} max={100} />
              <SettingSlider label="Vehicle Speed Limit" value={80} unit=" km/h" min={30} max={200} />
              <SettingToggle label="Auto-Track Threats" description="AI automatically follows detected threats across cameras" defaultOn={true} />
              <SettingToggle label="Predictive Mode" description="Enable AI threat prediction based on behavioral patterns" defaultOn={true} />
              <SettingToggle label="False Positive Reduction" description="Advanced filtering to minimize incorrect detections" defaultOn={true} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Alert Configuration</h3>
              <p className="text-xs text-gray-500 mb-6">Configure alert thresholds and notification preferences</p>
              <SettingToggle label="Email Notifications" description="Receive alerts via email" defaultOn={true} />
              <SettingToggle label="SMS Notifications" description="Receive critical alerts via SMS" defaultOn={true} />
              <SettingToggle label="Push Notifications" description="Browser push notifications for real-time alerts" defaultOn={true} />
              <SettingToggle label="Siren Integration" description="Trigger physical siren on CRITICAL alerts" defaultOn={false} />
              <SettingSlider label="Alert Cooldown" value={30} unit="s" min={5} max={120} />
              <SettingSlider label="Escalation Timeout" value={5} unit="min" min={1} max={30} />
            </div>
          )}

          {activeTab === 'cameras' && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Camera Preferences</h3>
              <p className="text-xs text-gray-500 mb-6">Default camera and recording settings</p>
              <SettingToggle label="Auto-Record on Alert" description="Start recording when threat detected" defaultOn={true} />
              <SettingToggle label="Night Vision Enhancement" description="AI-enhanced low-light visibility" defaultOn={true} />
              <SettingToggle label="Auto-Pan to Threat" description="PTZ cameras auto-rotate to detected threats" defaultOn={true} />
              <SettingSlider label="Default Recording Quality" value={4} unit="K" min={1} max={8} />
              <SettingSlider label="Frame Rate" value={30} unit=" FPS" min={15} max={60} />
              <SettingSlider label="Retention Period" value={90} unit=" days" min={7} max={365} />
            </div>
          )}

          {activeTab === 'display' && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Display Settings</h3>
              <p className="text-xs text-gray-500 mb-6">Customize visual appearance and layout</p>
              <SettingToggle label="Detection Overlays" description="Show bounding boxes and labels on feeds" defaultOn={true} />
              <SettingToggle label="Scan Line Animation" description="Animated scan line on camera feeds" defaultOn={true} />
              <SettingToggle label="Threat Pulse Effects" description="Pulsing glow on threat indicators" defaultOn={true} />
              <SettingToggle label="Compact Mode" description="Reduce spacing for more content density" defaultOn={false} />
              <SettingSlider label="Grid Opacity" value={3} unit="%" min={0} max={10} />
              <SettingSlider label="Animation Speed" value={1} unit="x" min={0} max={3} />
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Security Settings</h3>
              <p className="text-xs text-gray-500 mb-6">Authentication and data security controls</p>
              <SettingToggle label="Two-Factor Authentication" description="Require 2FA for all login attempts" defaultOn={true} />
              <SettingToggle label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultOn={true} />
              <SettingToggle label="IP Whitelist" description="Only allow access from approved IP addresses" defaultOn={false} />
              <SettingToggle label="Audit Logging" description="Log all user actions for compliance" defaultOn={true} />
              <SettingToggle label="Data Encryption" description="AES-256 encryption for all stored data" defaultOn={true} />
              <SettingSlider label="Password Min Length" value={12} unit=" chars" min={8} max={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
