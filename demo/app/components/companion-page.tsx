import type { RefObject } from "react";

type CompanionObstacle = { id: string; label: string; clue: string; outcome: string; nextTask: string };
type HuatuResource = { id: string; title: string; type: string; duration: number; difficulty: string; matchedProblem: string; practice: string };

type CompanionPageProps = {
  companionChatRef: RefObject<HTMLDivElement | null>;
  companionPhase: number;
  typedCompanionQuestion: string;
  companionObstacles: readonly CompanionObstacle[];
  selectedCompanionObstacle: number | null;
  onSelectCompanionObstacle: (index: number) => void;
  activeCompanionObstacle: CompanionObstacle;
  onSetCompanionPhase: (phase: number) => void;
  companionSearchStep: number;
  activeHuatuResource: HuatuResource;
  companionFeedbacks: readonly string[];
  selectedLearningFeedback: number | null;
  onSelectLearningFeedback: (index: number) => void;
  evidenceWithdrawn: boolean;
  onToggleEvidence: () => void;
  learningFeedbackOutcome: string;
  onOpenReview: () => void;
  companionProgress: number;
  companionTaskTab: "completed" | "pending";
  onSetCompanionTaskTab: (tab: "completed" | "pending") => void;
};

export function CompanionPage(props: CompanionPageProps) {
  const { companionChatRef, companionPhase, typedCompanionQuestion, companionObstacles, selectedCompanionObstacle, onSelectCompanionObstacle, activeCompanionObstacle, onSetCompanionPhase, companionSearchStep, activeHuatuResource, companionFeedbacks, selectedLearningFeedback, onSelectLearningFeedback, evidenceWithdrawn, onToggleEvidence, learningFeedbackOutcome, onOpenReview, companionProgress, companionTaskTab, onSetCompanionTaskTab } = props;
  return <section className="content-page companion-page">
    <div className="companion-heading"><div><span className="section-kicker">AI 伴学工作台</span><h2>计划不只写在纸上，<br />AI 陪你一起完成</h2></div><div className="companion-context"><span>本阶段主题：考公认知与入门验证</span><b>大二 · 第 2 周</b><small>Demo 演示考公，产品机制支持其他成长方向</small></div></div>
    <div className="companion-workspace">
      <article className="companion-chat-panel">
        <header><div><span className="agent-avatar">AI</span><div><small>成长罗盘 Agent</small><h3>林小北的学习对话</h3></div></div><span className="agent-online">本周可用 6 小时</span></header>
        <div className="companion-chat-stream" ref={companionChatRef} aria-live="polite">
          <div className="chat-day-divider"><span>周一 · 下一阶段开始</span></div>
          <div className="execution-message agent"><span>AI</span><p>上周我们确认了一个可报岗位，也了解了考试结构。这周先体验一次真实学习内容，看看你对备考过程的感受。</p></div>
          {companionPhase >= 1 && <div className="execution-message user companion-typed-message"><span>你</span><p>{typedCompanionQuestion}<i className={companionPhase === 1 ? "typing-caret" : ""} /></p></div>}
          {companionPhase >= 2 && <div className="companion-clarify-card"><span>AI · 先确认具体阻碍</span><h4>“做得慢”可能来自不同环节。你现在最容易卡在哪里？</h4><div>{companionObstacles.map((item, index) => <button className={selectedCompanionObstacle === index ? "is-selected" : ""} disabled={companionPhase > 3} onClick={() => onSelectCompanionObstacle(index)} key={item.id}>{item.label}<i>{selectedCompanionObstacle === index ? "✓" : "→"}</i></button>)}</div></div>}
          {companionPhase >= 3 && selectedCompanionObstacle !== null && <><div className="execution-message user"><span>你</span><p>{activeCompanionObstacle.label}</p></div><div className="conversation-clue"><span>本轮问题已定位</span><b>{activeCompanionObstacle.clue}</b><small>仅用于本次学习会话，不直接改变长期画像。</small></div></>}
          {companionPhase === 3 && <button className="chat-simulation-button primary" onClick={() => onSetCompanionPhase(4)}>让 AI 查找合适的学习资源 <span>→</span></button>}
          {companionPhase === 4 && <div className="huatu-resource-search"><header><span className="agent-avatar is-thinking">AI</span><div><small>模拟接入华图学习资源</small><h4>正在检索课程与练习</h4></div></header>{["分析当前问题", "核对学习阶段与可用时间", "匹配课程和配套练习", "检查推荐依据"].map((item, index) => <div className={companionSearchStep > index ? "is-done" : companionSearchStep === index ? "is-active" : ""} key={item}><span>{companionSearchStep > index ? "✓" : `0${index + 1}`}</span><b>{item}</b><i /></div>)}</div>}
          {companionPhase >= 5 && <div className="huatu-resource-card"><header><div><span>华图课程资源 · 预置样本</span><h4>{activeHuatuResource.title}</h4></div><b>{activeHuatuResource.duration} 分钟</b></header><div className="resource-meta"><span>{activeHuatuResource.type}</span><span>{activeHuatuResource.difficulty}</span><span>{activeHuatuResource.practice}</span></div><div className="resource-reason"><span>为什么推荐</span><p>你当前卡在“{activeHuatuResource.matchedProblem}”，课程适合首次体验，单次时长也没有超过 30 分钟。</p></div><footer><small>资源编号 {activeHuatuResource.id} · 模拟来源：华图课程资源库</small>{companionPhase === 5 && <button onClick={() => onSetCompanionPhase(6)}>加入本周计划 <span>→</span></button>}</footer></div>}
          {companionPhase >= 6 && <div className="structured-message companion-plan-diff"><header><span>计划已经调整</span><b>总权重不变</b></header><div><section><small>调整前</small><s>完成一套资料分析练习 · 45 分钟</s></section><i>→</i><section><small>调整后</small><strong>先学 {activeHuatuResource.duration} 分钟课程，再完成配套练习</strong></section></div><p>原因：先补当前最明确的知识缺口，截止时间保持周日 16:00。</p></div>}
          {companionPhase === 6 && <button className="chat-simulation-button primary" onClick={() => onSetCompanionPhase(7)}>模拟完成课程与随堂题 <span>→</span></button>}
          {companionPhase >= 7 && <><div className="structured-message companion-progress-message"><span>✓</span><div><small>课程任务已完成</small><h4>实际用时 18 分钟 · 随堂题 8 / 10</h4><p>课程任务权重 10，本周加权进度从 50% 更新到 60%。</p></div><b>+10%</b></div><div className="companion-feedback-card"><span>AI · 完成后反馈</span><h4>哪句话最接近你的真实感受？</h4><div>{companionFeedbacks.map((item, index) => <button className={selectedLearningFeedback === index ? "is-selected" : ""} disabled={selectedLearningFeedback !== null} onClick={() => onSelectLearningFeedback(index)} key={item}>{item}<i>{selectedLearningFeedback === index ? "✓" : "→"}</i></button>)}</div></div></>}
          {companionPhase >= 8 && selectedLearningFeedback !== null && <><div className="execution-message user"><span>你</span><p>{companionFeedbacks[selectedLearningFeedback]}</p></div><div className={`companion-evidence-update ${evidenceWithdrawn ? "is-withdrawn" : ""}`}><header><span>{evidenceWithdrawn ? "本轮记录已撤回" : "本轮学习记录已更新"}</span><button onClick={onToggleEvidence}>{evidenceWithdrawn ? "恢复记录" : "撤回本条"}</button></header><b>{evidenceWithdrawn ? "这条学习结果不会进入当前画像。" : `完成《${activeHuatuResource.title}》和随堂题；${learningFeedbackOutcome}`}</b><p>来源：华图课程任务结果 + 用户主动反馈 · 可随时管理</p></div><button className="chat-simulation-button primary" onClick={onOpenReview}>快进到周日，查看周期复盘 <span>→</span></button></>}
        </div>
        <footer className="companion-composer"><span>继续提问学习或求职问题……</span><button disabled aria-label="当前使用预置演示流程">↑</button></footer>
      </article>
      <aside className="companion-dashboard">
        <header><div><span className="section-kicker light">CURRENT PLAN</span><h3>考公认知与入门验证</h3></div><span>下次复盘<br /><b>周日 20:00</b></span></header>
        <div className="companion-progress"><div><strong>{companionProgress}</strong><span>%</span><small>加权进度</small></div><i><em style={{ width: `${companionProgress}%` }} /></i><p>已完成任务权重 {companionProgress} ÷ 总权重 100</p></div>
        <div className="companion-task-tabs"><button className={companionTaskTab === "completed" ? "is-active" : ""} onClick={() => onSetCompanionTaskTab("completed")}>已完成 <b>{companionPhase >= 7 ? 3 : 2}</b></button><button className={companionTaskTab === "pending" ? "is-active" : ""} onClick={() => onSetCompanionTaskTab("pending")}>未完成 <b>2</b></button></div>
        <div className="companion-task-list">{companionTaskTab === "completed" ? <><div><span>✓</span><p><b>确认 1 个可报岗位</b><small>岗位认知 · 20 分钟</small></p></div><div><span>✓</span><p><b>读懂行测与申论结构</b><small>考试认知 · 20 分钟</small></p></div>{companionPhase >= 7 && <div className="is-new"><span>✓</span><p><b>{activeHuatuResource.title}</b><small>学习体验 · 18 分钟</small></p></div>}</> : <>{companionPhase < 7 && <div className="is-current"><span>1</span><p><b>{companionPhase >= 5 ? activeHuatuResource.title : "完成一次真实学习体验"}</b><small>周日 16:00 · 中优先</small></p></div>}{companionPhase >= 7 && <div className="is-current"><span>1</span><p><b>{activeHuatuResource.practice}</b><small>周日 18:00 · 权重 20</small></p></div>}<div><span>2</span><p><b>记录愿意与不愿意承担的代价</b><small>周日 20:00 · 权重 20</small></p></div></>}</div>
        <div className="companion-checkpoint"><span>关键节点预览</span><h4>国考报名窗口 · 还有 7 天</h4><p>待确认：专业目录、应届身份和报名材料。</p><small>预置演示日期，正式产品需读取有来源的规则库。</small></div><div className="companion-source-note">课程为预置演示样本；正式接入后以华图实际目录和授权范围为准。</div>
      </aside>
    </div>
  </section>;
}
