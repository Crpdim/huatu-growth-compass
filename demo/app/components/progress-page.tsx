"use client";

import { useMemo, useState } from "react";
import type { Stage } from "../demo-types";

type ExecutionTask = {
  title: string;
  category: string;
  weight: number;
  deadline: string;
  priority: string;
  durationMinutes: number;
  deadlineOrder: number;
  unlocks: number;
  criteria: string;
};

type ProgressPageProps = {
  progress: number;
  progressClass: string;
  tasks: ExecutionTask[];
  taskCredits: number[];
  taskActions: Record<number, "rescheduled" | "abandoned">;
  reviewSnapshot: boolean;
  conversationStage: "execution" | "companion";
  onToggleTask: (index: number) => void;
  onSetTaskAction: (index: number, action: "rescheduled" | "abandoned" | null) => void;
  onNavigate: (stage: Stage) => void;
  onAskAgent: (prompt: string) => void;
};

const priorityOrder: Record<string, number> = { "高优先": 0, "中优先": 1, "低优先": 2 };
const completedActualMinutes = [20, 20, 38, 20];

function progressPhase(progress: number) {
  if (progress < 15) return "起步阶段";
  if (progress < 40) return "探索阶段";
  if (progress < 70) return "加速阶段";
  if (progress < 95) return "冲刺阶段";
  return "收官阶段";
}

export function ProgressPage({ progress, progressClass, tasks, taskCredits, taskActions, reviewSnapshot, conversationStage, onToggleTask, onSetTaskAction, onNavigate, onAskAgent }: ProgressPageProps) {
  const [activeList, setActiveList] = useState<"completed" | "pending">("pending");
  const taskRows = useMemo(() => tasks.map((task, index) => ({ ...task, index, credit: taskCredits[index] ?? 0 })), [tasks, taskCredits]);
  const completed = useMemo(() => taskRows.filter((task) => task.credit >= task.weight), [taskRows]);
  const pending = useMemo(() => taskRows.filter((task) => task.credit < task.weight).sort((a, b) =>
    (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
      || a.deadlineOrder - b.deadlineOrder
      || b.unlocks - a.unlocks
      || b.weight - a.weight,
  ), [taskRows]);
  const investedMinutes = taskRows.reduce((total, task) => total + (task.credit >= task.weight ? completedActualMinutes[task.index] : task.credit > 0 ? 18 : 0), 0);
  const remainingMinutes = pending.reduce((total, task) => total + (taskActions[task.index] === "abandoned" ? 0 : Math.max(0, task.durationMinutes - (task.credit > 0 ? 18 : 0))), 0);
  const completionRate = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;
  const activePendingCount = pending.filter((task) => taskActions[task.index] !== "abandoned").length;
  const groupedPending = ["高优先", "中优先", "低优先"].map((priority) => ({ priority, tasks: pending.filter((task) => task.priority === priority) })).filter((group) => group.tasks.length > 0);
  const learningCredit = taskCredits[2] ?? 0;
  const learningSummary = learningCredit === 0 ? "岗位认知已经开始，真实学习体验仍是信息缺口。" : learningCredit < tasks[2].weight ? "课程已经完成，配套练习仍缺少结果。" : "真实学习任务已完成，下一步应补方向复盘。";
  const recommendedAction = learningCredit === 0 ? "先完成 20 分钟入门课并记录感受。" : learningCredit < tasks[2].weight ? "先完成 10 道定位练习，再决定是否增量。" : "完成代价记录，再由用户确认下一阶段。";

  function deadlineLabel(index: number, fallback: string) {
    if (taskActions[index] === "rescheduled") return "已改至下周三 20:00";
    if (taskActions[index] === "abandoned") return "已暂停 · 记录保留";
    if (!reviewSnapshot) return fallback;
    if (index === 2) return "逾期 4 小时";
    if (index === 3) return "今天 20:00";
    return fallback;
  }

  function toggleTask(index: number) {
    onSetTaskAction(index, null);
    onToggleTask(index);
  }

  return <section className="content-page progress-page">
    <div className="management-page-heading task-manager-heading">
      <div><span className="section-kicker">任务管理</span><h2>本周任务，一处管理</h2></div>
      <div className="task-manager-heading-side">
        <p>手动勾选、改期或暂停；这里和 Agent 对话使用同一份任务状态。</p>
        <div>
          <button className="task-manager-back" onClick={() => onNavigate(conversationStage)}>← 返回 Agent 对话</button>
          <button className="task-manager-ai" onClick={() => onAskAgent("请根据我当前的任务完成情况，帮我重新排序，并把下一项任务拆得更容易开始。")}>AI 帮我调整</button>
        </div>
      </div>
    </div>
    <div className="task-manager-metrics" aria-label="任务概览">
      <article><span>任务完成率</span><strong>{completionRate}<small>%</small></strong><p>{completed.length} / {tasks.length} 项已完成</p></article>
      <article><span>加权进度</span><strong>{progress}<small>%</small></strong><p>重要任务完成后增长更多</p></article>
      <article><span>待办任务</span><strong>{activePendingCount}<small>项</small></strong><p>预计还需约 {remainingMinutes} 分钟</p></article>
      <article className="is-alert"><span>关键节点</span><strong>7<small>天</small></strong><p>国考报名窗口即将关闭</p></article>
    </div>
    <div className="progress-overview-grid">
      <article className="progress-main-card">
        <header><div><span>整体进度（加权）</span><strong>{progress}<small>%</small></strong><em>{progressPhase(progress)}</em></div><div><span>阶段目标</span><b>完成第一轮考公认知与学习体验</b><small>已完成 {completed.length} / {tasks.length} 项 · 已投入约 {investedMinutes} 分钟</small></div></header>
        <div className={`weighted-progress-track progress-spectrum ${progressClass}`} aria-label={`当前加权进度 ${progress}%`}><i style={{ width: `${progress}%` }} /></div>
        <div className="progress-band-labels" aria-hidden="true"><span>0–15% 起步</span><span>15–40% 探索</span><span>40–70% 加速</span><span>70–95% 冲刺</span><span>95–100% 收官</span></div>
        <div className="progress-list-tabs"><button className={activeList === "completed" ? "is-active" : ""} onClick={() => setActiveList("completed")}><span>已完成</span><b>{completed.length} 项</b></button><button className={activeList === "pending" ? "is-active" : ""} onClick={() => setActiveList("pending")}><span>未完成</span><b>{pending.length} 项</b></button></div>
        <div className="progress-task-list">
          {activeList === "completed" && completed.map((task) => <article key={task.title}>
            <button className="progress-task-check is-done" onClick={() => toggleTask(task.index)} aria-label={`取消完成：${task.title}`}>✓</button>
            <div><h4>{task.title}</h4><p>{task.category} · 实际 {completedActualMinutes[task.index]} 分钟 · 任务分值 {task.weight}</p><small>做到这里算完成：{task.criteria}</small></div>
            <span>已完成</span>
          </article>)}
          {activeList === "pending" && groupedPending.map((group) => <section className="progress-priority-group" key={group.priority}>
            <header><span>{group.priority}</span></header>
            {group.tasks.map((task) => {
              const deadline = deadlineLabel(task.index, task.deadline);
              const overdue = deadline.includes("逾期");
              const abandoned = taskActions[task.index] === "abandoned";
              return <article className={`${group.priority === "高优先" ? "is-high" : ""} ${overdue ? "is-overdue" : ""} ${task.credit > 0 ? "is-partial" : ""} ${abandoned ? "is-paused" : ""}`} key={task.title}>
                <button className="progress-task-check" disabled={abandoned} onClick={() => toggleTask(task.index)} aria-label={`标记完成：${task.title}`}>{abandoned ? "—" : task.credit > 0 ? "…" : ""}</button>
                <div><h4>{task.title}</h4><p>{task.category} · 约 {task.durationMinutes} 分钟 · 任务分值 {task.weight}</p><small>做到这里算完成：{task.criteria}</small>{task.credit > 0 && <em>进行中 · 已完成这项任务的一部分</em>}</div>
                <div className="progress-task-state"><span>{deadline}</span><div>{abandoned ? <button onClick={() => onSetTaskAction(task.index, null)}>恢复任务</button> : <><button onClick={() => onSetTaskAction(task.index, "rescheduled")}>改到下周</button><button onClick={() => onSetTaskAction(task.index, "abandoned")}>暂不做</button></>}</div></div>
              </article>;
            })}
          </section>)}
          {(activeList === "completed" ? completed : pending).length === 0 && <div className="progress-empty">这一组暂时没有任务</div>}
        </div>
        <footer><span>已经投入约 <b>{investedMinutes} 分钟</b></span><span>剩余任务约需 <b>{remainingMinutes} 分钟</b></span></footer>
      </article>
      <aside className="progress-agent-column">
        <article className="progress-next-card"><span>Agent 任务助手</span><h3>{learningCredit < tasks[2].weight ? "下一步先补一次真实学习" : "学习体验已完成，去确认方向"}</h3><p>{learningSummary}</p><div><b>建议现在做</b><p>{recommendedAction}</p></div><button onClick={() => onAskAgent("请结合我当前已完成和未完成的任务，告诉我现在最值得做哪一项，并帮我拆成三个小步骤。")}>让 Agent 帮我拆解 <i>→</i></button></article>
        <article className="progress-checkpoint-card"><span>关键节点</span><h3>国考报名窗口还有 7 天</h3><p>还要核对专业目录、应届身份和报名材料。</p><button onClick={() => onAskAgent("请帮我核对国考报名需要准备的材料，并把缺少的内容加入任务清单。")}>让 Agent 核对材料 <i>→</i></button></article>
      </aside>
    </div>
  </section>;
}
