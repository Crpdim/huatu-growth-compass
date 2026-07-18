"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Stage =
  | "landing"
  | "purpose"
  | "quiz"
  | "result"
  | "profile"
  | "positioning"
  | "futures"
  | "simulation"
  | "recalibration"
  | "plan";

type PathId = "public" | "job" | "postgrad";
type LifeDimension = "service" | "structure" | "boundary" | "reality";
type PurposeId = "steady" | "independent" | "growth" | "self" | "unclear";

type QuizOption = {
  label: string;
  signal: string;
  scores: Record<PathId, number>;
};

const journeySteps = [
  { label: "初始画像", short: "认识自己" },
  { label: "平行人生", short: "发现可能" },
  { label: "未来体验", short: "提前试走" },
  { label: "证据更新", short: "重新认识" },
  { label: "行动验证", short: "真实体验" },
];

const abilityDimensions = [
  { label: "性格适配度", value: 3.2, tag: "稳健有序", summary: "偏好规则清晰、节奏可控的环境，具体岗位适配度会在目标确认后重算。", evidence: "情境选择：稳定、规则与生活边界", confidence: "low", referenceOnly: true, color: "#6757e5" },
  { label: "专业能力", value: 2.4, tag: "基础起步", summary: "已完成一个课程项目，证书、实习、竞赛和代表作品仍有较大积累空间。", evidence: "资料填写：1 个课程项目，暂无实习", confidence: "medium", referenceOnly: true, color: "#8a72ed" },
  { label: "兴趣匹配度", value: 3.4, tag: "稳定导向", summary: "稳定、自主和地域是当前较明显的偏好，职业兴趣还需要真实任务验证。", evidence: "人生课题 + 情境偏好选择", confidence: "low", referenceOnly: true, color: "#ff8a55" },
  { label: "学习与知识", value: 3.1, tag: "基础达标", summary: "本科专业基础处于中游，具备继续学习的起点，持续学习成果仍待补充。", evidence: "资料填写：本科大二、专业成绩中游", confidence: "medium", referenceOnly: false, color: "#d9b63e" },
  { label: "压力应对", value: 2.8, tag: "恢复待验", summary: "计划受阻时有调整意识，持续高压下的稳定表现目前缺少行为证据。", evidence: "计划中断与现实取舍情境", confidence: "low", referenceOnly: false, color: "#2d9f7f" },
  { label: "沟通协作", value: 3.0, tag: "协作达标", summary: "具备课程项目协作基础，表达、冲突处理和协调能力仍缺外部反馈。", evidence: "课程项目经历 + 情境选择", confidence: "low", referenceOnly: false, color: "#4778df" },
];

const lifePurposes: { id: PurposeId; icon: string; title: string; description: string; signal: string; tag: string }[] = [
  { id: "steady", icon: "稳", title: "找到一种可预期的生活", description: "希望工作、城市和生活节奏更确定，也能照顾家人。", signal: "你当前最想先解决生活稳定性与地域确定性", tag: "稳定让我走得更远" },
  { id: "independent", icon: "立", title: "尽快实现经济独立", description: "想减少家庭压力，拥有不依赖别人做选择的底气。", signal: "你当前把经济独立和自主选择权放在优先位置", tag: "先获得选择权" },
  { id: "growth", icon: "升", title: "获得更快的成长上升", description: "想继续往上走，让能力、收入和平台都持续成长。", signal: "你当前更关心成长速度与长期上升空间", tag: "成长要看得见" },
  { id: "self", icon: "我", title: "做一次真正属于自己的选择", description: "想听清自己的声音，减少同学、家人和热门路线的影响。", signal: "你当前最想确认哪种选择真正属于自己", tag: "人生自己作答" },
  { id: "unclear", icon: "?", title: "我还说不清，只想先走一步", description: "暂时没有答案，希望从一件小事开始积累真实体验。", signal: "你当前需要一个低成本起点，先积累真实体验", tag: "先走一步" },
];

const questions: { eyebrow: string; title: string; options: QuizOption[] }[] = [
  {
    eyebrow: "毕业路口",
    title: "室友开始准备考研、公考和实习，而你还没想好。你会先做什么？",
    options: [
      { label: "先了解家乡和省会有哪些稳定岗位", signal: "地域与稳定是你会优先确认的现实条件", scores: { public: 3, job: 0, postgrad: 1 } },
      { label: "先投几份实习，用真实工作找方向", signal: "你倾向用企业实践快速验证选择", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "先看看继续读研能打开哪些可能", signal: "你愿意通过继续学习延长能力积累", scores: { public: 0, job: 0, postgrad: 3 } },
      { label: "把三条路都收藏起来，晚点再决定", signal: "你希望保留可能，但容易停在信息搜集阶段", scores: { public: 1, job: 1, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "理想生活",
    title: "如果工作五年后回头看，你最希望自己获得什么？",
    options: [
      { label: "生活可预期，也能照顾家人", signal: "你重视确定性、地域与生活边界", scores: { public: 3, job: 0, postgrad: 1 } },
      { label: "收入和能力都快速增长", signal: "你更看重成长速度和成果回报", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "在专业领域形成真正的积累", signal: "你在意长期专业深度", scores: { public: 0, job: 1, postgrad: 3 } },
      { label: "先有选择权，不被任何路线困住", signal: "你看重自主性，需要保留转轨空间", scores: { public: 1, job: 2, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "任务偏好",
    title: "周末可以体验一种陌生任务，你更愿意先试哪一种？",
    options: [
      { label: "从一堆材料里找规律，给出有依据的结论", signal: "你愿意尝试规则明确的信息分析任务", scores: { public: 3, job: 1, postgrad: 1 } },
      { label: "做一个能运行的小产品或功能", signal: "你偏好做出可见、可运行的成果", scores: { public: 0, job: 3, postgrad: 1 } },
      { label: "深入研究一个问题并写成报告", signal: "你愿意为一个问题进行持续研究", scores: { public: 1, job: 0, postgrad: 3 } },
      { label: "先听三个过来人讲真实经历", signal: "你习惯借助案例降低试错成本", scores: { public: 2, job: 1, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "计划中断",
    title: "学习计划第三天就被课程和社团打断，你通常会：",
    options: [
      { label: "缩小任务，先保住每天最低进度", signal: "你有一定的节奏调整意识", scores: { public: 2, job: 1, postgrad: 2 } },
      { label: "换成一个更有成果感的小项目", signal: "可见成果更容易驱动你继续行动", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "重新整理资料，做一份更完整的计划", signal: "你重视系统准备，但要警惕计划过载", scores: { public: 2, job: 0, postgrad: 2 } },
      { label: "先停下来，等状态好一点再开始", signal: "当前行动启动仍需要更小的第一步", scores: { public: 0, job: 0, postgrad: 0 } },
    ],
  },
  {
    eyebrow: "现实取舍",
    title: "三份机会同时出现，你会优先认真了解哪一份？",
    options: [
      { label: "离家近、稳定，但成长节奏慢一些", signal: "地域和稳定在你的排序中靠前", scores: { public: 3, job: 0, postgrad: 0 } },
      { label: "收入较高、成长快，但工作强度大", signal: "你愿意为成长速度承担更高强度", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "继续学习两三年，再进入更专业的领域", signal: "你能接受较长的学习投入周期", scores: { public: 0, job: 0, postgrad: 3 } },
      { label: "先比较每条路最坏会发生什么", signal: "你需要先看见风险和转轨成本", scores: { public: 1, job: 1, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "外部期待",
    title: "家人说“稳定最重要”，而你还不确定。你更接近：",
    options: [
      { label: "先把稳定路线纳入选择，不急着否定", signal: "你愿意认真考虑稳定路线，但还需要形成自己的理由", scores: { public: 3, job: 0, postgrad: 1 } },
      { label: "先用实习证明自己能走另一条路", signal: "你希望通过成果建立自主选择权", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "先提升学历，再和家人讨论长期选择", signal: "你把升学视为扩大选择范围的方式", scores: { public: 0, job: 0, postgrad: 3 } },
      { label: "把自己的顾虑说清楚，再一起比较", signal: "你愿意协商现实约束，同时保留自己的判断", scores: { public: 2, job: 1, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "面对规则",
    title: "一项任务流程很多、标准明确，还需要反复核对，你会：",
    options: [
      { label: "按流程拆开完成，正确比快更重要", signal: "你对规则型任务有一定耐受度", scores: { public: 3, job: 1, postgrad: 1 } },
      { label: "先找工具自动化重复步骤", signal: "你倾向用技术改善流程", scores: { public: 1, job: 3, postgrad: 0 } },
      { label: "先理解规则为什么这样设计", signal: "你更关注规则背后的原理", scores: { public: 1, job: 0, postgrad: 3 } },
      { label: "如果长期重复，我可能很难坚持", signal: "重复性工作可能影响你的持续投入", scores: { public: 0, job: 2, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "现在最怕",
    title: "如果只能先解决一个问题，你此刻最担心什么？",
    options: [
      { label: "选错方向，投入很久后才后悔", signal: "一次低成本体验可以帮你降低押注风险", scores: { public: 1, job: 1, postgrad: 1 } },
      { label: "起步太晚，错过关键准备窗口", signal: "你关注时间窗口，需要尽快补足路径信息", scores: { public: 2, job: 1, postgrad: 2 } },
      { label: "能力不够，即使努力也没有结果", signal: "你需要用一次小任务获得能力基线", scores: { public: 1, job: 1, postgrad: 1 } },
      { label: "信息太多，不知道第一步从哪开始", signal: "当前最大的阻力是信息没有变成行动", scores: { public: 2, job: 1, postgrad: 1 } },
    ],
  },
];

const pathData: Record<PathId, {
  name: string;
  icon: string;
  tone: string;
  summary: string;
  evidence: string[];
  gap: string;
}> = {
  public: {
    name: "体制内人生",
    icon: "公",
    tone: "green",
    summary: "稳定、地域与规则型任务与你当前表达的生活期待存在连接。",
    evidence: ["希望留在省会或家乡附近", "重视生活的可预期性", "愿意尝试规则明确的信息任务"],
    gap: "你对真实岗位内容、收入节奏和临时任务仍停留在想象。",
  },
  job: {
    name: "企业职场人生",
    icon: "职",
    tone: "violet",
    summary: "计算机专业和课程项目为企业求职保留了现实入口。",
    evidence: ["专业与技术岗位相关", "做过课程项目", "愿意通过成果验证能力"],
    gap: "缺少真实项目、实习体验和对工作强度的判断。",
  },
  postgrad: {
    name: "继续升学人生",
    icon: "研",
    tone: "blue",
    summary: "继续学习可能扩大选择范围，但当前研究动机仍不清晰。",
    evidence: ["专业基础中等", "愿意进行长期投入", "仍希望保留职业选择"],
    gap: "需要区分专业兴趣、学历需求和暂缓选择三种动机。",
  },
};

const promptAnswers: Record<string, string> = {
  "上岸后真的都是朝九晚五吗？": "岗位、地区和阶段差异很大。稳定岗位也会遇到材料、协调、窗口服务和临时任务。体验几个具体场景，能让你更准确地理解“稳定”。",
  "基层岗位每天在做什么？": "可能涉及政策落实、材料整理、群众沟通、部门协调和突发事项。真正要验证的是：你是否能接受规则、服务和重复沟通共同构成的工作。",
  "家乡岗和异地岗怎么选？": "建议一起比较竞争热度、生活成本、家庭支持、岗位内容，以及你长期留下的意愿。",
  "如果考了两年还没上岸呢？": "规划需要提前设置止损点和可迁移能力。备考过程中形成的阅读、写作、资料分析和表达能力，也应能服务其他路径。",
};

const lifeScenes: {
  time: string;
  chapter: string;
  title: string;
  story: string;
  message: string;
  options: { label: string; signal: string; delta: Partial<Record<LifeDimension, number>> }[];
}[] = [
  {
    time: "入职第 21 天 · 17:26",
    chapter: "第一幕 · 工作内容",
    title: "下班前，临时任务来了",
    story: "你正准备收拾东西，工作群里突然发来消息：需要协调三个部门，今晚完成一份情况汇总。朋友已经在楼下等你吃饭。",
    message: "办公室：这份材料比较急，数据口径记得和三个部门确认。",
    options: [
      { label: "先确认优先级和完成标准，再逐个协调", signal: "你愿意在规则内主动澄清任务", delta: { structure: 8, reality: 6 } },
      { label: "取消聚会，先一个人把材料全部做完", signal: "你能承担临时任务，但工作边界可能被压缩", delta: { structure: 5, boundary: -6, reality: 5 } },
      { label: "心里落差很大：原来稳定也会加班", signal: "你开始理解稳定岗位的真实工作节奏", delta: { reality: 10, boundary: 3 } },
    ],
  },
  {
    time: "入职第 47 天 · 10:15",
    chapter: "第二幕 · 群众沟通",
    title: "对方不接受你的解释",
    story: "一位办事群众因为材料不全往返两次，情绪很激动。规定不能绕开，但对方确实遇到了困难。",
    message: "群众：我都跑两趟了，你们到底能不能一次说清楚？",
    options: [
      { label: "先听完问题，再把缺失材料和替代办法写清楚", signal: "你愿意在规则内提供具体帮助", delta: { service: 10, structure: 6 } },
      { label: "严格按规定回复，避免承担额外风险", signal: "你重视边界和合规，但服务主动性仍待验证", delta: { structure: 9, service: -2 } },
      { label: "请有经验的同事一起处理，并记录这次问题", signal: "你愿意求助并把个案变成经验", delta: { service: 6, reality: 7 } },
    ],
  },
  {
    time: "入职第 100 天 · 20:38",
    chapter: "第三幕 · 同龄比较",
    title: "室友升职加薪了",
    story: "大学室友晒出晋升消息，收入增长很快。你的生活更可预期，但成长速度与想象不同。",
    message: "朋友圈：加入新团队，继续冲！感谢这一年的全力以赴。",
    options: [
      { label: "有点羡慕，但我更看重现在的生活节奏", signal: "稳定与生活节奏仍是你的主动选择", delta: { boundary: 9, reality: 7 } },
      { label: "开始担心自己会不会失去成长空间", signal: "长期成长依然是你的重要需求", delta: { reality: 9, boundary: -2 } },
      { label: "给自己安排一项长期学习计划", signal: "你希望在稳定环境中继续积累", delta: { structure: 6, boundary: 5 } },
    ],
  },
  {
    time: "入职第 180 天 · 周六",
    chapter: "第四幕 · 人生答案",
    title: "这就是你想要的“岸”吗？",
    story: "半年过去，你有过正常下班的傍晚，也遇到过临时任务和复杂沟通。稳定是真的，具体而琐碎也是真的。",
    message: "成长罗盘：现在回头看，你为什么想上岸？",
    options: [
      { label: "我能接受这些代价，这种生活值得继续了解", signal: "体制内生活从想象变成了可接受的具体选择", delta: { service: 6, reality: 10 } },
      { label: "稳定吸引我，但我还要了解具体岗位", signal: "你需要把抽象方向落实到岗位层面", delta: { reality: 10, structure: 4 } },
      { label: "和想象不同，我想把其他人生也保留下来", signal: "你愿意基于体验修正原有期待", delta: { reality: 12, boundary: 6 } },
    ],
  },
];

const planTasks = [
  { day: "DAY 1", title: "筛选 10 个真实可报岗位", resource: "岗位筛选清单", criteria: "记录专业、学历、地域、岗位内容与限制条件" },
  { day: "DAY 3", title: "完成 30 分钟行测体验", resource: "华图行测体验题", criteria: "完成资料分析与判断推理各一组，并记录真实感受" },
  { day: "DAY 5", title: "拆解一份基层岗位工作记录", resource: "岗位认知卡", criteria: "写下能接受、不能接受和仍想追问的各 1 项" },
  { day: "DAY 7", title: "确认是否进入正式考公规划", resource: "AI 周复盘", criteria: "选择继续探索、保留观察或暂不考虑，并说明依据" },
];

const stageRank: Record<Stage, number> = {
  landing: 0,
  purpose: 0,
  quiz: 0,
  result: 1,
  profile: 1,
  positioning: 1,
  futures: 2,
  simulation: 3,
  recalibration: 4,
  plan: 5,
};

export default function Home() {
  const landingVisualRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>("landing");
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeId | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [consent, setConsent] = useState(true);
  const [resumeName, setResumeName] = useState("");
  const [activePrompt, setActivePrompt] = useState(Object.keys(promptAnswers)[0]);
  const [lifeIndex, setLifeIndex] = useState(0);
  const [lifeAnswers, setLifeAnswers] = useState<number[]>([]);
  const [selectedLifeAnswer, setSelectedLifeAnswer] = useState<number | null>(null);
  const [reaction, setReaction] = useState("");
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [signalReviews, setSignalReviews] = useState<Record<number, "confirmed" | "rejected">>({});

  const currentRank = stageRank[stage];
  const quizProgress = ((quizIndex + 1) / questions.length) * 100;
  const lifeProgress = ((lifeIndex + 1) / lifeScenes.length) * 100;

  const profileSignals = useMemo(
    () => answers
      .map((answer, index) => answer >= 0 ? questions[index]?.options[answer]?.signal : null)
      .filter((signal): signal is string => Boolean(signal))
      .slice(0, 4),
    [answers],
  );

  const purpose = lifePurposes.find((item) => item.id === selectedPurpose) ?? lifePurposes[4];
  const radarPoints = abilityDimensions.map((item, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / abilityDimensions.length);
    const radius = (item.value / 5) * 42;
    return `${50 + Math.cos(angle) * radius}% ${50 + Math.sin(angle) * radius}%`;
  }).join(", ");
  const resultSignals = useMemo(() => [
    { text: purpose.signal, source: "人生课题 · 用户主动选择", confidence: "high" },
    ...profileSignals.slice(0, 3).map((text, index) => ({ text, source: `情境回答 ${String(index + 1).padStart(2, "0")}`, confidence: index === 0 ? "medium" : "low" })),
  ], [profileSignals, purpose]);

  const lifeStats = useMemo(() => {
    const stats: Record<LifeDimension, number> = { service: 44, structure: 58, boundary: 52, reality: 36 };
    lifeAnswers.forEach((answer, index) => {
      const option = lifeScenes[index]?.options[answer];
      if (!option) return;
      (Object.keys(option.delta) as LifeDimension[]).forEach((key) => {
        stats[key] = Math.max(12, Math.min(92, stats[key] + (option.delta[key] ?? 0)));
      });
    });
    return stats;
  }, [lifeAnswers]);

  const lifeEvidence = lifeAnswers
    .map((answer, index) => lifeScenes[index]?.options[answer]?.signal)
    .filter(Boolean) as string[];

  const planProgress = Math.round((completedTasks.length / planTasks.length) * 100);

  function resetDemo() {
    setStage("landing");
    setSelectedPurpose(null);
    setQuizIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setConsent(true);
    setResumeName("");
    setActivePrompt(Object.keys(promptAnswers)[0]);
    setLifeIndex(0);
    setLifeAnswers([]);
    setSelectedLifeAnswer(null);
    setReaction("");
    setCompletedTasks([]);
    setSignalReviews({});
  }

  function restartPurpose() {
    setSelectedPurpose(null);
    setQuizIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSignalReviews({});
    setStage("purpose");
  }

  function nextQuestion() {
    if (selectedAnswer === null) return;
    setAnswers((current) => [...current, selectedAnswer]);
    setSelectedAnswer(null);
    if (quizIndex === questions.length - 1) {
      setStage("result");
    } else {
      setQuizIndex((current) => current + 1);
    }
  }

  function skipQuestion() {
    setAnswers((current) => [...current, -1]);
    setSelectedAnswer(null);
    if (quizIndex === questions.length - 1) {
      setStage("result");
    } else {
      setQuizIndex((current) => current + 1);
    }
  }

  function nextLifeScene() {
    if (selectedLifeAnswer === null) return;
    setLifeAnswers((current) => [...current, selectedLifeAnswer]);
    setSelectedLifeAnswer(null);
    if (lifeIndex === lifeScenes.length - 1) {
      setStage("recalibration");
    } else {
      setLifeIndex((current) => current + 1);
    }
  }

  function toggleTask(index: number) {
    setCompletedTasks((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index]);
  }

  function handleLandingPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const visual = landingVisualRef.current;
    if (!visual) return;
    const rect = visual.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));

    visual.style.setProperty("--pointer-x", `${(x + 1) * 50}%`);
    visual.style.setProperty("--pointer-y", `${(y + 1) * 50}%`);
    visual.style.setProperty("--scene-x", `${x * 8}px`);
    visual.style.setProperty("--scene-y", `${y * 7}px`);
    visual.style.setProperty("--chat-x", `${x * 24}px`);
    visual.style.setProperty("--chat-y", `${y * 18}px`);
    visual.style.setProperty("--offer-x", `${x * -17}px`);
    visual.style.setProperty("--offer-y", `${y * -13}px`);
    visual.style.setProperty("--family-x", `${x * 19}px`);
    visual.style.setProperty("--family-y", `${y * 15}px`);
    visual.style.setProperty("--sticker-x", `${x * -25}px`);
    visual.style.setProperty("--sticker-y", `${y * -18}px`);
    visual.style.setProperty("--tilt-x", `${y * -5}deg`);
    visual.style.setProperty("--tilt-y", `${x * 6}deg`);
  }

  function resetLandingPointer() {
    const visual = landingVisualRef.current;
    if (!visual) return;
    ["--scene-x", "--scene-y", "--chat-x", "--chat-y", "--offer-x", "--offer-y", "--family-x", "--family-y", "--sticker-x", "--sticker-y"].forEach((property) => visual.style.setProperty(property, "0px"));
    visual.style.setProperty("--pointer-x", "50%");
    visual.style.setProperty("--pointer-y", "50%");
    visual.style.setProperty("--tilt-x", "0deg");
    visual.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <main className={`app-shell stage-${stage}`}>
      <header className="topbar">
        <button className="brand" onClick={resetDemo} aria-label="返回首页">
          <span className="brand-mark"><img src={`${basePath}/logo.png`} alt="" /></span>
          <span><strong>华图成长罗盘</strong><small>GROWTH COMPASS</small></span>
        </button>
        <div className="topbar-actions">
          {stage !== "landing" && <button className="ghost-button compact" onClick={resetDemo}>↻ 重置 Demo</button>}
        </div>
      </header>

      {stage !== "landing" && stage !== "purpose" && stage !== "quiz" && (
        <nav className="journey-nav" aria-label="体验进度">
          {journeySteps.map((item, index) => {
            const rank = index + 1;
            return (
              <div className={`journey-step ${rank <= currentRank ? "is-active" : ""} ${rank < currentRank ? "is-done" : ""}`} key={item.label}>
                <span>{rank < currentRank ? "✓" : `0${rank}`}</span>
                <div><small>{item.short}</small><strong>{item.label}</strong></div>
              </div>
            );
          })}
        </nav>
      )}

      {stage === "landing" && (
        <section className="landing-page">
          <div className="landing-copy">
            <div className="eyebrow-pill">✦ 给还没想好未来的你</div>
            <h1>你<span>迷茫</span>吗？</h1>
            <p className="landing-lead">大家好像都在往前走，而你还在考研、公考和实习之间反复横跳。人生答案可以慢慢来，先花 3 分钟看看哪种未来值得体验。</p>
            <div className="landing-actions">
              <button className="primary-button" onClick={() => setStage("purpose")}>找到我最想解决的人生课题 <span>→</span></button>
              <span>1 个课题锚点 + 8 道人生情境</span>
            </div>
            <div className="principle-row">
              <div><b>01</b><span>选择由你确认</span></div>
              <div><b>02</b><span>每个判断有依据</span></div>
              <div><b>03</b><span>先体验再规划</span></div>
            </div>
          </div>
          <div className="landing-visual" ref={landingVisualRef} onPointerMove={handleLandingPointerMove} onPointerLeave={resetLandingPointer} aria-label="林小北收到的未来提醒，移动鼠标可以观察不同方向的消息">
            <div className="orbital orbital-one" /><div className="orbital orbital-two" />
            <div className="compass-core"><span>N</span><strong>?</strong><small>下一步在哪</small></div>
            <div className="floating-layer card-chat"><article className="floating-card"><div className="avatar purple">研</div><div><small>考研群 · 12 条新消息</small><b>目标院校都定了吗？</b></div></article></div>
            <div className="floating-layer card-offer"><article className="floating-card"><div className="avatar orange">聘</div><div><small>朋友圈</small><b>室友拿到第一份实习 Offer</b></div></article></div>
            <div className="floating-layer card-family"><article className="floating-card"><div className="avatar green">家</div><div><small>妈妈</small><b>要不要早点准备考公？</b></div></article></div>
            <div className="status-sticker">三个未来正在靠近…</div>
          </div>
        </section>
      )}

      {stage === "purpose" && (
        <section className="purpose-page">
          <div className="purpose-heading">
            <span className="section-kicker">00 · 人生课题</span>
            <h2>未来生活，<br />将会是怎样？</h2>
            <p>人生很长，允许我们慢一点。你未来希望拥有怎样的人生呢？</p>
          </div>
          <div className="purpose-grid" role="radiogroup" aria-label="选择当前最想解决的人生课题">
            {lifePurposes.map((item) => (
              <button
                className={selectedPurpose === item.id ? "is-selected" : ""}
                onClick={() => setSelectedPurpose(item.id)}
                role="radio"
                aria-checked={selectedPurpose === item.id}
                key={item.id}
              >
                <span>{item.icon}</span>
                <div><strong>{item.title}</strong><small>{item.description}</small></div>
                <i>{selectedPurpose === item.id ? "✓" : "→"}</i>
              </button>
            ))}
          </div>
          <div className="purpose-footer">
            <p><b>不必着急，也不要有压力！</b> 有我们在 </p>
            <button className="primary-button" disabled={!selectedPurpose} onClick={() => setStage("quiz")}>先选择一个你想要的生活，我们慢慢来 <span>→</span></button>
          </div>
        </section>
      )}

      {stage === "quiz" && (
        <section className="quiz-page">
          <div className="quiz-aside">
            <span className="section-kicker">01 · 情境探索</span>
            <h2>这里没有标准答案。</h2>
            <p>你正想确定的是：<b>{purpose.title}</b>。这些情境会补充选择依据，职业方向会在事实信息确认后再推演。</p>
            <div className="quiz-count"><strong>{String(quizIndex + 1).padStart(2, "0")}</strong><span>/ {String(questions.length).padStart(2, "0")}</span></div>
          </div>
          <div className="quiz-card">
            <div className="progress-track"><i style={{ width: `${quizProgress}%` }} /></div>
            <span className="question-eyebrow">{questions[quizIndex].eyebrow}</span>
            <h3>{questions[quizIndex].title}</h3>
            <div className="option-list" role="radiogroup" aria-label="选择最接近的回答">
              {questions[quizIndex].options.map((option, index) => (
                <button key={option.label} className={selectedAnswer === index ? "is-selected" : ""} onClick={() => setSelectedAnswer(index)} role="radio" aria-checked={selectedAnswer === index}>
                  <span>{String.fromCharCode(65 + index)}</span>{option.label}<i>{selectedAnswer === index ? "✓" : ""}</i>
                </button>
              ))}
            </div>
            <div className="quiz-footer">
              <div className="quiz-footer-actions">
                <button className="skip-button" onClick={skipQuestion}>暂时跳过</button>
                <button className="primary-button" onClick={nextQuestion} disabled={selectedAnswer === null}>{quizIndex === questions.length - 1 ? "生成探索画像" : "下一题"} <span>→</span></button>
              </div>
              <small>答案仅用于本次 Demo，可随时重置</small>
            </div>
          </div>
        </section>
      )}

      {stage === "result" && (
        <section className="content-page result-page">
          <div className="page-heading centered">
            <span className="section-kicker">探索画像 · v0</span>
            <h2>现实探索型</h2>
            <p>你想先解决“{purpose.title}”，同时也会参考现实条件再选择路线。</p>
          </div>
          <div className="result-grid">
            <article className="share-card">
              <div className="share-top"><span>YOUR GROWTH SIGNAL</span><b>V0 · EXPLORING</b></div>
              <div className="type-symbol"><span>REALITY</span><strong>↗</strong></div>
              <h3>现实探索型</h3>
              <p>你的目的锚点是“{purpose.title}”。接下来需要看清不同生活的收益、代价与第一步。</p>
              <div className="share-tags"><span># {purpose.tag}</span><span># 选择要有依据</span><span># 先体验再押注</span></div>
              <footer><b>华图成长罗盘</b><span>这是起点，结论会随经历更新</span></footer>
            </article>
            <article className="state-panel">
              <div className="panel-title"><div><span>本次选择透露的线索</span><small>每条线索都由你确认，也可以返回重选</small></div><b>v0</b></div>
              <div className="signal-list">
                {resultSignals.map((signal, index) => (
                  <div className={`signal-row ${signalReviews[index] === "rejected" ? "is-rejected" : ""}`} key={`${signal.text}-${index}`}>
                    <span>0{index + 1}</span>
                    <div><p>{signal.text}</p><small>{signal.source} · {signal.confidence}</small></div>
                    <div className="signal-review">
                      <button className={signalReviews[index] === "confirmed" ? "is-active" : ""} onClick={() => setSignalReviews((current) => ({ ...current, [index]: "confirmed" }))}>符合</button>
                      <button className={signalReviews[index] === "rejected" ? "is-active reject" : ""} onClick={() => setSignalReviews((current) => ({ ...current, [index]: "rejected" }))}>不准确</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="evidence-note"><b>信息还不够完整</b><p>小游戏记录了你的选择方式。学校、专业、经历和现实约束还需要由你补充并确认。</p></div>
            </article>
          </div>
          <div className="result-actions"><button className="ghost-button" onClick={restartPurpose}>重新选择人生课题</button><button className="primary-button" onClick={() => setStage("profile")}>补充事实，打开三种未来 <span>→</span></button></div>
          <p className="disclaimer">探索画像仅用于本次体验；长期成长档案需要你另行确认。</p>
        </section>
      )}

      {stage === "profile" && (
        <section className="content-page profile-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">补充事实与授权</span><h2>让选择有现实坐标</h2></div>
            <p>以下使用虚构学生“林小北”的预置资料。你可以修改、跳过简历，或撤回授权。</p>
          </div>
          <div className="profile-layout">
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); if (consent) setStage("positioning"); }}>
              <div className="form-row"><label>学校<input defaultValue="某普通本科高校" /></label><label>年级<select defaultValue="大二"><option>大一</option><option>大二</option><option>大三</option><option>大四</option></select></label></div>
              <div className="form-row"><label>专业<input defaultValue="计算机科学与技术" /></label><label>成绩位置<select defaultValue="专业中游"><option>专业前 20%</option><option>专业中游</option><option>专业后 30%</option></select></label></div>
              <label>已有经历<textarea defaultValue="完成过校园二手平台课程项目；暂无实习、竞赛和职业证书。" /></label>
              <label>现实约束<textarea defaultValue="希望留在省会或家乡附近；家庭更倾向稳定就业；每周可用于探索约 6 小时。" /></label>
              <label className="upload-box">可选：上传简历（Demo 仅展示选择流程）<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? "")} /><span>{resumeName || "选择 PDF / Word 文件"}</span><small>本次体验不会读取文件内容</small></label>
              <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>我确认将以上信息用于本次路径推演；我可以随时修改或删除。</span></label>
              <button className="primary-button full" type="submit" disabled={!consent}>生成我的职途初鉴 <span>→</span></button>
            </form>
            <aside className="profile-preview">
              <span className="section-kicker light">准备生成</span><h3>初始画像快照 v1</h3><p>这份快照记录此刻的事实和选择依据，后续经历会形成新版本。</p>
              <div className="preview-evidence"><span>目的锚点</span><b>{purpose.title}</b><small>来源：用户主动选择，可返回修改</small></div>
              <div className="preview-evidence"><span>已确认</span><b>稳定与地域偏好较高</b><small>来源：情境选择 + 现实约束</small></div>
              <div className="preview-evidence"><span>事实</span><b>计算机专业，有课程项目</b><small>来源：用户填写</small></div>
              <div className="preview-evidence"><span>待验证</span><b>能否接受体制内真实工作内容</b><small>来源：当前仍缺少生活体验</small></div>
              <footer>下一步将生成六维能力雷达、维度短评和个人定位。</footer>
            </aside>
          </div>
        </section>
      )}

      {stage === "positioning" && (
        <section className="content-page positioning-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">01 · 职途初鉴</span><h2>先看清现在的自己</h2></div>
            <p>AI 将情境回答和已确认资料整理为六维初评。每项都有一句结论、证据来源和当前置信度。</p>
          </div>
          <div className="positioning-layout">
            <article className="coordinate-card">
              <div className="coordinate-heading"><div><span>功能 1 · AI 初评</span><h3>我的能力雷达</h3></div><div className="coordinate-badges"><b>0–5 分</b><b>六维等权</b></div></div>
              <div className="target-reference"><div><span>当前目标</span><b>尚未确定</b></div><p>性格适配度、专业能力和兴趣匹配度暂按通用职业环境评分；进入具体路径后会结合岗位要求重新计算。</p></div>
              <div className="coordinate-content">
                <div className="radar-chart" role="img" aria-label="六维能力雷达：性格适配度3.2，专业能力2.4，兴趣匹配度3.4，学习与知识3.1，压力应对2.8，沟通协作3.0">
                  <div className="radar-ring radar-ring-outer" /><div className="radar-ring radar-ring-middle" /><div className="radar-ring radar-ring-inner" />
                  {abilityDimensions.map((item, index) => <i className={`radar-axis axis-${index}`} key={item.label} />)}
                  <div className="radar-shape" style={{ clipPath: `polygon(${radarPoints})` }} />
                  {abilityDimensions.map((item, index) => {
                    const angle = -Math.PI / 2 + index * (Math.PI * 2 / abilityDimensions.length);
                    const radius = (item.value / 5) * 42;
                    return <em className="radar-dot" style={{ left: `${50 + Math.cos(angle) * radius}%`, top: `${50 + Math.sin(angle) * radius}%`, background: item.color }} key={item.label} />;
                  })}
                  {abilityDimensions.map((item, index) => <span className={`radar-label radar-label-${index}`} key={item.label}>{item.label}</span>)}
                  <strong>3.0</strong><small>六维均分 / 5</small>
                </div>
                <div className="dimension-list">
                  {abilityDimensions.map((item) => (
                    <div className="dimension-row" key={item.label}>
                      <div className="dimension-row-head"><div><span>{item.label}</span>{item.referenceOnly && <small>通用参考</small>}</div><div><em>{item.tag}</em><b>{item.value.toFixed(1)}</b><small>/ 5</small></div></div>
                      <p>{item.summary}</p>
                      <i><em style={{ width: `${(item.value / 5) * 100}%`, background: item.color }} /></i>
                      <div className="dimension-meta"><span>依据：{item.evidence}</span><b>置信度 {item.confidence}</b></div>
                    </div>
                  ))}
                </div>
              </div>
              <footer className="score-footer"><div><span><b>1</b>不足</span><span><b>2</b>待改进</span><span><b>3</b>达标</span><span><b>4</b>优秀</span><span><b>5</b>卓越</span></div><p>当前仅使用情境选择和预置资料。大五、霍兰德、能力测评及作品反馈尚未采集，后续获得新证据后会生成新版本。</p></footer>
            </article>
            <aside className="position-summary">
              <span className="section-kicker light">AI 初步定位</span>
              <div className="position-symbol">↗</div>
              <h3>现实导向的<br />探索型学习者</h3>
              <p>你会认真考虑稳定、地域和家庭等现实条件，也愿意通过学习继续积累。职业目标仍在形成，当前画像适合用来选择探索顺序。</p>
              <div className="position-finding positive"><span>相对优势</span><b>兴趣线索较清楚，学习基础达到当前阶段要求</b><small>较高维度：兴趣匹配度 3.4 · 性格适配度 3.2</small></div>
              <div className="position-finding"><span>优先补强</span><b>专业成果较少，压力与协作表现缺少真实反馈</b><small>较低维度：专业能力 2.4 · 压力应对 2.8</small></div>
              <div className="position-thesis"><span>个人定位</span><p>先用短期职业体验验证兴趣，再用项目成果和外部反馈提高画像可信度。</p></div>
              <div className="position-boundary"><b>评分边界</b><p>“压力应对”只记录情境行为，不推断心理状态；当前未接入任何外部平台数据。</p></div>
              <button className="primary-button full" onClick={() => setStage("futures")}>带着这个定位看三种人生 <span>→</span></button>
            </aside>
          </div>
        </section>
      )}

      {stage === "futures" && (
        <section className="content-page futures-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">02 · 三种平行人生</span><h2>系统建议先验证“体制内人生”</h2></div>
            <p>目的锚点、情境选择和林小北的现实资料共同形成推荐。页面展示体验顺序，并保留依据和信息缺口。</p>
          </div>
          <article className="priority-rationale">
            <span>为什么先看这条路</span>
            <p><b>你想解决：</b>{purpose.title}</p>
            <p><b>现实坐标：</b>希望留在家乡或省会，家庭倾向稳定，每周可探索约 6 小时。</p>
            <p><b>仍然不知道：</b>能否接受具体岗位中的规则、服务、重复沟通与临时任务。</p>
          </article>
          <div className="future-grid">
            {(["public", "job", "postgrad"] as PathId[]).map((id, index) => {
              const path = pathData[id];
              const available = id === "public";
              return (
                <article className={`future-card ${path.tone} ${index === 0 ? "is-recommended" : ""}`} key={id}>
                  <div className="future-card-top"><span>{path.icon}</span><b>{index === 0 ? "本次优先验证" : "作为对照保留"}</b></div>
                  <h3>{path.name}</h3><p>{path.summary}</p>
                  <div className="future-evidence"><small>为什么出现</small>{path.evidence.map((item) => <span key={item}>✓ {item}</span>)}</div>
                  <div className="future-gap"><small>仍待验证</small><p>{path.gap}</p></div>
                  {available ? <button className="primary-button full" onClick={() => setStage("simulation")}>先看看“上岸”到底是什么生活 <span>→</span></button> : <button className="ghost-button full" disabled>本次作为对照路径</button>}
                </article>
              );
            })}
          </div>
          <section className="agent-panel">
            <div className="agent-heading"><span className="agent-avatar">AI</span><div><small>未来体验 Agent</small><h3>进去之前，先问问“岸上”的真实生活</h3></div></div>
            <div className="prompt-chips">{Object.keys(promptAnswers).map((prompt) => <button className={activePrompt === prompt ? "is-active" : ""} onClick={() => setActivePrompt(prompt)} key={prompt}>{prompt}</button>)}</div>
            <div className="agent-reply"><span>成长罗盘</span><p>{promptAnswers[activePrompt]}</p></div>
          </section>
        </section>
      )}

      {stage === "simulation" && (
        <section className="content-page simulation-page">
          <div className="simulation-heading"><div><span className="section-kicker">03 · 体制内平行人生</span><h2>一场考试背后，<br />是一种具体生活。</h2></div><div className="simulation-counter"><strong>0{lifeIndex + 1}</strong><span>/ 0{lifeScenes.length}</span></div></div>
          <div className="simulation-layout">
            <article className="story-phone">
              <div className="phone-status"><span>平行人生</span><b>{lifeScenes[lifeIndex].time}</b></div>
              <div className="life-progress"><i style={{ width: `${lifeProgress}%` }} /></div>
              <span className="story-chapter">{lifeScenes[lifeIndex].chapter}</span><h3>{lifeScenes[lifeIndex].title}</h3><p className="story-copy">{lifeScenes[lifeIndex].story}</p>
              <div className="message-bubble">{lifeScenes[lifeIndex].message}</div>
              <div className="life-options" role="radiogroup" aria-label="选择你的反应">
                {lifeScenes[lifeIndex].options.map((option, index) => <button className={selectedLifeAnswer === index ? "is-selected" : ""} onClick={() => setSelectedLifeAnswer(index)} role="radio" aria-checked={selectedLifeAnswer === index} key={option.label}><span>{selectedLifeAnswer === index ? "✓" : String.fromCharCode(65 + index)}</span>{option.label}</button>)}
              </div>
              <button className="primary-button full" onClick={nextLifeScene} disabled={selectedLifeAnswer === null}>{lifeIndex === lifeScenes.length - 1 ? "看看体验改变了什么" : "进入下一幕"} <span>→</span></button>
            </article>
            <aside className="life-dashboard">
              <span className="section-kicker light">LIFE SIGNALS</span><h3>场景反应记录</h3><p>这些数值记录你在模拟场景中的选择变化，用于补充生活偏好与岗位认知。</p>
              {([
                ["公共服务意愿", lifeStats.service],
                ["规则任务适应", lifeStats.structure],
                ["生活边界需求", lifeStats.boundary],
                ["岗位现实认知", lifeStats.reality],
              ] as [string, number][]).map(([label, value]) => <div className="life-stat" key={label}><div><span>{label}</span><b>{value}</b></div><i><em style={{ width: `${value}%` }} /></i></div>)}
              <div className="dashboard-note"><b>体验正在补充什么？</b><p>单靠“我喜欢稳定”还不足以判断工作感受。真实场景会呈现你愿意接受的部分，以及需要继续了解的部分。</p></div>
            </aside>
          </div>
        </section>
      )}

      {stage === "recalibration" && (
        <section className="content-page recalibration-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">04 · 体验前后画像</span><h2>“想上岸”，现在有了更具体的含义</h2></div><p>以下都是候选证据。只有你确认后，它们才会进入正式画像并影响计划。</p>
          </div>
          <div className="before-after-grid">
            <article className="snapshot-card before"><span>体验前 · v1</span><h3>公考认知来自“稳定”印象</h3><ul><li>希望留在家乡或省会</li><li>生活可预期很重要</li><li>不了解真实岗位内容</li></ul><footer>证据：情境选择 + 用户填写</footer></article>
            <div className="evidence-bridge"><span>+{lifeEvidence.length}</span><b>条场景证据</b><i>→</i></div>
            <article className="snapshot-card after"><span>体验后 · v2 候选</span><h3>公考仍值得探索，但理由更完整</h3><ul>{lifeEvidence.slice(-3).map((item) => <li key={item}>{item}</li>)}</ul><footer>状态：等待用户确认</footer></article>
          </div>
          <article className="recalibration-reason"><div><span>系统解释</span><h3>“喜欢稳定”只说明了你对生活节奏的期待。</h3></div><p>你对地域、规则型任务和公共服务场景表现出一定接受度，也注意到了成长速度、临时任务和岗位差异。接下来最值得补充的是一次真实考试与岗位体验。</p></article>
          <div className="reaction-panel"><span>体验完这段生活，你现在更接近哪种感受？</span><div>{["这值得我继续了解", "可以接受，但先看具体岗位", "稳定吸引我，工作内容仍不确定", "和想象不同，保留其他人生"].map((item) => <button className={reaction === item ? "is-active" : ""} onClick={() => setReaction(item)} key={item}>{reaction === item ? "✓ " : ""}{item}</button>)}</div></div>
          <div className="implementation-question"><div><span>体验之后，你终于可以问</span><h3>“如果我想走到这种生活，下一步该怎么实现？”</h3><p>系统会先给你四项低成本验证，帮助你确认岗位与备考体验。</p></div><button className="primary-button" disabled={!reaction} onClick={() => setStage("plan")}>告诉我下一步怎么走 <span>→</span></button></div>
        </section>
      )}

      {stage === "plan" && (
        <section className="content-page plan-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">05 · 7 天考公体验计划</span><h2>模拟人生可以重开，真实选择需要证据</h2></div><p>七天的目标很简单：看清岗位、考试和这种生活是否值得继续投入。</p>
          </div>
          <div className="plan-overview">
            <article className="progress-card"><span>体验完成度</span><strong>{planProgress}%</strong><div><i style={{ width: `${planProgress}%` }} /></div><p>{completedTasks.length === planTasks.length ? "四项证据已集齐，可以进入正式规划。" : `还差 ${planTasks.length - completedTasks.length} 项真实证据`}</p></article>
            <article className="plan-thesis"><span>本周验证假设</span><h3>我向往“上岸”后的生活，也愿意体验公考的准备方式与具体岗位。</h3><p>来源：初始画像 v1 + 体制内人生体验反馈</p></article>
          </div>
          <div className="seven-day-list">
            {planTasks.map((task, index) => {
              const done = completedTasks.includes(index);
              return <article className={done ? "is-done" : ""} key={task.day}><button onClick={() => toggleTask(index)} aria-label={`${done ? "取消完成" : "标记完成"}：${task.title}`}>{done ? "✓" : ""}</button><div className="task-day">{task.day}</div><div><h3>{task.title}</h3><p><b>完成标准：</b>{task.criteria}</p></div><span>{task.resource}</span></article>;
            })}
          </div>
          <div className="final-banner"><div><span>先做验证</span><h3>完成这次低成本体验后，再决定是否进入正式考公规划。</h3></div><button className="ghost-button" onClick={resetDemo}>重新体验其他选择</button></div>
        </section>
      )}
    </main>
  );
}
