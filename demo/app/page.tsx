"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Stage =
  | "landing"
  | "purpose"
  | "quiz"
  | "interpreting"
  | "result"
  | "profile"
  | "analyzing"
  | "positioning"
  | "rolemodels"
  | "futures"
  | "simulation"
  | "recalibration"
  | "execution"
  | "executionReview";

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

const journeyDestinations: Stage[] = ["result", "rolemodels", "simulation", "recalibration", "execution"];

const abilityDimensions = [
  { label: "性格", value: 4.5, tag: "稳健有序", summary: "做选择时重视规则、确定性和责任边界，与多数公共服务岗位的工作方式较契合。", evidence: "稳定偏好、规则任务与现实取舍情境", confidence: "medium", referenceOnly: false, color: "#6757e5" },
  { label: "专业能力", value: 2.4, tag: "基础起步", summary: "现有专业成果较少，距离考公准备要求仍需补充岗位筛选、行测和申论体验。", evidence: "资料填写：1 个课程项目，暂无备考经历", confidence: "medium", referenceOnly: false, color: "#8a72ed" },
  { label: "兴趣匹配度", value: 3.4, tag: "稳定导向", summary: "稳定、地域和生活节奏与你的期待较一致，具体岗位兴趣仍需真实体验。", evidence: "人生课题 + 稳定与地域偏好", confidence: "medium", referenceOnly: false, color: "#ff8a55" },
  { label: "学习与知识", value: 3.1, tag: "基础达标", summary: "本科专业基础处于中游，具备继续学习的起点，持续学习成果仍待补充。", evidence: "资料填写：本科大二、专业成绩中游", confidence: "medium", referenceOnly: false, color: "#d9b63e" },
  { label: "压力应对", value: 4.8, tag: "韧性突出", summary: "计划受阻后倾向缩小任务、继续推进，对备考节奏和规则型任务有较好耐受。", evidence: "计划中断、风险比较与规则任务情境", confidence: "medium", referenceOnly: false, color: "#2d9f7f" },
  { label: "沟通协作", value: 3.9, tag: "沟通稳妥", summary: "愿意说明顾虑并协调现实期待，具备公共服务场景需要的基础沟通意识。", evidence: "家庭期待协商情境 + 课程项目经历", confidence: "medium", referenceOnly: false, color: "#4778df" },
];

const analysisSteps = [
  { label: "读取已授权资料", detail: "核对学校、年级、专业、经历与现实约束", output: "5 类事实资料已进入本次分析" },
  { label: "整理情境回答证据", detail: "提取人生课题与情境选择中的稳定线索", output: "只保留可追溯的选择依据" },
  { label: "匹配六维评分口径", detail: "调用 6 个维度、16 个子项的预置评价规则", output: "答案、事实与评分标准完成对应" },
  { label: "检索职业路径资料库", detail: "查找公考 / 考编、企业求职与继续升学要求", output: "获得 3 类路径的通用能力参照" },
  { label: "交叉校验并生成画像", detail: "检查证据冲突、信息缺口和结论置信度", output: "低置信度结论已标记为待验证" },
];

const confidenceLabels = { high: "较高", medium: "中等", low: "较低" } as const;

const interpretationSteps = [
  { label: "整理回答", detail: "把 8 次选择转换为可追溯线索" },
  { label: "寻找重复偏好", detail: "识别多次出现的生活期待与选择方式" },
  { label: "形成第一印象", detail: "生成一个可修改的临时成长标签" },
];

const lifePurposes: { id: PurposeId; icon: string; title: string; description: string; signal: string; tag: string }[] = [
  { id: "steady", icon: "稳", title: "找到一种可预期的生活", description: "希望工作、城市和生活节奏更确定，也能照顾家人。", signal: "比起一时的高回报，你更在意一种能够安排生活的确定感", tag: "稳定让我走得更远" },
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
      { label: "先了解家乡和省会有哪些稳定岗位", signal: "你会先确认城市和生活方式，再决定为哪条路投入", scores: { public: 3, job: 0, postgrad: 1 } },
      { label: "先投几份实习，用真实工作找方向", signal: "你倾向用企业实践快速验证选择", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "先看看继续读研能打开哪些可能", signal: "你愿意通过继续学习延长能力积累", scores: { public: 0, job: 0, postgrad: 3 } },
      { label: "把三条路都收藏起来，晚点再决定", signal: "你希望保留可能，但容易停在信息搜集阶段", scores: { public: 1, job: 1, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "理想生活",
    title: "如果工作五年后回头看，你最希望自己获得什么？",
    options: [
      { label: "生活可预期，也能照顾家人", signal: "你想要的不只是一份稳定工作，也希望下班后的时间仍然属于自己", scores: { public: 3, job: 0, postgrad: 1 } },
      { label: "收入和能力都快速增长", signal: "你更看重成长速度和成果回报", scores: { public: 0, job: 3, postgrad: 0 } },
      { label: "在专业领域形成真正的积累", signal: "你在意长期专业深度", scores: { public: 0, job: 1, postgrad: 3 } },
      { label: "先有选择权，不被任何路线困住", signal: "你看重自主性，需要保留转轨空间", scores: { public: 1, job: 2, postgrad: 1 } },
    ],
  },
  {
    eyebrow: "任务偏好",
    title: "周末可以体验一种陌生任务，你更愿意先试哪一种？",
    options: [
      { label: "从一堆材料里找规律，给出有依据的结论", signal: "比起模糊的承诺，你更相信规则清楚、努力能被看见的竞争", scores: { public: 3, job: 1, postgrad: 1 } },
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

const roleModelCases = [
  {
    id: "beijing",
    type: "机会样本",
    title: "从山西二本到北京朝阳区",
    match: ["普通本科起点", "应届身份", "提前准备"],
    route: ["山西生源", "北京读本科", "抓住应届窗口", "京考 151.5 分", "入职一年多"],
    now: "在北京朝阳区工作，租住单位附近的一室一厅。个人自述转正后月收入与补贴约 1 万元。",
    gain: "普通本科也能争取大城市岗位，应届身份、准备节奏和选岗共同影响结果。",
    cost: "房租约 3000 元，长期定居和住房成本仍需面对。",
    note: "她的路线值得参考：尽早确认报考资格，利用应届窗口，再把准备落到具体考试。",
    question: "普通二本想留在北京，真正需要提前准备什么？",
    initialSignal: "你正在主动确认普通本科进入大城市公职的可行条件",
    followupQuestion: "你想留在北京，最主要的原因是什么？",
    followups: [
      { label: "发展机会更多", signal: "你愿意为发展机会承担更高的城市生活成本", addition: "如果发展机会是首要考虑，应优先核对可报岗位数量、成长空间和住房成本，再决定投入强度。" },
      { label: "想建立独立生活", signal: "你把城市选择与个人自主空间联系在一起", addition: "如果独立生活更重要，还要比较收入、租房压力和长期留城条件。" },
      { label: "现在还没想清楚", signal: "你需要先比较大城市机会与生活成本", addition: "目前适合先做岗位与生活成本对照，暂时不必提前锁定城市。" },
    ],
    searches: ["案例 01 成长路线", "北京公务员招录条件", "应届岗位限制"],
    answer: "这份案例里，学校层次没有直接挡住机会。更关键的条件包括在北京读书、应届身份、提前准备京考和具体选岗。你还需要逐岗核对专业、学历、生源地与应届要求。",
    candidate: "你会优先确认大城市岗位资格与应届报考窗口",
    answerEvidence: "案例 01 + 公开招录条件",
  },
  {
    id: "taiyuan",
    type: "生活样本",
    title: "异地上岸太原：日子可预期",
    match: ["省会生活", "重视稳定", "独居租房"],
    route: ["异地报考", "上岸太原", "单位附近租房", "适应业务", "形成稳定日常"],
    now: "步行约 10 分钟上班，转正后全年综合收入自述约 12 万元，多数时候可以正常下班。",
    gain: "通勤短、生活成本相对可控，工作和周末更容易安排。",
    cost: "收入够日常生活，快速攒钱仍有难度，异地关系也需要重新建立。",
    note: "这条路展示了省会公职的普通一天：日子过得下去，也比较可预期。",
    question: "异地上岸太原后，收入和生活压力大吗？",
    initialSignal: "你正在主动评估异地上岸后的生活可持续性",
    followupQuestion: "如果去异地工作，你目前最担心哪一件事？",
    followups: [
      { label: "收入不够生活", signal: "你会优先确认收入与基本生活成本是否匹配", addition: "可以先按到手收入、租房、通勤和储蓄目标做一份月度预算。" },
      { label: "身边没有熟人", signal: "异地支持和归属感会显著影响你的选择", addition: "除了收入，还应了解同事年龄结构、城市社交条件和回家成本。" },
      { label: "以后不好转向", signal: "你重视路径的可迁移性和后续选择空间", addition: "需要同时确认岗位能力能否迁移，以及跨地区或转岗的现实成本。" },
    ],
    searches: ["案例 04 收入记录", "太原租房与通勤", "异地生活风险"],
    answer: "案例中的全年综合收入约 12 万元，日常生活和短通勤可以维持，快速攒钱仍有难度。异地生活还要考虑租房、朋友关系和遇事时的支持来源。",
    candidate: "你会重点比较收入、住房成本与异地支持",
    answerEvidence: "案例 04 个人自述 + 生活成本项目",
  },
  {
    id: "mismatch",
    type: "风险样本",
    title: "上岸以后，她仍然想离开",
    match: ["体制内体验", "组织氛围", "风险提醒"],
    route: ["多次职业尝试", "选择体制内", "通过考试", "难以融入部门", "重新评估方向"],
    now: "稳定工作没有缓解她的疲惫。部门年龄结构、沟通方式和具体工作内容持续影响体验。",
    gain: "通过考试证明了学习和执行能力，也获得了真实的组织环境体验。",
    cost: "岗位氛围与个人需求不合，稳定没有自动转化为满意度。",
    note: "这张风险卡提醒你：选岗时还要了解工作内容、团队氛围和日常协作方式。",
    question: "怎么提前判断自己会不会不适应体制内？",
    initialSignal: "你会主动关注上岸后的岗位匹配风险",
    followupQuestion: "下面哪种不适应最让你担心？",
    followups: [
      { label: "工作内容重复", signal: "你需要工作中存在持续学习或成果反馈", addition: "选岗时可以重点询问日常任务比例、成长空间和轮岗机会。" },
      { label: "团队沟通压抑", signal: "组织氛围和沟通方式会显著影响你的工作体验", addition: "岗位访谈时应了解团队年龄结构、协作方式和直属领导反馈习惯。" },
      { label: "成长速度太慢", signal: "你在稳定之外仍然重视长期成长速度", addition: "需要比较晋升节奏、可学习资源和下班后的自主成长空间。" },
    ],
    searches: ["案例 09 工作体验", "组织氛围影响因素", "岗位体验任务"],
    answer: "可以提前了解具体工作内容、部门年龄结构、沟通方式和临时任务频率。短期岗位访谈与场景体验能够发现部分风险，最终感受仍要结合真实接触继续验证。",
    candidate: "你需要验证组织氛围、同事结构和沟通方式",
    answerEvidence: "案例 09 + 岗位体验检查项",
  },
];

const lifeScenes: {
  time: string;
  chapter: string;
  source: string;
  title: string;
  story: string;
  message: string;
  options: { label: string; signal: string; delta: Partial<Record<LifeDimension, number>> }[];
}[] = [
  {
    time: "选岗前 · 晚上 22:10",
    chapter: "第一幕 · 城市取舍",
    source: "参考样本 01 / 04 / 07",
    title: "你想争取哪一种可预期生活？",
    story: "北京样本转正后月收入与补贴约 1 万元，附近租房约 3000 元；太原样本全年综合收入约 12 万元，步行 10 分钟上班。岗位限制和竞争强度也不同。",
    message: "成长罗盘：你选的不只是工资，还有城市成本、家庭距离和长期落脚方式。",
    options: [
      { label: "争取北京，应届窗口和发展机会更重要", signal: "你愿意为大城市机会承担更高生活成本", delta: { reality: 8, boundary: -2, structure: 2 } },
      { label: "优先家乡或省会，短通勤和生活成本更重要", signal: "地域支持与可控生活成本是你的重要条件", delta: { boundary: 9, reality: 7 } },
      { label: "先按资格和竞争筛岗位，再比较城市", signal: "你倾向先确认可报范围，再做生活取舍", delta: { structure: 9, reality: 8 } },
    ],
  },
  {
    time: "入职第 47 天 · 18:05",
    chapter: "第二幕 · 工作节奏",
    source: "参考样本 02 / 04 / 05 / 07",
    title: "稳定岗位，也会突然忙起来",
    story: "多位上岸者提到，写材料、迎检和临时加班都会出现，但多数时候仍能保住双休。今天下班前，群里通知明早迎检，需要今晚补齐材料。",
    message: "工作群：数据口径今晚确认，明早统一汇总。",
    options: [
      { label: "先确认标准并完成，偶尔加班可以接受", signal: "你能接受有边界的临时任务", delta: { structure: 9, reality: 8 } },
      { label: "先了解这种情况每月有多频繁，再判断", signal: "你需要用忙闲频率判断稳定是否适合自己", delta: { reality: 10, boundary: 5 } },
      { label: "我期待严格朝九晚五，这种不确定性很难接受", signal: "临时任务会明显影响你的岗位选择", delta: { boundary: 10, reality: 8 } },
    ],
  },
  {
    time: "入职第 100 天 · 周六",
    chapter: "第三幕 · 生活账本",
    source: "参考样本 03 / 04 / 08",
    title: "工资到账后，你想怎样生活？",
    story: "有人每月承担约 3000 元房租，换来大城市的独立空间；也有人在低成本城市短通勤。稳定收入还让一位普通家庭的年轻人开始养猫、摄影并照顾家人。",
    message: "本月账单：房租、餐饮、回家成本、储蓄和爱好，需要重新排序。",
    options: [
      { label: "稳定收入让我能经营爱好，这很重要", signal: "你看重稳定收入带来的生活自主权", delta: { boundary: 9, reality: 6 } },
      { label: "独立生活值得，但要先算清房租和储蓄", signal: "你愿意为独立空间承担可计算的成本", delta: { reality: 10, boundary: 5 } },
      { label: "异地孤独和回家成本让我更想靠近家人", signal: "家庭支持与归属感会显著影响城市选择", delta: { boundary: 10, reality: 8 } },
    ],
  },
  {
    time: "入职第 180 天 · 周一",
    chapter: "第四幕 · 适配风险",
    source: "参考样本 09",
    title: "上岸以后，部门里没有同龄人",
    story: "一位上岸者发现部门里没有同龄人，沟通方式和具体工作让她长期压抑。稳定没有自动变成满意，她开始重新评估方向。",
    message: "成长罗盘：通过考试说明你能考上，组织环境是否合适仍需真实验证。",
    options: [
      { label: "先了解团队和工作内容，给自己一段适应期", signal: "你愿意通过真实接触判断组织适配", delta: { structure: 5, service: 3, reality: 9 } },
      { label: "记录不适配原因，再寻找内部调整或其他路径", signal: "你会为稳定路线保留调整与退出机制", delta: { reality: 11, boundary: 8 } },
      { label: "稳定不够，我要把其他人生继续保留下来", signal: "组织氛围是你不能忽略的职业条件", delta: { reality: 12, boundary: 9 } },
    ],
  },
];

const executionObstacles = [
  {
    label: "岗位太多，看不懂",
    adjustedTitle: "跟着 AI 确认 1 个可报岗位",
    change: "目标数量 3 → 1，增加四步筛选引导",
    deadline: "顺延 1 天",
    criteria: "确认专业、学历、应届身份和地域四项条件",
    signal: "明确筛选入口后，你更容易开始行动",
    review: "任务入口不够清晰，AI 将大任务拆成一次可完成的确认。",
  },
  {
    label: "课程作业太多",
    adjustedTitle: "先确认专业和应届身份两项条件",
    change: "预计 45 分钟 → 15 分钟，保留最低进度",
    deadline: "顺延 2 天",
    criteria: "完成两项资格核对，并保存 1 个待确认岗位",
    signal: "课程任务会挤占探索时间，你需要更小的最低任务",
    review: "可用时间低于预期，AI 先降低任务规模并保留方向。",
  },
  {
    label: "不知道从哪里开始",
    adjustedTitle: "使用筛选器完成第 1 次岗位核对",
    change: "自主查找 → AI 逐项引导",
    deadline: "保持周五 20:00",
    criteria: "跟随引导完成 1 个岗位的资格核对",
    signal: "有明确步骤和示例时，你更容易启动",
    review: "当前阻碍来自步骤不清晰，计划将补充示例和完成标准。",
  },
  {
    label: "我对考公有些动摇",
    adjustedTitle: "只了解 1 个岗位的真实工作内容",
    change: "暂停备考任务，改为低成本方向验证",
    deadline: "本周日 20:00",
    criteria: "写下能接受、不能接受和仍想追问的各 1 项",
    signal: "你希望先确认方向，再决定是否投入备考",
    review: "方向意愿发生变化，系统不会继续增加备考任务。",
  },
];

const executionTasks = [
  { title: "确认 1 个可报岗位", category: "岗位认知", weight: 30, deadline: "周五 20:00", priority: "高优先" },
  { title: "读懂行测与申论结构", category: "考试认知", weight: 20, deadline: "周六 18:00", priority: "中优先" },
  { title: "体验 20 分钟华图入门课", category: "学习体验", weight: 30, deadline: "周日 16:00", priority: "中优先" },
  { title: "记录愿意与不愿意付出的代价", category: "方向复盘", weight: 20, deadline: "周日 20:00", priority: "低优先" },
];

const directionKnowledgeQuestions = [
  {
    question: "公务员真的很少加班吗？",
    dimension: 3,
    sources: ["近期岗位日常帖 12 条", "临时任务讨论", "不同层级工作记录"],
    answer: "公开经历里很少出现统一答案。材料、迎检、窗口服务和临时协调都可能带来加班，频率受地区、部门和岗位影响。更可靠的判断方式是继续追问具体单位的忙闲周期、值班安排和临时任务占比。",
  },
  {
    question: "基层岗位每天主要做什么？",
    dimension: 0,
    sources: ["基层工作记录 9 条", "群众服务经历", "材料与协调讨论"],
    answer: "近期公开经历反复提到材料整理、政策落实、群众沟通、跨部门协调和临时任务。岗位名称只能说明一部分，报考前还需要询问日常任务比例、服务对象和高频协作部门。",
  },
  {
    question: "异地上岸以后会后悔吗？",
    dimension: 3,
    sources: ["异地上岸分享 15 条", "租房与通勤讨论", "归属感相关帖子"],
    answer: "公开分享中的分歧主要来自生活支持。短通勤和稳定节奏带来确定感，租房、回家成本和缺少熟人也会放大孤独感。你需要把收入预算、城市归属和家庭距离分开比较。",
  },
];

const stageRank: Record<Stage, number> = {
  landing: 0,
  purpose: 0,
  quiz: 0,
  interpreting: 1,
  result: 1,
  profile: 1,
  analyzing: 1,
  positioning: 1,
  rolemodels: 2,
  futures: 2,
  simulation: 3,
  recalibration: 4,
  execution: 5,
  executionReview: 5,
};

export default function Home() {
  const landingVisualRef = useRef<HTMLDivElement>(null);
  const routeChatStreamRef = useRef<HTMLDivElement>(null);
  const executionChatRef = useRef<HTMLDivElement>(null);
  const launchTimerRef = useRef<number | null>(null);
  const knowledgeSearchTimerRef = useRef<number | null>(null);
  const knowledgePulseTimerRef = useRef<number | null>(null);
  const [stage, setStage] = useState<Stage>("landing");
  const [isLaunching, setIsLaunching] = useState(false);
  const [furthestRank, setFurthestRank] = useState(0);
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeId | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [consent, setConsent] = useState(true);
  const [resumeName, setResumeName] = useState("");
  const [lifeIndex, setLifeIndex] = useState(0);
  const [lifeAnswers, setLifeAnswers] = useState<number[]>([]);
  const [selectedLifeAnswer, setSelectedLifeAnswer] = useState<number | null>(null);
  const [activeKnowledgeQuestion, setActiveKnowledgeQuestion] = useState<number | null>(null);
  const [knowledgeSearchPhase, setKnowledgeSearchPhase] = useState(0);
  const [freeQuestionNotice, setFreeQuestionNotice] = useState(false);
  const [answeredKnowledgeQuestions, setAnsweredKnowledgeQuestions] = useState<number[]>([]);
  const [knowledgeScorePulse, setKnowledgeScorePulse] = useState<number | null>(null);
  const [executionPhase, setExecutionPhase] = useState(0);
  const [selectedObstacle, setSelectedObstacle] = useState<number | null>(null);
  const [expandedTaskGroup, setExpandedTaskGroup] = useState<"completed" | "pending" | null>(null);
  const [executionSignalStatus, setExecutionSignalStatus] = useState<"kept" | "deleted" | null>(null);
  const [nextPlanPhase, setNextPlanPhase] = useState<0 | 1 | 2>(0);
  const [nextPlanStep, setNextPlanStep] = useState(0);
  const [signalReviews, setSignalReviews] = useState<Record<number, "confirmed" | "rejected">>({});
  const [activeDimension, setActiveDimension] = useState(0);
  const [sampleDirection, setSampleDirection] = useState<PathId>("public");
  const [activeRoleModel, setActiveRoleModel] = useState(0);
  const [routeChatOpen, setRouteChatOpen] = useState(false);
  const [routeChatPhase, setRouteChatPhase] = useState(0);
  const [typedRouteQuestion, setTypedRouteQuestion] = useState("");
  const [selectedChatFollowup, setSelectedChatFollowup] = useState<number | null>(null);
  const [conversationEvidence, setConversationEvidence] = useState<Record<string, string[]>>({});
  const [analysisStep, setAnalysisStep] = useState(0);
  const [interpretationStep, setInterpretationStep] = useState(0);

  const currentRank = stageRank[stage];
  const availableRank = Math.max(currentRank, furthestRank);
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
  const selectedDimension = abilityDimensions[activeDimension];
  const activeRoleModelCase = roleModelCases[activeRoleModel];
  const activeConversationEvidence = conversationEvidence[activeRoleModelCase.id] ?? [];
  const conversationConcernCases = roleModelCases.filter((item) => (conversationEvidence[item.id]?.length ?? 0) > 0);
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

  const directionKnowledgeBonuses = [0, 0, 0, 0];
  answeredKnowledgeQuestions.forEach((questionIndex) => {
    directionKnowledgeBonuses[directionKnowledgeQuestions[questionIndex].dimension] += 1;
  });
  const directionKnowledge = [
    { label: "岗位内容", before: 26, after: Math.min(94, 48 + Math.round(lifeStats.reality * .4) + directionKnowledgeBonuses[0]), note: "开始理解材料、协调与临时任务" },
    { label: "规则任务", before: 38, after: Math.min(94, 42 + Math.round(lifeStats.structure * .5) + directionKnowledgeBonuses[1]), note: "体验过规则、优先级与工作边界" },
    { label: "公共服务", before: 32, after: Math.min(94, 38 + Math.round(lifeStats.service * .5) + directionKnowledgeBonuses[2]), note: "接触了群众沟通与具体帮助" },
    { label: "生活代价", before: 28, after: Math.min(94, 42 + Math.round((lifeStats.reality + lifeStats.boundary) * .25) + directionKnowledgeBonuses[3]), note: "看见稳定之外的收入、成长与地域取舍" },
  ];
  const directionKnowledgeScore = Math.round(directionKnowledge.reduce((total, item) => total + item.after, 0) / directionKnowledge.length);
  const directionKnowledgeBefore = Math.round(directionKnowledge.reduce((total, item) => total + item.before, 0) / directionKnowledge.length);
  const activeExecutionObstacle = executionObstacles[selectedObstacle ?? 0];
  const executionProgress = executionPhase >= 4 ? 50 : 0;
  const completedExecutionTasks = executionPhase >= 4 ? executionTasks.slice(0, 2) : [];
  const pendingExecutionTasks = executionPhase >= 4 ? executionTasks.slice(2) : executionTasks;
  const executionProgressClass = executionProgress < 15 ? "is-start" : executionProgress < 40 ? "is-exploring" : executionProgress < 70 ? "is-accelerating" : executionProgress < 95 ? "is-sprinting" : "is-finished";
  const analysisComplete = analysisStep >= analysisSteps.length;
  const analysisProgress = analysisComplete ? 100 : Math.round(8 + (analysisStep / analysisSteps.length) * 84);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stage, quizIndex, lifeIndex]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFurthestRank((current) => Math.max(current, currentRank)), 0);
    return () => window.clearTimeout(timer);
  }, [currentRank]);

  useEffect(() => {
    if (stage !== "execution") return;
    const stream = executionChatRef.current;
    if (!stream) return;
    stream.scrollTo({ top: stream.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [stage, executionPhase, selectedObstacle]);

  useEffect(() => {
    if (stage !== "executionReview" || nextPlanPhase !== 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setNextPlanStep(3);
        setNextPlanPhase(2);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setNextPlanStep(1), 260),
      window.setTimeout(() => setNextPlanStep(2), 900),
      window.setTimeout(() => setNextPlanStep(3), 1540),
      window.setTimeout(() => setNextPlanPhase(2), 2250),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [stage, nextPlanPhase]);

  useEffect(() => () => {
    if (launchTimerRef.current !== null) window.clearTimeout(launchTimerRef.current);
    if (knowledgeSearchTimerRef.current !== null) window.clearTimeout(knowledgeSearchTimerRef.current);
    if (knowledgePulseTimerRef.current !== null) window.clearTimeout(knowledgePulseTimerRef.current);
  }, []);

  useEffect(() => {
    if (stage !== "analyzing") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setAnalysisStep(analysisSteps.length), 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setAnalysisStep(0), 0),
      ...analysisSteps.map((_, index) => window.setTimeout(
        () => setAnalysisStep(index + 1),
        650 + index * 680,
      )),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [stage]);

  useEffect(() => {
    if (stage !== "interpreting") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setStage("result"), 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setInterpretationStep(0), 0),
      window.setTimeout(() => setInterpretationStep(1), 520),
      window.setTimeout(() => setInterpretationStep(2), 1120),
      window.setTimeout(() => setInterpretationStep(3), 1780),
      window.setTimeout(() => setStage("result"), 2600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [stage]);

  useEffect(() => {
    if (!routeChatOpen) return;
    const question = activeRoleModelCase.question;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setTypedRouteQuestion(question);
        setRouteChatPhase(3);
        setSelectedChatFollowup(null);
        setConversationEvidence((current) => ({
          ...current,
          [activeRoleModelCase.id]: Array.from(new Set([...(current[activeRoleModelCase.id] ?? []), activeRoleModelCase.initialSignal])),
        }));
      }, 0);
      return () => window.clearTimeout(timer);
    }

    let cursor = 0;
    const typing = window.setInterval(() => {
      cursor += 1;
      setTypedRouteQuestion(question.slice(0, cursor));
      if (cursor >= question.length) window.clearInterval(typing);
    }, 68);
    const typingDuration = question.length * 68;
    const timers = [
      window.setTimeout(() => {
        setTypedRouteQuestion("");
        setRouteChatPhase(0);
        setSelectedChatFollowup(null);
      }, 0),
      window.setTimeout(() => {
        setRouteChatPhase(1);
        setConversationEvidence((current) => ({
          ...current,
          [activeRoleModelCase.id]: Array.from(new Set([...(current[activeRoleModelCase.id] ?? []), activeRoleModelCase.initialSignal])),
        }));
      }, typingDuration + 260),
      window.setTimeout(() => setRouteChatPhase(2), typingDuration + 1050),
      window.setTimeout(() => setRouteChatPhase(3), typingDuration + 2150),
    ];
    return () => {
      window.clearInterval(typing);
      timers.forEach(window.clearTimeout);
    };
  }, [routeChatOpen, activeRoleModelCase]);

  useEffect(() => {
    if (!routeChatOpen || selectedChatFollowup === null) return;
    const selectedFollowup = activeRoleModelCase.followups[selectedChatFollowup];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        setRouteChatPhase(6);
        setConversationEvidence((current) => ({
          ...current,
          [activeRoleModelCase.id]: Array.from(new Set([...(current[activeRoleModelCase.id] ?? []), selectedFollowup.signal, activeRoleModelCase.candidate])),
        }));
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const timers = [
      window.setTimeout(() => setRouteChatPhase(5), 950),
      window.setTimeout(() => {
        setRouteChatPhase(6);
        setConversationEvidence((current) => ({
          ...current,
          [activeRoleModelCase.id]: Array.from(new Set([...(current[activeRoleModelCase.id] ?? []), activeRoleModelCase.candidate])),
        }));
      }, 2800),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [routeChatOpen, selectedChatFollowup, activeRoleModelCase]);

  useEffect(() => {
    if (!routeChatOpen) return;
    const stream = routeChatStreamRef.current;
    if (!stream) return;
    stream.scrollTo({
      top: stream.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [routeChatOpen, routeChatPhase, selectedChatFollowup]);

  useEffect(() => {
    if (!routeChatOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRouteChatOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [routeChatOpen]);

  function resetDemo() {
    if (launchTimerRef.current !== null) window.clearTimeout(launchTimerRef.current);
    if (knowledgeSearchTimerRef.current !== null) window.clearTimeout(knowledgeSearchTimerRef.current);
    if (knowledgePulseTimerRef.current !== null) window.clearTimeout(knowledgePulseTimerRef.current);
    launchTimerRef.current = null;
    knowledgeSearchTimerRef.current = null;
    knowledgePulseTimerRef.current = null;
    setIsLaunching(false);
    setFurthestRank(0);
    setStage("landing");
    setSelectedPurpose(null);
    setQuizIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setConsent(true);
    setResumeName("");
    setLifeIndex(0);
    setLifeAnswers([]);
    setSelectedLifeAnswer(null);
    setActiveKnowledgeQuestion(null);
    setKnowledgeSearchPhase(0);
    setFreeQuestionNotice(false);
    setAnsweredKnowledgeQuestions([]);
    setKnowledgeScorePulse(null);
    setExecutionPhase(0);
    setSelectedObstacle(null);
    setExpandedTaskGroup(null);
    setExecutionSignalStatus(null);
    setNextPlanPhase(0);
    setNextPlanStep(0);
    setSignalReviews({});
    setActiveDimension(0);
    setSampleDirection("public");
    setActiveRoleModel(0);
    setRouteChatOpen(false);
    setRouteChatPhase(0);
    setTypedRouteQuestion("");
    setSelectedChatFollowup(null);
    setConversationEvidence({});
    setAnalysisStep(0);
    setInterpretationStep(0);
  }

  function chooseRouteFollowup(index: number) {
    const selectedFollowup = activeRoleModelCase.followups[index];
    setSelectedChatFollowup(index);
    setRouteChatPhase(4);
    setConversationEvidence((current) => ({
      ...current,
      [activeRoleModelCase.id]: Array.from(new Set([...(current[activeRoleModelCase.id] ?? []), selectedFollowup.signal])),
    }));
  }

  function nextQuestion() {
    if (selectedAnswer === null) return;
    setAnswers((current) => [...current, selectedAnswer]);
    setSelectedAnswer(null);
    if (quizIndex === questions.length - 1) {
      setStage("interpreting");
    } else {
      setQuizIndex((current) => current + 1);
    }
  }

  function skipQuestion() {
    setAnswers((current) => [...current, -1]);
    setSelectedAnswer(null);
    if (quizIndex === questions.length - 1) {
      setStage("interpreting");
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

  function chooseExecutionObstacle(index: number) {
    setSelectedObstacle(index);
    setExecutionSignalStatus(null);
    setExecutionPhase(2);
  }

  function askDirectionKnowledge(index: number) {
    if (knowledgeSearchTimerRef.current !== null) window.clearTimeout(knowledgeSearchTimerRef.current);
    setFreeQuestionNotice(false);
    setActiveKnowledgeQuestion(index);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setKnowledgeSearchPhase(2);
      setAnsweredKnowledgeQuestions((current) => current.includes(index) ? current : [...current, index]);
      return;
    }
    setKnowledgeSearchPhase(1);
    knowledgeSearchTimerRef.current = window.setTimeout(() => {
      setKnowledgeSearchPhase(2);
      if (!answeredKnowledgeQuestions.includes(index)) {
        const dimension = directionKnowledgeQuestions[index].dimension;
        setAnsweredKnowledgeQuestions((current) => [...current, index]);
        setKnowledgeScorePulse(dimension);
        if (knowledgePulseTimerRef.current !== null) window.clearTimeout(knowledgePulseTimerRef.current);
        knowledgePulseTimerRef.current = window.setTimeout(() => {
          setKnowledgeScorePulse(null);
          knowledgePulseTimerRef.current = null;
        }, 1100);
      }
      knowledgeSearchTimerRef.current = null;
    }, 1600);
  }

  function startJourney() {
    if (isLaunching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("purpose");
      return;
    }
    setIsLaunching(true);
    landingVisualRef.current?.classList.add("is-launching");
    launchTimerRef.current = window.setTimeout(() => {
      setStage("purpose");
      setIsLaunching(false);
      launchTimerRef.current = null;
    }, 680);
  }

  function navigateJourney(rank: number) {
    if (rank > availableRank) return;
    if (rank === 5 && executionPhase >= 4) {
      if (stage !== "executionReview") setStage("executionReview");
      return;
    }
    const destination = journeyDestinations[rank - 1];
    if (destination && destination !== stage) setStage(destination);
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
    visual.style.setProperty("--needle-angle", `${Math.atan2(x, -y) * (180 / Math.PI)}deg`);
    visual.classList.add("is-pointer-active");
  }

  function resetLandingPointer() {
    const visual = landingVisualRef.current;
    if (!visual) return;
    ["--scene-x", "--scene-y", "--chat-x", "--chat-y", "--offer-x", "--offer-y", "--family-x", "--family-y", "--sticker-x", "--sticker-y"].forEach((property) => visual.style.setProperty(property, "0px"));
    visual.style.setProperty("--pointer-x", "50%");
    visual.style.setProperty("--pointer-y", "50%");
    visual.style.setProperty("--tilt-x", "0deg");
    visual.style.setProperty("--tilt-y", "0deg");
    visual.style.setProperty("--needle-angle", "14deg");
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
            const destination = rank === 5 && executionPhase >= 4 ? "executionReview" : journeyDestinations[index];
            const isCurrent = rank === currentRank;
            const isReached = rank <= availableRank;
            const canNavigate = isReached && destination !== stage;
            return (
              <button
                className={`journey-step ${isCurrent ? "is-active" : ""} ${isReached && !isCurrent ? "is-done" : ""} ${rank < availableRank ? "is-connected" : ""} ${canNavigate ? "is-clickable" : ""}`}
                onClick={() => navigateJourney(rank)}
                disabled={!canNavigate}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${item.label}${canNavigate ? "，点击返回" : ""}`}
                type="button"
                key={item.label}
              >
                <span>{isReached && !isCurrent ? "✓" : `0${rank}`}</span>
                <div><small>{item.short}</small><strong>{item.label}</strong></div>
              </button>
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
              <button className={`primary-button ${isLaunching ? "is-launching" : ""}`} onClick={startJourney} aria-busy={isLaunching}>找到我最想解决的人生课题 <span>→</span></button>
            </div>
            <div className="principle-row">
              <div><b>01</b><span>选择由你确认</span></div>
              <div><b>02</b><span>每个判断有依据</span></div>
              <div><b>03</b><span>先体验再规划</span></div>
            </div>
          </div>
          <div className="landing-visual" ref={landingVisualRef} onPointerMove={handleLandingPointerMove} onPointerLeave={resetLandingPointer} aria-label="林小北收到的未来提醒，移动鼠标可以观察不同方向的消息">
            <div className="orbital orbital-one" /><div className="orbital orbital-two" />
            <div className="compass-core"><div className="compass-needle" aria-hidden="true"><i /></div><span>N</span><strong>?</strong><small>正在寻找方向</small></div>
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

      {stage === "interpreting" && (
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
              <div className="interpretation-footer"><span>完成后自动进入第一印象</span><button className="skip-button" onClick={() => setStage("result")}>跳过动画</button></div>
            </div>
          </article>
        </section>
      )}

      {stage === "result" && (
        <section className="content-page result-page">
          <div className="page-heading centered result-heading">
            <h2>这是 AI 对你的第一印象</h2>
          </div>
          <div className="result-grid">
            <article className="share-card">
              <div className="share-top"><span>AI 初步印象</span><b>临时画像 · V0</b></div>
              <div className="type-symbol"><span>临时成长标签</span><strong>↗</strong></div>
              <h3>「人间清醒的务实派」</h3>
              <p>你倾向先了解现实条件，再通过一次小体验判断方向。你当前最想解决的是“{purpose.title}”。</p>
              <div className="type-explanation"><span>这个标签有什么用？</span><p>它帮助系统理解你的选择方式，并决定接下来先补充哪些信息。你可以随时修正。</p></div>
              <div className="share-tags"><span># {purpose.tag}</span><span># 选择要有依据</span><span># 先体验再押注</span></div>
              <footer><b>华图成长罗盘</b><span>初步印象，等待你确认</span></footer>
            </article>
            <article className="state-panel">
              <div className="panel-title"><div><span>这些判断说得像你吗？</span><small>逐条确认可以帮助 AI 修正对你的理解</small></div><b>请确认</b></div>
              <div className="signal-list">
                {resultSignals.map((signal, index) => (
                  <div className={`signal-row ${signalReviews[index] === "rejected" ? "is-rejected" : ""}`} key={`${signal.text}-${index}`}>
                    <span>0{index + 1}</span>
                    <div><p>{signal.text}</p><small>依据：{signal.source} · 置信度{confidenceLabels[signal.confidence as keyof typeof confidenceLabels]}</small></div>
                    <div className="signal-review">
                      <button className={signalReviews[index] === "confirmed" ? "is-active" : ""} onClick={() => setSignalReviews((current) => ({ ...current, [index]: "confirmed" }))}>说得像我</button>
                      <button className={signalReviews[index] === "rejected" ? "is-active reject" : ""} onClick={() => setSignalReviews((current) => ({ ...current, [index]: "rejected" }))}>不太像我</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-next-action"><button className="primary-button full" onClick={() => setStage("profile")}>下一步：补充学校和经历 <span>→</span></button></div>
            </article>
          </div>
        </section>
      )}

      {stage === "profile" && (
        <section className="content-page profile-page">
          <div className="page-heading split-heading">
            <div><span className="section-kicker">再了解你一点</span><h2>补充几项基本信息</h2></div>
            <p>这些信息会帮助 AI 判断你现在在哪、哪条路更值得先体验。内容可以修改，简历也可以不上传。</p>
          </div>
          <div className="profile-layout">
            <form className="profile-form" onSubmit={(event) => { event.preventDefault(); if (consent) setStage("analyzing"); }}>
              <div className="form-row"><label>学校<input defaultValue="某普通本科高校" /></label><label>年级<select defaultValue="大二"><option>大一</option><option>大二</option><option>大三</option><option>大四</option></select></label></div>
              <div className="form-row"><label>专业<input defaultValue="计算机科学与技术" /></label><label>成绩大概位置<select defaultValue="专业中游"><option>专业前 20%</option><option>专业中游</option><option>专业后 30%</option></select></label></div>
              <label>做过哪些事？<textarea defaultValue="完成过校园二手平台课程项目；暂无实习、竞赛和职业证书。" /><small className="field-help">课程项目、社团、比赛、实习或证书都可以。</small></label>
              <label>你对未来生活有什么想法？<textarea defaultValue="希望留在省会或家乡附近；更喜欢稳定、可预期的工作；每周大约能投入 6 小时探索方向。" /><small className="field-help">例如：想在哪座城市、偏好稳定还是高成长、家人的期待、每周能投入多少时间。</small></label>
              <label className="upload-box">有简历的话，可以一起看看（选填）<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? "")} /><span>{resumeName || "选择 PDF / Word 文件"}</span><small>本次体验不会读取文件内容</small></label>
              <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>我同意 AI 在本次体验中使用这些信息；我可以随时修改或删除。</span></label>
              <button className="primary-button full" type="submit" disabled={!consent}>让 AI 帮我分析 <span>→</span></button>
            </form>
            <aside className="profile-preview">
              <span className="section-kicker light">即将分析</span><h3>AI 将从这些信息出发</h3><p>先整理你想要的生活和当前基础，再判断哪条路更值得优先体验。</p>
              <div className="preview-evidence"><span>最想要的生活</span><b>{purpose.title}</b><small>来自：你刚才的选择</small></div>
              <div className="preview-evidence"><span>比较看重</span><b>稳定与地域偏好较高</b><small>来自：情境回答和未来想法</small></div>
              <div className="preview-evidence"><span>目前的基础</span><b>计算机专业，有课程项目</b><small>来自：你填写的资料</small></div>
              <div className="preview-evidence"><span>还要体验</span><b>能否接受体制内真实工作内容</b><small>原因：目前还没有真实岗位体验</small></div>
              <footer>下一步，AI 会整理依据、匹配评分标准，并生成能力雷达。</footer>
            </aside>
          </div>
        </section>
      )}

      {stage === "analyzing" && (
        <section className="content-page analysis-page">
          <div className="page-heading centered analysis-heading">
            <span className="section-kicker">AI 画像生成过程</span>
            <h2>{analysisComplete ? "你的初始画像已生成" : "正在拼出你的职业坐标"}</h2>
            <p>情境答案提供线索，已确认事实和评分标准共同决定画像结果。</p>
          </div>
          <div className="analysis-workspace">
            <article className="analysis-engine-card">
              <div className="analysis-engine-top"><span><i /> GROWTH ENGINE</span><b>{analysisComplete ? "READY" : "ANALYZING"}</b></div>
              <div className={`analysis-orbit ${analysisComplete ? "is-complete" : ""}`} aria-label={`画像分析进度 ${analysisProgress}%`}>
                <i /><i /><i />
                <div><strong>{analysisProgress}%</strong><small>{analysisComplete ? "分析完成" : "画像生成中"}</small></div>
              </div>
              <div className="analysis-current" aria-live="polite">
                <span>{analysisComplete ? "已完成" : `步骤 ${analysisStep + 1} / ${analysisSteps.length}`}</span>
                <b>{analysisComplete ? "六维评分与证据链已就绪" : analysisSteps[analysisStep].label}</b>
                <p>{analysisComplete ? "已生成用户画像" : analysisSteps[analysisStep].detail}</p>
              </div>
              <div className="analysis-progress"><i style={{ width: `${analysisProgress}%` }} /></div>
              <div className="analysis-sources"><span>情境回答 {answers.filter((answer) => answer >= 0).length} 条</span><span>事实资料 5 类</span><span>路径参照 3 类</span></div>
            </article>
            <article className="analysis-trace-card">
              <div className="analysis-trace-heading"><div><span>可解释分析记录</span><small>你可以看到分数从哪里来</small></div><b>逐项核对</b></div>
              <div className="analysis-step-list">
                {analysisSteps.map((item, index) => {
                  const isDone = index < analysisStep;
                  const isActive = index === analysisStep && !analysisComplete;
                  return (
                    <div className={`${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`} key={item.label}>
                      <span>{isDone ? "✓" : String(index + 1).padStart(2, "0")}</span>
                      <div><b>{item.label}</b><p>{isDone ? item.output : item.detail}</p></div>
                      <i>{isDone ? "完成" : isActive ? "处理中" : "等待"}</i>
                    </div>
                  );
                })}
              </div>
              <div className={`analysis-result ${analysisComplete ? "is-visible" : ""}`}>
                <div><span>生成结果</span><b>6 维初评</b></div><div><span>路径线索</span><b>考公更突出</b></div><div><span>系统建议</span><b>先体验再决定</b></div>
              </div>
              <div className="analysis-actions">
                {!analysisComplete && <button className="skip-button" onClick={() => setAnalysisStep(analysisSteps.length)}>跳过分析过程</button>}
                <button className="primary-button" disabled={!analysisComplete} onClick={() => setStage("positioning")}>查看我的用户画像 <span>→</span></button>
              </div>
            </article>
          </div>
          <p className="analysis-prototype-note">demo演示</p>
        </section>
      )}

      {stage === "positioning" && (
        <section className="content-page positioning-page">
          <div className="page-heading positioning-heading">
            <div><span className="section-kicker">01 · 职途初鉴</span><h2>先看清现在的自己</h2></div>
          </div>
          <div className="positioning-layout">
            <article className="coordinate-card">
              <div className="coordinate-heading"><div><span>AI 初评 · 0–5 分</span><h3>我的能力雷达</h3></div></div>
              <div className="target-reference target-public"><div><span>初步结论</span><b>考公方向好像更匹配</b></div><p>你的选择里反复出现了稳定、规则感和现实判断。</p></div>
              <div className="coordinate-content">
                <div className="radar-chart" role="img" aria-label="六维能力雷达：性格4.5，专业能力2.4，兴趣匹配度3.4，学习与知识3.1，压力应对4.8，沟通协作3.9">
                  <div className="radar-ring radar-ring-outer" /><div className="radar-ring radar-ring-middle" /><div className="radar-ring radar-ring-inner" />
                  {abilityDimensions.map((item, index) => <i className={`radar-axis axis-${index}`} key={item.label} />)}
                  <div className="radar-shape" style={{ clipPath: `polygon(${radarPoints})` }} />
                  {abilityDimensions.map((item, index) => {
                    const angle = -Math.PI / 2 + index * (Math.PI * 2 / abilityDimensions.length);
                    const radius = (item.value / 5) * 42;
                    return <em className="radar-dot" style={{ left: `${50 + Math.cos(angle) * radius}%`, top: `${50 + Math.sin(angle) * radius}%`, background: item.color }} key={item.label} />;
                  })}
                  {abilityDimensions.map((item, index) => <span className={`radar-label radar-label-${index}`} key={item.label}>{item.label}</span>)}
                  <strong>3.7</strong><small>六维均分 / 5</small>
                </div>
                <div className="dimension-explorer">
                  <div className="dimension-tabs" role="tablist" aria-label="能力雷达六个维度">
                    {abilityDimensions.map((item, index) => (
                      <button
                        className={activeDimension === index ? "is-active" : ""}
                        onClick={() => setActiveDimension(index)}
                        role="tab"
                        aria-selected={activeDimension === index}
                        aria-controls="dimension-detail"
                        key={item.label}
                      >
                        <span><i style={{ background: item.color }} />{item.label}</span><b>{item.value.toFixed(1)}</b>
                      </button>
                    ))}
                  </div>
                  <article className="dimension-detail" id="dimension-detail" role="tabpanel" aria-live="polite">
                    <div className="dimension-row-head"><div><span>{selectedDimension.label}</span>{selectedDimension.referenceOnly && <small>通用参考</small>}</div><div><em>{selectedDimension.tag}</em><b>{selectedDimension.value.toFixed(1)}</b><small>/ 5</small></div></div>
                    <p>{selectedDimension.summary}</p>
                    <i><em style={{ width: `${(selectedDimension.value / 5) * 100}%`, background: selectedDimension.color }} /></i>
                    <div className="dimension-meta"><span>依据：{selectedDimension.evidence}</span><b>置信度{confidenceLabels[selectedDimension.confidence as keyof typeof confidenceLabels]}</b></div>
                  </article>
                </div>
              </div>
              <footer className="score-footer"><p>初评分数会随体验和真实反馈更新。</p></footer>
            </article>
            <aside className="position-summary">
              <div className="position-summary-head"><div><span className="section-kicker light">AI 路径建议</span><h3>考公方向<br />值得优先体验</h3></div><div className="position-symbol">公</div></div>
              <div className="position-finding positive"><span>匹配依据</span><b>稳健有序、压力韧性突出、沟通方式稳妥</b><small>性格 4.5 · 压力应对 4.8 · 沟通协作 3.9</small></div>
              <div className="position-finding"><span>还要验证</span><b>是否喜欢真实岗位内容，也能接受备考过程</b></div>
              <div className="position-thesis"><span>下一步</span><p>先看看与自己相同起点的人</p></div>
              <div className="position-actions"><button className="primary-button full" onClick={() => setStage("rolemodels")}>看看相似的人怎么走 <span>→</span></button><button className="position-compare" onClick={() => setStage("futures")}>先看看三条路径对比</button></div>
            </aside>
          </div>
        </section>
      )}

      {stage === "rolemodels" && (
        <section className="content-page rolemodel-page">
          <div className="rolemodel-toolbar">
            <div className="rolemodel-heading"><span className="section-kicker">02 · 同路人的今天</span><h2>看看别人走过的路</h2></div>
            <div className="sample-direction-tabs" role="tablist" aria-label="切换案例方向">
              {([
                { id: "public" as PathId, label: "考公", status: "3 个样本" },
                { id: "postgrad" as PathId, label: "考研", status: "建设中" },
                { id: "job" as PathId, label: "求职", status: "建设中" },
              ]).map((item) => (
                <button className={sampleDirection === item.id ? "is-active" : ""} onClick={() => setSampleDirection(item.id)} role="tab" aria-selected={sampleDirection === item.id} key={item.id}>
                  <b>{item.label}</b><span>{item.status}</span>
                </button>
              ))}
            </div>
          </div>

          {sampleDirection === "public" ? (
            <div className="rolemodel-layout">
              <aside className="rolemodel-list" aria-label="考公人生样本">
                <div className="rolemodel-list-head"><span>选择一个案例</span><small>机会 · 生活 · 风险</small></div>
                {roleModelCases.map((item, index) => (
                  <button className={activeRoleModel === index ? "is-active" : ""} onClick={() => setActiveRoleModel(index)} key={item.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><small>{item.type}</small><b>{item.title}</b><p>{item.match.slice(0, 2).join(" · ")}</p></div>
                    <i>→</i>
                  </button>
                ))}
              </aside>

              <article className="rolemodel-detail">
                <div className="rolemodel-detail-top">
                  <div><span>{activeRoleModelCase.type}</span><h3>{activeRoleModelCase.title}</h3></div>
                  <div className="match-tags">{activeRoleModelCase.match.map((item) => <b key={item}>{item}</b>)}{activeConversationEvidence.length > 0 && <b className="is-confirmed">对话线索 {activeConversationEvidence.length}</b>}</div>
                </div>
                <div className="route-timeline" aria-label="案例成长路线">
                  {activeRoleModelCase.route.map((item, index) => <div key={item}><span>{index + 1}</span><b>{item}</b></div>)}
                </div>
                <div className="rolemodel-now"><span>她现在的生活</span><p>{activeRoleModelCase.now}</p></div>
                <div className="rolemodel-tradeoffs">
                  <div className="gain"><span>得到什么</span><p>{activeRoleModelCase.gain}</p></div>
                  <div><span>需要承担</span><p>{activeRoleModelCase.cost}</p></div>
                </div>
                <div className="rolemodel-note"><span>这条路线告诉你</span><p>{activeRoleModelCase.note}</p></div>
                <div className="rolemodel-actions"><button className="ghost-button route-question-button" onClick={() => setRouteChatOpen(true)}>✦ 问问这条路</button><button className="primary-button" onClick={() => setStage("simulation")}>参考这条路，体验我的考公人生 <span>→</span></button></div>
              </article>
            </div>
          ) : (
            <article className="direction-placeholder">
              <div>{sampleDirection === "postgrad" ? "研" : "职"}</div>
              <span>{sampleDirection === "postgrad" ? "考研" : "求职"}样本库</span>
              <h3>这个方向正在建设中</h3>
              <p>正式产品会使用相同结构，展示相似起点、关键路线、当前生活和风险案例。</p>
              <div><button className="primary-button" onClick={() => setSampleDirection("public")}>先看考公样本</button><button className="ghost-button" onClick={() => setStage("futures")}>查看方向概览</button></div>
            </article>
          )}

          {routeChatOpen && (
            <div className="route-chat-backdrop" onMouseDown={() => setRouteChatOpen(false)}>
              <aside className="route-chat" role="dialog" aria-modal="true" aria-label="未来体验 Agent 问答" onMouseDown={(event) => event.stopPropagation()}>
                <header className="route-chat-header">
                  <div><span className="agent-avatar">AI</span><div><small>未来体验 Agent</small><h3>问问这条路</h3></div></div>
                  <button onClick={() => setRouteChatOpen(false)} aria-label="关闭问答">×</button>
                </header>
                <div className="route-chat-context"><span>正在参考</span><b>{activeRoleModelCase.title}</b></div>
                <div className="route-chat-stream" aria-live="polite" ref={routeChatStreamRef}>
                  {routeChatPhase >= 1 && (
                    <>
                      <div className="chat-bubble user"><span>你</span><p>{activeRoleModelCase.question}</p></div>
                      {activeConversationEvidence.includes(activeRoleModelCase.initialSignal) && <div className="chat-profile-update"><span><small>对话线索已更新</small>{activeRoleModelCase.initialSignal}</span></div>}
                    </>
                  )}
                  {routeChatPhase === 2 && <div className="chat-bubble agent thinking"><span>AI</span><p>正在判断还缺哪项选择依据</p><i><b /><b /><b /></i></div>}
                  {routeChatPhase >= 3 && (
                    <>
                      <div className="chat-bubble agent followup"><span>AI · 还需要确认一件事</span><p>{activeRoleModelCase.followupQuestion}</p></div>
                      {selectedChatFollowup === null && <div className="chat-choice-list" role="group" aria-label="选择你的回答">{activeRoleModelCase.followups.map((item, index) => <button onClick={() => chooseRouteFollowup(index)} key={item.label}><span>{String.fromCharCode(65 + index)}</span>{item.label}<i>→</i></button>)}</div>}
                    </>
                  )}
                  {selectedChatFollowup !== null && routeChatPhase >= 4 && (
                    <>
                      <div className="chat-bubble user"><span>你</span><p>{activeRoleModelCase.followups[selectedChatFollowup].label}</p></div>
                      {activeConversationEvidence.includes(activeRoleModelCase.followups[selectedChatFollowup].signal) && <div className="chat-profile-update"><span><small>对话线索已更新</small>{activeRoleModelCase.followups[selectedChatFollowup].signal}</span></div>}
                      {routeChatPhase === 4 && <div className="chat-bubble agent thinking"><span>AI</span><p>正在结合你的回答重新组织问题</p><i><b /><b /><b /></i></div>}
                    </>
                  )}
                  {selectedChatFollowup !== null && routeChatPhase >= 5 && (
                    <div className={`route-research ${routeChatPhase >= 6 ? "is-done" : ""}`}>
                      <div><span>{routeChatPhase >= 6 ? "✓" : "⌕"}</span><b>{routeChatPhase >= 6 ? "资料核对完成" : "正在查询相关资料"}</b></div>
                      <div><span>{activeRoleModelCase.followups[selectedChatFollowup].label}</span>{activeRoleModelCase.searches.map((item) => <span key={item}>{item}</span>)}</div>
                    </div>
                  )}
                  {selectedChatFollowup !== null && routeChatPhase >= 6 && (
                    <>
                      <div className="chat-bubble agent answer"><span>AI · 结合你的回答</span><p>{activeRoleModelCase.answer} {activeRoleModelCase.followups[selectedChatFollowup].addition}</p><small>依据：{activeRoleModelCase.answerEvidence}</small></div>
                      {activeConversationEvidence.includes(activeRoleModelCase.candidate) && <div className="chat-profile-update final"><span><small>本轮画像已更新</small>{activeRoleModelCase.candidate}</span></div>}
                      <div className="chat-final-actions"><button className="ghost-button" onClick={() => setRouteChatOpen(false)}>继续看案例</button><button className="primary-button" onClick={() => { setRouteChatOpen(false); setStage("simulation"); }}>带着这些线索去体验 <span>→</span></button></div>
                    </>
                  )}
                </div>
                <div className={`route-chat-composer ${routeChatPhase >= 1 ? "is-sent" : ""}`}>
                  <span>{typedRouteQuestion}<i /></span><button aria-label="发送问题" disabled>↑</button>
                </div>
                <footer>演示问答使用预置案例与规则资料</footer>
              </aside>
            </div>
          )}
        </section>
      )}

      {stage === "futures" && (
        <section className="content-page futures-page">
          <div className="page-heading futures-heading">
            <span className="section-kicker">02 · 三种平行人生</span>
            <h2>三条路，先验证一条</h2>
            <p>结合你当前的选择与现实条件，系统建议先体验体制内；求职和升学继续保留。</p>
          </div>
          <div className="future-decision-grid">
            <article className="future-featured">
              <div className="future-featured-top"><span>{pathData.public.icon}</span><b>本次优先验证</b></div>
              <h3>{pathData.public.name}</h3>
              <p>{pathData.public.summary}</p>
              <div className="future-featured-content">
                <div><small>匹配线索</small>{pathData.public.evidence.map((item) => <span key={item}>✓ {item}</span>)}</div>
                <div><small>还要确认</small><p>{pathData.public.gap}</p></div>
              </div>
              <footer>
                <p><b>你想解决：</b>{purpose.title}</p>
                <button className="primary-button" onClick={() => setStage("simulation")}>体验我的考公人生 <span>→</span></button>
              </footer>
            </article>
            <aside className="future-alternatives">
              <div className="future-alternatives-heading"><span>继续保留</span><h3>另外两条路</h3></div>
              {(["job", "postgrad"] as PathId[]).map((id) => {
                const path = pathData[id];
                return (
                  <article className={`future-alternative ${path.tone}`} key={id}>
                    <div className="future-alternative-title"><span>{path.icon}</span><div><small>对照方向</small><h4>{path.name}</h4></div></div>
                    <p>{path.summary}</p>
                    <div><small>需要补充</small><span>{path.gap}</span></div>
                    <button className="ghost-button full" disabled>本次作为对照路径</button>
                  </article>
                );
              })}
            </aside>
          </div>
        </section>
      )}

      {stage === "simulation" && (
        <section className="content-page simulation-page">
          <div className="simulation-heading"><div><span className="section-kicker">03 · 真实样本未来体验</span><h2>试走一段真实的体制内生活</h2><p>四幕取材自公开上岸经历。先看见收益与代价，再决定是否继续。</p></div><div className="simulation-counter"><strong>0{lifeIndex + 1}</strong><span>/ 0{lifeScenes.length}</span></div></div>
          <div className="simulation-layout">
            <article className="story-phone">
              <div className="phone-status"><span>平行人生</span><b>{lifeScenes[lifeIndex].time}</b></div>
              <div className="life-progress"><i style={{ width: `${lifeProgress}%` }} /></div>
              <div className="story-meta-row"><span className="story-chapter">{lifeScenes[lifeIndex].chapter}</span><span className="story-source">{lifeScenes[lifeIndex].source}</span></div>
              <h3>{lifeScenes[lifeIndex].title}</h3><p className="story-copy">{lifeScenes[lifeIndex].story}</p>
              <div className="message-bubble">{lifeScenes[lifeIndex].message}</div>
              <div className="life-options" role="radiogroup" aria-label="选择你的反应">
                {lifeScenes[lifeIndex].options.map((option, index) => <button className={selectedLifeAnswer === index ? "is-selected" : ""} onClick={() => setSelectedLifeAnswer(index)} role="radio" aria-checked={selectedLifeAnswer === index} key={option.label}><span>{selectedLifeAnswer === index ? "✓" : String.fromCharCode(65 + index)}</span>{option.label}</button>)}
              </div>
              <button className="primary-button full" onClick={nextLifeScene} disabled={selectedLifeAnswer === null}>{lifeIndex === lifeScenes.length - 1 ? "看看体验改变了什么" : "进入下一幕"} <span>→</span></button>
            </article>
            <aside className="life-dashboard">
              <span className="section-kicker light">LIFE SIGNALS</span><h3>这次选择更新了什么</h3><p>只记录你对具体生活的反应，体验结束后再形成方向认知。</p>
              {conversationConcernCases.length > 0 && <div className="experience-concern"><span>从 Agent 带入的对话线索</span>{conversationConcernCases.flatMap((item) => (conversationEvidence[item.id] ?? []).slice(-2).map((evidence) => <b key={`${item.id}-${evidence}`}>{evidence}</b>))}</div>}
              <div className="life-stat-grid">{([
                  ["公共服务意愿", lifeStats.service],
                  ["规则任务适应", lifeStats.structure],
                  ["生活边界需求", lifeStats.boundary],
                  ["岗位现实认知", lifeStats.reality],
                ] as [string, number][]).map(([label, value]) => <div className="life-stat" key={label}><div><span>{label}</span><b>{value}</b></div><i><em style={{ width: `${value}%` }} /></i></div>)}</div>
              <div className="dashboard-note"><b>样本边界</b><p>公开经历展示可能的生活，不代表所有岗位。具体地区、部门和岗位仍需单独核实。</p></div>
            </aside>
          </div>
        </section>
      )}

      {stage === "recalibration" && (
        <section className="content-page recalibration-page">
          <div className="recalibration-heading">
            <div><span className="section-kicker">04 · 更新后的方向画像</span><h2>你对考公，已经有了具体认识</h2></div>
            <p>这是方向认知分，反映你目前了解多少；它不是岗位匹配率，也不是上岸概率。</p>
          </div>
          <div className="updated-profile-grid">
            <article className="direction-knowledge-card">
              <header>
                <div><span>考公方向认知</span><h3>值得继续探索，先看具体岗位</h3></div>
                <div className="knowledge-score"><strong>{directionKnowledgeScore}</strong><span>/ 100</span><small>体验前 {directionKnowledgeBefore}</small></div>
              </header>
              <div className="knowledge-dimensions">
                {directionKnowledge.map((item, index) => (
                  <div className={`knowledge-dimension ${knowledgeScorePulse === index ? "is-updating" : ""}`} key={item.label}>
                    {knowledgeScorePulse === index && <b className="knowledge-score-increment" aria-label="方向认知增加 1 分">+1</b>}
                    <div><span>{item.label}</span><small>{item.before} → <b>{item.after}</b></small></div>
                    <i><em style={{ width: `${item.after}%` }} /></i>
                    <p>{item.note}</p>
                  </div>
                ))}
              </div>
              <div className="knowledge-evidence"><span>本轮新增认识</span>{lifeEvidence.slice(-2).map((item) => <b key={item}>✓ {item}</b>)}</div>
              <footer><p>下一步先领取一个低成本任务，让规划真正开始执行。</p><button className="primary-button" onClick={() => setStage("execution")}>领取我的第一阶段任务 <span>→</span></button></footer>
            </article>

            <section className="knowledge-agent-card">
              <header><span className="agent-avatar">AI</span><div><small>方向认知 Agent</small><h3>还有哪里不确定？</h3></div></header>
              <p className="knowledge-agent-intro">选择一个疑问，AI 会模拟检索近期公开帖子与经历，再整理共同点和差异。</p>
              <div className="knowledge-question-list">
                {directionKnowledgeQuestions.map((item, index) => <button className={activeKnowledgeQuestion === index ? "is-active" : ""} onClick={() => askDirectionKnowledge(index)} key={item.question}><span>?</span>{item.question}<i>{answeredKnowledgeQuestions.includes(index) ? "已 +1" : "→"}</i></button>)}
              </div>
              <div className="free-question-row"><input type="text" placeholder="输入你自己的问题……" aria-label="自由提问" /><button onClick={() => { setActiveKnowledgeQuestion(null); setKnowledgeSearchPhase(0); setFreeQuestionNotice(true); }}>发送</button></div>
              <div className={`knowledge-answer ${knowledgeSearchPhase === 1 ? "is-searching" : ""}`} aria-live="polite">
                {freeQuestionNotice && <div className="knowledge-development"><span>建设中</span><h4>自由提问正在开发中</h4><p>当前 Demo 可以先体验上方三个预置问题。</p></div>}
                {!freeQuestionNotice && activeKnowledgeQuestion === null && <div className="knowledge-answer-empty"><span>⌕</span><p>选择上方问题，查看 AI 如何搜索和回答。</p></div>}
                {activeKnowledgeQuestion !== null && knowledgeSearchPhase === 1 && <div className="knowledge-searching"><span>AI 正在搜索近期公开帖子</span><div><i /><i /><i /></div><p>提取相似经历 · 对照不同岗位 · 整理共同结论</p></div>}
                {activeKnowledgeQuestion !== null && knowledgeSearchPhase === 2 && <div className="knowledge-answer-result"><span>AI 整理结果</span><h4>{directionKnowledgeQuestions[activeKnowledgeQuestion].question}</h4><p>{directionKnowledgeQuestions[activeKnowledgeQuestion].answer}</p><div>{directionKnowledgeQuestions[activeKnowledgeQuestion].sources.map((item) => <small key={item}>{item}</small>)}</div></div>}
              </div>
              <footer>Demo 使用预置检索结果；正式版将展示原帖链接、发布时间和引用片段。</footer>
            </section>
          </div>
        </section>
      )}

      {stage === "execution" && (
        <section className="content-page execution-page">
          <div className="execution-heading"><div><span className="section-kicker">05 · 规划开始执行</span><h2>先陪你把第一步走完</h2></div><p>系统会安排任务，也会在你没做完时追问原因、调整难度，并解释计划为什么改变。</p></div>
          <div className="execution-workspace">
            <article className="execution-chat-panel">
              <header><div><span className="agent-avatar">AI</span><div><small>成长规划 Agent</small><h3>第一阶段 · 7 天考公探索</h3></div></div><span className="agent-online">持续陪伴中</span></header>
              <div className="execution-chat-stream" ref={executionChatRef} aria-live="polite">
                <div className="chat-day-divider"><span>周一 · 计划启动</span></div>
                <div className="execution-message agent"><span>AI</span><p>你向往可预期的生活，但还不了解自己能报什么岗位。第一周先验证岗位范围和学习入口，不急着决定是否正式备考。</p></div>
                <div className="structured-message task-message">
                  <header><span>初步任务</span><b>权重 30</b></header><h4>筛选 3 个真实可报岗位</h4><p>结合计算机专业、本科学历、应届身份和地域偏好完成筛选。</p>
                  <div><span>截止：周五 20:00</span><span>预计：45 分钟</span><span>高优先</span></div>
                </div>
                {executionPhase === 0 && <button className="chat-simulation-button" onClick={() => setExecutionPhase(1)}>模拟两天后，任务仍未开始 <span>→</span></button>}

                {executionPhase >= 1 && <><div className="chat-day-divider alert"><span>周三 · 距离截止还有 2 天</span></div><div className="structured-message reminder-message"><header><span>任务提醒</span><b>当前进度 0%</b></header><h4>“筛选 3 个可报岗位”还没有开始</h4><p>我想先了解阻碍，再决定是否需要调整计划。</p></div></>}
                {executionPhase === 1 && <div className="obstacle-choice-card"><span>是什么让你没有开始？</span><div>{executionObstacles.map((item, index) => <button onClick={() => chooseExecutionObstacle(index)} key={item.label}>{item.label}<i>→</i></button>)}</div></div>}

                {executionPhase >= 2 && <><div className="execution-message user"><span>你</span><p>{activeExecutionObstacle.label}</p></div><div className="execution-message agent"><span>AI</span><p>{activeExecutionObstacle.review}</p></div><div className="structured-message adjustment-message"><header><span>计划已重新计算</span><b>{activeExecutionObstacle.deadline}</b></header><div className="adjustment-compare"><div><small>原任务</small><s>独立筛选 3 个岗位</s></div><span>→</span><div><small>新任务</small><strong>{activeExecutionObstacle.adjustedTitle}</strong></div></div><p>{activeExecutionObstacle.change}</p><footer>完成标准：{activeExecutionObstacle.criteria}</footer></div><div className={`execution-signal-candidate ${executionSignalStatus ?? ""}`}><div><small>候选画像线索</small><b>{activeExecutionObstacle.signal}</b></div>{executionSignalStatus === null ? <div><button onClick={() => setExecutionSignalStatus("deleted")}>删除</button><button onClick={() => setExecutionSignalStatus("kept")}>保留</button></div> : <span>{executionSignalStatus === "kept" ? "✓ 已保留，可随时修改" : "已删除，不进入画像"}</span>}</div></>}
                {executionPhase === 2 && <button className="chat-simulation-button primary" onClick={() => setExecutionPhase(3)}>接受调整，开始第一步 <span>→</span></button>}

                {executionPhase >= 3 && <div className="structured-message guided-task-message"><header><span>AI 筛选引导</span><b>岗位样本</b></header><h4>省会市直 · 信息化管理岗</h4><div className="job-condition-tags"><span>计算机类</span><span>本科</span><span>应届</span><span>省会</span></div><p>岗位样本满足当前四项基础条件。正式选择前仍需核对完整公告、工作内容和竞争情况。</p>{executionPhase === 3 && <button onClick={() => setExecutionPhase(4)}>确认岗位样本，并阅读考试结构 <span>→</span></button>}</div>}
                {executionPhase >= 4 && <><div className="structured-message completion-message"><span>✓</span><div><small>本轮进度已更新</small><h4>完成 2 项任务 · 加权进度 50%</h4><p>已确认岗位样本，并读懂行测与申论的基本结构。</p></div></div><button className="chat-simulation-button primary" onClick={() => setStage("executionReview")}>快进到周日晚，查看 AI 周复盘 <span>→</span></button></>}
              </div>
            </article>

            <aside className="execution-dashboard">
              <div className="execution-dashboard-top"><span className="section-kicker light">WEEKLY PROGRESS</span><b>{executionProgress < 15 ? "起步阶段" : "加速阶段"}</b></div>
              <div className="weighted-progress-value"><strong>{executionProgress}</strong><span>%</span><small>按任务难度加权</small></div>
              <div className={`weighted-progress-track ${executionProgressClass}`}><i style={{ width: `${executionProgress}%` }} /></div>
              <p className="progress-formula">已完成任务权重 {executionProgress} ÷ 总权重 100</p>
              <div className="task-summary-tabs">
                <button className={expandedTaskGroup === "completed" ? "is-active" : ""} onClick={() => setExpandedTaskGroup((current) => current === "completed" ? null : "completed")}><span>已完成</span><b>{completedExecutionTasks.length}</b></button>
                <button className={expandedTaskGroup === "pending" ? "is-active" : ""} onClick={() => setExpandedTaskGroup((current) => current === "pending" ? null : "pending")}><span>未完成</span><b>{pendingExecutionTasks.length}</b></button>
              </div>
              {expandedTaskGroup === "completed" && <div className="task-summary-list completed">{completedExecutionTasks.length === 0 ? <p>还没有完成任务。系统会先询问阻碍，不会给你贴上“拖延”标签。</p> : completedExecutionTasks.map((task) => <div key={task.title}><span>✓</span><p><b>{task.title}</b>{task.category} · 权重 {task.weight}</p></div>)}{completedExecutionTasks.length > 0 && <footer>总计投入时间：约 40 分钟</footer>}</div>}
              {expandedTaskGroup === "pending" && <div className="task-summary-list pending">{pendingExecutionTasks.map((task) => <div key={task.title}><span>{task.priority}</span><p><b>{task.title}</b>{task.deadline} · 权重 {task.weight}</p></div>)}<footer>预计还需：约 2 小时</footer></div>}
              {expandedTaskGroup === null && <div className="dashboard-task-preview"><span>当前最高优先级</span><h4>{executionPhase >= 2 ? activeExecutionObstacle.adjustedTitle : "筛选 3 个真实可报岗位"}</h4><p>{executionPhase >= 4 ? "本项已完成，下一步体验华图入门课。" : `截止时间：${executionPhase >= 2 ? activeExecutionObstacle.deadline : "周五 20:00"}`}</p></div>}
              <div className="monitoring-preview"><span>系统还会关注</span><div><b>日 / 周复盘</b><b>关键节点 7·3·1 天提醒</b><b>身心信号需授权</b></div></div>
            </aside>
          </div>
        </section>
      )}

      {stage === "executionReview" && (
        <section className="content-page execution-review-page">
          <div className="execution-review-heading"><div><span className="section-kicker">05 · 周复盘与计划校准</span><h2>这一周，先看看走到了哪里</h2></div><p>已完成 2 项，另有 2 项还需验证。系统会根据这周的真实进度安排下一阶段。</p></div>
          <div className="review-metric-grid">
            <article><span>任务完成率</span><strong>50%</strong><p>2 / 4 项任务完成</p></article>
            <article><span>目标偏离度</span><strong>40%</strong><p>轻度偏离 · 尚未体验学习</p></article>
            <article><span>本周投入</span><strong>40<small>min</small></strong><p>岗位认知与考试结构</p></article>
            <article><span>计划调整</span><strong>2<small>项</small></strong><p>缩小任务 · 顺延节点</p></article>
          </div>
          <div className="execution-review-grid">
            <article className="review-report-card">
              <header><span>本周完成状态</span><h3>完成第一轮岗位探索</h3></header>
              <div className="review-task-columns"><div><span>已完成</span>{executionTasks.slice(0, 2).map((task) => <p key={task.title}><b>✓</b>{task.title}<small>权重 {task.weight}</small></p>)}</div><div><span>未完成</span>{executionTasks.slice(2).map((task) => <p key={task.title}><b>·</b>{task.title}<small>权重 {task.weight}</small></p>)}</div></div>
              <div className="review-reason"><span>未完成原因</span><b>{activeExecutionObstacle.label}</b><p>{activeExecutionObstacle.review}</p></div>
            </article>
            <aside className={`review-agent-card next-plan-phase-${nextPlanPhase}`} aria-live="polite">
              {nextPlanPhase === 0 && <>
                <header><span className="agent-avatar">AI</span><div><small>成长规划 Agent</small><h3>那我们基于现在已经完成的任务，规划一下下一阶段吧？</h3></div></header>
                <div className="review-agent-message"><p>你已经确认了可报岗位，也了解了考试结构。下一阶段需要补上学习体验，同时控制任务量，避免和课程安排冲突。</p></div>
                <div className="review-plan-basis">
                  <div><span>已经完成</span><b>岗位范围、考试结构</b></div>
                  <div><span>还未验证</span><b>学习感受、持续投入意愿</b></div>
                  <div><span>本轮阻碍</span><b>{activeExecutionObstacle.label}</b></div>
                </div>
                <div className="review-decision"><button className="ghost-button" onClick={() => setStage("execution")}>查看执行记录</button><button className="primary-button" onClick={() => { setNextPlanStep(0); setNextPlanPhase(1); }}>基于当前进度，开启下一阶段 <span>→</span></button></div>
              </>}

              {nextPlanPhase === 1 && <div className="next-plan-processing">
                <header><span className="agent-avatar is-thinking">AI</span><div><small>成长规划 Agent</small><h3>正在重新规划</h3></div></header>
                <p>把这周的完成情况、阻碍和方向意愿放在一起计算。</p>
                <div className="next-plan-progress"><i style={{ width: `${(nextPlanStep / 3) * 100}%` }} /></div>
                <div className="next-plan-steps">
                  {["汇总已完成任务与未完成原因", "调整任务难度和先后顺序", "生成可在 3 天内完成的新计划"].map((item, index) => <div className={nextPlanStep > index ? "is-done" : nextPlanStep === index ? "is-active" : ""} key={item}><span>{nextPlanStep > index ? "✓" : `0${index + 1}`}</span><b>{item}</b><i /></div>)}
                </div>
                <small className="next-plan-processing-note">每项变化都会保留依据</small>
              </div>}

              {nextPlanPhase === 2 && <div className="next-plan-success">
                <header><span className="next-plan-success-icon">✓</span><div><small>规划完成</small><h3>下一阶段已开启</h3></div></header>
                <p>接下来先用 3 天完成一次低成本学习体验，再决定是否增加备考强度。</p>
                <div className="next-plan-task-list">
                  <div><span>DAY 1</span><b>体验 20 分钟华图考公入门课</b><small>完成标准：看完并记录 1 个新认识</small></div>
                  <div><span>DAY 2</span><b>写下愿意与不愿意承担的代价</b><small>完成标准：各列出 2 项真实感受</small></div>
                  <div><span>DAY 3</span><b>与企业求职路径做一次对照</b><small>完成标准：保留 1 条主路径和 1 条备选路径</small></div>
                </div>
                <div className="next-plan-meta"><span>总投入约 60 分钟</span><span>3 天后再次复盘</span><b>计划状态：进行中</b></div>
              </div>}
            </aside>
          </div>
          <div className="review-final-note"><span>本轮画像变化</span><b>{executionSignalStatus === "deleted" ? "你删除了本轮候选线索，画像保持不变。" : executionSignalStatus === "kept" ? activeExecutionObstacle.signal : "本轮线索仍待你确认，暂不进入画像。"}</b><p>下一阶段仍由行动结果继续校准，不承诺考试或就业结果。</p></div>
        </section>
      )}
    </main>
  );
}
