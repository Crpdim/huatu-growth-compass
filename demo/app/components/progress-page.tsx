"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { ExecutionTask, Stage, TaskDraft, TaskLink, TaskSubtask } from "../demo-types";

type ProgressPageProps = {
  progress: number;
  progressClass: string;
  tasks: ExecutionTask[];
  taskCredits: Record<string, number>;
  taskActions: Record<string, "rescheduled" | "abandoned">;
  reviewSnapshot: boolean;
  conversationStage: "execution" | "companion";
  onToggleTask: (taskId: string) => void;
  onSetTaskAction: (taskId: string, action: "rescheduled" | "abandoned" | null) => void;
  onAddTask: (draft: TaskDraft) => void;
  onUpdateTask: (taskId: string, updates: Partial<ExecutionTask>) => void;
  onDeleteTask: (taskId: string) => void;
  onSplitTask: (taskId: string, subtasks: TaskSubtask[]) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAttachLink: (taskId: string, link: TaskLink) => void;
  onNavigate: (stage: Stage) => void;
};

type AiResult = "idle" | "thinking" | "split" | "link";

const priorityOrder: Record<string, number> = { "高优先": 0, "中优先": 1, "低优先": 2 };
const priorityOptions = ["高优先", "中优先", "低优先"];
const officialRegistrationLink: TaskLink = {
  title: "2026 年度国考专题网站",
  url: "http://bm.scs.gov.cn/kl2026",
  source: "国家公务员局官方报名专题",
};
const emptyDraft: TaskDraft = {
  title: "",
  category: "个人任务",
  priority: "中优先",
  deadline: "周日 20:00",
  durationMinutes: 30,
  criteria: "完成任务并记录结果",
};

function progressPhase(progress: number) {
  if (progress < 15) return "起步";
  if (progress < 40) return "探索";
  if (progress < 70) return "加速";
  if (progress < 95) return "冲刺";
  return "收官";
}

function splitSuggestions(task: ExecutionTask): string[] {
  if (task.id === "learning-trial") return ["打开入门课，先学习 10 分钟", "完成剩余 10 分钟并记下 1 个难点", "做 10 道配套题并提交一次反馈"];
  if (task.id === "position-check") return ["打开招考简章并筛选本专业", "核对学历、应届身份与地域条件", "保存 1 个岗位编号并记录疑问"];
  return [`明确“${task.title}”的完成标准`, "先做一个 15 分钟的最小步骤", "记录结果，再决定是否继续投入"];
}

export function ProgressPage({ progress, progressClass, tasks, taskCredits, taskActions, reviewSnapshot, conversationStage, onToggleTask, onSetTaskAction, onAddTask, onUpdateTask, onDeleteTask, onSplitTask, onToggleSubtask, onAttachLink, onNavigate }: ProgressPageProps) {
  const [activeList, setActiveList] = useState<"completed" | "pending">("pending");
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState<TaskDraft>(emptyDraft);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<TaskDraft>(emptyDraft);
  const [activeAiTaskId, setActiveAiTaskId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiResult>("idle");
  const [requestedAiAction, setRequestedAiAction] = useState<"split" | "link">("split");

  const taskRows = useMemo(() => tasks.map((task) => ({ ...task, credit: taskCredits[task.id] ?? 0 })), [tasks, taskCredits]);
  const completed = useMemo(() => taskRows.filter((task) => task.credit >= task.weight), [taskRows]);
  const pending = useMemo(() => taskRows.filter((task) => task.credit < task.weight).sort((a, b) =>
    (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
      || a.deadlineOrder - b.deadlineOrder
      || b.unlocks - a.unlocks
      || b.weight - a.weight,
  ), [taskRows]);
  const groupedPending = priorityOptions.map((priority) => ({ priority, tasks: pending.filter((task) => task.priority === priority) })).filter((group) => group.tasks.length > 0);
  const investedMinutes = completed.reduce((total, task) => total + task.durationMinutes, 0);
  const remainingMinutes = pending.reduce((total, task) => total + (taskActions[task.id] === "abandoned" ? 0 : task.durationMinutes), 0);
  const activePendingCount = pending.filter((task) => taskActions[task.id] !== "abandoned").length;
  const activeAiTask = tasks.find((task) => task.id === activeAiTaskId) ?? null;
  const registrationTask = tasks.find((task) => task.id === "position-check") ?? null;

  function deadlineLabel(task: ExecutionTask) {
    if (taskActions[task.id] === "abandoned") return "已暂停";
    if (taskActions[task.id] === "rescheduled") return "已改期";
    if (reviewSnapshot && task.id === "learning-trial") return "逾期 4 小时";
    return task.deadline;
  }

  function submitNewTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTask.title.trim()) return;
    onAddTask({ ...newTask, title: newTask.title.trim(), criteria: newTask.criteria.trim() || "完成任务并记录结果" });
    setNewTask(emptyDraft);
    setShowNewTask(false);
  }

  function startEditing(task: ExecutionTask) {
    setEditingTaskId(task.id);
    setEditTask({ title: task.title, category: task.category, priority: task.priority, deadline: task.deadline, durationMinutes: task.durationMinutes, criteria: task.criteria });
  }

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTaskId || !editTask.title.trim()) return;
    onUpdateTask(editingTaskId, { ...editTask, title: editTask.title.trim(), criteria: editTask.criteria.trim() || "完成任务并记录结果" });
    setEditingTaskId(null);
  }

  function openTaskAi(taskId: string, action?: "split" | "link") {
    setActiveAiTaskId(taskId);
    setAiResult(action ? "thinking" : "idle");
    if (action) {
      setRequestedAiAction(action);
      window.setTimeout(() => setAiResult(action), 650);
    }
  }

  function runAiAction(action: "split" | "link") {
    setRequestedAiAction(action);
    setAiResult("thinking");
    window.setTimeout(() => setAiResult(action), 650);
  }

  function applySplit() {
    if (!activeAiTask) return;
    const subtasks = splitSuggestions(activeAiTask).map((title, index) => ({ id: `${activeAiTask.id}-step-${index + 1}`, title, done: false }));
    onSplitTask(activeAiTask.id, subtasks);
  }

  function confirmDelete(task: ExecutionTask) {
    if (window.confirm(`删除“${task.title}”？这只会删除这条演示任务。`)) onDeleteTask(task.id);
  }

  function renderTask(task: ExecutionTask & { credit: number }) {
    const isDone = task.credit >= task.weight;
    const isPaused = taskActions[task.id] === "abandoned";
    const deadline = deadlineLabel(task);
    return <article className={`task-manager-row ${isDone ? "is-done" : ""} ${isPaused ? "is-paused" : ""}`} key={task.id}>
      <button className="task-manager-check" disabled={isPaused} onClick={() => onToggleTask(task.id)} aria-label={isDone ? `取消完成：${task.title}` : `标记完成：${task.title}`}>{isDone ? "✓" : isPaused ? "—" : ""}</button>
      <div className="task-manager-row-main">
        <div className="task-manager-row-title"><h4>{task.title}</h4><span className={`priority-${priorityOrder[task.priority] ?? 2}`}>{task.priority}</span></div>
        <p>{task.category} · {task.durationMinutes} 分钟 · {deadline}</p>
        <small>完成标准：{task.criteria}</small>
        {task.link && <a className="task-saved-link" href={task.link.url} target="_blank" rel="noreferrer"><span>↗</span><b>{task.link.title}</b><small>{task.link.source}</small></a>}
        {task.subtasks && task.subtasks.length > 0 && <div className="task-subtask-list"><header><span>AI 已拆成 {task.subtasks.length} 步</span><b>{task.subtasks.filter((item) => item.done).length}/{task.subtasks.length}</b></header>{task.subtasks.map((subtask) => <button className={subtask.done ? "is-done" : ""} onClick={() => onToggleSubtask(task.id, subtask.id)} key={subtask.id}><i>{subtask.done ? "✓" : ""}</i><span>{subtask.title}</span></button>)}</div>}
      </div>
      <div className="task-manager-row-actions">
        <button className="task-row-ai" onClick={() => openTaskAi(task.id)} aria-label={`让 AI 调整：${task.title}`}><span>✦</span> AI</button>
        <button onClick={() => startEditing(task)}>编辑</button>
        {!isDone && <button onClick={() => onSetTaskAction(task.id, isPaused ? null : "abandoned")}>{isPaused ? "恢复" : "暂停"}</button>}
        <button className="is-delete" onClick={() => confirmDelete(task)}>删除</button>
      </div>
      {editingTaskId === task.id && <form className="task-inline-form task-edit-form" onSubmit={submitEdit}>
        <label><span>任务名</span><input value={editTask.title} onChange={(event) => setEditTask((current) => ({ ...current, title: event.target.value }))} /></label>
        <label><span>分类</span><input value={editTask.category} onChange={(event) => setEditTask((current) => ({ ...current, category: event.target.value }))} /></label>
        <label><span>截止时间</span><input value={editTask.deadline} onChange={(event) => setEditTask((current) => ({ ...current, deadline: event.target.value }))} /></label>
        <label><span>优先级</span><select value={editTask.priority} onChange={(event) => setEditTask((current) => ({ ...current, priority: event.target.value }))}>{priorityOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>预计分钟</span><input type="number" min="5" max="480" value={editTask.durationMinutes} onChange={(event) => setEditTask((current) => ({ ...current, durationMinutes: Number(event.target.value) }))} /></label>
        <label className="is-wide"><span>完成标准</span><input value={editTask.criteria} onChange={(event) => setEditTask((current) => ({ ...current, criteria: event.target.value }))} /></label>
        <div><button type="button" onClick={() => setEditingTaskId(null)}>取消</button><button type="submit">保存修改</button></div>
      </form>}
    </article>;
  }

  return <section className="content-page progress-page task-manager-page">
    <header className="task-manager-page-header">
      <div><span className="section-kicker">任务管理</span><h2>本周 Todo</h2><p>自己增删改，也可以只让 AI 处理某一项。</p></div>
      <div><button className="task-manager-back" onClick={() => onNavigate(conversationStage)}>← Agent 对话</button><button className="task-manager-add" onClick={() => setShowNewTask((current) => !current)}>＋ 新建任务</button></div>
    </header>

    <section className="task-manager-summary" aria-label="本周任务进度">
      <div className="task-manager-progress-copy"><span>加权进度</span><strong>{progress}<small>%</small></strong><em>{progressPhase(progress)}</em></div>
      <div className="task-manager-progress-track"><div className={`weighted-progress-track progress-spectrum ${progressClass}`}><i style={{ width: `${progress}%` }} /></div><div className="progress-band-labels"><span>起步</span><span>探索</span><span>加速</span><span>冲刺</span><span>收官</span></div></div>
      <div className="task-manager-summary-stats"><span><b>{completed.length}</b>已完成</span><span><b>{activePendingCount}</b>待处理</span><span><b>{remainingMinutes}</b>剩余分钟</span></div>
    </section>

    <div className="task-manager-layout">
      <main className="task-manager-list-card">
        <div className="task-manager-tabs"><button className={activeList === "pending" ? "is-active" : ""} onClick={() => setActiveList("pending")}>待办 <b>{pending.length}</b></button><button className={activeList === "completed" ? "is-active" : ""} onClick={() => setActiveList("completed")}>已完成 <b>{completed.length}</b></button></div>
        {showNewTask && <form className="task-inline-form task-new-form" onSubmit={submitNewTask}>
          <header><b>新建任务</b><span>新任务默认分值 10，可随时编辑或删除</span></header>
          <label className="is-wide"><span>任务名</span><input autoFocus value={newTask.title} placeholder="例如：整理报名材料" onChange={(event) => setNewTask((current) => ({ ...current, title: event.target.value }))} /></label>
          <label><span>分类</span><input value={newTask.category} onChange={(event) => setNewTask((current) => ({ ...current, category: event.target.value }))} /></label>
          <label><span>截止时间</span><input value={newTask.deadline} onChange={(event) => setNewTask((current) => ({ ...current, deadline: event.target.value }))} /></label>
          <label><span>优先级</span><select value={newTask.priority} onChange={(event) => setNewTask((current) => ({ ...current, priority: event.target.value }))}>{priorityOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>预计分钟</span><input type="number" min="5" max="480" value={newTask.durationMinutes} onChange={(event) => setNewTask((current) => ({ ...current, durationMinutes: Number(event.target.value) }))} /></label>
          <label className="is-wide"><span>完成标准</span><input value={newTask.criteria} onChange={(event) => setNewTask((current) => ({ ...current, criteria: event.target.value }))} /></label>
          <div><button type="button" onClick={() => setShowNewTask(false)}>取消</button><button type="submit">添加任务</button></div>
        </form>}
        <div className="task-manager-list">
          {activeList === "pending" && groupedPending.map((group) => <section className="task-manager-group" key={group.priority}><header><span>{group.priority}</span><b>{group.tasks.length}</b></header>{group.tasks.map(renderTask)}</section>)}
          {activeList === "completed" && completed.map(renderTask)}
          {(activeList === "completed" ? completed : pending).length === 0 && <div className="progress-empty">这一组暂时没有任务</div>}
        </div>
        <footer><span>已投入约 <b>{investedMinutes} 分钟</b></span><span>完成状态会同步到 Agent 对话</span></footer>
      </main>

      <aside className="task-manager-side">
        {/* <article className="task-manager-permission-card"><span>你的任务，你做主</span><h3>可以直接增删改</h3><p>AI 只给建议。拆解、链接和时间调整都要由你点击应用。</p><div><span>✓ 新建与编辑</span><span>✓ 暂停与删除</span><span>✓ AI 单任务协助</span></div><small>演示：点击“体验 20 分钟华图入门课”旁的 AI，可把它拆成 3 步。</small></article> */}
        <article className="task-manager-node-card"><span>关键节点 · 演示</span><h3>国考报名窗口还有 7 天</h3><p>可以让 AI 找到官方报名专题，并保存到“确认可报岗位”。</p><button disabled={!registrationTask} onClick={() => { if (registrationTask) openTaskAi(registrationTask.id, "link"); }}>✦ {registrationTask ? "用 AI 找报名入口" : "对应任务已删除"}</button></article>
      </aside>
    </div>

    {activeAiTask && <div className="task-ai-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setActiveAiTaskId(null); }}>
      <section className="task-ai-dialog" role="dialog" aria-modal="true" aria-label={`AI 调整任务：${activeAiTask.title}`}>
        <header><div><span>AI</span><div><small>AI 任务助手</small><h3>{activeAiTask.title}</h3></div></div><button onClick={() => setActiveAiTaskId(null)} aria-label="关闭 AI 任务助手">×</button></header>
        <div className="task-ai-stream" aria-live="polite">
          <div className="task-ai-message is-agent"><span>AI</span><p>我只处理这一项任务。你想把它拆小，还是查找完成任务需要的官方网址？</p></div>
          {aiResult !== "idle" && <div className="task-ai-message is-user"><span>你</span><p>{requestedAiAction === "link" ? "帮我找国考官方报名链接" : "把这个任务拆成容易开始的小步骤"}</p></div>}
          {aiResult === "thinking" && <div className="task-ai-thinking"><span>AI</span><p>正在读取任务要求并核验来源<i /><i /><i /></p></div>}
          {aiResult === "split" && <div className="task-ai-result"><span>拆解建议</span><h4>保留原任务，拆成 3 个可勾选步骤</h4><ol>{splitSuggestions(activeAiTask).map((item) => <li key={item}>{item}</li>)}</ol><button onClick={applySplit} disabled={Boolean(activeAiTask.subtasks?.length)}>{activeAiTask.subtasks?.length ? "已应用到任务" : "应用这份拆解"}</button></div>}
          {aiResult === "link" && <div className="task-ai-result is-link"><span>已核验官方来源</span><h4>{officialRegistrationLink.title}</h4><p>来源：{officialRegistrationLink.source}。正式使用时仍需按当年公告核对开放时间。</p><code>{officialRegistrationLink.url}</code><a href={officialRegistrationLink.url} target="_blank" rel="noreferrer">打开官方报名专题 ↗</a><button onClick={() => onAttachLink(activeAiTask.id, officialRegistrationLink)} disabled={Boolean(activeAiTask.link)}>{activeAiTask.link ? "已保存到任务" : "保存链接到任务"}</button></div>}
        </div>
        <footer><button disabled={aiResult === "thinking"} onClick={() => runAiAction("split")}>拆成小任务</button><button disabled={aiResult === "thinking"} onClick={() => runAiAction("link")}>查找官方网址</button></footer>
      </section>
    </div>}
  </section>;
}
