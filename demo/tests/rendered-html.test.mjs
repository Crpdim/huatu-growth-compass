import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/page.tsx", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);
const demoDataUrl = new URL("../app/demo-data.ts", import.meta.url);
const profilePageUrl = new URL("../app/components/profile-pages.tsx", import.meta.url);
const managementPageUrl = new URL("../app/components/management-action-pages.tsx", import.meta.url);
const progressPageUrl = new URL("../app/components/progress-page.tsx", import.meta.url);
const lifeGamePageUrl = new URL("../app/components/life-game-page.tsx", import.meta.url);
const promoHomePageUrl = new URL("../app/components/promo-home-page.tsx", import.meta.url);
const productManualPageUrl = new URL("../app/components/product-manual-page.tsx", import.meta.url);
const lifeGameHtmlUrl = new URL("../public/life-game/index.html", import.meta.url);
const lifeGameScriptUrl = new URL("../public/life-game/script.js", import.meta.url);
const globalStylesUrl = new URL("../app/globals.css", import.meta.url);
const featureUrls = [
  pageUrl,
  demoDataUrl,
  new URL("../app/demo-types.ts", import.meta.url),
  new URL("../app/components/app-chrome.tsx", import.meta.url),
  new URL("../app/components/exploration-pages.tsx", import.meta.url),
  profilePageUrl,
  new URL("../app/components/direction-pages.tsx", import.meta.url),
  managementPageUrl,
  new URL("../app/components/management-navigation.tsx", import.meta.url),
  new URL("../app/components/agent-message.tsx", import.meta.url),
  progressPageUrl,
  new URL("../app/components/companion-page.tsx", import.meta.url),
  new URL("../app/components/review-pages.tsx", import.meta.url),
  lifeGamePageUrl,
  promoHomePageUrl,
  productManualPageUrl,
  lifeGameHtmlUrl,
  lifeGameScriptUrl,
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
    "健康与精力状态",
    "家庭支持与限制",
    "用于判断规划能否实施，不评价家庭层级",
    "你对未来生活有什么想法",
    "可选授权",
    "Bilibili",
    "GitHub",
    "华图",
    "Apple Watch",
    "用这些信息补全画像",
    "AI 会建立任务画像",
    "职途初鉴",
    "我的八维成长画像",
    "AI 正在补全任务画像",
    "同步授权数据",
    "检索职业路径资料库",
    "八项指标都保留可追溯依据",
    "八维成长画像雷达",
    "抗压与情绪",
    "考公方向好像更匹配",
    "看看相似的人怎么走",
    "同路人的今天",
    "从山西二本到北京朝阳区",
    "完成方向探索，进入职途有声",
    "这个方向正在建设中",
    "三条发展路径",
    "未来体验 Agent",
    "还需要确认一件事",
    "正在结合你的回答重新组织问题",
    "正在查询相关资料",
    "对话线索已更新",
    "完成探索，导入职途有声",
    "职途有声",
    "GROWTH MANAGER",
    "方向探索已完成",
    "任务与伴学空间",
    "正在切换应用",
    "正在导入用户画像",
    "读取画像 v1 与授权范围",
    "生成 Todo List 与复盘节点",
    "进入职途有声",
    "你好，林小北",
    "直接进入职途有声",
    "方向与本周计划",
    "华图课程答疑",
    "当前任务进展",
    "我当前任务完成得怎么样",
    "当前完成状态",
    "本周回顾",
    "帮我回顾一下这周",
    "提醒中心",
    "在当前会话处理",
    "在当前会话处理",
    "状态分样例为 38",
    "你问一个问题，我回答一个问题",
    "我的能力怎样",
    "正在查找已确认画像与授权资料",
    "这是你当前的八维成长画像",
    "八项指标统一显示",
    "健康情况",
    "家庭情况",
    "家庭支持较强，但需考虑异地限制",
    "八维综合指数 / 5",
    "帮我安排一下任务看看我适不适合考公",
    "先用 4 个小任务验证你是否适合考公",
    "我确认了想去税务局",
    "已把税务局作为本周重点岗位",
    "需要赶紧报名了，国考报名窗口还有 7 天",
    "我已经报了名",
    "已记录报名完成，接下来准备笔试体验",
    "成长规划 Agent",
    "path_compare",
    "profile_radar",
    "task_list",
    "stress_probe",
    "任务管理",
    "本周 Todo",
    "自己增删改，也可以只让 AI 处理某一项",
    "可以直接增删改",
    "AI 任务助手",
    "完成状态会同步到 Agent 对话",
    "任务分值",
    "已完成",
    "未完成",
    "消息和任务使用同一份画像",
    "任务太大，帮我拆小",
    "本周加权进度",
    "这里只回答三件事",
    "为什么方向线索是",
    "匹配度变化",
    "证据还不够",
    "先完成两件小事，再决定下一阶段",
    "生成下一阶段计划",
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
    "复盘与画像更新",
    "阶段开始 v1 → 当前候选 v2",
    "只有任务和成果会更新画像",
    "阶段结算",
    "考公认知与入门验证",
    "继续考公探索",
    "看看其他方向",
    "先规划生活本身",
    "四周公考基础体验计划",
    "考公仍是阶段性探索",
    "人生模拟器",
    "没有人生目标？点击探索你的人生规划",
    "模范公务员达成",
    "补全任务画像 →",
    "补充真实信息后，AI会分析你的能力矩阵，教你一步步实现人生目标",
    "huatu:explore-planning",
    "huatu:life-game-complete",
  ]) {
    assert.match(page, new RegExp(content));
  }

  assert.match(page, /本次作为对照路径/);
  assert.match(page, /executionTotalWeight/);
  assert.match(page, /executionTaskDone/);
  assert.match(page, /managementTaskCredits/);
  assert.match(page, /sessionConversations/);
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
  assert.match(page, /useState<Stage>\("lifeGame"\)/);
  assert.match(page, /showPromoHome/);
  assert.match(page, /experience=life-game/);
  assert.match(page, /<PromoHomePage/);
  assert.match(page, /onExplorePlanning=\{\(\) => setStage\("landing"\)\}/);
  assert.match(page, /setStage\("profile"\)/);
  assert.doesNotMatch(page, /阶段复盘|user_confirmation_required|needs_more_evidence|decision_status ·|information_gaps ·/);
  assert.doesNotMatch(page, /体验我的考公人生|真实样本未来体验/);
  assert.doesNotMatch(page, /stage === "simulation"|stage === "recalibration"/);
  assert.doesNotMatch(page, /\{ label: "画像同步", short: "导入依据" \}|\{ label: "任务管理", short: "开始行动" \}|\{ label: "动态校准", short: "反馈更新" \}/);
  assert.doesNotMatch(page, /为什么还要补充资料/);
  assert.doesNotMatch(page, /重新回答|再补充一些信息/);
  assert.doesNotMatch(page, /你刚完成了情境探索|它来自刚才的人生课题和情境回答/);
  assert.doesNotMatch(page, /当前画像生成进度/);
  assert.doesNotMatch(page, /1 个课题锚点 \+ 8 道人生情境/);
  assert.doesNotMatch(page, /健康情况[^。；\n]*\/5|家庭情况[^。；\n]*\/5|结论边界|信息缺口：岗位体验/);
  assert.doesNotMatch(page, /确认加入待验证问题|生成一条画像候选/);
  assert.doesNotMatch(page, /资格审查通过率是多少|开始 10 分钟考公摸底/);
  assert.doesNotMatch(page, /你没有失败，只是第一步太大|下一阶段这样调整|开启下一阶段 · 开发中/);
  assert.doesNotMatch(page, /规划师|requires_human_review/);
});

test("opens with a campaign homepage and keeps the life game as the experience entry", async () => {
  const promo = await readFile(promoHomePageUrl, "utf8");
  const globalStyles = await readFile(globalStylesUrl, "utf8");

  assert.match(promo, /职途有声，懂你所需，助你所行/);
  assert.match(promo, /进入模拟人生/);
  assert.match(promo, /product-demo\.mp4/);
  assert.match(promo, /experience=life-game/);
  assert.match(promo, /onExperience\(\)/);
  assert.match(promo, /查看使用手册/);
  assert.match(promo, /\/manual\//);
  assert.match(promo, /src=\{`\$\{basePath\}\/logo\.png`\}/);
  assert.doesNotMatch(promo, /LIVE|先体验，再选择|把人生选择变成一次可以亲自参与的模拟/);
  assert.match(globalStyles, /\.promo-video-frame/);
  assert.match(globalStyles, /prefers-reduced-motion/);
});

test("renders the complete product manual as a first-party page", async () => {
  const manual = await readFile(productManualPageUrl, "utf8");

  for (const content of [
    "产品使用手册",
    "做更懂你的 AI 成长管家",
    "用户画像初建 · 模拟人生",
    "多渠道信息补充",
    "八维能力分析",
    "人生榜样参考",
    "让合理的规划真正落地",
    "方向与本周计划",
    "课程答疑",
    "当前任务进展",
    "实时提醒",
    "本周回顾",
    "一个入口，多个专业能力协同",
    "核心成长管家统筹的多 Agent 架构",
  ]) {
    assert.match(manual, new RegExp(content));
  }

  assert.match(manual, /management-tasks-3\.png/);
  assert.match(manual, /agent-architecture\.png/);
  assert.match(manual, /experience=life-game/);
  assert.doesNotMatch(manual, /my\.feishu\.cn|职图有声/);
});

test("uses finished product metadata instead of starter preview metadata", async () => {
  const layout = await readFile(layoutUrl, "utf8");

  assert.match(layout, /职途有声/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
});

test("keeps growth management chat-first with an explicit task manager entry", async () => {
  const appPage = await readFile(pageUrl, "utf8");
  const management = await readFile(managementPageUrl, "utf8");

  assert.match(management, /activeSession/);
  assert.match(management, /agent-session-list/);
  assert.match(management, /agent-profile-radar/);
  assert.match(management, /planningStep === 7/);
  assert.match(management, /planningIsBusy/);
  assert.match(management, /data-script-turn="ability"/);
  assert.match(management, /getBoundingClientRect\(\)\.top/);
  assert.match(management, /agent-session-metrics/);
  assert.match(management, /resourceAdded/);
  assert.match(management, /agent-reminder-center/);
  assert.match(management, /reminderSession === activeSession/);
  assert.match(management, /bringReminderIntoConversation/);
  assert.match(management, /agent-plain-summary/);
  assert.match(management, /activeSession === "progress"/);
  assert.match(management, /activeSession === "review"/);
  assert.match(management, /sessionConversations/);
  assert.match(management, /agent-task-manager-entry/);
  assert.match(management, /onGoToStage\("progress"\)/);
  assert.match(management, /我当前任务完成得怎么样/);
  assert.match(management, /帮我回顾一下这周/);
  assert.doesNotMatch(appPage, /ManagementNavigation/);
  assert.doesNotMatch(management, /agent-proactive-reminder/);
  assert.doesNotMatch(management, /周回顾与提醒/);
  assert.doesNotMatch(management, /后续解锁|查看完整画像依据|打开进展总览/);
});

test("lets the user add, edit, delete and AI-adjust tasks without losing shared state", async () => {
  const [appPage, management, progress, globalStyles] = await Promise.all([
    readFile(pageUrl, "utf8"),
    readFile(managementPageUrl, "utf8"),
    readFile(progressPageUrl, "utf8"),
    readFile(globalStylesUrl, "utf8"),
  ]);

  assert.match(appPage, /taskManagerActions/);
  assert.match(appPage, /setExecutionTasks/);
  assert.match(appPage, /addExecutionTask/);
  assert.match(appPage, /updateExecutionTask/);
  assert.match(appPage, /deleteExecutionTask/);
  assert.match(appPage, /splitExecutionTask/);
  assert.match(appPage, /attachExecutionTaskLink/);
  assert.match(appPage, /taskActions=\{taskManagerActions\}/);
  assert.match(appPage, /taskManagerActions=\{taskManagerActions\}/);
  assert.match(progress, /onToggleTask/);
  assert.match(progress, /onSetTaskAction/);
  assert.match(progress, /＋ 新建任务/);
  assert.match(progress, /保存修改/);
  assert.match(progress, /删除“\$\{task\.title\}”/);
  assert.match(progress, /className="task-row-ai"/);
  assert.match(progress, /className="task-ai-suggestions"/);
  assert.match(progress, /<footer><div className="task-ai-suggestions"/);
  assert.match(progress, /className="task-ai-composer"/);
  assert.match(progress, /submitAiMessage/);
  assert.match(progress, /输入你想让 AI 如何调整这项任务/);
  assert.match(progress, /拆成小任务/);
  assert.match(progress, /应用这份拆解/);
  assert.match(progress, /保存链接到任务/);
  assert.match(progress, /bm\.scs\.gov\.cn\/kl2026/);
  assert.match(progress, /国家公务员局官方报名专题/);
  assert.match(management, /已暂停 · 可在任务管理中恢复/);
  assert.match(management, /已拆成 \$\{task\.subtasks\.length\} 个小步骤/);
  assert.match(management, /已添加官方入口/);
  assert.match(globalStyles, /\.task-manager-row/);
  assert.match(globalStyles, /\.task-ai-dialog/);
  assert.match(globalStyles, /\.task-ai-composer/);
  assert.match(globalStyles, /\.progress-spectrum i/);
});

test("wires every life-game exit to the intended Growth Compass stage", async () => {
  const [appPage, bridge, gameHtml, gameScript] = await Promise.all([
    readFile(pageUrl, "utf8"),
    readFile(lifeGamePageUrl, "utf8"),
    readFile(lifeGameHtmlUrl, "utf8"),
    readFile(lifeGameScriptUrl, "utf8"),
  ]);

  assert.match(gameHtml, /id="open-growth-planning"/);
  assert.match(gameHtml, /id="complete-to-profile"/);
  assert.match(gameHtml, /script\.js\?v=20260719-route-notice/);
  assert.match(gameHtml, /当前仅开放<br \/><strong>体制内人生—公务员<\/strong>的游戏体验/);
  assert.match(gameHtml, /请选择体制内人生开始游戏/);
  assert.match(gameHtml, /id="choose-system-life"/);
  assert.match(gameScript, /if \(life === "体制内人生"\)/);
  assert.match(gameScript, /openRouteNotice\(\)/);
  assert.match(gameScript, /routeNotice\.showModal\(\)/);
  assert.match(gameScript, /chooseSystemLifeButton\.addEventListener\("click"/);
  assert.match(gameScript, /growthPlanningLink\.addEventListener\("click"/);
  assert.match(gameScript, /notifyGrowthCompass\("huatu:explore-planning"\)/);
  assert.match(gameScript, /completeToProfileButton\.addEventListener\("click"/);
  assert.match(gameScript, /notifyGrowthCompass\("huatu:life-game-complete"\)/);
  assert.doesNotMatch(gameHtml + gameScript, /梦想照进现实|现在的我该怎么一步一步接近这个结局|dream-roadmap|dream-cta/);
  assert.match(gameScript, /window\.parent\.postMessage\(\{ type \}, window\.location\.origin\)/);
  assert.match(bridge, /event\.origin !== window\.location\.origin/);
  assert.match(bridge, /event\.source !== frameRef\.current\?\.contentWindow/);
  assert.match(bridge, /event\.data\?\.type === "huatu:explore-planning"/);
  assert.match(bridge, /event\.data\?\.type === "huatu:life-game-complete"/);
  assert.match(bridge, /index\.html\?v=\$\{lifeGameAssetVersion\}/);
  assert.match(appPage, /onExplorePlanning=\{\(\) => setStage\("landing"\)\}/);
  assert.match(appPage, /setSelectedPurpose\("steady"\)/);
  assert.match(appPage, /setStage\("profile"\)/);
});

test("renders health and family inside a real eight-axis profile without exposing scoring prompts", async () => {
  const [demoData, profilePage, managementPage, globalStyles] = await Promise.all([
    readFile(demoDataUrl, "utf8"),
    readFile(profilePageUrl, "utf8"),
    readFile(managementPageUrl, "utf8"),
    readFile(globalStylesUrl, "utf8"),
  ]);
  const abilityBlock = demoData.match(/export const abilityDimensions = \[([\s\S]*?)\n\];/)?.[1];
  const agentBlock = managementPage.match(/const agentProfileDimensions = \[([\s\S]*?)\n\];/)?.[1];

  assert.ok(abilityBlock, "abilityDimensions should remain a static eight-axis array");
  assert.ok(agentBlock, "agentProfileDimensions should remain a static eight-axis array");
  assert.equal([...abilityBlock.matchAll(/\{ label:/g)].length, 8);
  assert.equal([...agentBlock.matchAll(/\{ label:/g)].length, 8);

  for (const label of ["性格适配", "专业能力", "兴趣匹配度", "学习与知识", "抗压与情绪", "沟通协作", "健康情况", "家庭情况"]) {
    assert.match(abilityBlock, new RegExp(label));
  }

  assert.match(profilePage, /aria-label="八维成长画像雷达/);
  assert.match(profilePage, /八维综合指数 \/ 5/);
  assert.match(managementPage, /八维画像雷达/);
  assert.match(globalStyles, /\.radar-axis\.axis-6/);
  assert.match(globalStyles, /\.radar-axis\.axis-7/);
  assert.doesNotMatch(demoData + profilePage + managementPage, /profileContextDimensions|agentProfileContextDimensions|六项能力|条件项 · 不计分/);
  assert.doesNotMatch(
    demoData + profilePage + managementPage,
    /HRV|SES|父母期望问卷|压力游戏|体能耐受|精力阈值|经济资本|文化资本|社会资源|沟通质量|x0\.3|x0\.4/,
  );
});
