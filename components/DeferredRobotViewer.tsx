"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Rotate3D } from "lucide-react";

const RobotViewer = dynamic(() => import("@/components/RobotViewer"), {
  ssr: false,
  loading: () => <div className="robot-viewer-placeholder" role="status">3D 뷰어를 준비하고 있어요…</div>,
});

export default function DeferredRobotViewer({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (compact || !container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEnabled(true);
        observer.disconnect();
      }
    }, { rootMargin: "150px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [compact]);

  return <div ref={container} className={`deferred-robot ${compact ? "deferred-compact" : "deferred-interactive"}`}>
    {enabled ? <RobotViewer compact={compact} /> : <div className="robot-poster">
      <Image className="robot-poster-light" src="/models/unitree-g1-preview.webp" alt="Unitree G1 휴머노이드 모델 미리보기" fill unoptimized sizes="(max-width: 800px) 100vw, 500px" loading={compact ? "eager" : "lazy"} />
      <Image className="robot-poster-dark" src="/models/unitree-g1-preview-dark.webp" alt="" aria-hidden="true" fill unoptimized sizes="(max-width: 800px) 100vw, 500px" loading={compact ? "eager" : "lazy"} />
      {compact ? <button type="button" onClick={() => setEnabled(true)} className="robot-activate"><Rotate3D size={16} />3D 모델 움직여보기</button> : <p role="status">3D 탐구 화면을 준비하고 있어요…</p>}
    </div>}
  </div>;
}
