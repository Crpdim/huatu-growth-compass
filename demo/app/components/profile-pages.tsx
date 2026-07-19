import type { AuthorizationSourceId, Stage } from "../demo-types";

type Confidence = "high" | "medium" | "low";
type Purpose = { title: string; tag: string };
type ResultSignal = { text: string; source: string; confidence: string };
type SignalReview = "confirmed" | "rejected";
type AuthorizationSource = { id: AuthorizationSourceId; icon: string; name: string; scope: string; insight: string };
type AnalysisStep = { label: string; detail: string; output: string };
type AbilityDimension = {
  label: string;
  value: number;
  tag: string;
  summary: string;
  evidence: string;
  confidence: string;
  referenceOnly: boolean;
  color: string;
};

type ProfilePagesProps = {
  stage: Stage;
  purpose: Purpose;
  resultSignals: ResultSignal[];
  signalReviews: Record<number, SignalReview>;
  onReviewSignal: (index: number, review: SignalReview) => void;
  confidenceLabels: Record<Confidence, string>;
  onSetStage: (stage: Stage) => void;
  resumeName: string;
  onResumeNameChange: (name: string) => void;
  authorizationSources: AuthorizationSource[];
  authorizedSources: Record<AuthorizationSourceId, boolean>;
  onToggleAuthorization: (source: AuthorizationSourceId) => void;
  consent: boolean;
  onConsentChange: (consent: boolean) => void;
  selectedAuthorizationSources: AuthorizationSource[];
  analysisComplete: boolean;
  analysisProgress: number;
  analysisStep: number;
  analysisSteps: AnalysisStep[];
  onSetAnalysisStep: (step: number) => void;
  answeredCount: number;
  abilityDimensions: AbilityDimension[];
  radarPoints: string;
  activeDimension: number;
  onSetActiveDimension: (dimension: number) => void;
  selectedDimension: AbilityDimension;
};

export function ProfilePages(props: ProfilePagesProps) {
  const {
    stage,
    purpose,
    resultSignals,
    signalReviews,
    onReviewSignal,
    confidenceLabels,
    onSetStage,
    resumeName,
    onResumeNameChange,
    authorizationSources,
    authorizedSources,
    onToggleAuthorization,
    consent,
    onConsentChange,
    selectedAuthorizationSources,
    analysisComplete,
    analysisProgress,
    analysisStep,
    analysisSteps,
    onSetAnalysisStep,
    answeredCount,
    abilityDimensions,
    radarPoints,
    activeDimension,
    onSetActiveDimension,
    selectedDimension,
  } = props;
  const profileAverage = abilityDimensions.reduce((total, item) => total + item.value, 0) / abilityDimensions.length;

  if (stage === "result") {
    return (
      <section className="content-page result-page">
        <div className="page-heading centered result-heading"><h2>这是 AI 对你的第一印象</h2></div>
        <div className="result-grid">
          <article className="share-card">
            <div className="share-top"><span>AI 初步印象</span><b>临时画像 · V0</b></div>
            <div className="type-symbol"><span>临时成长标签</span><strong>↗</strong></div>
            <h3>「人间清醒的务实派」</h3>
            <p>你倾向先了解现实条件，再通过一次小体验判断方向。你当前最想解决的是“{purpose.title}”。</p>
            <div className="type-explanation"><span>这个标签有什么用？</span><p>它帮助系统理解你的选择方式，并决定接下来先补充哪些信息。你可以随时修正。</p></div>
            <div className="share-tags"><span># {purpose.tag}</span><span># 选择要有依据</span><span># 先体验再押注</span></div>
            <footer><b>职途有声</b><span>初步印象，等待你确认</span></footer>
          </article>
          <article className="state-panel">
            <div className="panel-title"><div><span>这些判断说得像你吗？</span><small>逐条确认可以帮助 AI 修正对你的理解</small></div><b>请确认</b></div>
            <div className="signal-list">
              {resultSignals.map((signal, index) => (
                <div className={`signal-row ${signalReviews[index] === "rejected" ? "is-rejected" : ""}`} key={`${signal.text}-${index}`}>
                  <span>0{index + 1}</span>
                  <div><p>{signal.text}</p><small>依据：{signal.source} · 置信度{confidenceLabels[signal.confidence as Confidence]}</small></div>
                  <div className="signal-review">
                    <button className={signalReviews[index] === "confirmed" ? "is-active" : ""} onClick={() => onReviewSignal(index, "confirmed")}>说得像我</button>
                    <button className={signalReviews[index] === "rejected" ? "is-active reject" : ""} onClick={() => onReviewSignal(index, "rejected")}>不太像我</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel-next-action"><button className="primary-button full" onClick={() => onSetStage("profile")}>下一步：补充资料与授权 <span>→</span></button></div>
          </article>
        </div>
      </section>
    );
  }

  if (stage === "profile") {
    return (
      <section className="content-page profile-page">
        <div className="page-heading split-heading">
          <div><span className="section-kicker">补全任务画像</span><h2>让 AI 多了解你一点</h2></div>
          <p>填写基本信息、健康与家庭条件，也可以授权常用平台。AI 只读取你主动提供或勾选的范围，用来判断基础、路径条件和可投入时间。</p>
        </div>
        <div className="profile-layout">
          <form className="profile-form" onSubmit={(event) => { event.preventDefault(); if (consent) onSetStage("analyzing"); }}>
            <div className="form-row"><label>学校<input defaultValue="某普通本科高校" /></label><label>年级<select defaultValue="大二"><option>大一</option><option>大二</option><option>大三</option><option>大四</option></select></label></div>
            <div className="form-row"><label>专业<input defaultValue="计算机科学与技术" /></label><label>成绩大概位置<select defaultValue="专业中游"><option>专业前 20%</option><option>专业中游</option><option>专业后 30%</option></select></label></div>
            <div className="form-row"><label>健康与精力状态<select defaultValue="日常状态稳定，暂无明确限制"><option>日常状态稳定，暂无明确限制</option><option>偶尔疲劳，需要降低任务强度</option><option>存在明确限制，需要核对岗位要求</option></select><small className="field-help">仅用于安排节奏和识别明确限制，不进行健康诊断。</small></label><label>家庭支持与限制<select defaultValue="支持探索，但需考虑异地限制"><option>支持探索，但需考虑异地限制</option><option>支持当前方向，地域限制较少</option><option>暂不确定，需要继续沟通</option></select><small className="field-help">用于判断规划能否实施，不评价家庭层级。</small></label></div>
            <label>做过哪些事？<textarea defaultValue="完成过校园二手平台课程项目；暂无实习、竞赛和职业证书。" /><small className="field-help">课程项目、社团、比赛、实习或证书都可以。</small></label>
            <label>你对未来生活有什么想法？<textarea defaultValue="希望留在省会或家乡附近；更喜欢稳定、可预期的工作；每周大约能投入 6 小时探索方向。" /><small className="field-help">例如：想在哪座城市、偏好稳定还是高成长、家人的期待、每周能投入多少时间。</small></label>
            <label className="upload-box">有简历的话，可以一起看看（选填）<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => onResumeNameChange(event.target.files?.[0]?.name ?? "")} /><span>{resumeName || "选择 PDF / Word 文件"}</span><small>本次体验不会读取文件内容</small></label>
            <fieldset className="authorization-block">
              <legend>可选授权</legend><p>勾选后模拟同步对应范围；随时可以取消。</p>
              <div className="authorization-grid">
                {authorizationSources.map((source) => {
                  const isSelected = authorizedSources[source.id];
                  return <button className={`authorization-source ${isSelected ? "is-selected" : ""}`} type="button" aria-pressed={isSelected} onClick={() => onToggleAuthorization(source.id)} key={source.id}><span className="authorization-icon">{source.icon}</span><span><b>{source.name}</b><small>{source.scope}</small></span><i aria-hidden="true">{isSelected ? "✓" : "+"}</i></button>;
                })}
              </div>
            </fieldset>
            <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} /><span>我同意 AI 在本次体验中使用这些信息；我可以随时修改或删除。</span></label>
            <button className="primary-button full" type="submit" disabled={!consent}>用这些信息补全画像 <span>→</span></button>
          </form>
          <aside className="profile-preview">
            <span className="section-kicker light">即将补全</span><h3>AI 会建立任务画像</h3><p>把你主动填写的事实与授权线索放在一起，形成后续任务安排的依据。</p>
            <div className="preview-evidence"><span>最想要的生活</span><b>{purpose.title}</b><small>来自：你刚才的选择</small></div>
            <div className="preview-evidence"><span>比较看重</span><b>稳定与地域偏好较高</b><small>来自：情境回答和未来想法</small></div>
            <div className="preview-evidence"><span>目前的基础</span><b>计算机专业，有课程项目</b><small>来自：你填写的资料</small></div>
            <div className="preview-evidence"><span>现实条件</span><b>健康基础达标；家庭支持较强，但需考虑异地限制</b><small>来自：你主动填写的健康与家庭情况</small></div>
            <div className="preview-evidence authorization-preview"><span>已选择 {selectedAuthorizationSources.length} 项授权</span><b>{selectedAuthorizationSources.length > 0 ? selectedAuthorizationSources.map((source) => source.name).join(" · ") : "暂不授权外部平台"}</b><small>只使用已勾选的范围</small></div>
            <footer>下一步，AI 会同步线索、标记来源并生成能力雷达与任务画像。</footer>
          </aside>
        </div>
      </section>
    );
  }

  if (stage === "analyzing") {
    const activeAnalysisStep = analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)];
    return (
      <section className="content-page analysis-page">
        <div className="page-heading centered analysis-heading"><span className="section-kicker">AI 正在补全任务画像</span><h2>{analysisComplete ? "你的任务画像已补全" : "正在整理你的学习与行动线索"}</h2><p>手动资料、情境答案和授权数据共同形成结论，每条线索都会保留来源。</p></div>
        <div className="analysis-workspace">
          <article className="analysis-engine-card">
            <div className="analysis-engine-top"><span><i /> GROWTH ENGINE</span><b>{analysisComplete ? "READY" : "ANALYZING"}</b></div>
            <div className={`analysis-orbit ${analysisComplete ? "is-complete" : ""}`} aria-label={`画像分析进度 ${analysisProgress}%`}><i /><i /><i /><div><strong>{analysisProgress}%</strong><small>{analysisComplete ? "分析完成" : "画像生成中"}</small></div></div>
            <div className="analysis-current" aria-live="polite">
              <span>{analysisComplete ? "已完成" : `步骤 ${analysisStep + 1} / ${analysisSteps.length}`}</span>
              <b>{analysisComplete ? "任务画像与证据链已就绪" : activeAnalysisStep.label}</b>
              <p>{analysisComplete ? "已生成能力雷达、路径线索和任务偏好" : analysisStep === 1 ? selectedAuthorizationSources.length > 0 ? selectedAuthorizationSources.map((source) => `${source.name}：${source.insight}`).join("；") : "用户未授权外部平台，本轮只使用手动资料" : activeAnalysisStep.detail}</p>
            </div>
            <div className="analysis-progress"><i style={{ width: `${analysisProgress}%` }} /></div>
            <div className="analysis-sources"><span>情境回答 {answeredCount} 条</span><span>手动资料 7 类</span>{selectedAuthorizationSources.length > 0 ? selectedAuthorizationSources.map((source) => <span key={source.id}>{source.name}</span>) : <span>未授权外部平台</span>}</div>
          </article>
          <article className="analysis-trace-card">
            <div className="analysis-trace-heading"><div><span>可解释分析记录</span><small>你可以看到分数从哪里来</small></div><b>逐项核对</b></div>
            <div className="analysis-step-list">
              {analysisSteps.map((item, index) => { const isDone = index < analysisStep; const isActive = index === analysisStep && !analysisComplete; return <div className={`${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`} key={item.label}><span>{isDone ? "✓" : String(index + 1).padStart(2, "0")}</span><div><b>{item.label}</b><p>{isDone ? item.output : item.detail}</p></div><i>{isDone ? "完成" : isActive ? "处理中" : "等待"}</i></div>; })}
            </div>
            <div className={`analysis-result ${analysisComplete ? "is-visible" : ""}`}><div><span>生成结果</span><b>八维画像与任务画像</b></div><div><span>评分结构</span><b>八项画像指标</b></div><div><span>行动偏好</span><b>短任务、周复盘</b></div></div>
            <div className="analysis-actions">{!analysisComplete && <button className="skip-button" onClick={() => onSetAnalysisStep(analysisSteps.length)}>跳过分析过程</button>}<button className="primary-button" disabled={!analysisComplete} onClick={() => onSetStage("positioning")}>查看补全后的画像 <span>→</span></button></div>
          </article>
        </div>
        <p className="analysis-prototype-note">demo演示</p>
      </section>
    );
  }

  if (stage === "positioning") {
    return (
      <section className="content-page positioning-page">
        <div className="page-heading positioning-heading"><div><span className="section-kicker">01 · 职途初鉴</span><h2>先看清现在的自己</h2></div></div>
        <div className="positioning-layout">
          <article className="coordinate-card">
            <div className="coordinate-heading"><div><span>八维画像 · 8 项指标统一展示</span><h3>我的八维成长画像</h3></div></div>
            <div className="target-reference target-public"><div><span>初步结论</span><b>考公方向好像更匹配</b></div><p>你的选择里反复出现了稳定、规则感和现实判断。</p></div>
            <div className="coordinate-content">
              <div className="radar-chart" role="img" aria-label="八维成长画像雷达：性格适配、专业能力、兴趣匹配度、学习与知识、抗压与情绪、沟通协作、健康情况和家庭情况">
                <div className="radar-ring radar-ring-outer" /><div className="radar-ring radar-ring-middle" /><div className="radar-ring radar-ring-inner" />
                {abilityDimensions.map((item, index) => <i className={`radar-axis axis-${index}`} key={item.label} />)}
                <div className="radar-shape" style={{ clipPath: `polygon(${radarPoints})` }} />
                {abilityDimensions.map((item, index) => { const angle = -Math.PI / 2 + index * (Math.PI * 2 / abilityDimensions.length); const radius = (item.value / 5) * 42; return <em className="radar-dot" style={{ left: `${50 + Math.cos(angle) * radius}%`, top: `${50 + Math.sin(angle) * radius}%`, background: item.color }} key={item.label} />; })}
                {abilityDimensions.map((item, index) => <span className={`radar-label radar-label-${index}`} key={item.label}>{item.label}</span>)}
                <strong>{profileAverage.toFixed(1)}</strong><small>八维综合指数 / 5</small>
              </div>
              <div className="dimension-explorer">
                <div className="dimension-tabs" role="tablist" aria-label="八项画像指标">{abilityDimensions.map((item, index) => <button className={activeDimension === index ? "is-active" : ""} onClick={() => onSetActiveDimension(index)} role="tab" aria-selected={activeDimension === index} aria-controls="dimension-detail" key={item.label}><span><i style={{ background: item.color }} />{item.label}</span><b>{item.value.toFixed(1)}</b></button>)}</div>
                <article className="dimension-detail" id="dimension-detail" role="tabpanel" aria-live="polite"><div className="dimension-row-head"><div><span>{selectedDimension.label}</span>{selectedDimension.referenceOnly && <small>通用参考</small>}</div><div><em>{selectedDimension.tag}</em><b>{selectedDimension.value.toFixed(1)}</b><small>/ 5</small></div></div><p>{selectedDimension.summary}</p><i><em style={{ width: `${(selectedDimension.value / 5) * 100}%`, background: selectedDimension.color }} /></i><div className="dimension-meta"><span>依据：{selectedDimension.evidence}</span><b>置信度{confidenceLabels[selectedDimension.confidence as Confidence]}</b></div></article>
              </div>
            </div>
            <footer className="score-footer"><p>八项指标都保留可追溯依据。健康情况仅用于任务节奏和岗位适配，不进行健康诊断；家庭情况仅用于判断规划实施条件。</p></footer>
          </article>
          <aside className="position-summary">
            <div className="position-summary-head"><div><span className="section-kicker light">AI 路径建议</span><h3>考公方向<br />值得优先体验</h3></div><div className="position-symbol">公</div></div>
            <div className="position-finding positive"><span>匹配依据</span><b>稳健有序、压力韧性突出、沟通方式稳妥</b><small>性格适配 4.5 · 抗压与情绪 4.8 · 沟通协作 3.9</small></div>
            <div className="position-finding"><span>现实条件</span><b>健康状态稳定；家庭支持较强，但需考虑异地限制</b><small>已纳入八维画像，用于调整岗位适配和规划顺序</small></div>
            <div className="position-finding"><span>还要验证</span><b>是否喜欢真实岗位内容，也能接受备考过程</b></div>
            <div className="position-thesis"><span>下一步</span><p>先看看与自己相同起点的人</p></div>
            <div className="position-actions"><button className="primary-button full" onClick={() => onSetStage("rolemodels")}>看看相似的人怎么走 <span>→</span></button><button className="position-compare" onClick={() => onSetStage("futures")}>先看看三条路径对比</button></div>
          </aside>
        </div>
      </section>
    );
  }

  return null;
}
