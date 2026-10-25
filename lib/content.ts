import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
export type Section = "notes" | "weekly" | "design" | "build";
export type Entry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  kind: string;
  body: string;
};
export function getEntries(section: Section): Entry[] {
  const directory = path.join(process.cwd(), "content", section);
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(directory, file), "utf8"),
      );
      if (data.publish !== true) return [];
      const date =
        data.created instanceof Date
          ? data.created.toISOString().slice(0, 10)
          : String(data.created || "");
      return [
        {
          slug: file.replace(/\.md$/, ""),
          title: String(data.title || file.replace(/\.md$/, "")),
          description: String(
            data.description ||
              content.replace(/[#*`]/g, "").trim().slice(0, 120),
          ),
          date,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          kind: String(data.kind || "note"),
          body: content,
        },
      ];
    })
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "ko"),
    );
}
