export type Session = { userId: string; createdAt: Date; expiresAt: Date; data: Record<string, unknown> };

export interface SessionStore {
  get(id: string): Session | undefined;
  set(id: string, session: Session): void;
  delete(id: string): void;
  sweep(now: Date): number; // removes expired sessions, returns how many
}

export class MemorySessionStore implements SessionStore {
  private map = new Map<string, Session>();
  get(id: string) {
    return this.map.get(id);
  }
  set(id: string, s: Session) {
    this.map.set(id, s);
  }
  delete(id: string) {
    this.map.delete(id);
  }
  sweep(now: Date) {
    let n = 0;
    for (const [id, s] of this.map) if (s.expiresAt <= now) (this.map.delete(id), n++);
    return n;
  }
}
