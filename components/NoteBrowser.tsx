"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, X, BookOpen } from "lucide-react";
import type { Entry } from "@/lib/content";
import { Arrow } from "./ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function NoteBrowser({
  entries,
}: {
  entries: Omit<Entry, "body">[];
}) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("전체");
  const tags = ["전체", ...new Set(entries.flatMap((entry) => entry.tags))];
  const filtered = entries.filter(
    (entry) =>
      (tag === "전체" || entry.tags.includes(tag)) &&
      `${entry.title} ${entry.description} ${entry.tags.join(" ")}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <Tabs value={tag} onValueChange={setTag} className="note-browser">
      <div className="notes-toolbar">
        <TabsList aria-label="노트 주제" className="note-filter-tabs">
          {tags.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="note-search">
          <Search size={17} aria-hidden="true" />
          <Input
            aria-label="학습 노트 검색"
            placeholder="궁금한 개념을 검색하세요"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="검색어 지우기"
              onClick={() => setSearch("")}
            >
              <X />
            </Button>
          )}
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        <BookOpen size={14} />
        {filtered.length}개의 노트
      </p>
      <TabsContent value={tag}>
        <div className="notes-grid">
          {filtered.map((entry) => (
            <Link
              href={`/notes/${entry.slug}`}
              key={entry.slug}
              className="note-card-link"
            >
              <Card className="note-card">
                <div className="note-card-top">
                  <Badge variant="secondary">
                    {entry.tags[0] || "로보틱스"}
                  </Badge>
                  <span className="mono muted">
                    {entry.kind === "guide" ? "GUIDE" : "NOTE"}
                  </span>
                </div>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
                <div className="note-card-bottom">
                  <span>
                    {entry.kind === "guide" ? "사이트 학습 가이드" : entry.date}
                  </span>
                  <Arrow />
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {!filtered.length && (
          <Card className="empty-state">
            <Search className="empty-search-icon" />
            <h2>일치하는 노트가 없습니다.</h2>
            <p>다른 검색어나 주제로 찾아보세요.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setTag("전체");
              }}
            >
              전체 노트 보기
            </Button>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
