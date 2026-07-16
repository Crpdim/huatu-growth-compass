import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/page.tsx", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);

test("contains the complete Growth Compass demo journey", async () => {
  const page = await readFile(pageUrl, "utf8");

  for (const content of [
    "你<span>迷茫</span>吗",
    "未来生活",
    "现实探索型",
    "AI 成长坐标",
    "现实导向的",
    "三种平行人生",
    "未来体验 Agent",
    "体制内平行人生",
    "体验前后画像",
    "7 天考公体验计划",
  ]) {
    assert.match(page, new RegExp(content));
  }

  assert.match(page, /公考仍值得探索，但理由更完整/);
  assert.match(page, /如果我想走到这种生活，下一步该怎么实现/);
  assert.match(page, /本次作为对照路径/);
  assert.match(page, /onPointerMove=\{handleLandingPointerMove\}/);
  assert.match(page, /floating-layer card-chat/);
  assert.doesNotMatch(page, /规划师|requires_human_review/);
});

test("uses finished product metadata instead of starter preview metadata", async () => {
  const layout = await readFile(layoutUrl, "utf8");

  assert.match(layout, /华图成长罗盘/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
});
