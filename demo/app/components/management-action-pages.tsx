"use client";

import { useEffect, useState, type FormEvent, type RefObject } from "react";
import type { Stage } from "../demo-types";
import { AgentMessage } from "./agent-message";

type AuthorizationSource = { id: string; name: string };
type ExecutionTask = { title: string; category: string; weight: number; deadline: string; priority: string };
type ExecutionObstacle = { label: string; adjustedTitle: string; change: string; deadline: string; criteria: string; signal: string; review: string };
type AgentSessionId = "planning" | "learning" | "review";
type ReminderKind = "registration" | "deadline" | "wellbeing";

const agentSessions: { id: AgentSessionId; title: string; preview: string; time: string; badge?: string }[] = [
  { id: "planning", title: "方向与本周计划", preview: "选择方向、查看画像并生成任务", time: "10:31" },
  { id: "learning", title: "华图课程答疑", preview: "资料分析总是找数据慢", time: "周二", badge: "1" },
  { id: "review", title: "阶段复盘", preview: "完成率、偏离度和计划校准", time: "周日" },
];

const reminderItems: { id: ReminderKind; label: string; title: string; meta: string; tone: string }[] = [
  { id: "registration", label: "关键节点", title: "国考报名窗口还有 7 天", meta: "需核对资格与报名材料", tone: "node" },
  { id: "deadline", label: "任务到期", title: "《岗位筛选》还有 2 天到期", meta: "当前进度 0%", tone: "deadline" },
  { id: "wellbeing", label: "状态信号", title: "连续两晚睡眠低于平时", meta: "来自 Apple Watch 样例数据", tone: "care" },
];

const agentProfileDimensions = [
  { label: "性格", value: 4.5, summary: "稳健有序", evidence: "情境回答与规则任务偏好" },
  { label: "专业能力", value: 2.4, summary: "基础起步", evidence: "课程项目与当前成果" },
  { label: "兴趣匹配", value: 3.4, summary: "稳定导向", evidence: "人生课题与地域偏好" },
  { label: "学习与知识", value: 3.1, summary: "基础达标", evidence: "本科专业与学习记录" },
  { label: "压力应对", value: 4.8, summary: "韧性突出", evidence: "计划中断与压力情境" },
  { label: "沟通协作", value: 3.9, summary: "沟通稳妥", evidence: "协商情境与课程项目" },
];

type ManagementActionPagesProps = {
  stage: Stage;
  selectedAuthorizationSources: AuthorizationSource[];
  profileImportSteps: string[];
  profileImportStep: number;
  executionProgress: number;
  executionProgressClass: string;
  executionTasks: ExecutionTask[];
  executionTaskDone: boolean[];
  executionPhase: number;
  activeExecutionObstacle: ExecutionObstacle;
  completedExecutionTasks: ExecutionTask[];
  onToggleExecutionTask: (index: number) => void;
  onGoToStage: (stage: Stage) => void;
  executionChatRef: RefObject<HTMLDivElement | null>;
  onSetExecutionPhase: (phase: number) => void;
  executionObstacles: ExecutionObstacle[];
  onChooseExecutionObstacle: (index: number) => void;
  onCompleteFirstTasks: () => void;
  nextPlanPhase: 0 | 1 | 2;
  nextPlanStep: number;
  onStartNextPlan: () => void;
};

export function ManagementActionPages(props: ManagementActionPagesProps) {
  const { stage, selectedAuthorizationSources, profileImportSteps, profileImportStep, executionProgress, executionProgressClass, executionTasks, executionTaskDone, executionPhase, activeExecutionObstacle, completedExecutionTasks, onToggleExecutionTask, onGoToStage, executionChatRef, onSetExecutionPhase, executionObstacles, onChooseExecutionObstacle, onCompleteFirstTasks, nextPlanPhase, nextPlanStep, onStartNextPlan } = props;
  const [selectedPath, setSelectedPath] = useState<"public" | "job" | "postgrad" | null>(null);
  const [planningStep, setPlanningStep] = useState(0);
  const [stressResponse, setStressResponse] = useState<string | null>(null);
  const [composerText, setComposerText] = useState("");
  const [sentQuestion, setSentQuestion] = useState("");
  const [composerReply, setComposerReply] = useState("");
  const [composerThinking, setComposerThinking] = useState(false);
  const [activeSession, setActiveSession] = useState<AgentSessionId>("planning");
  const [resourceAdded, setResourceAdded] = useState(false);
  const [reminderCenterOpen, setReminderCenterOpen] = useState(false);
  const [activeReminder, setActiveReminder] = useState<ReminderKind | null>(null);
  const [reminderSession, setReminderSession] = useState<AgentSessionId | null>(null);
  const [reminderAction, setReminderAction] = useState("");
  const [proactiveReminderVisible, setProactiveReminderVisible] = useState(false);

  useEffect(() => {
    if (stage !== "execution") return;
    const timer = window.setTimeout(() => setProactiveReminderVisible(true), 1100);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (planningStep !== 1) return;
    const timer = window.setTimeout(() => setPlanningStep(2), 760);
    return () => window.clearTimeout(timer);
  }, [planningStep]);

  useEffect(() => {
    if (!composerThinking || !sentQuestion) return;
    const timer = window.setTimeout(() => {
      const reply = activeSession === "learning"
        ? "我会先定位具体知识缺口，再从华图课程样例中匹配一节短课和配套练习。"
        : activeSession === "review"
          ? "我会把这个情况放进本周复盘，先确认事实，再决定是否调整任务或方向。"
          : planningStep < 3 && (sentQuestion.includes("来不及") || sentQuestion.includes("太多"))
        ? "本周任务还没有生成。先选一个方向，我会控制第一轮任务量。"
        : sentQuestion.includes("进度")
        ? `你当前完成 ${completedExecutionTasks.length} / ${executionTasks.length} 项，加权进度 ${executionProgress}%。明细已经直接展开在这条回复下面。`
        : sentQuestion.includes("来不及") || sentQuestion.includes("太多")
          ? "收到。先不增加任务量，我会问清楚具体阻碍，再把最近的一项拆小。"
          : "我先把这个问题加入本轮对话。你可以继续补充具体场景，我会结合任务结果和已授权资料给出下一步。";
      setComposerReply(reply);
      setComposerThinking(false);
    }, 820);
    return () => window.clearTimeout(timer);
  }, [activeSession, composerThinking, completedExecutionTasks.length, executionProgress, executionTasks.length, planningStep, sentQuestion]);

  useEffect(() => {
    if (stage !== "execution") return;
    const stream = executionChatRef.current;
    if (!stream) return;
    stream.scrollTo({ top: stream.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [stage, activeSession, planningStep, executionPhase, stressResponse, activeReminder, reminderAction, sentQuestion, composerThinking, composerReply, executionTaskDone, executionChatRef]);

  function choosePath(path: "public" | "job" | "postgrad") {
    setSelectedPath(path);
    setPlanningStep(1);
  }

  function switchSession(session: AgentSessionId) {
    setActiveSession(session);
    setComposerText("");
    setSentQuestion("");
    setComposerReply("");
    setComposerThinking(false);
  }

  function bringReminderIntoConversation(reminder: ReminderKind) {
    setActiveReminder(reminder);
    setReminderSession(activeSession);
    setReminderAction("");
    setStressResponse(null);
    setReminderCenterOpen(false);
    setProactiveReminderVisible(false);
  }

  function submitComposer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = composerText.trim();
    if (!question || composerThinking) return;
    setSentQuestion(question);
    setComposerReply("");
    setComposerText("");
    setComposerThinking(true);
    if (planningStep >= 3 && (question.includes("来不及") || question.includes("太多"))) onSetExecutionPhase(1);
  }

  if (stage === "importing") {
    return <section className="content-page profile-import-page"><article className="profile-import-card" aria-live="polite">
      <div className="app-transfer-visual" aria-label="正在从华图成长罗盘切换到华图成长管理"><div className="app-transfer-source"><span>罗</span><small>华图成长罗盘</small><b>方向探索已完成</b></div><div className="app-transfer-route"><i /><span>正在导入</span><b>→</b></div><div className="app-transfer-target"><span>管</span><small>华图成长管理</small><b>任务与伴学空间</b></div></div>
      <span className="section-kicker">正在切换应用</span><h2>正在导入用户画像</h2><p>成长罗盘已经完成方向探索，现在把已确认画像、授权范围和方向线索交给成长管理。</p>
      <div className="profile-import-summary"><div><span>当前用户</span><b>林小北 · 大二 · 计算机科学与技术</b></div><div><span>已授权来源</span><b>{selectedAuthorizationSources.length > 0 ? selectedAuthorizationSources.map((source) => source.name).join(" · ") : "仅使用手动资料"}</b></div><div><span>本次管理方向</span><b>考公探索 · 每周可投入 6 小时</b></div></div>
      <div className="profile-import-steps">{profileImportSteps.map((item, index) => { const isDone = index < profileImportStep; const isActive = index === profileImportStep && profileImportStep < profileImportSteps.length; return <div className={`${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`} key={item}><span>{isDone ? "✓" : index + 1}</span><b>{item}</b><small>{isDone ? "完成" : isActive ? "处理中" : "等待"}</small></div>; })}</div>
      <div className="profile-import-progress"><i style={{ width: `${Math.round((profileImportStep / profileImportSteps.length) * 100)}%` }} /></div><footer>只导入你已确认的信息；后续每次调整都会说明依据。</footer>
    </article></section>;
  }

  if (stage === "execution") {
    return <section className="content-page execution-page">
      <div className="agent-session-workspace">
        <aside className="agent-session-list">
          <header><div><span className="agent-avatar">AI</span><div><b>成长规划 Agent</b><small>林小北的成长空间</small></div></div><button onClick={() => switchSession("planning")} aria-label="新建会话">＋</button></header>
          <span className="agent-session-label">会话</span>
          <div>{agentSessions.map((session) => <button className={activeSession === session.id ? "is-active" : ""} onClick={() => switchSession(session.id)} key={session.id}><span>{session.id === "planning" ? "规" : session.id === "learning" ? "学" : "复"}</span><div><b>{session.title}</b><small>{session.preview}</small></div><em>{session.badge ?? session.time}</em></button>)}</div>
          <footer><span>已授权</span><b>华图 · Bilibili · GitHub</b><small>消息和任务使用同一份画像</small></footer>
        </aside>
        <article className="agent-home-chat">
          <header><div><span className="agent-avatar">AI</span><div><small>{activeSession === "planning" ? "规划与行动" : activeSession === "learning" ? "学习答疑" : "反馈与校准"}</small><h3>{agentSessions.find((session) => session.id === activeSession)?.title}</h3></div></div><div className="agent-header-actions"><span className="agent-online">Agent 在线</span><button className={reminderCenterOpen ? "agent-reminder-button is-active" : "agent-reminder-button"} onClick={() => { setReminderCenterOpen((open) => !open); setProactiveReminderVisible(false); }} aria-expanded={reminderCenterOpen} aria-label="打开提醒中心"><span>提醒</span><b>3</b></button></div></header>
          {reminderCenterOpen && <aside className="agent-reminder-center" aria-label="提醒中心"><header><div><span>提醒中心</span><b>3 条待处理</b></div><button onClick={() => setReminderCenterOpen(false)} aria-label="关闭提醒中心">×</button></header><div>{reminderItems.map((item) => <button onClick={() => bringReminderIntoConversation(item.id)} key={item.id}><i className={`is-${item.tone}`}>{item.id === "registration" ? "报" : item.id === "deadline" ? "期" : "心"}</i><span><small>{item.label}</small><b>{item.title}</b><em>{item.meta}</em></span><strong>在当前会话处理 →</strong></button>)}</div><footer>提醒独立于会话；处理时由 Agent 带入你正在进行的对话。</footer></aside>}
          {proactiveReminderVisible && <aside className="agent-proactive-reminder" role="status"><button className="agent-proactive-close" onClick={() => setProactiveReminderVisible(false)} aria-label="稍后处理状态提醒">×</button><span>状态提醒 · Apple Watch</span><b>连续两晚睡眠低于平时</b><p>我注意到你最近的状态有变化。需要我在当前对话里问问发生了什么吗？</p><div><button onClick={() => bringReminderIntoConversation("wellbeing")}>在当前会话处理</button><button onClick={() => setProactiveReminderVisible(false)}>稍后</button></div></aside>}
          <div className="agent-home-stream" ref={executionChatRef} aria-live="polite">
            {activeSession === "planning" && <>
            <div className="agent-chat-greeting"><h2>你好，林小北 <span>🌱</span></h2><p>今天也从一个可以完成的动作开始。</p></div>
            <div className="execution-message agent"><span>AI</span><div><small>10:31</small><p>画像和方向线索已经导入。开始规划前，你更想优先推进哪个领域？</p></div></div>
            <AgentMessage type="path_compare" label="快速选择" title="选择你的主要方向">
              <div className="agent-path-options">{[{ id: "postgrad", icon: "研", title: "学业深造", note: "考研 / 出国 / 专升本" }, { id: "job", icon: "职", title: "职业发展", note: "求职 / 实习 / 转行" }, { id: "public", icon: "公", title: "稳定发展", note: "考公 / 考编 / 央国企" }].map((item) => <button className={selectedPath === item.id ? "is-selected" : ""} disabled={planningStep > 0} onClick={() => choosePath(item.id as "public" | "job" | "postgrad")} key={item.id}><span>{item.icon}</span><b>{item.title}</b><small>{item.note}</small></button>)}</div>
            </AgentMessage>
            {planningStep >= 1 && selectedPath && <div className="execution-message user"><span>你</span><div><small>10:32</small><p>{selectedPath === "public" ? "稳定发展，先了解考公" : selectedPath === "job" ? "职业发展" : "学业深造"}</p></div></div>}
            {planningStep === 1 && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在读取你的最新画像和路径资料<i /><i /><i /></p></div>}
            {planningStep >= 2 && <AgentMessage type="profile_radar" label="完整画像" title="这是当前规划使用的六维画像">
              <div className="agent-full-profile-grid">{agentProfileDimensions.map((item) => <section key={item.label}><header><span>{item.label}</span><b>{item.value}<small>/5</small></b></header><i><em style={{ width: `${item.value * 20}%` }} /></i><strong>{item.summary}</strong><p>依据：{item.evidence}</p></section>)}</div>
              <div className="agent-inline-note">这是可持续更新的画像 v1。任务结果和用户反馈会形成新证据，原始版本不会被覆盖。</div>
            </AgentMessage>}
            {planningStep >= 2 && <AgentMessage type="path_compare" label="路径建议" title={selectedPath === "public" ? "先把考公作为本轮验证方向" : "这个方向已经记录为你的主动选择"}>
              {selectedPath === "public" ? <><p>稳定、地域和规则边界与你当前表达的生活期待有连接。以下两条路线先作为本轮对照，不代表最终选择。</p><div className="agent-route-compare"><section><span>路线 A</span><b>省会公务员方向</b><small>准备周期：9—12 个月</small><small>主要门槛：岗位资格、行测与申论</small><em>当前建议：优先体验</em></section><i>VS</i><section><span>路线 B</span><b>计算机企业求职</b><small>准备周期：3—6 个月</small><small>主要门槛：项目、算法与实习</small><em>当前建议：保留对照</em></section></div><button onClick={() => setPlanningStep(3)}>为我生成本周重点任务 <i>→</i></button></> : <><p>产品机制支持该方向，但本次 Demo 的完整课程与任务数据只展开考公样例。</p><button onClick={() => { setSelectedPath("public"); setPlanningStep(3); }}>继续查看考公演示任务 <i>→</i></button></>}
            </AgentMessage>}
            {planningStep >= 3 && <AgentMessage type="task_list" label="本周任务" title="本周先完成 4 件小事">
              <div className="agent-task-list">{executionTasks.map((task, index) => { const title = index === 0 && executionPhase >= 2 ? activeExecutionObstacle.adjustedTitle : task.title; return <button className={executionTaskDone[index] ? "is-done" : ""} onClick={() => onToggleExecutionTask(index)} key={task.title}><span>{executionTaskDone[index] ? "✓" : index + 1}</span><div><b>{title}</b><small>{task.category} · 权重 {task.weight} · {task.deadline}</small></div></button>; })}</div>
              <div className="agent-inline-progress"><div><span>加权进度</span><b>{executionProgress}%</b></div><div className={`weighted-progress-track ${executionProgressClass}`}><i style={{ width: `${executionProgress}%` }} /></div><small>{completedExecutionTasks.length} / {executionTasks.length} 项完成 · 四项任务可以按你的实际节奏执行</small></div>
            </AgentMessage>}
            {planningStep >= 3 && completedExecutionTasks.length > 0 && <AgentMessage type="progress_update" label="完成状态已同步" title={`已完成 ${completedExecutionTasks.length} 项，当前进度 ${executionProgress}%`} tone="success"><div className="agent-inline-task-summary">{executionTasks.map((task, index) => <span className={executionTaskDone[index] ? "is-done" : ""} key={task.title}><i>{executionTaskDone[index] ? "✓" : "·"}</i><b>{task.title}</b><small>权重 {task.weight}</small></span>)}</div><p>任务结果已经成为成长记录，后续计划会使用这些事实。</p></AgentMessage>}
            {planningStep >= 3 && executionPhase === 1 && <AgentMessage type="reminder" label="先找阻碍" title="这次卡在哪里？" tone="warning"><div className="agent-choice-list">{executionObstacles.map((item, index) => <button onClick={() => onChooseExecutionObstacle(index)} key={item.label}>{item.label}<i>→</i></button>)}</div></AgentMessage>}
            {planningStep >= 3 && executionPhase >= 2 && executionPhase < 4 && <><div className="execution-message user"><span>你</span><p>{activeExecutionObstacle.label}</p></div><AgentMessage type="task_list" label="计划已调整" title={activeExecutionObstacle.adjustedTitle} tone="success"><p>{activeExecutionObstacle.review}</p><div className="agent-plan-change"><s>独立筛选 3 个岗位</s><i>→</i><b>{activeExecutionObstacle.deadline} · {activeExecutionObstacle.criteria}</b></div>{executionPhase === 2 && <button onClick={() => onSetExecutionPhase(3)}>查看 AI 找到的岗位样本 <i>→</i></button>}</AgentMessage></>}
            {planningStep >= 3 && executionPhase === 3 && <div className="chat-job-sample"><span>Agent 检索结果 · 岗位样本</span><h4>省会市直 · 信息化管理岗</h4><div><b>计算机类</b><b>本科</b><b>应届</b><b>省会</b></div><p>样本符合四项基础条件，正式选择前仍需核对完整公告。</p><button onClick={onCompleteFirstTasks}>采纳样本并完成前两项</button></div>}
            {planningStep >= 3 && executionPhase >= 4 && <AgentMessage type="review_card" label="Agent 建议" title="现在可以安排一次阶段复盘" tone="success"><div className="agent-inline-metrics"><span><b>{executionProgress}%</b>任务完成率</span><span><b>{executionTaskDone[2] ? "20%" : "40%"}</b>目标偏离度</span><span><b>{completedExecutionTasks.length}</b>项事实证据</span></div><p>下一步优先完成一次真实学习体验，再决定是否增加考公投入。周回顾会继续保留在独立会话中。</p></AgentMessage>}
            {sentQuestion && <div className="execution-message user"><span>你</span><div><small>刚刚</small><p>{sentQuestion}</p></div></div>}
            {composerThinking && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在结合任务和画像整理回答<i /><i /><i /></p></div>}
            {composerReply && <AgentMessage type={sentQuestion.includes("进度") ? "progress_update" : "text"} label="AI 回复"><p>{composerReply}</p>{sentQuestion.includes("进度") && <div className="agent-inline-progress"><div><span>本周加权进度</span><b>{executionProgress}%</b></div><div className={`weighted-progress-track ${executionProgressClass}`}><i style={{ width: `${executionProgress}%` }} /></div><div className="agent-inline-task-summary">{executionTasks.map((task, index) => <span className={executionTaskDone[index] ? "is-done" : ""} key={task.title}><i>{executionTaskDone[index] ? "✓" : "·"}</i><b>{task.title}</b><small>{executionTaskDone[index] ? "已完成" : task.deadline}</small></span>)}</div></div>}</AgentMessage>}
            </>}

            {activeSession === "learning" && <>
              <div className="chat-day-divider"><span>周二 · 学习答疑</span></div>
              <div className="execution-message user"><span>你</span><div><small>19:42</small><p>资料分析总是找数据很慢，我应该怎么练？</p></div></div>
              <div className="execution-message agent"><span>AI</span><div><small>19:42</small><p>我先把问题缩小到“材料数据定位”，再匹配一节短课和练习。</p></div></div>
              <AgentMessage type="task_list" label="华图课程资源 · 模拟接入" title="资料分析入门：快速定位材料数据">
                <div className="agent-resource-inline"><span>入门微课</span><span>20 分钟</span><span>基础</span><span>配套 10 道题</span></div><p>推荐依据：当前问题是找数据慢；课程时长符合单次不超过 30 分钟的条件。</p><button onClick={() => setResourceAdded(true)} disabled={resourceAdded}>{resourceAdded ? "已加入本周任务" : "加入本周任务"}</button>
              </AgentMessage>
              {resourceAdded && <AgentMessage type="task_list" label="计划已更新" title="课程和练习已经拆成两步" tone="success"><div className="agent-plan-change"><s>完整练习 · 45 分钟</s><i>→</i><b>20 分钟课程 + 10 道定位题</b></div><p>总权重保持不变，截止时间仍为周日 16:00。</p></AgentMessage>}
            </>}

            {activeSession === "review" && <>
              <div className="chat-day-divider"><span>周日 · 自动周回顾</span></div>
              <div className="execution-message agent"><span>AI</span><div><small>20:00</small><p>本周回顾已经生成。先看完成情况，再决定下周怎么调整。</p></div></div>
              <AgentMessage type="review_card" label="周回顾" title="行动已经开始，学习体验仍需补充">
                <div className="agent-inline-metrics"><span><b>{executionProgress}%</b>任务完成率</span><span><b>{executionTaskDone[2] ? "20%" : "40%"}</b>目标偏离度</span><span><b>0</b>重大节点风险</span><span><b>38</b>身心状态样例</span></div><p>完成率较低时，Agent 会先询问阻碍；偏离也可能意味着你出现了新的方向，不会直接判定为“走错了”。</p>
              </AgentMessage>
            </>}

            {activeReminder === "registration" && reminderSession === activeSession && <AgentMessage type="checkpoint_alert" label={`Agent 主动提醒 · 当前会话：${agentSessions.find((session) => session.id === activeSession)?.title}`} title="国考报名窗口还有 7 天" tone="warning"><p>这是会影响年度安排的关键节点。我先帮你检查三项前置准备。</p><div className="agent-inline-task-summary"><span><i>·</i><b>核对专业目录</b><small>L1</small></span><span><i>·</i><b>确认应届身份</b><small>L1</small></span><span><i>·</i><b>准备报名材料</b><small>L2</small></span></div><div className="agent-choice-list"><button onClick={() => setReminderAction("已创建报名准备清单，并设置 3 天后再次检查。")}>生成准备清单<i>→</i></button><button onClick={() => setReminderAction("已记录：本轮不报名。系统不会继续推送这一节点。")}>本轮不报名<i>→</i></button></div>{reminderAction && <div className="agent-inline-note">{reminderAction}</div>}<small className="agent-reminder-source">演示日期为预置数据，正式产品需读取可追踪更新时间的规则库。</small></AgentMessage>}
            {activeReminder === "deadline" && reminderSession === activeSession && <AgentMessage type="deadline_alert" label={`Agent 主动提醒 · 当前会话：${agentSessions.find((session) => session.id === activeSession)?.title}`} title="《岗位筛选》还有 2 天到期" tone="warning"><p>当前进度为 {executionProgress}%。我先确认是任务太大、时间冲突，还是方向发生了变化。</p><div className="agent-choice-list">{["任务太大，帮我拆小", "这两天课程太多", "我想重新考虑方向"].map((item) => <button onClick={() => { setReminderAction(item === "任务太大，帮我拆小" ? "已改为：先确认 1 个可报岗位，预计 15 分钟。" : item === "这两天课程太多" ? "已顺延至周日 20:00，并保留调整原因。" : "已暂停该任务，下一步先进行方向复核。"); if (item === "任务太大，帮我拆小") onSetExecutionPhase(1); }} key={item}>{item}<i>→</i></button>)}</div>{reminderAction && <div className="agent-inline-note">{reminderAction}</div>}</AgentMessage>}
            {activeReminder === "wellbeing" && reminderSession === activeSession && <AgentMessage type="stress_probe" label={`应激探针 · 当前会话：${agentSessions.find((session) => session.id === activeSession)?.title}`} title="最近两晚睡眠和应激记录偏低，主要发生了什么？" tone="care"><p>这只是状态记录，不作心理或健康诊断，也不会自动改变方向。</p><div className="agent-choice-list">{["课程作业集中", "限时练习紧张", "生活作息被打乱", "暂不记录"].map((item) => <button className={stressResponse === item ? "is-selected" : ""} onClick={() => setStressResponse(item)} key={item}>{item}<i>{stressResponse === item ? "✓" : "→"}</i></button>)}</div>{stressResponse && <div className="agent-inline-note">已记录“{stressResponse}”。它只用于判断本周任务强度，后续复盘会说明是否因此调整计划。</div>}</AgentMessage>}

            {activeSession !== "planning" && sentQuestion && <div className="execution-message user"><span>你</span><div><small>刚刚</small><p>{sentQuestion}</p></div></div>}
            {activeSession !== "planning" && composerThinking && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在结合当前会话整理回答<i /><i /><i /></p></div>}
            {activeSession !== "planning" && composerReply && <AgentMessage type="text" label="AI 回复"><p>{composerReply}</p></AgentMessage>}
          </div>
          <form className="agent-home-composer" onSubmit={submitComposer}><button type="button" aria-label="添加结构化消息">＋</button><input value={composerText} onChange={(event) => setComposerText(event.target.value)} placeholder="问计划、进度、课程，或输入“任务太多来不及”" aria-label="向成长规划 Agent 提问" /><button type="submit" disabled={!composerText.trim() || composerThinking} aria-label="发送消息">↑</button></form>
        </article>
      </div>
    </section>;
  }

  if (stage === "executionReview") {
    return <section className="content-page execution-review-page">
      <div className="execution-review-heading"><div><span className="section-kicker">周复盘与计划校准</span><h2>这一周，先看看走到了哪里</h2></div><p>已完成 2 项，另有 2 项还需验证。系统会根据这周的真实进度安排下一阶段。</p></div>
      <div className="review-metric-grid"><article><span>任务完成率</span><strong>50%</strong><p>2 / 4 项任务完成</p></article><article><span>目标偏离度</span><strong>40%</strong><p>轻度偏离 · 尚未体验学习</p></article><article><span>本周投入</span><strong>40<small>min</small></strong><p>岗位认知与考试结构</p></article><article><span>计划调整</span><strong>2<small>项</small></strong><p>缩小任务 · 顺延节点</p></article></div>
      <div className="execution-review-grid">
        <article className="review-report-card"><header><span>本周完成状态</span><h3>完成第一轮岗位探索</h3></header><div className="review-task-columns"><div><span>已完成</span>{executionTasks.slice(0, 2).map((task) => <p key={task.title}><b>✓</b>{task.title}<small>权重 {task.weight}</small></p>)}</div><div><span>未完成</span>{executionTasks.slice(2).map((task) => <p key={task.title}><b>·</b>{task.title}<small>权重 {task.weight}</small></p>)}</div></div><div className="review-reason"><span>未完成原因</span><b>{activeExecutionObstacle.label}</b><p>{activeExecutionObstacle.review}</p></div></article>
        <aside className={`review-agent-card next-plan-phase-${nextPlanPhase}`} aria-live="polite">
          {nextPlanPhase === 0 && <><header><span className="agent-avatar">AI</span><div><small>成长规划 Agent</small><h3>那我们基于现在已经完成的任务，规划一下下一阶段吧？</h3></div></header><div className="review-agent-message"><p>你已经确认了可报岗位，也了解了考试结构。下一阶段需要补上学习体验，同时控制任务量，避免和课程安排冲突。</p></div><div className="review-plan-basis"><div><span>已经完成</span><b>岗位范围、考试结构</b></div><div><span>还未验证</span><b>学习感受、持续投入意愿</b></div><div><span>本轮阻碍</span><b>{activeExecutionObstacle.label}</b></div></div><div className="review-decision"><button className="ghost-button" onClick={() => onGoToStage("execution")}>查看执行记录</button><button className="primary-button" onClick={onStartNextPlan}>基于当前进度，开启下一阶段 <span>→</span></button></div></>}
          {nextPlanPhase === 1 && <div className="next-plan-processing"><header><span className="agent-avatar is-thinking">AI</span><div><small>成长规划 Agent</small><h3>正在重新规划</h3></div></header><p>把这周的完成情况、阻碍和方向意愿放在一起计算。</p><div className="next-plan-progress"><i style={{ width: `${(nextPlanStep / 3) * 100}%` }} /></div><div className="next-plan-steps">{["汇总已完成任务与未完成原因", "调整任务难度和先后顺序", "生成可在 3 天内完成的新计划"].map((item, index) => <div className={nextPlanStep > index ? "is-done" : nextPlanStep === index ? "is-active" : ""} key={item}><span>{nextPlanStep > index ? "✓" : `0${index + 1}`}</span><b>{item}</b><i /></div>)}</div><small className="next-plan-processing-note">每项变化都会保留依据</small></div>}
          {nextPlanPhase === 2 && <div className="next-plan-success"><header><span className="next-plan-success-icon">✓</span><div><small>规划完成</small><h3>下一阶段已开启</h3></div></header><p>接下来先用 3 天完成一次低成本学习体验，再决定是否增加备考强度。</p><div className="next-plan-task-list"><div><span>DAY 1</span><b>体验 20 分钟华图考公入门课</b><small>完成标准：看完并记录 1 个新认识</small></div><div><span>DAY 2</span><b>写下愿意与不愿意承担的代价</b><small>完成标准：各列出 2 项真实感受</small></div><div><span>DAY 3</span><b>与企业求职路径做一次对照</b><small>完成标准：保留 1 条主路径和 1 条备选路径</small></div></div><div className="next-plan-meta"><span>总投入约 60 分钟</span><span>3 天后再次复盘</span><b>计划状态：进行中</b></div><button className="next-plan-enter-button" onClick={() => onGoToStage("companion")}>进入我的 AI 伴学工作台 <span>→</span></button></div>}
        </aside>
      </div>
      <div className="review-final-note"><span>本轮记录</span><b>任务完成情况已保存，计划调整本身不改变能力画像。</b><p>完成课程或提交成果后，系统才会依据事实证据校准画像；不承诺考试或就业结果。</p></div>
    </section>;
  }

  return null;
}
