import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/MarkdownContent";
import { getEntries } from "@/lib/content";
export function generateStaticParams() {
  return getEntries("notes").map((entry) => ({ slug: entry.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntries("notes").find((entry) => entry.slug === slug);
  return { title: entry?.title || "노트를 찾을 수 없습니다" };
}
export default async function Note({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = getEntries("notes");
  const entry = entries.find((entry) => entry.slug === slug);
  if (!entry) notFound();
  return (
    <article className="article">
      <Link href="/notes" className="text-link">
        ← 학습 노트로 돌아가기
      </Link>
      <header className="article-header">
        <div className="eyebrow">
          {entry.kind === "guide" ? "LEARNING GUIDE" : "FIELD NOTE"}
        </div>
        <h1>{entry.title}</h1>
        <p>{entry.description}</p>
        <div className="article-meta">
          <span>{entry.date}</span>
          {entry.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>
      {entry.kind === "guide" && (
        <aside className="info-callout">
          사이트 입문용 학습 가이드입니다. 실제 제작이나 실험 결과를 기록한 글이
          아닙니다.
        </aside>
      )}
      <div className="prose">
        <MarkdownContent>{entry.body}</MarkdownContent>
      </div>
      <div className="article-next">
        <span className="eyebrow">KEEP EXPLORING</span>
        {entries
          .filter((item) => item.slug !== slug)
          .slice(0, 2)
          .map((item) => (
            <Link key={item.slug} href={`/notes/${item.slug}`}>
              {item.title} ↗
            </Link>
          ))}
      </div>
    </article>
  );
}
