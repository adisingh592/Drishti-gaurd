import { useCallback, useEffect, useState } from 'react';
import { getHealth } from '@/services/api';

export type BackendStatus = 'checking' | 'online' | 'offline';

/** Polls the FastAPI `/api/health` endpoint so the shell can show live connection state. */
export function useBackendHealth(intervalMs = 15000) {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  const check = useCallback(async () => {
    const started = performance.now();
    try {
      await getHealth();
      setLatencyMs(Math.round(performance.now() - started));
      setStatus('online');
    } catch {
      setLatencyMs(null);
      setStatus('offline');
    }
    setCheckedAt(new Date());
  }, []);

  useEffect(() => {
    check();
    const id = window.setInterval(check, intervalMs);
    return () => window.clearInterval(id);
  }, [check, intervalMs]);

  return { status, latencyMs, checkedAt, check };
}
