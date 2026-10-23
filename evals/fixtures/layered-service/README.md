# layered-service

A small HTTP-shaped service. Requests enter in `src/http.ts`, go through `src/service.ts`, reach data via `src/repo.ts`, which reads `src/db.ts`. Run `bun test`.
