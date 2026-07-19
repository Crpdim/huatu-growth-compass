import type { PointerEventHandler, RefObject } from "react";
import type { PurposeId, QuizOption, Stage } from "../demo-types";

type Purpose = {
  id: PurposeId;
  icon: string;
  title: string;
  description: string;
  signal: string;
  tag: string;
};

type Question = { eyebrow: string; title: string; options: QuizOption[] };
type InterpretationStep = { label: string; detail: string };

type ExplorationPagesProps = {
  stage: Stage;
  landingVisualRef: RefObject<HTMLDivElement | null>;
  onLandingPointerMove: PointerEventHandler<HTMLDivElement>;
  onLandingPointerLeave: () => void;
  isLaunching: boolean;
  onStartJourney: () => void;
  onEnterManagement: () => void;
  lifePurposes: Purpose[];
  selectedPurpose: PurposeId | null;
  onSelectPurpose: (purpose: PurposeId) => void;
  onSetStage: (stage: Stage) => void;
  purpose: Purpose;
  quizIndex: number;
  questions: Question[];
  quizProgress: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answer: number) => void;
  onSkipQuestion: () => void;
  onNextQuestion: () => void;
  answers: number[];
  interpretationStep: number;
  interpretationSteps: InterpretationStep[];
};

export function ExplorationPages({
  stage,
  landingVisualRef,
  onLandingPointerMove,
  onLandingPointerLeave,
  isLaunching,
  onStartJourney,
  onEnterManagement,
  lifePurposes,
  selectedPurpose,
  onSelectPurpose,
  onSetStage,
  purpose,
  quizIndex,
  questions,
  quizProgress,
  selectedAnswer,
  onSelectAnswer,
  onSkipQuestion,
  onNextQuestion,
  answers,
  interpretationStep,
  interpretationSteps,
}: ExplorationPagesProps) {
  if (stage === "landing") {
    return (
      <section className="landing-page">
        <div className="landing-copy">
          <div className="eyebrow-pill">✦ 给还没想好未来的你</div>
          <h1>你<span>迷茫</span>吗？</h1>
          <p className="landing-lead">大家好像都在往前走，而你还在考研、公考和实习之间反复横跳。人生答案可以慢慢来，先花 3 分钟看看哪种未来值得体验。</p>
          <div className="landing-actions">
            <button className={`primary-button ${isLaunching ? "is-launching" : ""}`} onClick={onStartJourney} aria-busy={isLaunching}>找到我最想解决的人生课题 <span>→</span></button>
            <button className="ghost-button landing-management-entry" onClick={onEnterManagement}>直接进入职图有声 <span>→</span></button>
          </div>
          <div className="principle-row">
            <div><b>01</b><span>选择由你确认</span></div>
            <div><b>02</b><span>每个判断有依据</span></div>
            <div><b>03</b><span>先体验再规划</span></div>
          </div>
        </div>
        <div className="landing-visual" ref={landingVisualRef} onPointerMove={onLandingPointerMove} onPointerLeave={onLandingPointerLeave} aria-label="林小北收到的未来提醒，移动鼠标可以观察不同方向的消息">
          <div className="orbital orbital-one" /><div className="orbital orbital-two" />
          <div className="compass-core"><div className="compass-needle" aria-hidden="true"><i /></div><span>N</span><strong>?</strong><small>正在寻找方向</small></div>
          <div className="floating-layer card-chat"><article className="floating-card"><div className="avatar purple">研</div><div><small>考研群 · 12 条新消息</small><b>目标院校都定了吗？</b></div></article></div>
          <div className="floating-layer card-offer"><article className="floating-card"><div className="avatar orange">聘</div><div><small>朋友圈</small><b>室友拿到第一份实习 Offer</b></div></article></div>
          <div className="floating-layer card-family"><article className="floating-card"><div className="avatar green">家</div><div><small>妈妈</small><b>要不要早点准备考公？</b></div></article></div>
          <div className="status-sticker">三个未来正在靠近…</div>
        </div>
      </section>
    );
  }

  if (stage === "purpose") {
    return (
      <section className="purpose-page">
        <div className="purpose-heading">
          <span className="section-kicker">00 · 人生课题</span>
          <h2>未来生活，<br />将会是怎样？</h2>
          <p>人生很长，允许我们慢一点。你未来希望拥有怎样的人生呢？</p>
        </div>
        <div className="purpose-grid" role="radiogroup" aria-label="选择当前最想解决的人生课题">
          {lifePurposes.map((item) => (
            <button className={selectedPurpose === item.id ? "is-selected" : ""} onClick={() => onSelectPurpose(item.id)} role="radio" aria-checked={selectedPurpose === item.id} key={item.id}>
              <span>{item.icon}</span>
              <div><strong>{item.title}</strong><small>{item.description}</small></div>
              <i>{selectedPurpose === item.id ? "✓" : "→"}</i>
            </button>
          ))}
        </div>
        <div className="purpose-footer">
          <p><b>不必着急，也不要有压力！</b> 有我们在 </p>
          <button className="primary-button" disabled={!selectedPurpose} onClick={() => onSetStage("quiz")}>先选择一个你想要的生活，我们慢慢来 <span>→</span></button>
        </div>
      </section>
    );
  }

  if (stage === "quiz") {
    const question = questions[quizIndex];
    return (
      <section className="quiz-page">
        <div className="quiz-aside">
          <span className="section-kicker">01 · 情境探索</span>
          <h2>这里没有标准答案。</h2>
          <p>你正想确定的是：<b>{purpose.title}</b>。这些情境会补充选择依据，职业方向会在事实信息确认后再推演。</p>
          <div className="quiz-count"><strong>{String(quizIndex + 1).padStart(2, "0")}</strong><span>/ {String(questions.length).padStart(2, "0")}</span></div>
        </div>
        <div className="quiz-card">
          <div className="progress-track"><i style={{ width: `${quizProgress}%` }} /></div>
          <span className="question-eyebrow">{question.eyebrow}</span>
          <h3>{question.title}</h3>
          <div className="option-list" role="radiogroup" aria-label="选择最接近的回答">
            {question.options.map((option, index) => (
              <button key={option.label} className={selectedAnswer === index ? "is-selected" : ""} onClick={() => onSelectAnswer(index)} role="radio" aria-checked={selectedAnswer === index}>
                <span>{String.fromCharCode(65 + index)}</span>{option.label}<i>{selectedAnswer === index ? "✓" : ""}</i>
              </button>
            ))}
          </div>
          <div className="quiz-footer">
            <div className="quiz-footer-actions">
              <button className="skip-button" onClick={onSkipQuestion}>暂时跳过</button>
              <button className="primary-button" onClick={onNextQuestion} disabled={selectedAnswer === null}>{quizIndex === questions.length - 1 ? "生成探索画像" : "下一题"} <span>→</span></button>
            </div>
            <small>答案仅用于本次 Demo，可随时重置</small>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "interpreting") {
    return (
      <section className="content-page interpretation-page">
        <div className="interpretation-heading">
          <span className="section-kicker">AI 正在整理刚才的回答</span>
          <h2>正在读懂你的选择方式…</h2>
          <p>这一轮只寻找重复出现的偏好，用来生成临时第一印象。专业能力会在补充学校和经历后分析。</p>
        </div>
        <article className="interpretation-card">
          <div className="interpretation-visual" aria-label="AI 正在从情境答案中提取选择线索">
            <div className="interpretation-ring ring-one" /><div className="interpretation-ring ring-two" />
            <span className="insight-chip insight-one">人生课题 · {purpose.tag}</span>
            <span className="insight-chip insight-two">现实条件</span>
            <span className="insight-chip insight-three">行动方式</span>
            <span className="insight-chip insight-four">生活期待</span>
            <div className="interpretation-core"><small>AI</small><strong>{Math.min(100, 18 + interpretationStep * 27)}%</strong><span>理解中</span></div>
          </div>
          <div className="interpretation-trace">
            <div className="interpretation-trace-top"><div><span>第一印象生成中</span><small>已读取 {answers.filter((answer) => answer >= 0).length} 条情境回答</small></div><b>V0</b></div>
            <div className="interpretation-step-list">
              {interpretationSteps.map((item, index) => {
                const isDone = index < interpretationStep;
                const isActive = index === interpretationStep && interpretationStep < interpretationSteps.length;
                return <div className={`${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`} key={item.label}><span>{isDone ? "✓" : `0${index + 1}`}</span><div><b>{item.label}</b><p>{item.detail}</p></div><i>{isDone ? "完成" : isActive ? "分析中" : "等待"}</i></div>;
              })}
            </div>
            <div className="interpretation-boundary"><b>本轮会得到什么？</b><p>一个帮助你理解选择方式的临时标签，以及几条等待确认的线索。</p></div>
            <div className="interpretation-footer"><span>完成后自动进入第一印象</span><button className="skip-button" onClick={() => onSetStage("result")}>跳过动画</button></div>
          </div>
        </article>
      </section>
    );
  }

  return null;
}
