import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  FileVideo,
  Brain,
  Download,
  Clock,
  Shield,
  CheckCircle,
  Play,
  Pause,
  AlertTriangle,
} from 'lucide-react';
import { pollUntilComplete, startAnalysis, uploadVideo } from '@/services/api';
import type { AnalysisResult } from '@/types/analysis';
import { formatVideoTime, mapResultToUI, scoreGradient } from '@/utils/analysisUi';

const PLACEHOLDER_TIMELINE = [
  { time: '00:00', type: 'Awaiting analysis…', severity: 'LOW' as const, color: 'text-gray-500', dot: 'bg-gray-500', timestampSeconds: 0 },
];

export function UploadAnalyzePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const [videoUrl, setVideoUrl] = useState('');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [timeline, setTimeline] = useState(PLACEHOLDER_TIMELINE);
  const [snapshots, setSnapshots] = useState<{ time: string; label: string; severity: string; imageUrl: string; timestampSeconds: number }[]>([]);
  const [score, setScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('');
  const [counts, setCounts] = useState({ critical: 0, high: 0, medium: 0, low: 0 });
  const [eventCount, setEventCount] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<{ label: string; confidence: number } | null>(null);

  const applyResult = useCallback((result: AnalysisResult) => {
    const ui = mapResultToUI(result);
    setTimeline(ui.timeline.length ? ui.timeline : PLACEHOLDER_TIMELINE);
    setSnapshots(ui.snapshots);
    setScore(ui.score);
    setRiskLevel(ui.riskLevel);
    setCounts(ui.counts);
    setEventCount(ui.eventCount);
    setVideoUrl(ui.videoUrl);
    setDurationSeconds(ui.durationSeconds);
    setFileName(ui.fileName);
    setAnalyzed(true);
    setAnalyzing(false);
    setProgress(100);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setAnalyzed(false);
    setAnalyzing(true);
    setProgress(0);
    setStatusMessage('Uploading video…');
    setFileName(file.name);

    try {
      const upload = await uploadVideo(file);
      setProgress(8);
      setStatusMessage('Starting AI analysis…');
      await startAnalysis(upload.upload_id);

      const result = await pollUntilComplete(upload.upload_id, (p) => {
        setProgress(Math.max(8, p.progress));
        setStatusMessage(p.message || p.current_step || 'Processing…');
      });

      applyResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
      setAnalyzing(false);
      setProgress(0);
    }
  }, [applyResult]);

  const onFileSelected = (file: File | undefined) => {
    if (!file || analyzing) return;
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }
    processFile(file);
  };

  const seekTo = (seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = seconds;
    setCurrentTime(seconds);
    if (!playing) {
      v.play().catch(() => undefined);
      setPlaying(true);
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const grad = scoreGradient(score);
  const scoreColor = score <= 30 ? 'text-emerald-400' : score <= 60 ? 'text-amber-400' : score <= 85 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Upload & Analyze</h1>
        <p className="text-sm text-gray-500 font-mono">
          AI-powered video analysis • YOLOv11 + ByteTrack • Threat report generation
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0])}
      />

      {error && (
        <div className="glass rounded-xl p-4 border border-red-500/30 flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Upload, label: 'Upload', desc: 'Video files up to 10GB', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { icon: Brain, label: 'AI Process', desc: 'YOLOv11 neural analysis', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Clock, label: 'Timeline', desc: 'Threat event mapping', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: Download, label: 'Report', desc: 'Structured JSON report', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${step.color}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-850 dark:text-white">{step.label}</div>
                <div className="text-xs text-gray-600">{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            className={`relative glass-dark rounded-2xl border-2 border-dashed transition-all p-10 text-center cursor-pointer ${
              dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/25 hover:border-cyan-500/50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onFileSelected(e.dataTransfer.files?.[0]);
            }}
            onClick={() => !analyzing && !analyzed && fileInputRef.current?.click()}
          >
            {(analyzing || dragging) && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                  style={{ animation: 'scanLine 1.5s linear infinite' }}
                />
              </div>
            )}
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  dragging ? 'border-cyan-400 bg-cyan-500/20' : 'border-cyan-500/30 bg-cyan-500/10'
                }`}
              >
                {analyzed ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Upload className={`w-8 h-8 ${dragging || analyzing ? 'text-cyan-400' : 'text-gray-500'}`} />
                )}
              </div>
              <div>
                <div className="text-slate-850 dark:text-white font-semibold mb-1">
                  {analyzed ? 'Analysis Complete!' : analyzing ? 'Processing footage…' : 'Drop surveillance footage here'}
                </div>
                <div className="text-gray-500 text-sm">
                  {analyzed
                    ? fileName || 'Report ready'
                    : analyzing
                      ? `${progress}% • ${statusMessage}`
                      : 'MP4, AVI, MOV, MKV up to 10GB'}
                </div>
              </div>
              {(analyzing || analyzed) && (
                <div className="w-full max-w-md">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        background: analyzed
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                        boxShadow: analyzed ? 'rgba(16,185,129,0.5)' : 'rgba(59,130,246,0.5)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs font-mono text-gray-600">AI Analysis Engine</span>
                    <span className={`text-xs font-mono ${analyzed ? 'text-emerald-400' : 'text-cyan-400'}`}>{progress}%</span>
                  </div>
                </div>
              )}
              {!analyzing && !analyzed && (
                <button
                  type="button"
                  className="btn-primary flex items-center gap-2 text-sm py-2 px-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <FileVideo className="w-4 h-4" /> Select Video File
                </button>
              )}
            </div>
          </div>

          {analyzed && videoUrl && (
            <div className="glass rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
              <div className="relative aspect-video bg-[#050d1a]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onLoadedMetadata={() => setDurationSeconds(videoRef.current?.duration ?? durationSeconds)}
                />
                {activeOverlay && (
                  <div
                    className="absolute top-8 left-12 w-16 h-20 border-2 border-red-400/70 rounded-sm pointer-events-none"
                    style={{ boxShadow: '0 0 10px rgba(239,68,68,0.4)' }}
                  >
                    <div className="absolute -top-4 left-0 text-[10px] text-red-400 font-mono bg-red-900/60 px-1 whitespace-nowrap">
                      {activeOverlay.label.toUpperCase()} {(activeOverlay.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: 'rgba(2,8,20,0.9)' }}>
                  <div className="flex items-center gap-3">
                    <button type="button" className="text-cyan-400 hover:text-cyan-300" onClick={togglePlay}>
                      {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{
                          width: `${durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {formatVideoTime(currentTime)} / {formatVideoTime(durationSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {analyzed && (
            <div className="glass rounded-xl p-5 neon-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-gray-400">THREAT ASSESSMENT</span>
                <Shield className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke={`url(#uaGrad-${score})`}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 50 * (score / 100)} ${2 * Math.PI * 50 * (1 - score / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id={`uaGrad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={grad.from} />
                        <stop offset="100%" stopColor={grad.to} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-2xl font-black ${scoreColor}`}>{score}</div>
                    <div className="text-[9px] font-mono text-gray-500">{riskLevel}</div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    [String(counts.critical), 'Critical', 'text-red-400'],
                    [String(counts.high), 'High', 'text-orange-400'],
                    [String(counts.medium), 'Medium', 'text-amber-400'],
                  ].map(([n, l, c]) => (
                    <div key={l} className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${c}`}>{n}</span>
                      <span className="text-xs text-gray-500">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm opacity-90">
                <Download className="w-4 h-4" /> Download AI Report (JSON)
              </button>
            </div>
          )}

          <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-400">THREAT TIMELINE</span>
              {analyzed && (
                <span className="text-xs text-emerald-400 font-mono ml-auto">{eventCount} EVENTS</span>
              )}
            </div>
            <div className="relative space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent" />
              {timeline.map((event, i) => {
                const border =
                  event.severity === 'CRITICAL'
                    ? 'border-red-500/20'
                    : 'border-slate-200 dark:border-white/5';
                return (
                  <button
                    key={`${event.time}-${event.type}-${i}`}
                    type="button"
                    disabled={!analyzed}
                    onClick={() => {
                      seekTo(event.timestampSeconds);
                      setActiveOverlay({ label: event.type, confidence: 0.9 });
                    }}
                    className={`relative flex items-start gap-4 pl-10 w-full text-left transition-all ${
                      analyzed ? 'opacity-100 hover:opacity-90 cursor-pointer' : 'opacity-30 cursor-default'
                    }`}
                    style={{ transitionDelay: analyzed ? `${i * 80}ms` : '0ms' }}
                  >
                    <div
                      className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full ${event.dot} -translate-x-1/2`}
                      style={{ boxShadow: analyzed ? '0 0 8px currentColor' : 'none' }}
                    />
                    <div className={`glass rounded-lg p-3 flex-1 border ${border}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm text-slate-850 dark:text-white font-medium">{event.type}</div>
                          <div className="text-xs text-gray-600 font-mono">{event.time}</div>
                        </div>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded ${
                            event.severity === 'CRITICAL'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : event.severity === 'HIGH'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : event.severity === 'MEDIUM'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {event.severity}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {!analyzed && !analyzing && (
              <p className="mt-4 text-xs text-center text-gray-500 font-mono">
                Upload a CCTV video to run live AI analysis
              </p>
            )}
          </div>

          {analyzed && snapshots.length > 0 && (
            <div className="glass rounded-xl p-4 border border-slate-200 dark:border-white/5">
              <span className="text-sm font-mono text-gray-400">EVIDENCE SNAPSHOTS</span>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {snapshots.map((snap, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => seekTo(snap.timestampSeconds)}
                    className="relative rounded-lg overflow-hidden aspect-video text-left"
                    style={{
                      border:
                        snap.severity === 'CRITICAL'
                          ? '1px solid rgba(239,68,68,0.3)'
                          : '1px solid rgba(59,130,246,0.2)',
                    }}
                  >
                    <img src={snap.imageUrl} alt={snap.label} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1" style={{ background: 'rgba(2,8,20,0.9)' }}>
                      <div className="text-[10px] text-gray-400 font-mono">{snap.time}</div>
                      <div
                        className={`text-[10px] font-mono ${
                          snap.severity === 'CRITICAL'
                            ? 'text-red-400'
                            : snap.severity === 'HIGH'
                              ? 'text-orange-400'
                              : 'text-amber-400'
                        }`}
                      >
                        {snap.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
