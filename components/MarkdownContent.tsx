import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ children }: { children: string }) {
  return <Markdown remarkPlugins={[remarkGfm]} components={{
    table: ({ children }) => <div className="markdown-table-scroll" role="region" aria-label="본문 표" tabIndex={0}><table>{children}</table></div>,
  }}>{children}</Markdown>;
}
