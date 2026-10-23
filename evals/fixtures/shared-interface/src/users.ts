import { MemoryRepository } from "./repository";
export type User = { id: string; name: string };
export const usersRepo = new MemoryRepository<User>();
export function getUserName(id: string): string {
  return usersRepo.find(id)?.name ?? "unknown";
}
