// Parse a Markdown file with YAML front matter.
export type Doc = { path: string; data: Record<string, any>; body: string };

export async function readDoc(path: string): Promise<Doc> {
  const text = await Bun.file(path).text();
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { path, data: {}, body: text.trim() };
  return { path, data: (Bun.YAML.parse(m[1]) as Record<string, any>) ?? {}, body: m[2].trim() };
}

export async function readDocs(dir: string): Promise<Doc[]> {
  const glob = new Bun.Glob("*.md");
  const files = [...glob.scanSync({ cwd: dir })].sort();
  return Promise.all(files.map((f) => readDoc(`${dir}/${f}`)));
}

export const slug = (s: string) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
