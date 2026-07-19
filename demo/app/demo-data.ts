import type { AuthorizationSourceId, ExecutionTask, NextStageChoice, PathId, PurposeId, QuizOption, ReviewWindow, Stage } from "./demo-types";

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const journeySteps = [
  { label: "初始画像", short: "认识自己" },
  { label: "方向探索", short: "发现可能" },
];

export const journeyDestinations: Stage[] = ["result", "rolemodels"];
export const growthManagementStages: Stage[] = ["importing", "execution", "progress", "executionReview", "companion", "companionReview", "stageSummary"];

export const abilityDimensions = [
  { label: "性格适配", value: 4.5, tag: "稳健有序", summary: "做选择时重视规则、确定性和责任边界，与多数公共服务岗位的工作方式较契合。", evidence: "稳定偏好、规则任务与现实取舍情境", confidence: "medium", referenceOnly: false, color: "#6757e5" },
  { label: "专业能力", value: 2.4, tag: "基础起步", summary: "现有专业成果较少，距离考公准备要求仍需补充岗位筛选、行测和申论体验。", evidence: "资料填写：1 个课程项目，暂无备考经历", confidence: "medium", referenceOnly: false, color: "#8a72ed" },
  { label: "兴趣匹配度", value: 3.4, tag: "稳定导向", summary: "稳定、地域和生活节奏与你的期待较一致，具体岗位兴趣仍需真实体验。", evidence: "人生课题 + 稳定与地域偏好", confidence: "medium", referenceOnly: false, color: "#ff8a55" },
  { label: "学习与知识", value: 3.1, tag: "基础达标", summary: "本科专业基础处于中游，具备继续学习的起点，持续学习成果仍待补充。", evidence: "资料填写：本科大二、专业成绩中游", confidence: "medium", referenceOnly: false, color: "#d9b63e" },
  { label: "抗压与情绪", value: 4.8, tag: "韧性突出", summary: "计划受阻后倾向缩小任务、继续推进，对备考节奏和规则型任务有较好耐受。", evidence: "计划中断、风险比较与规则任务情境", confidence: "medium", referenceOnly: false, color: "#2d9f7f" },
  { label: "沟通协作", value: 3.9, tag: "沟通稳妥", summary: "愿意说明顾虑并协调现实期待，具备公共服务场景需要的基础沟通意识。", evidence: "家庭期待协商情境 + 课程项目经历", confidence: "medium", referenceOnly: false, color: "#4778df" },
  { label: "健康情况", value: 4.1, tag: "状态稳定", summary: "目前的日常状态能够支持常规学习与岗位体验；如后续出现明确限制，任务强度和岗位建议会相应调整。", evidence: "用户确认的健康情况与日常状态记录", confidence: "low", referenceOnly: false, color: "#26a6a1" },
  { label: "家庭情况", value: 3.6, tag: "支持较强", summary: "家庭支持继续探索，但异地选择仍需提前沟通；规划会优先保留现实上更容易实施的路径。", evidence: "家庭支持、地域偏好与可投入时间确认", confidence: "medium", referenceOnly: false, color: "#d56f9c" },
];

export const analysisSteps = [
  { label: "读取手动资料", detail: "核对学校、年级、专业、经历与现实约束", output: "手动填写资料已完成核对" },
  { label: "同步授权数据", detail: "读取用户勾选的平台样例数据", output: "授权数据已转成可追溯的任务线索" },
  { label: "整理情境回答证据", detail: "提取人生课题与情境选择中的稳定线索", output: "只保留可追溯的选择依据" },
  { label: "匹配八维建模口径", detail: "将能力表现和现实支持条件整理为八项画像指标", output: "八项指标已完成统一映射" },
  { label: "检索职业路径资料库", detail: "查找公考 / 考编、企业求职与继续升学要求", output: "获得 3 类路径的通用能力参照" },
  { label: "交叉校验并生成画像", detail: "检查证据冲突、信息缺口和结论置信度", output: "低置信度结论已标记为待验证" },
];

export const authorizationSources: { id: AuthorizationSourceId; icon: string; name: string; scope: string; insight: string }[] = [
  { id: "bilibili", icon: "B", name: "Bilibili", scope: "收藏与学习分区", insight: "近期关注公考入门、效率工具和计算机课程" },
  { id: "github", icon: "G", name: "GitHub", scope: "公开仓库与贡献记录", insight: "有 3 个课程项目，前端实践多于算法训练" },
  { id: "huatu", icon: "华", name: "华图", scope: "课程与练习记录", insight: "完成考公导学，资料分析尚未开始系统训练" },
  { id: "watch", icon: "⌚", name: "Apple Watch", scope: "睡眠、活动与心率趋势", insight: "用于安排任务强度，不进行心理或健康诊断" },
];

export const profileImportSteps = ["读取画像 v1 与授权范围", "转换为任务偏好和时间约束", "生成 Todo List 与复盘节点"];

export const confidenceLabels = { high: "较高", medium: "中等", low: "较低" } as const;

export const interpretationSteps = [
  { label: "整理回答", detail: "把 8 次选择转换为可追溯线索" },
  { label: "寻找重复偏好", detail: "识别多次出现的生活期待与选择方式" },
  { label: "形成第一印象", detail: "生成一个可修改的临时成长标签" },
];

export const lifePurposes: { id: PurposeId; icon: string; title: string; description: string; signal: string; tag: string }[] = [
  { id: "steady", icon: "稳", title: "找到一种可预期的生活", description: "希望工作、城市和生活节奏更确定，也能照顾家人。", signal: "比起一时的高回报，你更在意一种能够安排生活的确定感", tag: "稳定让我走得更远" },
  { id: "independent", icon: "立", title: "尽快实现经济独立", description: "想减少家庭压力，拥有不依赖别人做选择的底气。", signal: "你当前把经济独立和自主选择权放在优先位置", tag: "先获得选择权" },
  { id: "growth", icon: "升", title: "获得更快的成长上升", description: "想继续往上走，让能力、收入和平台都持续成长。", signal: "你当前更关心成长速度与长期上升空间", tag: "成长要看得见" },
  { id: "self", icon: "我", title: "做一次真正属于自己的选择", description: "想听清自己的声音，减少同学、家人和热门路线的影响。", signal: "你当前最想确认哪种选择真正属于自己", tag: "人生自己作答" },
  { id: "unclear", icon: "?", title: "我还说不清，只想先走一步", description: "暂时没有答案，希望从一件小事开始积累真实体验。", signal: "你当前需要一个低成本起点，先积累真实体验", tag: "先走一步" },
];

export const questions: { eyebrow: string; title: string; options: QuizOption[] }[] = [
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

export const pathData: Record<PathId, {
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

export const roleModelCases = [
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

export const executionObstacles = [
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

export const executionTasks: ExecutionTask[] = [
  { id: "position-check", title: "确认 1 个可报岗位", category: "岗位认知", weight: 30, deadline: "周五 20:00", priority: "高优先", durationMinutes: 30, deadlineOrder: 1, unlocks: 2, criteria: "核对专业、学历、应届身份和地域四项条件" },
  { id: "exam-structure", title: "读懂行测与申论结构", category: "考试认知", weight: 20, deadline: "周六 18:00", priority: "中优先", durationMinutes: 20, deadlineOrder: 2, unlocks: 1, criteria: "用自己的话写出两类考试各自考什么" },
  { id: "learning-trial", title: "体验 20 分钟华图入门课", category: "学习体验", weight: 30, deadline: "周日 16:00", priority: "中优先", durationMinutes: 40, deadlineOrder: 3, unlocks: 1, criteria: "完成 20 分钟课程、配套练习和一次主动反馈" },
  { id: "cost-reflection", title: "记录愿意与不愿意付出的代价", category: "方向复盘", weight: 20, deadline: "周日 20:00", priority: "低优先", durationMinutes: 20, deadlineOrder: 4, unlocks: 0, criteria: "愿意与不愿意承担的代价各写 2 项" },
];

export const huatuDemoResources = {
  locate: {
    id: "HT-DEMO-DATA-01",
    title: "资料分析入门：快速定位材料数据",
    type: "入门微课",
    duration: 20,
    difficulty: "基础",
    matchedProblem: "材料数据定位",
    practice: "10 道材料定位题",
  },
  formula: {
    id: "HT-DEMO-DATA-02",
    title: "资料分析公式：从题型到计算式",
    type: "公式导学",
    duration: 18,
    difficulty: "基础",
    matchedProblem: "公式调用与题型识别",
    practice: "8 道公式匹配题",
  },
  calculate: {
    id: "HT-DEMO-DATA-03",
    title: "资料分析速算：截位与比例法",
    type: "技巧微课",
    duration: 22,
    difficulty: "基础",
    matchedProblem: "计算速度与正确率",
    practice: "10 道基础速算题",
  },
  pressure: {
    id: "HT-DEMO-APT-01",
    title: "行测导学：模块顺序与时间分配",
    type: "备考导学",
    duration: 18,
    difficulty: "基础",
    matchedProblem: "限时任务节奏",
    practice: "完成 1 次 20 分钟分模块练习",
  },
} as const;

export const companionObstacles = [
  { id: "locate", label: "找数据太慢", clue: "当前问题已缩小到“材料数据定位”，本轮先处理这一项。", outcome: "数据定位比开始时清楚，计算速度仍需继续验证。", nextTask: "15 分钟基础速算 + 10 道训练" },
  { id: "formula", label: "公式记不住", clue: "当前问题主要是题型与公式没有形成对应，本轮先建立调用线索。", outcome: "题型与公式开始形成对应，计算熟练度仍待验证。", nextTask: "8 道公式匹配 + 错因记录" },
  { id: "calculate", label: "计算容易错", clue: "当前问题集中在基础速算，本轮先练正确率，再逐步压缩时间。", outcome: "基础计算正确率有了起点，速度仍需连续练习。", nextTask: "10 道截位与比例速算训练" },
  { id: "pressure", label: "时间一紧张就乱", clue: "当前问题来自限时节奏，本轮先用分模块练习建立稳定顺序。", outcome: "已经建立模块顺序，限时状态下的稳定性仍待验证。", nextTask: "20 分钟分模块练习 + 节奏记录" },
] as const;

export const companionFeedbacks = [
  "找数据明显快了一些",
  "定位清楚了，但计算还是慢",
  "方法能理解，练习过程比较枯燥",
  "暂时没感受到变化",
] as const;

export const reviewWindowData: Record<ReviewWindow, { title: string; description: string; metric: string; note: string }> = {
  day: { title: "今天的最低任务完成了", description: "已完成 20 分钟课程，练习留到明天继续。", metric: "1 / 2", note: "日复盘只调整明天，不改变长期方向。" },
  week: { title: "第一次真实学习已经发生", description: "本周完成岗位认知、考试结构和一节入门课。", metric: "60%", note: "完整周复盘会更新任务、证据与下一阶段计划。" },
  month: { title: "月度证据仍在积累", description: "当前只有一周数据，尚不足以判断长期投入稳定性。", metric: "1 周", note: "月底将比较路径状态和关键能力积累。" },
  semester: { title: "学期画像等待更多成长事件", description: "课程成绩、项目成果和连续任务记录会进入学期总结。", metric: "v1", note: "学期复盘会生成新画像版本，但不会覆盖初始基线。" },
};

export const nextStageOptions: { id: NextStageChoice; icon: string; title: string; description: string }[] = [
  { id: "continue", icon: "公", title: "继续考公探索", description: "进入四周基础能力计划，考公仍是阶段性探索。" },
  { id: "compare", icon: "路", title: "看看其他方向", description: "重新比较考研、企业求职和短期实习。" },
  { id: "life", icon: "生", title: "先规划生活本身", description: "把下一阶段用于锻炼、休息、旅行或新技能。" },
];

export const stageRank: Record<Stage, number> = {
  lifeGame: 0,
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
  importing: 2,
  execution: 2,
  progress: 2,
  executionReview: 2,
  companion: 2,
  companionReview: 2,
  stageSummary: 2,
};
