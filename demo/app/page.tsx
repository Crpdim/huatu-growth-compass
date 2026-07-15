"use client";

import { useMemo, useState } from "react";

type Stage =
  | "landing"
  | "quiz"
  | "result"
  | "profile"
  | "paths"
  | "plan"
  | "calibration";

type PathId = "job" | "postgrad" | "public";

const stages: { id: Stage; label: string; short: string }[] = [
  { id: "landing", label: "认识担忧", short: "定位" },
  { id: "result", label: "初始状态", short: "画像" },
  { id: "paths", label: "三路推演", short: "定向" },
  { id: "plan", label: "成长实验", short: "导航" },
  { id: "calibration", label: "动态更新", short: "校准" },
];

const questions = [
  {
    eyebrow: "面对选择",
    title: "室友已经开始准备考研、公考和实习，而你还没想好。你更接近：",
    options: [
      "先跟着准备，至少别落后",
      "疯狂搜资料，但迟迟没按下开始键",
      "先做一次短期体验，再决定加不加码",
      "再观察一下，也许答案会自己出现",
    ],
  },
  {
    eyebrow: "计划中断",
    title: "回想你最近一次计划中断，最后更接近哪种情况？",
    options: [
      "当晚重排了一版更完整的计划",
      "先砍掉一半任务，保住最低进度",
      "换个更容易完成的目标找手感",
      "暂时搁置，等课业稳定后再重开",
    ],
  },
  {
    eyebrow: "职业价值",
    title: "三份机会摆在你面前，你会先认真了解哪一个？",
    options: [
      "稳定、离家近，但成长节奏慢一些",
      "收入和成长快，但工作强度很高",
      "自由度高，但路径和未来不太确定",
      "先看哪个愿意给我 Offer，再谈理想",
    ],
  },
  {
    eyebrow: "信息过载",
    title: "收藏夹里躺着 37 篇经验帖，你通常会：",
    options: [
      "继续分类，等资料完整再决定",
      "挑一篇照做，完成后再补信息",
      "找一个过来人，直接问最关键的问题",
      "关掉收藏夹，先处理眼前的课程",
    ],
  },
  {
    eyebrow: "真实体验",
    title: "如果用一个周末体验陌生方向，你更愿意：",
    options: [
      "做一个能跑起来的小项目",
      "完成一套体验题，看看自己是否适应",
      "旁听一节课，再写下真实感受",
      "先看别人完整复盘，降低试错成本",
    ],
  },
  {
    eyebrow: "外部期待",
    title: "家人说“稳定最重要”，而你还不确定。你会：",
    options: [
      "先把稳定路线纳入选择，不急着否定",
      "把自己的顾虑说清楚，再一起比较",
      "先用行动验证兴趣，有结果再沟通",
      "暂时不谈，等自己更确定一点",
    ],
  },
  {
    eyebrow: "困难反馈",
    title: "一项任务比预想难很多，你第一反应通常是：",
    options: [
      "先怀疑是不是方向选错了",
      "拆小任务，看看具体卡在哪里",
      "找参考答案，先跑通一次完整流程",
      "换一项任务，比较哪种困难更能接受",
    ],
  },
  {
    eyebrow: "现在最怕",
    title: "如果必须选一个，你此刻最想解决的是：",
    options: [
      "怕选错，投入很久后才后悔",
      "怕来不及，错过关键准备窗口",
      "怕能力不够，努力也没有结果",
      "信息太多，不知道第一步从哪开始",
    ],
  },
];

const pathData: Record<
  PathId,
  {
    name: string;
    icon: string;
    status: string;
    accent: string;
    reason: string;
    gap: string;
    test: string;
    window: string;
  }
> = {
  job: {
    name: "企业后端求职",
    icon: "⌁",
    status: "值得探索 · 实践待补",
    accent: "violet",
    reason: "专业相关，已有课程项目，对做出可见成果有兴趣。",
    gap: "工程能力、项目深度、真实工作体验",
    test: "部署一个后端接口，并获得一次代码反馈",
    window: "大三上前可与考研并行验证",
  },
  postgrad: {
    name: "计算机考研",
    icon: "◇",
    status: "基础尚可 · 动机待验",
    accent: "blue",
    reason: "专业基础中等，愿意长期投入，但研究兴趣还不清晰。",
    gap: "目标院校、研究兴趣、数学与专业课水平",
    test: "体验一节专业课，完成三所院校对比",
    window: "大三上确定目标前仍可调整",
  },
  public: {
    name: "公考 / 考编",
    icon: "▦",
    status: "轻量探索 · 认知不足",
    accent: "green",
    reason: "稳定和地域偏好较强，但对岗位与考试仍停留在印象层。",
    gap: "岗位限制、行测基础、对工作内容的真实认知",
    test: "完成 30 分钟行测体验，筛选 10 个可报岗位",
    window: "现阶段先验证，不建议过早单线投入",
  },
};

const planWeeks = [
  {
    week: "第 1 周",
    title: "把模糊名字变成真实信息",
    time: "3.5 小时",
    tasks: [
      "调研 10 个后端实习 JD，标记重复技能",
      "对比 3 所目标院校的考试与培养信息",
      "筛选目标地区 10 个可报公考岗位",
    ],
    proof: "提交一份三路径信息对比表，所有信息注明来源",
  },
  {
    week: "第 2 周",
    title: "获得一次真实手感",
    time: "6 小时",
    tasks: [
      "部署一个可访问的后端接口",
      "完成一套 30 分钟行测体验题",
      "旁听一节研究生专业课程并记录感受",
    ],
    proof: "代码链接、体验题结果、课程体验记录齐全",
  },
  {
    week: "第 3 周",
    title: "让外部反馈进入罗盘",
    time: "3 小时",
    tasks: [
      "记录三类任务中的投入感与困难类型",
      "访谈一名在读研究生或开发实习生",
      "确认哪些结果可以写入成长画像",
    ],
    proof: "结构化复盘表 + 至少一条外部反馈",
  },
  {
    week: "第 4 周",
    title: "只决定下一个阶段",
    time: "2 小时",
    tasks: [
      "根据证据重新比较三条路径",
      "选择一条主路径和一条探索路径",
      "确认下学期的第一个里程碑",
    ],
    proof: "确认路径选择，并生成下一阶段计划",
  },
];

const stageRank: Record<Stage, number> = {
  landing: 0,
  quiz: 0,
  result: 1,
  profile: 1,
  paths: 2,
  plan: 3,
  calibration: 4,
};

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [mainPath, setMainPath] = useState<PathId>("job");
  const [explorePath, setExplorePath] = useState<PathId>("postgrad");
  const [activeWeek, setActiveWeek] = useState(0);
  const [decision, setDecision] = useState<"accept" | "partial" | "reject" | null>(null);

  const currentRank = stageRank[stage];
  const progress = useMemo(
    () => ((quizIndex + 1) / questions.length) * 100,
    [quizIndex],
  );

  function resetDemo() {
    setStage("landing");
    setQuizIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setCopied(false);
    setMainPath("job");
    setExplorePath("postgrad");
    setActiveWeek(0);
    setDecision(null);
  }

  function nextQuestion() {
    if (selectedAnswer === null) return;
    setAnswers((current) => [...current, selectedAnswer]);
    setSelectedAnswer(null);
    if (quizIndex === questions.length - 1) {
      setStage("result");
      return;
    }
    setQuizIndex((current) => current + 1);
  }

  function skipQuestion() {
    setAnswers((current) => [...current, -1]);
    setSelectedAnswer(null);
    if (quizIndex === questions.length - 1) {
      setStage("result");
      return;
    }
    setQuizIndex((current) => current + 1);
  }

  function copyResult() {
    const text =
      "我的初始成长原型是「多线加载型」：不是没有目标，而是后台同时运行了太多任务。#华图成长罗盘";
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function setAsMain(id: PathId) {
    setMainPath(id);
    if (explorePath === id) {
      setExplorePath(id === "job" ? "postgrad" : "job");
    }
  }

  function setAsExplore(id: PathId) {
    if (mainPath !== id) setExplorePath(id);
  }

  return (
    <main className={`app-shell stage-${stage}`}>
      <header className="topbar">
        <button className="brand" onClick={resetDemo} aria-label="返回首页">
          <span className="brand-mark">华</span>
          <span>
            <strong>华图成长罗盘</strong>
            <small>GROWTH COMPASS</small>
          </span>
        </button>
        <div className="topbar-actions">
          <span className="fallback-pill">
            <i /> 静态演示数据 · 离线可运行
          </span>
          {stage !== "landing" && (
            <button className="ghost-button compact" onClick={resetDemo}>
              ↻ 重置 Demo
            </button>
          )}
        </div>
      </header>

      {stage !== "landing" && stage !== "quiz" && (
        <nav className="journey-nav" aria-label="成长罗盘进度">
          {stages.slice(1).map((item, index) => {
            const rank = index + 1;
            return (
              <div
                className={`journey-step ${rank <= currentRank ? "is-active" : ""} ${rank < currentRank ? "is-done" : ""}`}
                key={item.id}
              >
                <span>{rank < currentRank ? "✓" : `0${rank}`}</span>
                <div>
                  <small>{item.short}</small>
                  <strong>{item.label}</strong>
                </div>
              </div>
            );
          })}
        </nav>
      )}

      {stage === "landing" && (
        <section className="landing-page">
          <div className="landing-copy">
            <div className="eyebrow-pill">✦ 给还没想好未来的你</div>
            <h1>
              你<span>迷茫</span>吗？
            </h1>
            <p className="landing-lead">
              大家好像都在往前走，而你还在考研、公考和实习之间反复横跳。
              先别急着决定一生，用 3 分钟看看你的成长罗盘卡在哪一步。
            </p>
            <div className="landing-actions">
              <button className="primary-button" onClick={() => setStage("quiz")}>
                测测我的成长状态 <span>→</span>
              </button>
              <span>8 道情境题 · 没有标准答案</span>
            </div>
            <div className="principle-row">
              <div><b>01</b><span>不替你决定</span></div>
              <div><b>02</b><span>每个判断有依据</span></div>
              <div><b>03</b><span>用行动校准未来</span></div>
            </div>
          </div>

          <div className="landing-visual" aria-label="林小北收到的未来提醒">
            <div className="orbital orbital-one" />
            <div className="orbital orbital-two" />
            <div className="compass-core">
              <span>N</span>
              <strong>?</strong>
              <small>下一步在哪</small>
            </div>
            <article className="floating-card card-chat">
              <div className="avatar purple">研</div>
              <div><small>考研群 · 12 条新消息</small><b>目标院校都定了吗？</b></div>
            </article>
            <article className="floating-card card-offer">
              <div className="avatar orange">聘</div>
              <div><small>朋友圈</small><b>室友拿到第一份实习 Offer</b></div>
            </article>
            <article className="floating-card card-family">
              <div className="avatar green">家</div>
              <div><small>妈妈</small><b>要不要早点准备考公？</b></div>
            </article>
            <div className="status-sticker">三个方向同时加载中…</div>
          </div>
        </section>
      )}

      {stage === "quiz" && (
        <section className="quiz-page">
          <div className="quiz-aside">
            <span className="section-kicker">01 · 初始定位</span>
            <h2>答案不必漂亮，<br />真实就好。</h2>
            <p>这些题只用于形成初始状态，不是心理测评，也不会决定你适合什么职业。</p>
            <div className="quiz-count"><strong>{String(quizIndex + 1).padStart(2, "0")}</strong><span>/ {String(questions.length).padStart(2, "0")}</span></div>
          </div>
          <div className="quiz-card">
            <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
            <span className="question-eyebrow">{questions[quizIndex].eyebrow}</span>
            <h3>{questions[quizIndex].title}</h3>
            <div className="option-list" role="radiogroup" aria-label="选择最接近的回答">
              {questions[quizIndex].options.map((option, index) => (
                <button
                  key={option}
                  className={selectedAnswer === index ? "is-selected" : ""}
                  onClick={() => setSelectedAnswer(index)}
                  role="radio"
                  aria-checked={selectedAnswer === index}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                  <i>{selectedAnswer === index ? "✓" : ""}</i>
                </button>
              ))}
            </div>
            <div className="quiz-footer">
              <div className="quiz-footer-actions">
                <button className="skip-button" onClick={skipQuestion}>暂时跳过</button>
                <button
                  className="primary-button"
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                >
                  {quizIndex === questions.length - 1 ? "生成我的初始状态" : "下一题"} <span>→</span>
                </button>
              </div>
              <small>你的答案仅用于本次 Demo</small>
            </div>
          </div>
        </section>
      )}

      {stage === "result" && (
        <section className="content-page result-page">
          <div className="page-heading centered">
            <span className="section-kicker">你的初始成长状态 · v1</span>
            <h2>多线加载型</h2>
            <p>不是没有目标，而是后台同时运行了太多任务。</p>
          </div>

          <div className="result-grid">
            <article className="share-card">
              <div className="share-top"><span>HUATU GROWTH TYPE</span><b>HT · 04</b></div>
              <div className="type-symbol"><span>LOADING</span><strong>∞</strong></div>
              <h3>多线加载型</h3>
              <p>考研、公考、实习都不想错过。你的优势是愿意保留可能，风险是精力同时摊在太多方向。</p>
              <div className="share-tags"><span># 方向探索中</span><span># 信息收藏家</span><span># 稳定优先</span></div>
              <footer><b>华图成长罗盘</b><span>测出来不算，走出来才算 →</span></footer>
            </article>

            <article className="state-panel">
              <div className="panel-title"><div><span>初始状态罗盘</span><small>基于本次 8 道回答</small></div><b>v1</b></div>
              <div className="dimension-list">
                {[
                  ["方向清晰度", "探索中", "44%"],
                  ["行动启动", "容易过载", "68%"],
                  ["探索主动性", "偏信息搜集", "52%"],
                  ["风险偏好", "稳定优先", "72%"],
                ].map(([label, state, width]) => (
                  <div className="dimension" key={label}>
                    <div><span>{label}</span><b>{state}</b></div>
                    <i><em style={{ width }} /></i>
                  </div>
                ))}
                <div className="dimension locked">
                  <div><span>能力准备度</span><b>待解锁</b></div>
                  <i><em /></i>
                  <small>补充专业、成绩与经历后生成</small>
                </div>
              </div>
              <div className="evidence-note"><b>当前最需要验证</b><p>你对三条路线的认识主要来自信息，还缺少真实体验证据。</p></div>
            </article>
          </div>

          <div className="result-actions">
            <button className="ghost-button" onClick={copyResult}>{copied ? "✓ 分享文案已复制" : "复制我的成长原型"}</button>
            <button className="primary-button" onClick={() => setStage("profile")}>测出来不算，走出来才算 <span>→</span></button>
          </div>
          <p className="disclaimer">成长原型只是入口语言，不是人格或能力定论。所有状态会随真实行动持续更新。</p>
        </section>
      )}

      {stage === "profile" && (
        <section className="content-page profile-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">补充事实证据</span><h2>让罗盘知道你现在在哪</h2></div>
            <p>小游戏只看见了你的选择方式。再补充几个事实，系统才能判断三条路线的准备状态。</p>
          </div>
          <div className="profile-layout">
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); setStage("paths"); }}>
              <div className="form-row"><label>学校<input defaultValue="某普通本科高校" /></label><label>年级<select defaultValue="大二"><option>大一</option><option>大二</option><option>大三</option><option>大四</option></select></label></div>
              <div className="form-row"><label>专业<input defaultValue="计算机科学与技术" /></label><label>成绩位置<select defaultValue="专业中游"><option>专业前 20%</option><option>专业中游</option><option>专业后 30%</option></select></label></div>
              <label>已有经历<textarea defaultValue="完成过校园二手平台课程项目；暂无实习、竞赛和职业证书。" /></label>
              <label>现实约束<textarea defaultValue="希望留在省会或家乡附近；家庭更倾向稳定就业。" /></label>
              <div className="consent-line"><span>✓</span><p>仅将以上信息用于本次路径推演；你可以随时修正或删除。</p></div>
              <button className="primary-button full" type="submit">解锁能力准备度与三条路径 <span>→</span></button>
            </form>
            <aside className="profile-preview">
              <span className="section-kicker light">即将固化</span>
              <h3>初始画像快照 v1</h3>
              <p>固化的是成长起点，不是把你定型。</p>
              <div className="preview-evidence"><span>已确认</span><b>稳定与地域偏好</b><small>来源：情境题 + 用户填写</small></div>
              <div className="preview-evidence"><span>待验证</span><b>对技术工作存在兴趣</b><small>来源：专业 + 课程项目</small></div>
              <div className="preview-evidence"><span>事实</span><b>实践经历不足</b><small>来源：经历填写</small></div>
              <footer>后续变化将生成 v2 / v3，不覆盖历史。</footer>
            </aside>
          </div>
        </section>
      )}

      {stage === "paths" && (
        <section className="content-page paths-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">02 · 多路径推演</span><h2>不是选答案，是比较代价</h2></div>
            <p>系统暂不推荐唯一方向。先保留一条主路径和一条探索路径，用四周行动补齐证据。</p>
          </div>
          <div className="path-grid">
            {(Object.keys(pathData) as PathId[]).map((id) => {
              const item = pathData[id];
              const isMain = mainPath === id;
              const isExplore = explorePath === id;
              return (
                <article className={`path-card ${item.accent} ${isMain ? "is-main" : ""}`} key={id}>
                  <div className="path-card-top"><span className="path-icon">{item.icon}</span>{isMain ? <b>主路径</b> : isExplore ? <b className="explore">探索路径</b> : <small>备选</small>}</div>
                  <h3>{item.name}</h3><p className="path-status">{item.status}</p>
                  <div className="path-fact"><span>为什么值得看</span><p>{item.reason}</p></div>
                  <div className="path-fact"><span>关键缺口</span><p>{item.gap}</p></div>
                  <div className="path-fact highlight"><span>建议验证</span><p>{item.test}</p></div>
                  <div className="path-window">↗ 转轨窗口：{item.window}</div>
                  <div className="path-actions">
                    <button onClick={() => setAsMain(id)} disabled={isMain}>{isMain ? "✓ 当前主路径" : "设为主路径"}</button>
                    <button onClick={() => setAsExplore(id)} disabled={isMain || isExplore}>{isExplore ? "✓ 已保留探索" : "保留探索"}</button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="decision-bar"><div><span>你的选择</span><b>{pathData[mainPath].name}</b><small>主路径</small><b>{pathData[explorePath].name}</b><small>探索路径</small></div><button className="primary-button" onClick={() => setStage("plan")}>生成四周成长实验 <span>→</span></button></div>
        </section>
      )}

      {stage === "plan" && (
        <section className="content-page plan-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">03 · 四周成长实验</span><h2>不急着决定一生，先拿到新证据</h2></div>
            <p>每项任务都有明确完成标准，也会告诉你：它将影响画像里的哪一项判断。</p>
          </div>
          <div className="plan-layout">
            <div className="week-tabs">
              {planWeeks.map((week, index) => (
                <button className={activeWeek === index ? "is-active" : ""} onClick={() => setActiveWeek(index)} key={week.week}><span>{week.week}</span><b>{week.title}</b><small>{week.time}</small></button>
              ))}
            </div>
            <article className="week-detail">
              <div className="week-heading"><div><span>{planWeeks[activeWeek].week}</span><h3>{planWeeks[activeWeek].title}</h3></div><b>预计 {planWeeks[activeWeek].time}</b></div>
              <div className="task-list">
                {planWeeks[activeWeek].tasks.map((task, index) => <div className="task-row" key={task}><span>{index + 1}</span><p>{task}</p><i>{index === 0 && activeWeek === 1 ? "重点" : ""}</i></div>)}
              </div>
              <div className="proof-box"><span>✓ 完成标准</span><p>{planWeeks[activeWeek].proof}</p></div>
              <div className="impact-box"><span>完成后将更新</span><p>{activeWeek === 0 ? "路径认知与信息充分度" : activeWeek === 1 ? "技术兴趣、行测基础与升学动机" : activeWeek === 2 ? "投入意愿与外部反馈" : "主路径优先级与学期目标"}</p></div>
            </article>
          </div>
          <div className="plan-footer"><div><b>第一周从今天开始</b><p>所有任务使用静态样例，现场无需调用外部服务。</p></div><button className="primary-button" onClick={() => setStage("calibration")}>模拟两周后的成长反馈 <span>→</span></button></div>
        </section>
      )}

      {stage === "calibration" && (
        <section className="content-page calibration-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">04 · 动态校准</span><h2>失败不是结论，它也是证据</h2></div>
            <p>两次没完成开发任务，不等于不适合技术。系统先区分任务难度、方法和真实投入意愿。</p>
          </div>
          <div className="timeline-card">
            <div className="snapshot snapshot-before"><span>初始画像 · v1</span><h3>技术兴趣 <b>medium</b></h3><p>依据：计算机专业、课程项目、自述兴趣</p><small>缺少真实体验</small></div>
            <div className="event-stream"><span>成长事件</span><div className="event positive"><i>+</i><p>完成全部行测体验与岗位调研</p></div><div className="event positive"><i>+</i><p>连续两周完成资料分析任务</p></div><div className="event negative"><i>−</i><p>两次未完成开发任务，反馈投入意愿较低</p></div></div>
            <div className="snapshot snapshot-after"><span>当前画像 · v2</span><h3>公考探索 <b>medium</b></h3><p>依据：任务完成、投入反馈、岗位调研</p><small>获得行为证据</small></div>
          </div>
          <div className="calibration-grid">
            <article className="change-card"><div className="change-title"><span>路径优先级变化</span><b>3 项调整</b></div><div className="change-row"><span>企业求职</span><b>主路径</b><i>→</i><strong>探索路径</strong></div><div className="change-row"><span>公考 / 考编</span><b>轻量验证</b><i>→</i><strong>重点探索</strong></div><div className="change-row"><span>技术任务</span><b>6 小时 / 周</b><i>→</i><strong>2 小时 / 周</strong></div></article>
            <article className="reason-card"><span>为什么调整</span><h3>不是因为一次测试，而是两周行动提供了新证据。</h3><p>系统提高公考探索权重，但不会立即完全放弃技术方向。下一阶段保留轻量开发任务，同时增加岗位调研、行测模块诊断和申论体验。</p><div className="status-line"><i /> 决策状态：需要你的确认</div></article>
          </div>
          {!decision ? (
            <div className="calibration-actions"><button className="ghost-button" onClick={() => setDecision("partial")}>部分接受</button><button className="ghost-button" onClick={() => setDecision("reject")}>暂不调整</button><button className="primary-button" onClick={() => setDecision("accept")}>接受调整并生成下一阶段 <span>→</span></button></div>
          ) : (
            <div className="success-banner"><span>{decision === "reject" ? "↺" : "✓"}</span><div><b>{decision === "accept" ? "成长罗盘已更新至 v2" : decision === "partial" ? "已按你的选择部分更新" : "已保留原计划"}</b><p>{decision === "reject" ? "本次建议不会写入正式画像，你可以继续完成原计划。" : "你还没有决定一生，但已经知道下一步要验证什么。"}</p></div><button className="ghost-button" onClick={resetDemo}>重新演示</button></div>
          )}
        </section>
      )}
    </main>
  );
}
