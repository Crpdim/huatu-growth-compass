import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/page.tsx", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);

test("contains the complete Growth Compass demo journey", async () => {
  const page = await readFile(pageUrl, "utf8");

  for (const content of [
    "你<span>迷茫</span>吗",
    "稳中探索型",
    "三种平行人生",
    "未来体验 Agent",
    "体制内平行人生",
    "体验前后画像",
    "7 天考公体验计划",
  ]) {
    assert.match(page, new RegExp(content));
  }

  assert.match(page, /公考仍值得探索，但理由更完整/);
  assert.match(page, /更多人生正在生成中/);
  assert.doesNotMatch(page, /规划师|requires_human_review/);
});

test("uses finished product metadata instead of starter preview metadata", async () => {
  const layout = await readFile(layoutUrl, "utf8");

  assert.match(layout, /华图成长罗盘/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
});
