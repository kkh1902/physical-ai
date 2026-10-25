import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
const sections = new Set(["notes", "weekly", "design", "build"]);
const slugify = (name) =>
  path
    .basename(name, ".md")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/^-+|-+$/g, "");

export function prepareEntries(files) {
  const entries = files.flatMap((file) => {
    const parsed = matter(file.text);
    if (parsed.data.publish !== true) return [];
    const section = parsed.data.site_section || "notes";
    if (!sections.has(section)) throw new Error(`Invalid section: ${section}`);
    const slug = slugify(file.name);
    if (!slug || slug === "." || slug === "..")
      throw new Error(`Invalid slug: ${file.name}`);
    return [
      {
        name: path.basename(file.name, ".md"),
        slug,
        section,
        data: parsed.data,
        body: parsed.content,
      },
    ];
  });
  const keys = new Set();
  const byName = new Map();
  for (const entry of entries) {
    const key = `${entry.section}/${entry.slug}.md`;
    if (keys.has(key) || byName.has(entry.name))
      throw new Error(`Slug/name collision: ${entry.name}`);
    keys.add(key);
    byName.set(entry.name, entry);
  }
  return entries.map((entry) => {
    // Only a public allowlist survives. Unknown metadata is private by default.
    const data = {
      publish: true,
      title: entry.data.title || entry.name,
      ...Object.fromEntries(
        ["description", "created", "updated", "tags", "kind"]
          .filter((key) => entry.data[key] !== undefined)
          .map((key) => [key, entry.data[key]]),
      ),
    };
    const body = entry.body.replace(/!?\[\[([^\]]+)\]\]/g, (match, inner) => {
      if (match.startsWith("!")) return "[첨부 자료 생략]";
      const [target, alias] = inner.split("|");
      const [name, heading] = target.split("#");
      const linked = byName.get(path.basename(name, ".md"));
      if (!linked) return "[비공개 또는 미동기화 문서]";
      const href =
        linked.section === "notes"
          ? `/notes/${encodeURIComponent(linked.slug)}`
          : `/${linked.section}#${encodeURIComponent(linked.slug)}`;
      const label = (alias || linked.data.title || linked.name).replace(
        /[\[\]]/g,
        "",
      );
      void heading;
      return `[${label}](${href})`;
    });
    return {
      section: entry.section,
      slug: entry.slug,
      text: matter.stringify(body, data),
    };
  });
}

export function sync(source, output, dryRun = false) {
  if (!fs.existsSync(source))
    throw new Error(`Source directory not found: ${source}`);
  function collect(directory) {
    return fs
      .readdirSync(directory, { withFileTypes: true })
      .flatMap((item) => {
        const name = path.join(directory, item.name);
        if (item.isSymbolicLink()) return [];
        if (item.isDirectory()) return collect(name);
        return item.isFile() && item.name.endsWith(".md")
          ? [{ name: item.name, text: fs.readFileSync(name, "utf8") }]
          : [];
      });
  }
  const entries = prepareEntries(collect(source));
  const manifest = path.join(output, ".secondbrain-manifest.json");
  const previous = fs.existsSync(manifest)
    ? JSON.parse(fs.readFileSync(manifest, "utf8"))
    : [];
  const safe = (relative) =>
    typeof relative === "string" &&
    /^(notes|weekly|design|build)\/[^/\\]+\.md$/u.test(relative) &&
    !relative.includes("..");
  if (!Array.isArray(previous) || !previous.every(safe))
    throw new Error("Invalid sync manifest");
  const next = entries.map((entry) => `${entry.section}/${entry.slug}.md`);
  const changes = [];
  for (const [index, entry] of entries.entries()) {
    const relative = next[index];
    const destination = path.join(output, relative);
    if (fs.existsSync(destination) && !previous.includes(relative))
      throw new Error(`Refusing to overwrite unmanaged content: ${relative}`);
    if (
      !fs.existsSync(destination) ||
      fs.readFileSync(destination, "utf8") !== entry.text
    )
      changes.push({ type: "write", relative, text: entry.text });
  }
  for (const relative of previous) {
    if (!next.includes(relative) && fs.existsSync(path.join(output, relative)))
      changes.push({ type: "remove", relative });
  }
  if (!dryRun) {
    for (const change of changes) {
      const destination = path.join(output, change.relative);
      if (change.type === "remove") fs.unlinkSync(destination);
      else {
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, change.text);
      }
    }
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(manifest, JSON.stringify(next, null, 2) + "\n");
  }
  return changes.map(({ type, relative }) => ({ type, relative }));
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const args = process.argv.slice(2);
  const option = (name) => {
    const i = args.indexOf(name);
    if (i < 0) return undefined;
    const value = args[i + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value: ${name}`);
    return value;
  };
  try {
    const changes = sync(
      option("--source") ||
        "/home/pc/gdrive/secondbrain/wiki/20-29 커리어/23 로보틱스",
      option("--out") || path.resolve("content"),
      args.includes("--dry-run"),
    );
    console.log(
      args.includes("--dry-run")
        ? "Preview only — no files changed"
        : "Synced public cards",
    );
    for (const change of changes)
      console.log(`${change.type}: ${change.relative}`);
    console.log(`${changes.length} change(s)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
