"use client";

import { useMemo, useState } from "react";
import type { Stage } from "../demo-types";
import { AgentMessage } from "./agent-message";

type ExecutionTask = { title: string; category: string; weight: number; deadline: string; priority: string };

type ProgressPageProps = {
  progress: number;
  progressClass: string;
  tasks: ExecutionTask[];
  taskDone: boolean[];
  onToggleTask: (index: number) => void;
  onNavigate: (stage: Stage) => void;
};

const taskMinutes = [30, 20, 18, 20];

export function ProgressPage({ progress, progressClass, tasks, taskDone, onToggleTask, onNavigate }: ProgressPageProps) {
  const [activeList, setActiveList] = useState<"completed" | "pending">("pending");
  const completed = useMemo(() => tasks.map((task, index) => ({ ...task, index })).filter((task) => taskDone[task.index]), [tasks, taskDone]);
  const pending = useMemo(() => tasks.map((task, index) => ({ ...task, index })).filter((task) => !taskDone[task.index]), [tasks, taskDone]);
  const investedMinutes = completed.reduce((total, task) => total + taskMinutes[task.index], 0);

  return <section className="content-page progress-page">
    <div className="management-page-heading"><div><span className="section-kicker">进展总览</span><h2>每一步，都有迹可循</h2></div><p>进度按任务难度加权计算。完成、延期和调整都会保留原因。</p></div>
    <div className="progress-overview-grid">
      <article className="progress-main-card">
        <header><div><span>整体进度（加权）</span><strong>{progress}<small>%</small></strong></div><div><span>阶段目标</span><b>完成第一轮考公认知与学习体验</b><small>下次复盘：周日 20:00</small></div></header>
        <div className={`weighted-progress-track progress-spectrum ${progressClass}`}><i style={{ width: `${progress}%` }} /></div>
        <div className="progress-band-labels"><span>0 起步</span><span>15 探索</span><span>40 加速</span><span>70 冲刺</span><span>95 收官</span><span>100</span></div>
        <div className="progress-list-tabs"><button className={activeList === "completed" ? "is-active" : ""} onClick={() => setActiveList("completed")}><span>已完成</span><b>{completed.length} 项</b></button><button className={activeList === "pending" ? "is-active" : ""} onClick={() => setActiveList("pending")}><span>未完成</span><b>{pending.length} 项</b></button></div>
        <div className="progress-task-list">
          {(activeList === "completed" ? completed : pending).map((task) => <article className={`${task.priority.startsWith("高") ? "is-high" : ""} ${task.deadline.includes("逾期") ? "is-overdue" : ""}`} key={task.title}>
            <button className="progress-task-check" onClick={() => onToggleTask(task.index)} aria-label={`${taskDone[task.index] ? "取消完成" : "标记完成"}：${task.title}`}>{taskDone[task.index] ? "✓" : ""}</button>
            <div><h4>{task.title}</h4><p>{task.category} · 预计 {taskMinutes[task.index]} 分钟 · 权重 {task.weight}</p></div>
            <span>{taskDone[task.index] ? "已完成" : task.deadline}</span>
          </article>)}
          {(activeList === "completed" ? completed : pending).length === 0 && <div className="progress-empty">这一组暂时没有任务</div>}
        </div>
        <footer><span>已投入约 <b>{investedMinutes} 分钟</b></span><span>预计还需 <b>约 2 个月</b>完成基础探索</span></footer>
      </article>
      <aside className="progress-agent-column">
        <AgentMessage type="review_card" label="AI 进展解读" title="当前属于加速前的探索期">
          <p>岗位认知已经开始，真实学习体验仍不足。本周先补一节入门课，暂时不增加刷题量。</p>
          <div className="agent-metric-pills"><span><b>50%</b>任务完成率</span><span><b>40%</b>轻度偏离</span></div>
          <button onClick={() => onNavigate("execution")}>回到对话，让 AI 调整任务 <i>→</i></button>
        </AgentMessage>
        <AgentMessage type="reminder" label="关键节点" title="国考报名窗口还有 7 天" tone="warning">
          <p>待确认专业目录、应届身份和报名材料。正式产品会读取带来源的规则库。</p>
          <button onClick={() => onNavigate("execution")}>在对话中处理 <i>→</i></button>
        </AgentMessage>
      </aside>
    </div>
  </section>;
}
