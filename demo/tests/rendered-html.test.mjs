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
    "人间清醒的务实派",
    "这是 AI 对你的第一印象",
    "正在读懂你的选择方式",
    "寻找重复偏好",
    "这些判断说得像你吗",
    "补充几项基本信息",
    "你对未来生活有什么想法",
    "AI 将从这些信息出发",
    "职途初鉴",
    "我的能力雷达",
    "AI 画像生成过程",
    "检索职业路径资料库",
    "初评分数会随体验和真实反馈更新",
    "性格4.5",
    "压力应对",
    "考公方向好像更匹配",
    "看看相似的人怎么走",
    "同路人的今天",
    "从山西二本到北京朝阳区",
    "参考这条路，体验我的考公人生",
    "这个方向正在建设中",
    "三种平行人生",
    "未来体验 Agent",
    "还需要确认一件事",
    "正在结合你的回答重新组织问题",
    "正在查询相关资料",
    "对话线索已更新",
    "带着这些线索去体验",
    "从 Agent 带入的对话线索",
    "真实样本未来体验",
    "参考样本 01 / 04 / 07",
    "上岸以后，部门里没有同龄人",
    "更新后的方向画像",
    "考公方向认知",
    "AI 正在搜索近期公开帖子",
    "自由提问正在开发中",
    "方向认知增加 1 分",
    "领取我的第一阶段任务",
    "第一阶段 · 7 天考公探索",
    "模拟两天后，任务仍未开始",
    "是什么让你没有开始",
    "计划已重新计算",
    "候选画像线索",
    "按任务难度加权",
    "快进到周日晚",
    "周复盘与计划校准",
    "这一周，先看看走到了哪里",
    "基于当前进度，开启下一阶段",
    "正在重新规划",
    "下一阶段已开启",
    "体验 20 分钟华图考公入门课",
  ]) {
    assert.match(page, new RegExp(content));
  }

  assert.match(page, /值得继续探索，先看具体岗位/);
  assert.match(page, /不是岗位匹配率，也不是上岸概率/);
  assert.match(page, /本次作为对照路径/);
  assert.match(page, /已完成任务权重 \{executionProgress\} ÷ 总权重 100/);
  assert.match(page, /不承诺考试或就业结果/);
  assert.match(page, /onPointerMove=\{handleLandingPointerMove\}/);
  assert.match(page, /floating-layer card-chat/);
  assert.match(page, /compass-needle/);
  assert.match(page, /--needle-angle/);
  assert.match(page, /startJourney/);
  assert.match(page, /is-launching/);
  assert.match(page, /window\.scrollTo/);
  assert.match(page, /navigateJourney/);
  assert.match(page, /furthestRank/);
  assert.match(page, /aria-current=\{isCurrent \? "step"/);
  assert.match(page, /下一步：补充学校和经历/);
  assert.match(page, /只寻找重复出现的偏好/);
  assert.doesNotMatch(page, /为什么还要补充资料/);
  assert.doesNotMatch(page, /重新回答|再补充一些信息/);
  assert.doesNotMatch(page, /你刚完成了情境探索|它来自刚才的人生课题和情境回答/);
  assert.doesNotMatch(page, /当前画像生成进度/);
  assert.doesNotMatch(page, /1 个课题锚点 \+ 8 道人生情境/);
  assert.doesNotMatch(page, /六维等权|结论边界|信息缺口：岗位体验/);
  assert.doesNotMatch(page, /确认加入待验证问题|生成一条画像候选/);
  assert.doesNotMatch(page, /资格审查通过率是多少|开始 10 分钟考公摸底/);
  assert.doesNotMatch(page, /你没有失败，只是第一步太大|下一阶段这样调整|开启下一阶段 · 开发中/);
  assert.doesNotMatch(page, /规划师|requires_human_review/);
});

test("uses finished product metadata instead of starter preview metadata", async () => {
  const layout = await readFile(layoutUrl, "utf8");

  assert.match(layout, /华图成长罗盘/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
});
