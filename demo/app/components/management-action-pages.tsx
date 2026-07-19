"use client";

import { useEffect, useState, type FormEvent, type RefObject } from "react";
import type { Stage } from "../demo-types";
import { AgentMessage } from "./agent-message";

type AuthorizationSource = { id: string; name: string };
type ExecutionTask = { title: string; category: string; weight: number; deadline: string; priority: string; durationMinutes: number; deadlineOrder: number; unlocks: number; criteria: string };
type ExecutionObstacle = { label: string; adjustedTitle: string; change: string; deadline: string; criteria: string; signal: string; review: string };
type AgentSessionId = "planning" | "learning" | "progress" | "review";
type ReminderKind = "registration" | "deadline" | "wellbeing";
type SessionConversation = { composerText: string; sentQuestion: string; reply: string; thinking: boolean };

const agentSessions: { id: AgentSessionId; title: string; preview: string; time: string; badge?: string }[] = [
  { id: "planning", title: "方向与本周计划", preview: "一问一答查看八维画像与任务", time: "刚刚" },
  { id: "learning", title: "华图课程答疑", preview: "资料分析总是找数据慢", time: "周二", badge: "1" },
  { id: "progress", title: "当前任务进展", preview: "我现在完成得怎么样？", time: "刚刚" },
  { id: "review", title: "本周回顾", preview: "这周卡在哪里，下周怎么调整", time: "周日" },
];

const emptyConversation = (): SessionConversation => ({ composerText: "", sentQuestion: "", reply: "", thinking: false });

const reminderItems: { id: ReminderKind; label: string; title: string; meta: string; tone: string }[] = [
  { id: "registration", label: "关键节点", title: "国考报名窗口还有 7 天", meta: "需核对资格与报名材料", tone: "node" },
  { id: "deadline", label: "任务到期", title: "《岗位筛选》还有 2 天到期", meta: "当前进度 0%", tone: "deadline" },
  { id: "wellbeing", label: "状态信号", title: "连续两晚睡眠低于平时", meta: "来自 Apple Watch 样例数据", tone: "care" },
];

const agentProfileDimensions = [
  { label: "性格适配", value: 4.2, summary: "稳健有序", evidence: "情境回答" },
  { label: "专业能力", value: 3.4, summary: "分析力较好", evidence: "课程项目" },
  { label: "兴趣匹配", value: 3.8, summary: "稳定导向", evidence: "人生课题选择" },
  { label: "学习知识", value: 3.5, summary: "基础可用", evidence: "成绩与课程记录" },
  { label: "抗压情绪", value: 3.7, summary: "能调整节奏", evidence: "计划中断情境" },
  { label: "沟通协作", value: 3.6, summary: "沟通稳妥", evidence: "家庭协商与项目经历" },
];

const agentProfileContextDimensions = [
  { label: "健康情况", status: "✓ 基础达标", tag: "条件项 · 不计分", summary: "未发现影响一般岗位选择的硬性限制", evidence: "用户自评与授权趋势" },
  { label: "家庭情况", status: "支持较强", tag: "支持度 − 约束度", summary: "家庭支持较强，但需考虑异地限制", evidence: "地域与投入确认" },
];

const radarPoint = (index: number, value: number, radius = 82) => {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / agentProfileDimensions.length;
  const distance = radius * value;
  return `${120 + Math.cos(angle) * distance},${120 + Math.sin(angle) * distance}`;
};

const radarPolygon = (value: number) => agentProfileDimensions.map((_, index) => radarPoint(index, value)).join(" ");
const profileRadarPolygon = agentProfileDimensions.map((item, index) => radarPoint(index, item.value / 5)).join(" ");

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
  onRestartPlanningDemo: () => void;
  nextPlanPhase: 0 | 1 | 2;
  nextPlanStep: number;
  onStartNextPlan: () => void;
};

export function ManagementActionPages(props: ManagementActionPagesProps) {
  const { stage, selectedAuthorizationSources, profileImportSteps, profileImportStep, executionProgress, executionProgressClass, executionTasks, executionTaskDone, executionPhase, activeExecutionObstacle, completedExecutionTasks, onToggleExecutionTask, onGoToStage, executionChatRef, onSetExecutionPhase, onRestartPlanningDemo, nextPlanPhase, nextPlanStep, onStartNextPlan } = props;
  const [planningStep, setPlanningStep] = useState(0);
  const [stressResponse, setStressResponse] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<AgentSessionId>("planning");
  const [sessionConversations, setSessionConversations] = useState<Record<AgentSessionId, SessionConversation>>({ planning: emptyConversation(), learning: emptyConversation(), progress: emptyConversation(), review: emptyConversation() });
  const [resourceAdded, setResourceAdded] = useState(false);
  const [reviewResponse, setReviewResponse] = useState("");
  const [reminderCenterOpen, setReminderCenterOpen] = useState(false);
  const [activeReminder, setActiveReminder] = useState<ReminderKind | null>(null);
  const [reminderSession, setReminderSession] = useState<AgentSessionId | null>(null);
  const [reminderAction, setReminderAction] = useState("");
  const alignmentRequirements = [
    { label: "方向由用户确认", met: true },
    { label: "核对岗位资格", met: executionTaskDone[0] },
    { label: "了解考试结构", met: executionTaskDone[1] },
    { label: "完成学习体验", met: executionTaskDone[2] },
    { label: "记录真实代价", met: executionTaskDone[3] },
  ];
  const alignedRequirementCount = alignmentRequirements.filter((item) => item.met).length;
  const minimumEvidenceReady = executionTaskDone[0] && executionTaskDone[1];
  const currentConversation = sessionConversations[activeSession];
  const composerText = currentConversation.composerText;
  const sentQuestion = currentConversation.sentQuestion;
  const composerReply = currentConversation.reply;
  const composerThinking = currentConversation.thinking;
  const nextExecutionTask = executionTasks.find((_, index) => !executionTaskDone[index]);
  const sessionIcon: Record<AgentSessionId, string> = { planning: "规", learning: "学", progress: "进", review: "回" };
  const sessionContext: Record<AgentSessionId, string> = { planning: "规划与行动", learning: "学习答疑", progress: "进展查询", review: "复盘与校准" };
  const planningPrompts = planningStep === 0
    ? ["我的能力怎样？"]
    : planningStep === 2
      ? ["帮我安排一下任务看看我适不适合考公。"]
      : planningStep === 4
        ? ["我确认了想去税务局"]
        : planningStep === 7
          ? ["我已经报了名"]
          : [];
  const suggestedPrompts: Record<AgentSessionId, string[]> = {
    planning: planningPrompts,
    learning: ["资料分析怎么练", "推荐一节短课", "加入本周计划"],
    progress: ["我完成了多少", "还有哪些没完成", "下一步先做什么"],
    review: ["这周完成得怎么样", "为什么没有完成", "下周怎么调整"],
  };
  const planningIsBusy = activeSession === "planning" && [1, 3, 5, 6, 8].includes(planningStep);

  useEffect(() => {
    const nextStep = new Map([[1, 2], [3, 4], [5, 6], [6, 7], [8, 9]]).get(planningStep);
    if (!nextStep) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reducedMotion ? 0 : planningStep === 6 ? 1250 : 760;
    const timer = window.setTimeout(() => setPlanningStep(nextStep), delay);
    return () => window.clearTimeout(timer);
  }, [planningStep]);

  useEffect(() => {
    if (!composerThinking || !sentQuestion) return;
    const timer = window.setTimeout(() => {
      const reply = activeSession === "progress"
        ? `你当前完成 ${completedExecutionTasks.length} / ${executionTasks.length} 项，任务进度 ${executionProgress}%。建议先完成距离截止时间最近的那一项。`
        : activeSession === "review"
          ? `这周已完成 ${completedExecutionTasks.length} 项。Agent 会先确认未完成原因，再和你一起决定保持、拆小或调整计划。`
          : activeSession === "learning"
        ? "我会先定位具体知识缺口，再从华图课程样例中匹配一节短课和配套练习。"
        : planningStep < 3 && (sentQuestion.includes("来不及") || sentQuestion.includes("太多"))
        ? "本周任务还没有生成。先选一个方向，我会控制第一轮任务量。"
        : sentQuestion.includes("进度")
        ? `你当前完成 ${completedExecutionTasks.length} / ${executionTasks.length} 项，加权进度 ${executionProgress}%。明细已经直接展开在这条回复下面。`
        : sentQuestion.includes("调整方向") || sentQuestion.includes("重新考虑")
          ? "我先暂停新增备考任务。方向变化不会被当成失败；下一步会补一项路径对照任务，再由你决定继续、切换或先做生活规划。"
        : sentQuestion.includes("来不及") || sentQuestion.includes("太多")
          ? "收到。先不增加任务量，我会问清楚具体阻碍，再把最近的一项拆小。"
          : "我先把这个问题加入本轮对话。你可以继续补充具体场景，我会结合任务结果和已授权资料给出下一步。";
      setSessionConversations((current) => ({ ...current, [activeSession]: { ...current[activeSession], reply, thinking: false } }));
    }, 820);
    return () => window.clearTimeout(timer);
  }, [activeSession, composerThinking, completedExecutionTasks.length, executionProgress, executionTasks.length, planningStep, sentQuestion]);

  useEffect(() => {
    if (stage !== "execution") return;
    const stream = executionChatRef.current;
    if (!stream) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const frame = window.requestAnimationFrame(() => {
      const hasConversationReply = Boolean(sentQuestion || composerThinking || composerReply);
      const hasManualReminder = activeReminder !== null && reminderSession === activeSession;
      if (activeSession === "planning" && !hasConversationReply && !hasManualReminder && planningStep > 0) {
        const turn = planningStep <= 2 ? "ability" : planningStep <= 4 ? "tasks" : planningStep <= 6 ? "tax" : planningStep === 7 ? "registration-alert" : "registration-done";
        const anchor = stream.querySelector<HTMLElement>(`[data-script-turn="${turn}"]`);
        if (anchor) {
          const top = anchor.getBoundingClientRect().top - stream.getBoundingClientRect().top + stream.scrollTop - 14;
          stream.scrollTo({ top: Math.max(0, top), behavior });
          return;
        }
      }
      stream.scrollTo({ top: stream.scrollHeight, behavior });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stage, activeSession, planningStep, executionPhase, stressResponse, activeReminder, reminderSession, reminderAction, sentQuestion, composerThinking, composerReply, executionChatRef]);

  function switchSession(session: AgentSessionId) {
    setActiveSession(session);
  }

  function restartPlanningDemo() {
    onRestartPlanningDemo();
    setPlanningStep(0);
    setActiveSession("planning");
    setSessionConversations((current) => ({ ...current, planning: emptyConversation() }));
    setActiveReminder(null);
    setReminderSession(null);
    setReminderCenterOpen(false);
  }

  function bringReminderIntoConversation(reminder: ReminderKind) {
    setActiveReminder(reminder);
    setReminderSession(activeSession);
    setReminderAction("");
    setStressResponse(null);
    setReminderCenterOpen(false);
  }

  function submitComposer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = composerText.trim();
    if (!question || composerThinking || planningIsBusy) return;

    if (activeSession === "planning") {
      const scriptedStep = planningStep === 0 && (question.includes("能力") || question.includes("画像"))
        ? 1
        : planningStep === 2 && (question.includes("任务") || question.includes("考公"))
          ? 3
          : planningStep === 4 && (question.includes("税务局") || question.includes("确认"))
            ? 5
            : planningStep === 7 && (question.includes("报了名") || question.includes("已报名"))
              ? 8
              : null;
      if (scriptedStep !== null) {
        setSessionConversations((current) => ({ ...current, planning: emptyConversation() }));
        if (scriptedStep === 8 && !executionTaskDone[0]) onToggleExecutionTask(0);
        setPlanningStep(scriptedStep);
        return;
      }
    }

    setSessionConversations((current) => ({ ...current, [activeSession]: { composerText: "", sentQuestion: question, reply: "", thinking: true } }));
    if (planningStep >= 3 && (question.includes("来不及") || question.includes("太多") || question.includes("调整方向"))) onSetExecutionPhase(1);
  }

  function setComposerText(value: string) {
    setSessionConversations((current) => ({ ...current, [activeSession]: { ...current[activeSession], composerText: value } }));
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
          <header><div><span className="agent-avatar">AI</span><div><b>成长规划 Agent</b><small>林小北的成长空间</small></div></div><button onClick={restartPlanningDemo} aria-label="重新开始演示会话">＋</button></header>
          <span className="agent-session-label">会话</span>
          <div>{agentSessions.map((session) => <button className={activeSession === session.id ? "is-active" : ""} onClick={() => switchSession(session.id)} key={session.id}><span>{sessionIcon[session.id]}</span><div><b>{session.title}</b><small>{session.preview}</small></div><em>{session.badge ?? session.time}</em></button>)}</div>
          <footer><span>已授权</span><b>华图 · Bilibili · GitHub</b><small>消息和任务使用同一份画像</small></footer>
        </aside>
        <article className="agent-home-chat">
          <header><div><span className="agent-avatar">AI</span><div><small>{sessionContext[activeSession]}</small><h3>{agentSessions.find((session) => session.id === activeSession)?.title}</h3></div></div><div className="agent-header-actions"><span className="agent-online">Agent 在线</span><button className={reminderCenterOpen ? "agent-reminder-button is-active" : "agent-reminder-button"} onClick={() => setReminderCenterOpen((open) => !open)} aria-expanded={reminderCenterOpen} aria-label="打开提醒中心"><span>提醒</span><b>3</b></button></div></header>
          {reminderCenterOpen && <aside className="agent-reminder-center" aria-label="提醒中心"><header><div><span>提醒中心</span><b>3 条待处理</b></div><button onClick={() => setReminderCenterOpen(false)} aria-label="关闭提醒中心">×</button></header><div>{reminderItems.map((item) => <button onClick={() => bringReminderIntoConversation(item.id)} key={item.id}><i className={`is-${item.tone}`}>{item.id === "registration" ? "报" : item.id === "deadline" ? "期" : "心"}</i><span><small>{item.label}</small><b>{item.title}</b><em>{item.meta}</em></span><strong>在当前会话处理 →</strong></button>)}</div><footer>提醒独立于会话；处理时由 Agent 带入你正在进行的对话。</footer></aside>}
          <div className="agent-home-stream" ref={executionChatRef} aria-live="polite">
            {activeSession === "planning" && <>
              <div className="agent-chat-greeting"><h2>你好，林小北 <span>🌱</span></h2><p>我是你的成长规划 Agent。你问一个问题，我回答一个问题。</p></div>
              <div className="execution-message agent"><span>AI</span><div><small>刚刚</small><p>可以先问我：你的能力怎么样、适合验证什么方向，或者本周先做什么。</p></div></div>

              {planningStep >= 1 && <div className="execution-message user" data-script-turn="ability"><span>你</span><div><small>刚刚</small><p>我的能力怎样？</p></div></div>}
              {planningStep === 1 && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在查找已确认画像与授权资料<i /><i /><i /></p></div>}
              {planningStep >= 2 && <AgentMessage type="profile_radar" label="AI 查找完成" title="这是你当前的八维成长画像">
                <div className="agent-profile-summary"><strong>整体特点：稳健、有分析基础，也看重稳定与边界</strong><p>当前短板不是“能力不行”，而是实际任务证据还比较少。</p></div>
                <div className="agent-profile-visual">
                  <svg className="agent-profile-radar" viewBox="0 0 240 240" role="img" aria-label="性格适配、专业能力、兴趣匹配、学习知识、抗压情绪和沟通协作六项能力评分雷达；健康和家庭作为条件项单独展示">
                    {[0.25, 0.5, 0.75, 1].map((level) => <polygon className="agent-profile-radar-grid" points={radarPolygon(level)} key={level} />)}
                    {agentProfileDimensions.map((item, index) => {
                      const [axisX, axisY] = radarPoint(index, 1).split(",");
                      const [labelX, labelY] = radarPoint(index, 1.18).split(",");
                      const x = Number(labelX);
                      return <g key={item.label}><line className="agent-profile-radar-axis" x1="120" y1="120" x2={axisX} y2={axisY} /><text x={labelX} y={labelY} textAnchor={x < 112 ? "end" : x > 128 ? "start" : "middle"}>{item.label}</text></g>;
                    })}
                    <polygon className="agent-profile-radar-value" points={profileRadarPolygon} />
                    {agentProfileDimensions.map((item, index) => { const [x, y] = radarPoint(index, item.value / 5).split(","); return <circle cx={x} cy={y} r="3.5" key={item.label} />; })}
                  </svg>
                  <div className="agent-profile-dimensions">{agentProfileDimensions.map((item) => <section key={item.label}><span>{item.label}</span><b>{item.value}<small>/5</small></b><strong>{item.summary}</strong><p>依据：{item.evidence}</p></section>)}</div>
                </div>
                <div className="agent-profile-context">{agentProfileContextDimensions.map((item) => <section key={item.label}><div><span>{item.label}</span><b>{item.status}</b></div><em>{item.tag}</em><p>{item.summary}</p><small>依据：{item.evidence}</small></section>)}</div>
                <div className="agent-inline-note">八维画像 v1 · 六项能力使用 0–5 分；健康用“达标 / 受限”表示，家庭用“支持度 − 约束度”表示。所有结论保留来源，任务证据只做增量更新。</div>
              </AgentMessage>}

              {planningStep >= 3 && <div className="execution-message user" data-script-turn="tasks"><span>你</span><div><small>刚刚</small><p>帮我安排一下任务看看我适不适合考公。</p></div></div>}
              {planningStep === 3 && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在按每周 6 小时安排低成本验证任务<i /><i /><i /></p></div>}
              {planningStep >= 4 && <AgentMessage type="task_list" label="AI 已安排" title="先用 4 个小任务验证你是否适合考公">
                <p>这些任务只验证岗位认知、学习体验和真实代价，不会替你锁定方向。</p>
                <div className="agent-task-list">{executionTasks.map((task, index) => <button className={executionTaskDone[index] ? "is-done" : ""} onClick={() => onToggleExecutionTask(index)} key={task.title}><span>{executionTaskDone[index] ? "✓" : index + 1}</span><div><b>{task.title}</b><small>{task.deadline} · 任务分值 {task.weight}</small><em>做到这里算完成：{task.criteria}</em></div></button>)}</div>
              </AgentMessage>}

              {planningStep >= 5 && <div className="execution-message user" data-script-turn="tax"><span>你</span><div><small>刚刚</small><p>我确认了想去税务局</p></div></div>}
              {planningStep === 5 && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在把税务局意向加入本周计划<i /><i /><i /></p></div>}
              {planningStep >= 6 && <AgentMessage type="task_list" label="任务已更新" title="已把税务局作为本周重点岗位" tone="success">
                <div className="agent-plan-change"><s>确认 1 个可报岗位</s><i>→</i><b>核对税务局岗位资格与专业目录</b></div>
                <div className="agent-change-reason"><p><span>为什么调整</span>你主动确认了税务局意向</p><p><span>具体改了什么</span>岗位核对、材料准备和课程体验都围绕税务局展开</p></div>
                <div className="agent-updated-task-list"><span><i>1</i><b>核对税务局岗位资格</b><small>今天 20:00 · 完成标准：确认专业、学历和应届身份</small></span><span><i>2</i><b>整理报名材料</b><small>周四 18:00 · 完成标准：身份证明与学历信息齐全</small></span><span><i>3</i><b>体验 20 分钟行测入门课</b><small>周日 16:00 · 完成标准：记录难点和真实感受</small></span></div>
              </AgentMessage>}

              {planningStep >= 7 && <div className="agent-proactive-alert" data-script-turn="registration-alert"><AgentMessage type="checkpoint_alert" label="AI 主动提醒 · 关键节点" title="需要赶紧报名了，国考报名窗口还有 7 天" tone="warning">
                <p>你已经确认税务局意向，但报名状态还没确认。这个节点一旦错过，会影响本年度安排。</p>
                <div className="agent-checkpoint-list"><span><b>1</b>核对专业目录</span><span><b>2</b>确认应届身份</span><span><b>3</b>提交报名材料</span></div>
                {/* {planningStep === 7 && <div className="agent-inline-note">如果已经完成，直接回复：我已经报了名</div>} */}
              </AgentMessage></div>}

              {planningStep >= 8 && <div className="execution-message user" data-script-turn="registration-done"><span>你</span><div><small>刚刚</small><p>我已经报了名</p></div></div>}
              {planningStep === 8 && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在记录报名完成并重排本周任务<i /><i /><i /></p></div>}
              {planningStep >= 9 && <AgentMessage type="task_list" label="任务安排已更新" title="已记录报名完成，接下来准备笔试体验" tone="success">
                <div className="agent-completion-banner"><span>✓</span><div><b>国考报名</b><p>已完成 · 已加入成长记录</p></div></div>
                <div className="agent-updated-task-list"><span className="is-done"><i>✓</i><b>完成国考报名</b><small>刚刚完成</small></span><span><i>1</i><b>整理税务局资格审查材料</b><small>下一步 · 预计 20 分钟</small></span><span><i>2</i><b>体验 20 分钟行测入门课</b><small>周日 16:00 · 记录难点和真实感受</small></span></div>
                <div className="agent-change-reason"><p><span>调整原因</span>报名任务已经完成</p><p><span>计划变化</span>取消报名提醒，把时间转到资格审查和笔试体验</p></div>
                <div className="agent-card-actions"><button onClick={() => switchSession("progress")}>查看当前任务进展 <i>→</i></button><button onClick={() => switchSession("review")}>进行本周回顾</button></div>
              </AgentMessage>}

              {sentQuestion && <div className="execution-message user"><span>你</span><div><small>刚刚</small><p>{sentQuestion}</p></div></div>}
              {composerThinking && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在结合任务和画像整理回答<i /><i /><i /></p></div>}
              {composerReply && <AgentMessage type={sentQuestion.includes("进度") ? "progress_update" : "text"} label="AI 回复"><p>{composerReply}</p></AgentMessage>}
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

            {activeSession === "progress" && <>
              <div className="chat-day-divider"><span>今天 · 任务进展</span></div>
              <div className="execution-message user"><span>你</span><div><small>刚刚</small><p>我当前任务完成得怎么样？</p></div></div>
              <div className="execution-message agent"><span>AI</span><div><small>刚刚</small><p>我查了本周任务记录，先给你看结果，再告诉你下一步最值得做什么。</p></div></div>
              <AgentMessage type="progress_update" label="当前完成状态" title={`已完成 ${completedExecutionTasks.length} / ${executionTasks.length} 项，任务进度 ${executionProgress}%`} tone={completedExecutionTasks.length > 0 ? "success" : "default"}>
                <div className="agent-session-metrics"><span><b>{completedExecutionTasks.length}/{executionTasks.length}</b>完成任务</span><span><b>{executionProgress}%</b>任务进度</span><span><b>{completedExecutionTasks.reduce((total, task) => total + task.durationMinutes, 0)}</b>投入分钟</span></div>
                <div className={`weighted-progress-track ${executionProgressClass}`}><i style={{ width: `${executionProgress}%` }} /></div>
                <div className="agent-task-list compact">{executionTasks.map((task, index) => <button className={executionTaskDone[index] ? "is-done" : ""} onClick={() => onToggleExecutionTask(index)} key={task.title}><span>{executionTaskDone[index] ? "✓" : index + 1}</span><div><b>{task.title}</b><small>{executionTaskDone[index] ? "已完成" : task.deadline} · 任务分值 {task.weight}</small><em>做到这里算完成：{task.criteria}</em></div></button>)}</div>
                <div className="agent-next-action"><span>下一步先做</span><b>{nextExecutionTask?.title ?? "本周任务已经全部完成"}</b><small>{nextExecutionTask ? `预计 ${nextExecutionTask.durationMinutes} 分钟，完成后进度会增加 ${nextExecutionTask.weight}%` : "可以进入本周回顾，确认下一阶段。"}</small></div>
              </AgentMessage>
            </>}

            {activeSession === "review" && <>
              <div className="chat-day-divider"><span>周日 · 本周回顾</span></div>
              <div className="execution-message user"><span>你</span><div><small>20:00</small><p>帮我回顾一下这周，接下来应该怎么调整？</p></div></div>
              <div className="execution-message agent"><span>AI</span><div><small>20:00</small><p>可以。我只说三件事：这周做了什么、还缺什么、下周先做什么。</p></div></div>
              <AgentMessage type="review_card" label="本周回顾" title={completedExecutionTasks.length >= 2 ? "方向探索已经开始，下一步补真实学习体验" : "先补最小探索任务，不急着增加任务量"}>
                <div className="agent-session-metrics"><span><b>{completedExecutionTasks.length}/{executionTasks.length}</b>完成任务</span><span><b>{alignedRequirementCount}/5</b>方向线索</span><span><b>{executionProgress}%</b>任务进度</span></div>
                <div className="agent-plain-summary"><p><span>这周完成了</span>{completedExecutionTasks.length > 0 ? completedExecutionTasks.map((task) => task.category).join("、") : "还没有提交任务记录"}。</p><p><span>还需要确认</span>{executionPhase >= 2 ? activeExecutionObstacle.label : "未完成原因和真实学习感受"}。</p><p><span>下周先做</span>{nextExecutionTask ? `${nextExecutionTask.title}，暂时不增加额外任务。` : "保持当前节奏，并由你确认是否进入下一阶段。"}</p></div>
                <details className="agent-review-evidence"><summary>查看 Agent 的判断依据</summary><p>依据来自任务勾选记录、完成标准和你主动说明的阻碍。没有完成不等于方向错误，Agent 不会自动替你换方向。</p></details>
                <div className="agent-choice-list"><button onClick={() => setReviewResponse("已记录：下周先把最近的一项拆成 15 分钟的小任务，其他任务不增加。")}>任务太多，帮我拆小<i>→</i></button><button onClick={() => setReviewResponse("已记录：先暂停新增任务，下周增加一次方向对照，再由你决定是否继续。")}>我想重新考虑方向<i>→</i></button><button onClick={() => setReviewResponse("已记录：保持当前计划和截止时间，下周继续观察真实完成情况。")}>按原计划继续<i>→</i></button></div>
                {reviewResponse && <div className="agent-inline-note">{reviewResponse}</div>}
              </AgentMessage>
            </>}

            {activeReminder === "registration" && reminderSession === activeSession && !(activeSession === "planning" && planningStep >= 7) && <AgentMessage type="checkpoint_alert" label={`Agent 主动提醒 · 当前会话：${agentSessions.find((session) => session.id === activeSession)?.title}`} title="国考报名窗口还有 7 天" tone="warning"><p>这是会影响年度安排的关键节点。我先帮你检查三项前置准备。</p><div className="agent-inline-task-summary"><span><i>·</i><b>核对专业目录</b><small>L1</small></span><span><i>·</i><b>确认应届身份</b><small>L1</small></span><span><i>·</i><b>准备报名材料</b><small>L2</small></span></div><div className="agent-choice-list"><button onClick={() => setReminderAction("已创建报名准备清单，并设置 3 天后再次检查。")}>生成准备清单<i>→</i></button><button onClick={() => setReminderAction("已记录：本轮不报名。系统不会继续推送这一节点。")}>本轮不报名<i>→</i></button></div>{reminderAction && <div className="agent-inline-note">{reminderAction}</div>}<small className="agent-reminder-source">演示日期为预置数据，正式产品需读取可追踪更新时间的规则库。</small></AgentMessage>}
            {activeReminder === "deadline" && reminderSession === activeSession && <AgentMessage type="deadline_alert" label={`Agent 主动提醒 · 当前会话：${agentSessions.find((session) => session.id === activeSession)?.title}`} title="《岗位筛选》还有 2 天到期" tone="warning"><p>当前进度为 {executionProgress}%。我先确认是任务太大、时间冲突，还是方向发生了变化。</p><div className="agent-choice-list">{["任务太大，帮我拆小", "这两天课程太多", "我想重新考虑方向"].map((item) => <button onClick={() => { setReminderAction(item === "任务太大，帮我拆小" ? "已改为：先确认 1 个可报岗位，预计 15 分钟。" : item === "这两天课程太多" ? "已顺延至周日 20:00，并保留调整原因。" : "已暂停该任务，下一步先进行方向复核。"); if (item === "任务太大，帮我拆小") onSetExecutionPhase(1); }} key={item}>{item}<i>→</i></button>)}</div>{reminderAction && <div className="agent-inline-note">{reminderAction}</div>}</AgentMessage>}
            {activeReminder === "wellbeing" && reminderSession === activeSession && <AgentMessage type="stress_probe" label={`Agent 主动关怀 · 当前会话：${agentSessions.find((session) => session.id === activeSession)?.title}`} title="状态分样例为 38：检测到你最近状态不好，可以给我讲一讲最近发生了什么吗？" tone="care"><p>触发依据：应激频率、睡眠质量与用户自评的预置样例。或许我可以给你提供一些帮助</p><div className="agent-choice-list">{["课程作业集中", "限时练习紧张", "生活作息被打乱", "暂不记录"].map((item) => <button className={stressResponse === item ? "is-selected" : ""} onClick={() => setStressResponse(item)} key={item}>{item}<i>{stressResponse === item ? "✓" : "→"}</i></button>)}</div>{stressResponse && <div className="agent-inline-note">{stressResponse === "暂不记录" ? "已跳过，本次状态信号不会沉淀为画像或调整任务。" : `已保存为本周状态上下文：“${stressResponse}”。它不进入长期画像；如需减负，仍会先征求你的确认。`}</div>}</AgentMessage>}

            {activeSession !== "planning" && sentQuestion && <div className="execution-message user"><span>你</span><div><small>刚刚</small><p>{sentQuestion}</p></div></div>}
            {activeSession !== "planning" && composerThinking && <div className="agent-thinking-line"><span className="agent-avatar is-thinking">AI</span><p>正在结合当前会话整理回答<i /><i /><i /></p></div>}
            {activeSession !== "planning" && composerReply && <AgentMessage type="text" label="AI 回复"><p>{composerReply}</p></AgentMessage>}
          </div>
          <div className="agent-composer-zone"><div className="agent-suggested-prompts"><span>{planningIsBusy ? "Agent 正在处理" : "试着问"}</span>{suggestedPrompts[activeSession].map((prompt) => <button type="button" onClick={() => setComposerText(prompt)} key={prompt}>{prompt}</button>)}</div><form className="agent-home-composer" onSubmit={submitComposer}><button type="button" aria-label="添加结构化消息">＋</button><input value={composerText} onChange={(event) => setComposerText(event.target.value)} placeholder={planningIsBusy ? "AI 正在整理结果…" : "输入一个问题，Agent 会逐条回答"} aria-label="向成长规划 Agent 提问" disabled={planningIsBusy} /><button type="submit" disabled={!composerText.trim() || composerThinking || planningIsBusy} aria-label="发送消息">↑</button></form></div>
        </article>
      </div>
    </section>;
  }

  if (stage === "executionReview") {
    return <section className="content-page execution-review-page">
      <div className="execution-review-heading"><div><span className="section-kicker">周回顾</span><h2>{minimumEvidenceReady ? "这周有进展，下一步补真实体验" : "先完成两件小事，再决定下一阶段"}</h2></div><p>这里只回答三件事：做了什么、还缺什么、接下来做什么。</p></div>
      <div className="review-simple-stats"><article><span>完成任务</span><strong>{completedExecutionTasks.length}<small> / {executionTasks.length}</small></strong><p>点开下方可看每项记录</p></article><article><span>本周进度</span><strong>{executionProgress}<small>%</small></strong><p>任务越重要，完成后增加得越多</p></article><article><span>方向线索</span><strong>{alignedRequirementCount}<small> / {alignmentRequirements.length}</small></strong><p>已确认方向 + 已完成的真实任务</p></article></div>
      <div className="execution-review-grid">
        <article className="review-report-card"><header><span>任务记录</span><h3>{completedExecutionTasks.length >= 2 ? "第一轮岗位探索已完成" : "先完成最小探索任务"}</h3></header><div className="review-task-columns"><div><span>已完成</span>{executionTasks.filter((_, index) => executionTaskDone[index]).map((task) => <p key={task.title}><b>✓</b><span>{task.title}</span><small>分值 {task.weight}</small></p>)}{completedExecutionTasks.length === 0 && <p className="review-empty-copy">还没有完成任务</p>}</div><div><span>接下来</span>{executionTasks.filter((_, index) => !executionTaskDone[index]).map((task) => <p key={task.title}><b>·</b><span>{task.title}</span><small>{task.deadline}</small></p>)}</div></div><details className="review-alignment-details"><summary>为什么方向线索是 {alignedRequirementCount} / {alignmentRequirements.length}？</summary><div>{alignmentRequirements.map((item) => <span className={item.met ? "is-met" : ""} key={item.label}><i>{item.met ? "✓" : "·"}</i>{item.label}</span>)}</div><p>没有完成不代表方向错误，可能是任务太难、时间冲突，或你有了新的想法。Agent 会先问原因。</p></details><div className="review-reason"><span>当前卡点</span><b>{executionPhase < 2 ? "还不知道，需要你补充" : activeExecutionObstacle.label}</b><p>{executionPhase < 2 ? "回到本周计划说明原因后，Agent 才会拆小任务或调整时间。" : activeExecutionObstacle.review}</p></div></article>
        <aside className={`review-agent-card next-plan-phase-${nextPlanPhase}`} aria-live="polite">
          {nextPlanPhase === 0 && <><header><span className="agent-avatar">AI</span><div><small>AI 本周建议</small><h3>{minimumEvidenceReady ? "可以进入下一阶段" : "现在还不适合生成下一阶段"}</h3></div></header><div className="review-next-summary"><section><span>我知道的</span><p>{completedExecutionTasks.length > 0 ? `你已完成 ${completedExecutionTasks.map((task) => task.category).join("、")}。` : "方向由你确认，但还没有真实任务结果。"}</p></section><section><span>还不知道的</span><p>{minimumEvidenceReady ? "真实学习感受和能否持续投入。" : "可报岗位、考试结构和未完成原因。"}</p></section><section><span>建议</span><p>{minimumEvidenceReady ? "下一阶段只补一次学习体验，不增加刷题量。" : "先完成岗位资格与考试结构两项任务，再回来生成计划。"}</p></section></div><div className="review-safety-note">Agent 不会因为低进度自动换方向，也不会清空你的主对话；最终选择仍由你确认。</div><div className="review-decision"><button className="ghost-button" onClick={() => onGoToStage("execution")}>回到本周计划</button><button className="primary-button" disabled={!minimumEvidenceReady} onClick={onStartNextPlan}>{minimumEvidenceReady ? "生成下一阶段计划" : "完成前两项后再生成"} <span>→</span></button></div></>}
          {nextPlanPhase === 1 && <div className="next-plan-processing"><header><span className="agent-avatar is-thinking">AI</span><div><small>成长规划 Agent</small><h3>正在重新规划</h3></div></header><p>把这周的完成情况、阻碍和方向意愿放在一起计算。</p><div className="next-plan-progress"><i style={{ width: `${(nextPlanStep / 3) * 100}%` }} /></div><div className="next-plan-steps">{["汇总已完成任务与未完成原因", "调整任务难度和先后顺序", "生成可在 3 天内完成的新计划"].map((item, index) => <div className={nextPlanStep > index ? "is-done" : nextPlanStep === index ? "is-active" : ""} key={item}><span>{nextPlanStep > index ? "✓" : `0${index + 1}`}</span><b>{item}</b><i /></div>)}</div><small className="next-plan-processing-note">每项变化都会保留依据</small></div>}
          {nextPlanPhase === 2 && <div className="next-plan-success"><header><span className="next-plan-success-icon">✓</span><div><small>规划完成</small><h3>下一阶段已开启</h3></div></header><p>接下来先用 3 天完成一次低成本学习体验，再决定是否增加备考强度。</p><div className="next-plan-task-list"><div><span>DAY 1</span><b>体验 20 分钟华图考公入门课</b><small>完成标准：看完并记录 1 个新认识</small></div><div><span>DAY 2</span><b>写下愿意与不愿意承担的代价</b><small>完成标准：各列出 2 项真实感受</small></div><div><span>DAY 3</span><b>与企业求职路径做一次对照</b><small>完成标准：保留 1 条主路径和 1 条备选路径</small></div></div><div className="next-plan-meta"><span>总投入约 60 分钟</span><span>3 天后再次复盘</span><b>计划状态：进行中</b></div><button className="next-plan-enter-button" onClick={() => onGoToStage("companion")}>进入我的 AI 伴学工作台 <span>→</span></button></div>}
        </aside>
      </div>
      <div className="review-final-note"><span>记录已保存</span><b>切换页面不会清空主对话和任务状态。</b><p>只有完成课程或提交成果后才校准画像；不承诺考试或就业结果。</p></div>
    </section>;
  }

  return null;
}
