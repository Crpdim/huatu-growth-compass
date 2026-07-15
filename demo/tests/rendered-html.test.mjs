import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/page.tsx", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);

test("contains the complete Growth Compass demo journey", async () => {
  const page = await readFile(pageUrl, "utf8");

  for (const content of [
    "你<span>迷茫</span>吗",
    "多线加载型",
    "企业后端求职",
    "四周成长实验",
    "动态校准",
    "成长罗盘已更新至 v2",
  ]) {
    assert.match(page, new RegExp(content));
  }

  assert.doesNotMatch(page, /规划师|requires_human_review/);
});

test("uses finished product metadata instead of starter preview metadata", async () => {
  const layout = await readFile(layoutUrl, "utf8");

  assert.match(layout, /华图成长罗盘/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
});
