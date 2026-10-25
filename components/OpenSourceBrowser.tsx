"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, FolderGit2, Search, X } from "lucide-react";
import { roboticsProjects } from "@/lib/open-source";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["전체", ...new Set(roboticsProjects.map(project => project.category))];

export default function OpenSourceBrowser() {
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const projects = roboticsProjects.filter(project =>
    (category === "전체" || project.category === category) &&
    `${project.name} ${project.repository} ${project.category} ${project.description} ${project.tags.join(" ")}`
      .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  return <section className="opensource-browser" aria-label="로봇 오픈소스 탐색">
    <div className="opensource-toolbar">
      <div className="opensource-filters" role="group" aria-label="오픈소스 분야">
        {categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="note-search">
        <Search size={17} aria-hidden="true" />
        <Input aria-label="오픈소스 검색" placeholder="프로젝트, 주제, 언어 검색" value={query} onChange={event => setQuery(event.target.value)} />
        {query && <Button variant="ghost" size="icon-xs" aria-label="오픈소스 검색어 지우기" onClick={() => setQuery("")}><X /></Button>}
      </div>
    </div>
    <div className="opensource-results"><p aria-live="polite"><FolderGit2 size={15} />{projects.length}개 프로젝트</p><span>공식 저장소 확인 · 2026.10.22</span></div>
    <div className="opensource-grid">
      {projects.map(project => <article className="opensource-card" key={project.repository}>
        <div className="opensource-card-top"><FolderGit2 size={21} /><span>{project.category}</span></div>
        <h2>{project.name}</h2>
        <span className="opensource-repository">{project.repository}</span>
        <p>{project.description}</p>
        <div className="opensource-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <div className="opensource-explore"><h3><BookOpen size={14} />이렇게 탐구해요</h3><p>{project.explore}</p></div>
        <a className="opensource-link" href={`https://github.com/${project.repository}`} target="_blank" rel="noreferrer" aria-label={`${project.name} 공식 저장소 보기 (새 탭)`}>공식 저장소 보기 <ArrowUpRight size={16} /></a>
      </article>)}
    </div>
    {!projects.length && <div className="opensource-empty"><Search size={30} /><h2>일치하는 프로젝트가 없어요.</h2><p>다른 검색어나 분야로 찾아보세요.</p><Button variant="outline" onClick={() => { setQuery(""); setCategory("전체"); }}>전체 프로젝트 보기</Button></div>}
  </section>;
}
