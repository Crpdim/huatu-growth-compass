/* eslint-disable @next/next/no-img-element */

import styles from "./product-manual-page.module.css";

type ManualFeature = {
  id: string;
  title: string;
  description: string;
  images: Array<{ src: string; alt: string }>;
};

type ManualChapter = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  features: ManualFeature[];
};

const chapters: ManualChapter[] = [
  {
    id: "planning",
    number: "01",
    eyebrow: "成长规划",
    title: "做更懂你的 AI 成长管家",
    summary: "从互动体验开始补充真实信息，逐步形成可解释的八维画像，再连接适合参考的成长路径与人生案例。",
    features: [
      {
        id: "life-game",
        title: "用户画像初建 · 模拟人生",
        description: "用一局模拟人生替代枯燥的冷启动问卷。用户在情境选择中表达偏好，AI 将游戏线索作为交流起点，再通过真实信息确认建立画像。",
        images: [
          { src: "planning-life-1.png", alt: "模拟人生产品入口" },
          { src: "planning-life-2.png", alt: "模拟人生身份建档" },
          { src: "planning-life-3.png", alt: "模拟人生情境选择" },
          { src: "planning-life-4.png", alt: "模拟人生阶段结果" },
        ],
      },
      {
        id: "data-sources",
        title: "多渠道信息补充",
        description: "在用户授权的前提下，支持简历、学习记录、账号内容和可穿戴设备摘要等多种信息来源，为能力分析与职业路径规划补充可追溯的真实依据。",
        images: [
          { src: "planning-data-1.png", alt: "多渠道信息补充页面" },
          { src: "planning-data-2.png", alt: "用户授权信息来源" },
        ],
      },
      {
        id: "profile",
        title: "八维能力分析",
        description: "从性格适配、专业能力、兴趣匹配、学习与知识、抗压与情绪、沟通协作、健康情况和家庭情况八个维度，帮助用户看清当前状态、证据来源与信息缺口。",
        images: [
          { src: "planning-profile.png", alt: "八维成长画像分析" },
        ],
      },
      {
        id: "role-model",
        title: "人生榜样参考",
        description: "榜样推荐以画像与路径的匹配程度为核心，而不是简单比较知名度。用户可以查看相似背景下的真实轨迹、关键选择与行动节点。",
        images: [
          { src: "planning-role-model-1.png", alt: "人生榜样匹配结果" },
          { src: "planning-role-model-2.png", alt: "榜样人生轨迹与关键节点" },
        ],
      },
    ],
  },
  {
    id: "management",
    number: "02",
    eyebrow: "成长管理",
    title: "让合理的规划真正落地",
    summary: "计划、任务、课程与提醒共享同一份状态。用户既能自主增删改，也能随时让 AI 帮助拆解、查询与校准。",
    features: [
      {
        id: "weekly-plan",
        title: "方向与本周计划",
        description: "核心成长管家通过一问一答理解用户的最新选择，并把方向转化为本周可执行、可反馈、带完成标准的小任务。",
        images: [
          { src: "management-plan-1.png", alt: "方向与本周计划对话" },
          { src: "management-plan-2.png", alt: "AI 更新任务计划" },
        ],
      },
      {
        id: "course-help",
        title: "课程答疑",
        description: "关联用户授权的华图学习记录，在对话中提供课程答疑、知识解释和学习资源推荐，让学习结果继续回流任务与画像。",
        images: [
          { src: "management-course.png", alt: "华图课程答疑对话" },
        ],
      },
      {
        id: "tasks",
        title: "当前任务进展",
        description: "任务页集中展示完成状态、优先级、时间投入和加权进度。每项任务都可自主编辑，也可唤起 AI 进行拆解或查找官方网址。",
        images: [
          { src: "management-tasks-1.png", alt: "任务进展总览" },
          { src: "management-tasks-2.png", alt: "任务清单与优先级" },
          { src: "management-tasks-3.png", alt: "AI 任务助手" },
        ],
      },
      {
        id: "alerts",
        title: "实时提醒",
        description: "围绕报名、材料、考试与阶段任务等关键节点提供提醒，并将高风险事项带回当前对话处理，避免提醒与行动相互割裂。",
        images: [
          { src: "management-reminder.png", alt: "关键节点提醒" },
        ],
      },
      {
        id: "review",
        title: "本周回顾",
        description: "Agent 在当前会话中回顾本周任务完成情况，区分事实、原因与下一步调整，让用户能看懂计划发生了什么变化。",
        images: [
          { src: "management-review.png", alt: "本周回顾对话" },
        ],
      },
    ],
  },
  {
    id: "agents",
    number: "03",
    eyebrow: "1 + N Agent",
    title: "一个入口，多个专业能力协同",
    summary: "用户只与核心成长管家交互。管家负责理解需求、管理上下文和解释下一步，专业 Agent 在后台按需提供画像、规划、任务、复盘与提醒能力。",
    features: [
      {
        id: "agent-system",
        title: "核心成长管家统筹的多 Agent 架构",
        description: "各专业 Agent 共享经过授权的画像证据、任务记录和计划版本，通过统一调度完成意图路由、信息读取、工具调用与结果校验；重大方向调整仍由用户最终确认。",
        images: [
          { src: "agent-architecture.png", alt: "核心成长管家与专业 Agent 协作架构" },
        ],
      },
    ],
  },
];

type ProductManualPageProps = {
  basePath: string;
};

export function ProductManualPage({ basePath }: ProductManualPageProps) {
  const asset = (name: string) => `${basePath}/manual/${name}`;
  const experienceUrl = `${basePath}/?experience=life-game`;

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href={`${basePath}/`} aria-label="返回职途有声宣传首页">
          <img src={`${basePath}/logo.png`} alt="" width="42" height="42" />
          <span><b>职途有声</b><small>PRODUCT MANUAL</small></span>
        </a>
        <nav aria-label="使用手册章节">
          <a href="#planning">成长规划</a>
          <a href="#management">成长管理</a>
          <a href="#agents">多 Agent</a>
        </nav>
        <a className={styles.navAction} href={experienceUrl}>开始体验 <span>↗</span></a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className={styles.kicker}>职途有声 · 产品使用手册</p>
        <h1>从一次人生体验，<br />到一套持续成长计划</h1>
        <p className={styles.heroSummary}>认识自己、探索方向、安排任务、跟踪行动。一个 AI 成长管家，把每一次选择连接成下一步。</p>
        <div className={styles.heroStats}>
          <span><b>AI</b> 越来越懂你</span>
          <span><b>规划</b> 越来越合理</span>
          <span><b>目标</b> 越来越靠近</span>
        </div>
        <div className={styles.chapterLinks}>
          {chapters.map((chapter) => (
            <a href={`#${chapter.id}`} key={chapter.id}>
              <span>{chapter.number}</span>
              <b>{chapter.eyebrow}</b>
              <small>{chapter.title}</small>
              <i>↓</i>
            </a>
          ))}
        </div>
      </section>

      <div className={styles.content}>
        {chapters.map((chapter) => (
          <section className={styles.chapter} id={chapter.id} key={chapter.id}>
            <header className={styles.chapterHeader}>
              <span>{chapter.number}</span>
              <div>
                <p>{chapter.eyebrow}</p>
                <h2>{chapter.title}</h2>
              </div>
              <p className={styles.chapterSummary}>{chapter.summary}</p>
            </header>

            <div className={styles.featureList}>
              {chapter.features.map((feature, featureIndex) => (
                <article className={styles.feature} id={feature.id} key={feature.id}>
                  <header className={styles.featureHeader}>
                    <span>{String(featureIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <p>{chapter.eyebrow}</p>
                      <h3>{feature.title}</h3>
                    </div>
                  </header>
                  <p className={styles.featureDescription}>{feature.description}</p>
                  <div className={styles.gallery} data-count={feature.images.length}>
                    {feature.images.map((image) => (
                      <figure key={image.src}>
                        <a href={asset(image.src)} target="_blank" rel="noreferrer" aria-label={`查看大图：${image.alt}`}>
                          <img src={asset(image.src)} alt={image.alt} loading="lazy" />
                        </a>
                        <figcaption>{image.alt}<span>查看大图 ↗</span></figcaption>
                      </figure>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className={styles.finalCta}>
        <p>手册看完了，下一步亲自体验。</p>
        <h2>从模拟一种人生开始，<br />让 AI 逐步认识真实的你。</h2>
        <div>
          <a href={experienceUrl}>进入模拟人生 <span>↗</span></a>
          <a href={`${basePath}/`}>返回宣传首页</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>职途有声 · AI 大学生成长实验系统</span>
        <span>产品功能介绍</span>
      </footer>
    </main>
  );
}
