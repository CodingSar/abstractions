export interface Repository<T extends { id: string }> {
  find(id: string): T | undefined;
  save(item: T): void;
  all(): T[];
}

export class MemoryRepository<T extends { id: string }> implements Repository<T> {
  private items = new Map<string, T>();
  find(id: string): T | undefined {
    return this.items.get(id);
  }
  save(item: T): void {
    this.items.set(item.id, item);
  }
  all(): T[] {
    return [...this.items.values()];
  }
}
