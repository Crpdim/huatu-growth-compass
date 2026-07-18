import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/page.tsx", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);
const featureUrls = [
  pageUrl,
  new URL("../app/demo-data.ts", import.meta.url),
  new URL("../app/demo-types.ts", import.meta.url),
  new URL("../app/components/app-chrome.tsx", import.meta.url),
  new URL("../app/components/exploration-pages.tsx", import.meta.url),
  new URL("../app/components/profile-pages.tsx", import.meta.url),
  new URL("../app/components/direction-pages.tsx", import.meta.url),
  new URL("../app/components/management-action-pages.tsx", import.meta.url),
  new URL("../app/components/management-navigation.tsx", import.meta.url),
  new URL("../app/components/agent-message.tsx", import.meta.url),
  new URL("../app/components/progress-page.tsx", import.meta.url),
  new URL("../app/components/companion-page.tsx", import.meta.url),
  new URL("../app/components/review-pages.tsx", import.meta.url),
];

test("contains the complete Growth Compass demo journey", async () => {
  const page = (await Promise.all(featureUrls.map((url) => readFile(url, "utf8")))).join("\n");

  for (const content of [
    "你<span>迷茫</span>吗",
    "未来生活",
    "人间清醒的务实派",
    "这是 AI 对你的第一印象",
    "正在读懂你的选择方式",
    "寻找重复偏好",
    "这些判断说得像你吗",
    "让 AI 多了解你一点",
    "你对未来生活有什么想法",
    "可选授权",
    "Bilibili",
    "GitHub",
    "华图",
    "Apple Watch",
    "用这些信息补全画像",
    "AI 会建立任务画像",
    "职途初鉴",
    "我的能力雷达",
    "AI 正在补全任务画像",
    "同步授权数据",
    "检索职业路径资料库",
    "初评分数会随体验和真实反馈更新",
    "性格4.5",
    "压力应对",
    "考公方向好像更匹配",
    "看看相似的人怎么走",
    "同路人的今天",
    "从山西二本到北京朝阳区",
    "完成方向探索，进入成长管理",
    "这个方向正在建设中",
    "三条发展路径",
    "未来体验 Agent",
    "还需要确认一件事",
    "正在结合你的回答重新组织问题",
    "正在查询相关资料",
    "对话线索已更新",
    "完成探索，导入成长管理",
    "华图成长管理",
    "GROWTH MANAGER",
    "方向探索已完成",
    "任务与伴学空间",
    "正在切换应用",
    "正在导入用户画像",
    "读取画像 v1 与授权范围",
    "生成 Todo List 与复盘节点",
    "进入成长管理",
    "你好，林小北",
    "直接进入成长管理",
    "方向与本周计划",
    "华图课程答疑",
    "阶段复盘",
    "提醒中心",
    "在当前会话处理",
    "在当前会话处理",
    "连续两晚睡眠低于平时",
    "选择你的主要方向",
    "稳定发展，先了解考公",
    "正在读取你的最新画像和路径资料",
    "为我生成本周重点任务",
    "成长规划 Agent",
    "path_compare",
    "profile_radar",
    "task_list",
    "stress_probe",
    "进展总览",
    "整体进度（加权）",
    "已完成",
    "未完成",
    "这是当前规划使用的六维画像",
    "消息和任务使用同一份画像",
    "任务太大，帮我拆小",
    "这次卡在哪里",
    "计划已调整",
    "本周加权进度",
    "周复盘与计划校准",
    "这一周，先看看走到了哪里",
    "基于当前进度，开启下一阶段",
    "正在重新规划",
    "下一阶段已开启",
    "体验 20 分钟华图考公入门课",
    "进入我的 AI 伴学工作台",
    "AI 伴学工作台",
    "计划不只写在纸上",
    "模拟接入华图学习资源",
    "资料分析入门：快速定位材料数据",
    "加入本周计划",
    "本轮学习记录已更新",
    "周期复盘与画像校准",
    "阶段开始 v1 → 当前候选 v2",
    "能力变化来自任务和成果证据",
    "阶段结算",
    "考公认知与入门验证",
    "继续考公探索",
    "看看其他方向",
    "先规划生活本身",
    "四周公考基础体验计划",
    "考公仍是阶段性探索",
  ]) {
    assert.match(page, new RegExp(content));
  }

  assert.match(page, /本次作为对照路径/);
  assert.match(page, /executionTasks\.reduce/);
  assert.match(page, /executionTaskDone/);
  assert.match(page, /不承诺考试或就业结果/);
  assert.match(page, /onLandingPointerMove=\{handleLandingPointerMove\}/);
  assert.match(page, /onPointerMove=\{onLandingPointerMove\}/);
  assert.match(page, /floating-layer card-chat/);
  assert.match(page, /compass-needle/);
  assert.match(page, /--needle-angle/);
  assert.match(page, /startJourney/);
  assert.match(page, /is-launching/);
  assert.match(page, /window\.scrollTo/);
  assert.match(page, /navigateJourney/);
  assert.match(page, /furthestRank/);
  assert.match(page, /companionSearchStep/);
  assert.match(page, /updatedRadarPoints/);
  assert.match(page, /evidenceWithdrawn/);
  assert.match(page, /NextStageChoice/);
  assert.match(page, /aria-current=\{isCurrent \? "step"/);
  assert.match(page, /下一步：补充资料与授权/);
  assert.match(page, /只寻找重复出现的偏好/);
  assert.doesNotMatch(page, /体验我的考公人生|真实样本未来体验/);
  assert.doesNotMatch(page, /stage === "simulation"|stage === "recalibration"/);
  assert.doesNotMatch(page, /\{ label: "画像同步", short: "导入依据" \}|\{ label: "任务管理", short: "开始行动" \}|\{ label: "动态校准", short: "反馈更新" \}/);
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

test("keeps growth management content inside switchable Agent sessions", async () => {
  const management = await readFile(
    new URL("../app/components/management-action-pages.tsx", import.meta.url),
    "utf8",
  );

  assert.match(management, /activeSession/);
  assert.match(management, /agent-session-list/);
  assert.match(management, /agent-full-profile-grid/);
  assert.match(management, /agent-inline-progress/);
  assert.match(management, /resourceAdded/);
  assert.match(management, /agent-reminder-center/);
  assert.match(management, /reminderSession === activeSession/);
  assert.match(management, /bringReminderIntoConversation/);
  assert.doesNotMatch(management, /周回顾与提醒/);
  assert.doesNotMatch(management, /后续解锁|查看完整画像依据|打开进展总览/);
});
