export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface VideoMetadata {
  upload_id: string;
  file_name: string;
  duration_seconds: number;
  fps: number;
  width: number;
  height: number;
  resolution: string;
  file_size_bytes: number;
  file_size_human: string;
  video_url: string;
}

export interface ThreatTimelineEvent {
  timestamp: string;
  timestamp_seconds: number;
  type: string;
  confidence: number;
  screenshot_url?: string;
  risk_level: string;
  severity: Severity;
}

export interface ScreenshotEvidence {
  id: string;
  filename: string;
  url: string;
  timestamp: string;
  timestamp_seconds: number;
  label: string;
  confidence: number;
  severity: Severity;
}

export interface RiskScore {
  numeric_score: number;
  risk_level: string;
  explanation: string;
  breakdown: Record<string, number>;
}

export interface AnalysisSummary {
  title: string;
  video_duration: string;
  frames_processed: number;
  threats_found: number;
  weapons: number;
  masked_persons: number;
  crowd_alerts: number;
  traffic_violations: number;
  overall_threat_score: number;
  threat_level: string;
  details: string[];
}

export interface AnalysisResult {
  upload_id: string;
  status: AnalysisStatus;
  video_metadata: VideoMetadata;
  threat_timeline: ThreatTimelineEvent[];
  screenshots: ScreenshotEvidence[];
  risk_score: RiskScore;
  summary: AnalysisSummary;
  progress: number;
}

export interface AnalysisProgress {
  upload_id: string;
  status: AnalysisStatus;
  progress: number;
  current_step: string;
  message: string;
  error?: string;
}

export interface UploadResponse {
  upload_id: string;
  message: string;
  metadata: VideoMetadata;
}

export interface TimelineUIEvent {
  time: string;
  type: string;
  severity: Severity;
  color: string;
  dot: string;
  timestampSeconds: number;
  screenshotUrl?: string;
}

export interface SnapshotUI {
  time: string;
  label: string;
  severity: Severity;
  imageUrl: string;
  timestampSeconds: number;
}
