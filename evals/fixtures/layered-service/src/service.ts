import { findUser, type User } from "./repo";

export class NotFound extends Error {
  constructor(what: string) {
    super(`${what} not found`);
  }
}

export function getUser(id: string): User {
  const u = findUser(id);
  if (!u) throw new NotFound(`user ${id}`);
  return u;
}
