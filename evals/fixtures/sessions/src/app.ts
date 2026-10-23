import { MemorySessionStore, type SessionStore, type Session } from "./session-store";

export function createStore(): SessionStore {
  return new MemorySessionStore();
}

export function login(store: SessionStore, id: string, userId: string, now = new Date()): Session {
  const s: Session = { userId, createdAt: now, expiresAt: new Date(now.getTime() + 3600_000), data: {} };
  store.set(id, s);
  return s;
}

export function isActive(store: SessionStore, id: string, now = new Date()): boolean {
  const s = store.get(id);
  return !!s && s.expiresAt > now;
}
