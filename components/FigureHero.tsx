"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowUpRight } from "lucide-react";

export default function FigureHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) video.current?.pause();
      else video.current?.play().catch(() => {});
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return <section className="figure-film-hero" aria-label="휴머노이드 학습 소개">
    <video ref={video} muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      poster="https://images.ctfassets.net/qx5k8y1u9drj/6rREWE2DjWe7W3AFbZYSyH/21889f6a8f17464410b45c9ae12b718a/human-form-module-figure-3-image-v3.png?fm=webp&q=80&w=1600" aria-label="Figure 03 공식 소개 영상">
      <source media="(max-width: 767px)" src="https://videos.ctfassets.net/qx5k8y1u9drj/2fVvlCNzoJ4KbpcvLkXodq/34459d6f89a26f547929aed8a3f89007/homepage-01-mobile.mp4" type="video/mp4" />
      <source src="https://videos.ctfassets.net/qx5k8y1u9drj/2fyl7BnOtv5uyHkmWmnrQv/f9d9a70af813f0099d4a649b6748ec1a/homepage-01.mp4" type="video/mp4" />
    </video>
    <div className="film-shade" />
    <div className="film-content">
      <div><span className="film-kicker">Physical AI / Independent learning lab</span><h1>지능이 움직이는 순간.<br />그 원리를 배웁니다.</h1><p>실제 휴머노이드에서 출발해 코드, 제어, 제작으로.<br />나만의 로봇을 향한 학습을 시작하세요.</p></div>
      <div className="film-actions"><Link href="/roadmap">학습 로드맵 <ArrowUpRight size={18} /></Link><Link href="/study">3D 구조 탐구 <ArrowUpRight size={18} /></Link></div>
    </div>
    <div className="film-bottom"><a href="https://www.figure.ai/" target="_blank" rel="noreferrer">영상 출처: Figure · Figure 03 ↗</a><button onClick={() => { if(playing) video.current?.pause(); else video.current?.play().catch(() => {}); }} aria-label={playing ? "소개 영상 일시정지" : "소개 영상 재생"}>{playing ? <Pause size={15}/> : <Play size={15}/>}</button></div>
  </section>;
}
