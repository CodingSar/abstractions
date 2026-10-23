import { usersRepo } from "./users";
export function auditLine(userId: string, action: string): string {
  const u = usersRepo.find(userId);
  return `${u ? u.name : "?"} ${action}`;
}
