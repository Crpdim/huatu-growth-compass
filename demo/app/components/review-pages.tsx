import type { NextStageChoice, ReviewWindow, Stage } from "../demo-types";

type ReviewWindowItem = { title: string; description: string; metric: string; note: string };
type AbilityDimension = { label: string; value: number; currentValue: number };
type NextStageOption = { id: NextStageChoice; icon: string; title: string; description: string };

type ReviewPagesProps = {
  stage: Stage;
  reviewWindow: ReviewWindow;
  onSetReviewWindow: (window: ReviewWindow) => void;
  reviewWindowData: Record<ReviewWindow, ReviewWindowItem>;
  evidenceWithdrawn: boolean;
  abilityDimensions: { label: string }[];
  radarPoints: string;
  updatedRadarPoints: string;
  updatedAbilityDimensions: AbilityDimension[];
  reviewDimension: number;
  onSetReviewDimension: (dimension: number) => void;
  learningFeedbackOutcome: string;
  learningFeedbackNextTask: string;
  activeResourceTitle: string;
  onGoToStage: (stage: Stage) => void;
  nextStageOptions: NextStageOption[];
  nextStageChoice: NextStageChoice | null;
  onSelectNextStage: (choice: NextStageChoice) => void;
  stagePlanPhase: 0 | 1 | 2;
  stagePlanStep: number;
  onStartStagePlan: () => void;
};

export function ReviewPages(props: ReviewPagesProps) {
  const { stage, reviewWindow, onSetReviewWindow, reviewWindowData, evidenceWithdrawn, abilityDimensions, radarPoints, updatedRadarPoints, updatedAbilityDimensions, reviewDimension, onSetReviewDimension, learningFeedbackOutcome, learningFeedbackNextTask, activeResourceTitle, onGoToStage, nextStageOptions, nextStageChoice, onSelectNextStage, stagePlanPhase, stagePlanStep, onStartStagePlan } = props;

  if (stage === "companionReview") {
    return <section className="content-page companion-review-page">
      <div className="companion-review-heading"><div><span className="section-kicker">复盘与画像更新</span><h2>这周做了什么，<br />下周怎么调整</h2></div><p>只有任务和成果会更新画像，每次变化都会说明原因。</p></div>
      <div className="review-window-tabs" role="tablist" aria-label="选择复盘周期">{(["day", "week", "month", "semester"] as ReviewWindow[]).map((item) => <button className={reviewWindow === item ? "is-active" : ""} onClick={() => onSetReviewWindow(item)} role="tab" aria-selected={reviewWindow === item} key={item}>{item === "day" ? "日复盘" : item === "week" ? "周复盘" : item === "month" ? "月复盘" : "学期复盘"}</button>)}</div>
      {reviewWindow !== "week" ? <article className="review-window-placeholder"><div><span>{reviewWindowData[reviewWindow].metric}</span><small>{reviewWindow === "day" ? "今日任务" : reviewWindow === "month" ? "已积累" : "当前画像"}</small></div><section><span>能力预览</span><h3>{reviewWindowData[reviewWindow].title}</h3><p>{reviewWindowData[reviewWindow].description}</p>{(reviewWindow === "month" || reviewWindow === "semester") && <div className="matching-drift-boundary"><span>匹配度变化</span><b>证据还不够</b><p>只累计任务、对话意图和状态证据；在没有可靠常模与足够周期数据前，不展示伪精确分数。</p></div>}<small>{reviewWindowData[reviewWindow].note}</small></section><button className="primary-button" onClick={() => onSetReviewWindow("week")}>查看完整周回顾 <span>→</span></button></article> : <>
        <div className="companion-review-metrics"><article><span>完成任务</span><strong>3<small> 项</small></strong><small>岗位、课程与练习</small></article><article><span>本周投入</span><strong>58<small> 分钟</small></strong><small>来自已提交的任务记录</small></article><article><span>画像新证据</span><strong>{evidenceWithdrawn ? 0 : 1}<small> 条</small></strong><small>{evidenceWithdrawn ? "已由用户撤回" : "课程结果与反馈"}</small></article></div>
        <div className="profile-review-grid">
          <article className="profile-radar-review"><header><div><span>画像版本对比</span><h3>阶段开始 v1 → 当前候选 v2</h3></div><div><small><i className="baseline" />阶段开始</small><small><i className="current" />当前状态</small></div></header><div className="profile-radar-body"><div className="radar-chart review-radar"><div className="radar-ring radar-ring-outer" /><div className="radar-ring radar-ring-middle" /><div className="radar-ring radar-ring-inner" />{abilityDimensions.map((_, index) => <i className={`radar-axis axis-${index}`} key={`review-axis-${index}`} />)}<div className="radar-shape radar-shape-baseline" style={{ clipPath: `polygon(${radarPoints})` }} /><div className={`radar-shape radar-shape-current ${evidenceWithdrawn ? "is-withdrawn" : ""}`} style={{ clipPath: `polygon(${updatedRadarPoints})` }} />{updatedAbilityDimensions.map((item, index) => <span className={`radar-label radar-label-${index}`} key={item.label}>{item.label}</span>)}<strong>{evidenceWithdrawn ? "v1" : "v2"}</strong><small>{evidenceWithdrawn ? "证据已撤回" : "候选画像"}</small></div><div className="profile-dimension-review"><div className="review-dimension-list">{updatedAbilityDimensions.map((item, index) => <button className={reviewDimension === index ? "is-active" : ""} onClick={() => onSetReviewDimension(index)} key={item.label}><span>{item.label}</span><b>{item.value.toFixed(1)}{item.currentValue !== item.value && !evidenceWithdrawn ? ` → ${item.currentValue.toFixed(1)}` : ""}</b>{item.currentValue !== item.value && !evidenceWithdrawn && <i>+0.2</i>}</button>)}</div><div className="review-dimension-detail"><span>{updatedAbilityDimensions[reviewDimension].label}</span><h4>{reviewDimension === 1 ? "真实练习补充了能力证据" : reviewDimension === 3 ? "完成课程并能说清剩余困难" : "本轮没有足够的新证据"}</h4><p>{reviewDimension === 1 ? "依据：完成课程随堂题，结果 8 / 10。" : reviewDimension === 3 ? "依据：完成课程并提交主动学习反馈。" : "当前分数保持不变，后续仍需通过相关任务验证。"}</p><small>置信度：中等 · Demo 预置评分</small></div></div></div></article>
          <aside className="dynamic-plan-review"><header><span className="agent-avatar">AI</span><div><small>AI 下周建议</small><h3>减少任务，保留真实体验</h3></div></header><div className="weekly-review-summary"><span>为什么这样调整</span><p>你已经完成第一次真实学习。{learningFeedbackOutcome}</p></div><div className="plan-change-list"><div><span>资料分析</span><s>完成一套综合练习</s><i>→</i><b>{learningFeedbackNextTask}</b><small>根据本轮学习反馈调整</small></div><div><span>申论体验</span><s>完成 2 篇阅读</s><i>→</i><b>先保留 1 篇，另一篇顺延</b><small>控制总任务量</small></div><div><span>每日投入</span><s>60 分钟</s><i>→</i><b>工作日 30 分钟</b><small>与课程作业协调</small></div></div><div className="review-evidence-note"><span>{evidenceWithdrawn ? "画像未更新" : "本轮新增 1 条证据"}</span><b>{evidenceWithdrawn ? "用户已撤回课程结果记录" : `完成《${activeResourceTitle}》与随堂反馈`}</b><small>每项计划变化都能回到证据来源。</small></div><div className="review-user-decision">还需要你确认：是否按这个节奏进入下一阶段。</div><button className="primary-button full" onClick={() => onGoToStage("stageSummary")}>确认建议，进入阶段结算 <span>→</span></button></aside>
        </div>
      </>}
    </section>;
  }

  if (stage === "stageSummary") {
    return <section className="content-page stage-summary-page">
      <div className="stage-summary-heading"><div><span className="section-kicker">阶段结算</span><h2>这一段走完了，<br />下一段仍由你选择</h2></div><p>这是 7 天考公认知与入门验证的结果。完成一段探索，不等于已经决定终身方向。</p></div>
      <div className="stage-complete-banner"><span>✓</span><div><small>核心目标 · 已完成</small><h3>考公认知与入门验证</h3><p>完成岗位认知、考试结构、华图入门课程和一次学习反馈；两项巩固任务转入下一阶段。</p></div><div><strong>58</strong><small>分钟投入</small></div></div>
      <div className="stage-summary-grid"><article className="stage-outcome-card"><header><span>本阶段总结</span><h3>你开始用真实任务判断方向</h3></header><div className="stage-outcome-points"><section><span>做得好的</span><p>愿意从一项小任务开始，也能具体说出学习中的阻碍。</p></section><section><span>还要改进</span><p>学习节奏尚未稳定，申论内容还没有真正体验。</p></section></div><div className="stage-evidence-list"><div><span>新增成果</span><b>课程随堂题 · 结果 8 / 10</b></div><div><span>画像变化</span><b>{evidenceWithdrawn ? "本轮证据已撤回，画像保持 v1" : "专业能力 +0.2 · 学习与知识 +0.2"}</b></div><div><span>仍待验证</span><b>能否连续三周保持投入</b></div></div><details><summary>如果这一阶段没有完成，会怎样？</summary><p>系统会先确认是时间冲突、任务难度、兴趣变化还是外部条件变化，再让用户选择缩小任务、重新安排或返回比较方向，不使用批评性标签。</p></details></article><aside className="next-stage-card"><header><span>下一段人生</span><h3>接下来想把时间用在哪里？</h3></header><div className="next-stage-options">{nextStageOptions.map((item) => <button className={nextStageChoice === item.id ? "is-selected" : ""} onClick={() => onSelectNextStage(item.id)} key={item.id}><span>{item.icon}</span><div><b>{item.title}</b><small>{item.description}</small></div><i>{nextStageChoice === item.id ? "✓" : "→"}</i></button>)}</div></aside></div>
      {nextStageChoice === "continue" && <section className="next-stage-result-panel">{stagePlanPhase === 0 && <div className="next-stage-ready"><div><span>继续当前方向</span><h3>基于现有证据生成四周基础计划</h3><p>课程结果、每周时间和仍待验证的问题会共同决定任务强度。</p></div><button className="primary-button" onClick={onStartStagePlan}>生成下一阶段计划 <span>→</span></button></div>}{stagePlanPhase === 1 && <div className="stage-plan-processing"><header><span className="agent-avatar is-thinking">AI</span><div><small>成长规划 Agent</small><h3>正在生成四周计划</h3></div></header><div className="next-plan-progress"><i style={{ width: `${(stagePlanStep / 3) * 100}%` }} /></div>{["读取当前能力证据与可用时间", "匹配华图课程和阶段任务", "检查任务总量与复盘节点"].map((item, index) => <p className={stagePlanStep > index ? "is-done" : stagePlanStep === index ? "is-active" : ""} key={item}><span>{stagePlanStep > index ? "✓" : `0${index + 1}`}</span><b>{item}</b></p>)}</div>}{stagePlanPhase === 2 && <div className="four-week-plan"><header><div><span>新阶段已生成</span><h3>四周公考基础体验计划</h3><p>阶段目标：验证持续学习节奏，建立行测与申论基础认知。</p></div><b>考公仍是阶段性探索</b></header><div>{["第 1 周 · 速算基础与 10 道训练", "第 2 周 · 资料分析限时练习", "第 3 周 · 申论材料要点提炼", "第 4 周 · 小型模考与方向复盘"].map((item, index) => <section key={item}><span>0{index + 1}</span><b>{item}</b><small>{index === 3 ? "完成标准：提交模考与复盘记录" : "完成标准：课程记录 + 对应练习"}</small></section>)}</div><footer><span>每周约 3 小时</span><span>周日 20:00 复盘</span><button onClick={() => onGoToStage("companion")}>返回伴学工作台 <i>→</i></button></footer></div>}</section>}
      {nextStageChoice === "compare" && <section className="alternative-stage-panel"><header><span>重新比较方向</span><h3>先完成三个低成本探索，再决定下一条主路径</h3><p>以下是候选任务，不是系统替你做出的选择。</p></header><div><article><span>研</span><b>访谈一名目标专业研究生</b><small>了解研究内容与读研动机</small></article><article><span>职</span><b>完成一次企业岗位 JD 对照</b><small>标记三项高频能力要求</small></article><article><span>实</span><b>参加一次短期项目体验</b><small>用成果判断真实工作兴趣</small></article></div><footer>当前 Demo 不展开完整分支；正式产品会重新生成路径依据、代价和退出方式。</footer></section>}
      {nextStageChoice === "life" && <section className="life-growth-panel"><header><span>生活也值得被认真规划</span><h3>选择一个主题，给下一阶段留下可完成的目标</h3></header><div>{[{ icon: "动", title: "恢复规律运动", task: "本周完成两次 30 分钟快走" }, { icon: "休", title: "调整休息边界", task: "连续三天在 23:30 前停止学习" }, { icon: "游", title: "完成一次城市探索", task: "做一份预算与一天路线" }, { icon: "新", title: "体验一个新技能", task: "完成一节入门课和一个小作品" }].map((item) => <article key={item.title}><span>{item.icon}</span><b>{item.title}</b><small>{item.task}</small><i>静态计划样例</i></article>)}</div><footer>生活成长可以形成由用户管理的成长证据，但不会被强行解释成职业匹配结论。</footer></section>}
    </section>;
  }

  return null;
}
