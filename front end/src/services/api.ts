import type {
  AnalysisProgress,
  AnalysisResult,
  UploadResponse,
} from '@/types/analysis';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail ?? body);
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function mediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  return request<UploadResponse>('/api/upload', { method: 'POST', body: form });
}

export async function startAnalysis(uploadId: string): Promise<{ upload_id: string; status: string; message: string }> {
  return request(`/api/analyze/${uploadId}`, { method: 'POST' });
}

export async function getAnalysisProgress(uploadId: string): Promise<AnalysisProgress> {
  return request<AnalysisProgress>(`/api/analyze/${uploadId}/progress`);
}

export async function getAnalysisResults(uploadId: string): Promise<AnalysisResult> {
  return request<AnalysisResult>(`/api/analyze/${uploadId}/results`);
}

export async function pollUntilComplete(
  uploadId: string,
  onProgress: (p: AnalysisProgress) => void,
  intervalMs = 800,
): Promise<AnalysisResult> {
  for (;;) {
    const progress = await getAnalysisProgress(uploadId);
    onProgress(progress);
    if (progress.status === 'completed') {
      return getAnalysisResults(uploadId);
    }
    if (progress.status === 'failed') {
      throw new Error(progress.error || progress.message || 'Analysis failed');
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
