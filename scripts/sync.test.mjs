import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { prepareEntries, sync } from "./sync-secondbrain.mjs";

test("only explicit publish true is exported; source metadata is removed", () => {
  const result = prepareEntries([
    {
      name: "23.01 로봇.md",
      text: "---\npublish: true\nsite_section: notes\nsources: [private.pdf]\nsource_count: 1\ntitle: 공개\n---\n내용",
    },
    { name: "비공개.md", text: "---\npublish: false\n---\n비밀" },
    { name: "문자열.md", text: '---\npublish: "true"\n---\n비밀' },
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].section, "notes");
  assert.ok(!result[0].text.includes("private.pdf"));
  assert.ok(!result[0].text.includes("source_count"));
});
test("wiki links only resolve to public pages and respect sections", () => {
  const result = prepareEntries([
    {
      name: "A.md",
      text: "---\npublish: true\n---\n[[B|다음]] [[비밀일정카드]]",
    },
    {
      name: "B.md",
      text: "---\npublish: true\nsite_section: weekly\n---\n공개",
    },
  ]);
  assert.match(result[0].text, /\[다음\]\(\/weekly#b\)/);
  assert.ok(!result[0].text.includes("비밀일정카드"));
});
test("sync removes previously managed records when publication is revoked; preserves hand-authored content", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "physical-sync-"));
  const source = path.join(root, "source");
  const output = path.join(root, "content");
  fs.mkdirSync(source);
  fs.mkdirSync(path.join(output, "notes"), { recursive: true });
  fs.writeFileSync(path.join(output, "notes", "guide.md"), "handwritten");
  try {
    fs.writeFileSync(
      path.join(source, "A.md"),
      "---\npublish: true\n---\nhello",
    );
    sync(source, output);
    assert.ok(fs.existsSync(path.join(output, "notes", "a.md")));
    fs.writeFileSync(
      path.join(source, "A.md"),
      "---\npublish: false\n---\nsecret",
    );
    sync(source, output);
    assert.ok(!fs.existsSync(path.join(output, "notes", "a.md")));
    assert.equal(
      fs.readFileSync(path.join(output, "notes", "guide.md"), "utf8"),
      "handwritten",
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
test("dry run leaves output untouched; invalid sections and slug collisions are rejected", () => {
  assert.throws(
    () =>
      prepareEntries([
        {
          name: "A.md",
          text: "---\npublish: true\nsite_section: ../outside\n---\nx",
        },
      ]),
    /section/,
  );
  assert.throws(
    () =>
      prepareEntries([
        { name: "A.md", text: "---\npublish: true\n---\nx" },
        { name: "a.md", text: "---\npublish: true\n---\ny" },
      ]),
    /collision/,
  );
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "physical-sync-"));
  try {
    const source = path.join(root, "source");
    fs.mkdirSync(source);
    fs.writeFileSync(
      path.join(source, "A.md"),
      "---\npublish: true\n---\nhello",
    );
    sync(source, path.join(root, "output"), true);
    assert.ok(!fs.existsSync(path.join(root, "output")));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
