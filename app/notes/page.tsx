import { getEntries } from "@/lib/content";
import NoteBrowser from "@/components/NoteBrowser";
import { PageHeading } from "@/components/ui";
export const metadata = { title: "학습 노트" };
export default function Notes() {
  const entries = getEntries("notes").map(({ body, ...entry }) => {
    void body;
    return entry;
  });
  return (
    <>
      <PageHeading
        label="KNOWLEDGE BASE"
        title="배운 것을, 내 언어로"
        description="로봇을 이해하는 작은 개념들을 연결합니다. 주제별로 찾아보고 궁금한 내용을 탐구하세요."
      />
      <NoteBrowser entries={entries} />
      <aside className="info-callout">
        GUIDE로 표시된 글은 사이트를 위해 작성한 입문 자료입니다. 개인 학습·발표
        기록은 공개 설정된 카드가 동기화되면 추가됩니다.
      </aside>
    </>
  );
}
