type Entry = { attempts: number[] };

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const store = new Map<string, Entry>();

export function isAllowed(key: string) {
  const now = Date.now();
  const entry = store.get(key) ?? { attempts: [] };
  // remove expired
  entry.attempts = entry.attempts.filter((t) => t > now - WINDOW_MS);
  if (entry.attempts.length >= MAX_ATTEMPTS) {
    store.set(key, entry);
    return false;
  }
  entry.attempts.push(now);
  store.set(key, entry);
  return true;
}

export function resetKey(key: string) {
  store.delete(key);
}
