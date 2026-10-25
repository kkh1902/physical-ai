import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <span className="eyebrow orange">404 / UNCHARTED TERRITORY</span>
      <h1>아직 기록되지 않은 곳입니다.</h1>
      <p>주소를 확인하거나 학습 노트에서 다시 탐색해보세요.</p>
      <Link className="button primary" href="/notes">
        학습 노트로 이동 ↗
      </Link>
    </div>
  );
}
