import type { AnalysisResult, Severity, SnapshotUI, TimelineUIEvent } from '@/types/analysis';
import { mediaUrl } from '@/services/api';

export function severityStyles(severity: Severity) {
  switch (severity) {
    case 'CRITICAL':
      return { color: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/20' };
    case 'HIGH':
      return { color: 'text-orange-400', dot: 'bg-orange-400', border: 'border-orange-500/20' };
    case 'MEDIUM':
      return { color: 'text-amber-400', dot: 'bg-amber-400', border: 'border-amber-500/20' };
    default:
      return { color: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20' };
  }
}

export function mapResultToUI(result: AnalysisResult) {
  const timeline: TimelineUIEvent[] = result.threat_timeline.map((e) => {
    const s = severityStyles(e.severity);
    return {
      time: e.timestamp,
      type: e.type,
      severity: e.severity,
      color: s.color,
      dot: s.dot,
      timestampSeconds: e.timestamp_seconds,
      screenshotUrl: e.screenshot_url ? mediaUrl(e.screenshot_url) : undefined,
    };
  });

  const snapshots: SnapshotUI[] = result.screenshots.map((s) => ({
    time: s.timestamp,
    label: s.label,
    severity: s.severity,
    imageUrl: mediaUrl(s.url),
    timestampSeconds: s.timestamp_seconds,
  }));

  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const e of result.threat_timeline) {
    const k = e.severity.toLowerCase() as keyof typeof counts;
    if (k in counts) counts[k] += 1;
  }

  return {
    timeline,
    snapshots,
    score: result.risk_score.numeric_score,
    riskLevel: result.risk_score.risk_level,
    counts,
    eventCount: result.threat_timeline.length,
    videoUrl: mediaUrl(result.video_metadata.video_url),
    durationSeconds: result.video_metadata.duration_seconds,
    fileName: result.video_metadata.file_name,
    summary: result.summary,
  };
}

export function formatVideoTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function scoreGradient(score: number): { from: string; to: string } {
  if (score <= 30) return { from: '#10b981', to: '#34d399' };
  if (score <= 60) return { from: '#f59e0b', to: '#fbbf24' };
  if (score <= 85) return { from: '#f97316', to: '#ef4444' };
  return { from: '#ef4444', to: '#dc2626' };
}
