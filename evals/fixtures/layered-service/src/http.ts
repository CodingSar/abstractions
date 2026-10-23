import { getUser, NotFound } from "./service";

export type Req = { method: string; path: string };
export type Res = { status: number; body: unknown };

export function handle(req: Req): Res {
  const m = req.path.match(/^\/users\/([^/]+)$/);
  if (req.method === "GET" && m) {
    try {
      return { status: 200, body: getUser(m[1]) };
    } catch (e) {
      if (e instanceof NotFound) return { status: 404, body: { error: e.message } };
      throw e;
    }
  }
  return { status: 404, body: { error: "no route" } };
}
