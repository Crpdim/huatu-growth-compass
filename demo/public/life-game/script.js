const buttons = document.querySelectorAll(".life-button");
const statusLine = document.querySelector(".status-line");
const growthPlanningLink = document.querySelector("#open-growth-planning");
const backButtons = document.querySelectorAll('[data-action="back-to-entry"]');
const backToSystemButtons = document.querySelectorAll('[data-action="back-to-system"]');
const identityForm = document.querySelector("#identity-form");
const identityStatus = document.querySelector("#identity-status");

const sceneBackdrop = document.querySelector(".dorm-backdrop img");
const sceneBadge = document.querySelector(".dorm-badge");
const sceneEyebrow = document.querySelector(".dorm-eyebrow");
const sceneTitle = document.querySelector("#dorm-title");
const sceneLead = document.querySelector(".dorm-lead");
const chatPanel = document.querySelector(".chat-panel");
const chatFeed = document.querySelector("#chat-feed");
const questionBlock = document.querySelector("#question-block");
const questionStep = document.querySelector("#question-step");
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const otherAnswer = document.querySelector("#other-answer");
const otherAnswerInput = document.querySelector("#other-answer-input");
const previousQuestionButton = document.querySelector("#back-question");
const answerNextButton = document.querySelector("#answer-next");
const sceneStatus = document.querySelector("#dorm-status");
const sceneComplete = document.querySelector("#dorm-complete");
const sceneCompleteTitle = document.querySelector(".complete-title");
const sceneCompleteSummary = document.querySelector("#complete-summary");
const returnPreviousQuestionButton = document.querySelector("#redo-chat");
const dreamRoadmapButton = document.querySelector("#dream-roadmap");
const dreamGuide = document.querySelector("#dream-guide");
const transitionCta = document.querySelector("#transition-cta");
const nextSceneButton = document.querySelector("#next-scene");
const finalProfile = document.querySelector("#final-profile");
const completeToProfileButton = document.querySelector("#complete-to-profile");

const identityControls = {
  characterName: document.querySelector("#character-name"),
  occupation: document.querySelector("#occupation"),
  education: document.querySelector("#education"),
  schoolTier: document.querySelector("#school-tier"),
  familyIncome: document.querySelector("#family-income"),
  major: document.querySelector("#major")
};

const summaryNodes = {
  characterName: document.querySelector('[data-summary="characterName"]'),
  occupation: document.querySelector('[data-summary="occupation"]'),
  education: document.querySelector('[data-summary="education"]'),
  schoolTier: document.querySelector('[data-summary="schoolTier"]'),
  familyIncome: document.querySelector('[data-summary="familyIncome"]'),
  major: document.querySelector('[data-summary="major"]')
};

const finalSummaryNodes = {
  characterName: document.querySelector('[data-final-summary="characterName"]'),
  occupation: document.querySelector('[data-final-summary="occupation"]'),
  education: document.querySelector('[data-final-summary="education"]'),
  schoolTier: document.querySelector('[data-final-summary="schoolTier"]'),
  familyIncome: document.querySelector('[data-final-summary="familyIncome"]'),
  major: document.querySelector('[data-final-summary="major"]')
};

const messages = {
  国企人生: "国企人生存档已加载：稳稳开局，福利值正在上涨。",
  体制内人生: "体制内人生存档已加载：考试倒计时，声望值亮起。",
  互联网人生: "互联网人生存档已加载：技能点暴涨，发量请注意。",
  外企人生: "外企人生存档已加载：英文邮件和年假都准备好了。",
  创业人生: "创业人生存档已加载：现金流紧张，但梦想很响。",
  网红人生: "网红人生存档已加载：热度起飞，人设正在生成。"
};

const identityLabels = {
  characterName: "人物姓名",
  occupation: "职业",
  education: "学历",
  schoolTier: "毕业院校层次",
  familyIncome: "家庭年收入",
  major: "专业"
};

const particleColors = ["#ffffff", "#caff42", "#ffef61", "#ff62c7", "#5ff2ff"];
const otherOptionLabel = "其他（自己填写）";
const answerLockDurationMs = 620;

const journeyScenes = [
  {
    key: "dorm",
    documentTitle: "体制内人生 - 舍友夜谈",
    badge: "毕业前夜 · 舍友夜谈",
    eyebrow: "宿舍熄灯后",
    title: "舍友突然开始聊起未来",
    lead: "临近毕业，兄弟们围着床沿说真心话。接下来请如实回答每一个问题。",
    background: "./assets/dorm-chat-bg.png",
    intro: [
      { speaker: "舍友", text: "毕业前最后一次夜聊，咱们别打官腔，说点真的。" }
    ],
    questions: [
      {
        speaker: "舍友",
        prompt: "为什么要进入体制内",
        options: [
          "我想要为人民服务",
          "现在就业环境不好，体制内的工作更稳定些",
          "我也想赚钱，可是能力/专业不允许呀",
          "感觉当上公务员就是当“官”了"
        ]
      },
      {
        speaker: "舍友",
        prompt: "你报考的哪里的公务员呀",
        options: [
          "家乡的公务员，我想每天都能回家",
          "异地的公务员，外省条件好",
          "首都的公务员，权力中心，前景好"
        ]
      },
      {
        speaker: "舍友",
        prompt: "可以接受体制内的低工资么",
        options: [
          "没事，爷不差钱",
          "我考的地方的公务员工资可不低",
          "以后升职了就能涨工资了吧"
        ]
      }
    ],
    transitionTitle: "夜聊结束",
    transitionSummary: ({ characterName }) =>
      `${characterName}把实话都说完了，宿舍灯光也跟着安静下来。下一幕正式进入体制内。`
  },
  {
    key: "scene-1",
    documentTitle: "体制内人生 - 入职第一周",
    badge: "入职第一周 · 新工位",
    eyebrow: "办公室摸鱼观察",
    title: "第一周，活少得离谱",
    lead: "入职一个周，工作量少得像样板间。你坐在工位上，先判断这份轻松到底是福还是坑。",
    background: "./assets/career-scene-1-bg.png",
    intro: [
      { speaker: "同事", text: "你这周也太清闲了吧？" },
      { speaker: "领导", text: "先熟悉流程，别着急上强度。" }
    ],
    questions: [
      {
        speaker: "领导",
        prompt: "入职了一个周，领导给你安排的工作量都特别少并且都特别简单，这时你会怎么样",
        options: [
          "觉得太好了可以自己摸鱼了，祈祷一直这样",
          "因为什么也没学到觉得有点焦虑，主动找领导沟通",
          "希望能进步，但还是稳住静观其变"
        ]
      }
    ],
    transitionTitle: "第一幕结束",
    transitionSummary: () => "你刚摸到体制内的节奏，第二幕的风声已经吹进来。"
  },
  {
    key: "scene-2",
    documentTitle: "体制内人生 - 私下试探",
    badge: "岗位考验 · 私下试探",
    eyebrow: "通融不通融",
    title: "有人把好处递到你桌边",
    lead: "门轻轻一关，空气里只剩一句话：帮个忙，没人会知道的。",
    background: "./assets/career-scene-2-bg.png",
    intro: [
      { speaker: "陌生人", text: "这点小意思，你懂的。" }
    ],
    questions: [
      {
        speaker: "陌生人",
        prompt: "有人偷偷找到你给你小好处，让你利用职位“通融通融”，并保证没人会知道的，这时你会",
        options: [
          "当场严词拒绝",
          "既然没人知道我就先收下",
          "假装收下，然后将证据交到纪委"
        ]
      }
    ],
    transitionTitle: "第二幕结束",
    transitionSummary: () => "这一关看着不大，却最像真正的考试。下一幕换成时间的答案。"
  },
  {
    key: "scene-3",
    documentTitle: "体制内人生 - 十年后聚会",
    badge: "毕业十年后 · 同学聚会",
    eyebrow: "饭桌闲话",
    title: "同宿舍的人都发达了",
    lead: "酒杯碰在一起的时候，你突然被时间照了一下。",
    background: "./assets/career-scene-3-bg.png",
    intro: [
      { speaker: "老同学", text: "你现在过得咋样？" }
    ],
    questions: [
      {
        speaker: "老同学",
        prompt: "毕业十年后同学聚会，当时和你同一个宿舍的同学都发达了，而你还是体制内一个清贫的大头兵，这时你会觉得",
        options: [
          "非常羡慕有钱的同学，后悔当初的决定",
          "觉得自己这样的小日子也挺好的"
        ],
        allowOther: true
      }
    ],
    transitionTitle: "第三幕结束",
    transitionSummary: () => "每个人都走成了自己的样子，热闹也好，清贫也好，都是自己选出来的。"
  },
  {
    key: "scene-4",
    documentTitle: "体制内人生 - 模范公务员",
    badge: "终章 · 模范公务员",
    eyebrow: "结局达成",
    title: "恭喜你成为模范公务员",
    lead: "经过一路考验，你终于把选择、试探和琐碎都熬成了稳定的底色。",
    background: "./assets/career-scene-4-bg.png",
    finalTitle: "模范公务员达成",
    finalSummary: ({ characterName }) =>
      `${characterName}经过在体制内的种种考验和历练，最终成长为了一名优秀的“模范公务员”！`
  }
];

let savedIdentity = null;
let currentSceneIndex = 0;
let currentQuestionIndex = 0;
let currentSceneAnswers = [];
let sceneLocked = false;
let sceneTimer = null;
let selectedAnswerButton = null;

removeSceneProfileBlocks();

growthPlanningLink.addEventListener("click", (event) => {
  event.preventDefault();
  notifyGrowthCompass("huatu:explore-planning");
});

completeToProfileButton.addEventListener("click", () => {
  notifyGrowthCompass("huatu:life-game-complete");
});

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    selectLifeButton(button);

    const life = button.dataset.life;
    statusLine.textContent = messages[life];

    if (life === "体制内人生") {
      enterSystemLife();
      return;
    }

    burst(button);
  });
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stopSceneTimer();
    document.body.dataset.view = "entry";
    document.title = "人生模拟器入口";
    scrollToTop();
  });
});

backToSystemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stopSceneTimer();
    document.body.dataset.view = "system";
    document.title = "体制内人生 - 身份建档";
    scrollToTop();
  });
});

Object.values(identityControls).forEach((control) => {
  control.addEventListener("input", updateIdentitySummary);
  control.addEventListener("change", updateIdentitySummary);
});

otherAnswerInput.addEventListener("input", () => {
  if (!otherAnswer.classList.contains("hidden")) {
    answerNextButton.disabled = !otherAnswerInput.value.trim();
  }
});

otherAnswerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitOtherAnswer();
  }
});

answerNextButton.addEventListener("click", submitOtherAnswer);
previousQuestionButton.addEventListener("click", goToPreviousQuestion);
returnPreviousQuestionButton.addEventListener("click", () => {
  if (!savedIdentity) {
    return;
  }

  stopSceneTimer();
  goToPreviousQuestion();
});
dreamRoadmapButton.addEventListener("click", toggleDreamRoadmap);
nextSceneButton.addEventListener("click", goToNextScene);

identityForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = getIdentityValues();
  const missingKey = Object.keys(values).find((key) => !values[key]);

  if (missingKey) {
    identityStatus.textContent = `还差「${identityLabels[missingKey]}」没有填写。`;
    identityControls[missingKey].focus();
    return;
  }

  identityStatus.textContent = `身份已记录：${values.characterName} / ${values.occupation} / ${values.education} / ${values.schoolTier} / ${values.familyIncome} / ${values.major}。`;
  startJourney(values);
});

function selectLifeButton(selectedButton) {
  buttons.forEach((item) => {
    const isSelected = item === selectedButton;
    item.classList.toggle("is-selected", isSelected);
    item.setAttribute("aria-pressed", String(isSelected));
  });
}

function notifyGrowthCompass(type) {
  if (window.parent !== window) {
    window.parent.postMessage({ type }, window.location.origin);
    return;
  }

  window.location.href = "../";
}

function enterSystemLife() {
  stopSceneTimer();
  document.body.dataset.view = "system";
  document.title = "体制内人生 - 身份建档";
  updateIdentitySummary();
  scrollToTop();

  window.requestAnimationFrame(() => {
    identityControls.occupation.focus({ preventScroll: true });
  });
}

function startJourney(values) {
  savedIdentity = values;
  currentSceneAnswers = [];
  enterScene(0);
}

function enterScene(sceneIndex, questionIndex = 0) {
  stopSceneTimer();
  removeSceneProfileBlocks();
  resetCompletionDetails();

  currentSceneIndex = sceneIndex;
  currentQuestionIndex = questionIndex;
  sceneLocked = false;
  selectedAnswerButton = null;

  const scene = journeyScenes[sceneIndex];
  document.body.dataset.view = "dorm";
  document.title = scene.documentTitle;
  scrollToTop();

  sceneBackdrop.src = scene.background;
  sceneBadge.textContent = scene.badge;
  sceneEyebrow.textContent = scene.eyebrow;
  sceneTitle.textContent = scene.title;
  sceneLead.textContent = scene.lead;

  chatFeed.innerHTML = "";
  chatPanel.classList.remove("is-final");
  sceneStatus.textContent = "";
  sceneComplete.classList.add("hidden");
  sceneComplete.dataset.mode = "";
  sceneCompleteSummary.textContent = "";
  transitionCta.classList.add("hidden");
  finalProfile.classList.add("hidden");
  questionBlock.classList.remove("hidden");
  otherAnswer.classList.add("hidden");
  otherAnswerInput.value = "";
  answerNextButton.classList.add("hidden");
  answerNextButton.disabled = true;

  if (scene.finalSummary) {
    renderFinalScene(scene);
    return;
  }

  renderCurrentQuestion();
}

function removeSceneProfileBlocks() {
  document.querySelectorAll(".dorm-profile").forEach((profile) => {
    profile.remove();
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function renderCurrentQuestion() {
  const scene = journeyScenes[currentSceneIndex];
  const question = scene.questions[currentQuestionIndex];

  if (!question) {
    completeScene(scene);
    return;
  }

  sceneLocked = false;
  selectedAnswerButton = null;
  renderSceneChat();
  updatePreviousQuestionButton();

  questionStep.textContent = `第 ${currentQuestionIndex + 1} / ${scene.questions.length} 题`;
  questionText.textContent = question.prompt;
  answerList.innerHTML = "";
  sceneStatus.textContent = "";
  otherAnswer.classList.add("hidden");
  otherAnswerInput.value = "";
  answerNextButton.classList.add("hidden");
  answerNextButton.disabled = true;

  const optionList = question.allowOther ? [...question.options, otherOptionLabel] : [...question.options];

  optionList.forEach((optionText) => {
    const optionButton = document.createElement("button");
    optionButton.className = "answer-option";
    optionButton.type = "button";
    optionButton.textContent = optionText;

    optionButton.addEventListener("click", () => {
      if (sceneLocked) {
        return;
      }

      selectedAnswerButton = optionButton;

      if (question.allowOther && optionText === otherOptionLabel) {
        selectOtherOption(optionButton);
        return;
      }

      submitSceneAnswer(optionText);
    });

    answerList.appendChild(optionButton);
  });
}

function selectOtherOption(selectedButton) {
  answerList.querySelectorAll(".answer-option").forEach((option) => {
    option.classList.toggle("is-selected", option === selectedButton);
  });

  otherAnswer.classList.remove("hidden");
  answerNextButton.classList.remove("hidden");
  answerNextButton.disabled = !otherAnswerInput.value.trim();
  sceneStatus.textContent = "";
  otherAnswerInput.focus();
}

function submitOtherAnswer() {
  const scene = journeyScenes[currentSceneIndex];
  const question = scene.questions[currentQuestionIndex];

  if (sceneLocked || otherAnswer.classList.contains("hidden") || !question.allowOther) {
    return;
  }

  const answer = otherAnswerInput.value.trim();

  if (!answer) {
    sceneStatus.textContent = "这里也要说真话，先写一句。";
    otherAnswerInput.focus();
    return;
  }

  submitSceneAnswer(answer, true);
}

function submitSceneAnswer(answer, isCustomAnswer = false) {
  const scene = journeyScenes[currentSceneIndex];
  const question = scene.questions[currentQuestionIndex];

  if (sceneLocked) {
    return;
  }

  sceneLocked = true;

  answerList.querySelectorAll(".answer-option").forEach((option) => {
    option.disabled = true;
    option.classList.toggle("is-selected", option === selectedAnswerButton);
  });
  previousQuestionButton.disabled = true;
  answerNextButton.disabled = true;

  addChatMessage(question.speaker, question.prompt, "roommate");
  addChatMessage(savedIdentity.characterName || "你", answer, "player");
  currentSceneAnswers.push({
    scene: scene.key,
    sceneIndex: currentSceneIndex,
    questionIndex: currentQuestionIndex,
    speaker: question.speaker,
    question: question.prompt,
    answer,
    isCustomAnswer
  });

  sceneStatus.textContent =
    currentQuestionIndex < scene.questions.length - 1 ? "已记录，下一题来了。" : "已记录，下一幕等你点击继续。";

  stopSceneTimer();
  sceneTimer = window.setTimeout(() => {
    currentQuestionIndex += 1;

    if (currentQuestionIndex < scene.questions.length) {
      sceneTimer = null;
      renderCurrentQuestion();
      return;
    }

    completeScene(scene);
  }, answerLockDurationMs);
}

function completeScene(scene) {
  if (scene.finalSummary) {
    renderFinalScene(scene);
    return;
  }

  sceneLocked = false;
  questionBlock.classList.add("hidden");
  chatPanel.classList.remove("is-final");
  sceneComplete.dataset.mode = "transition";
  sceneComplete.classList.remove("hidden");
  sceneCompleteTitle.textContent = scene.transitionTitle || "本幕结束";
  sceneCompleteSummary.textContent = scene.transitionSummary(savedIdentity, currentSceneAnswers);
  transitionCta.classList.remove("hidden");
  finalProfile.classList.add("hidden");
  nextSceneButton.disabled = false;
  nextSceneButton.setAttribute("aria-disabled", "false");
  sceneStatus.textContent = "";

  stopSceneTimer();

  window.requestAnimationFrame(() => {
    nextSceneButton.focus({ preventScroll: true });
  });
}

function goToNextScene() {
  if (sceneComplete.dataset.mode !== "transition") {
    return;
  }

  const nextSceneIndex = currentSceneIndex + 1;

  if (nextSceneIndex >= journeyScenes.length) {
    return;
  }

  enterScene(nextSceneIndex);
}

function goToPreviousQuestion() {
  if (sceneLocked) {
    return;
  }

  const previousPosition = getPreviousQuestionPosition(currentSceneIndex, currentQuestionIndex);

  if (!previousPosition) {
    return;
  }

  pruneAnswersFrom(previousPosition.sceneIndex, previousPosition.questionIndex);
  enterScene(previousPosition.sceneIndex, previousPosition.questionIndex);
}

function getPreviousQuestionPosition(sceneIndex, questionIndex) {
  if (questionIndex > 0) {
    return { sceneIndex, questionIndex: questionIndex - 1 };
  }

  for (let index = sceneIndex - 1; index >= 0; index -= 1) {
    const scene = journeyScenes[index];

    if (scene.questions?.length) {
      return { sceneIndex: index, questionIndex: scene.questions.length - 1 };
    }
  }

  return null;
}

function getQuestionOrder(sceneIndex, questionIndex) {
  let order = 0;

  for (let index = 0; index < sceneIndex; index += 1) {
    order += journeyScenes[index].questions?.length || 0;
  }

  return order + questionIndex;
}

function pruneAnswersFrom(sceneIndex, questionIndex) {
  const targetOrder = getQuestionOrder(sceneIndex, questionIndex);

  currentSceneAnswers = currentSceneAnswers.filter((answer) => {
    return getQuestionOrder(answer.sceneIndex, answer.questionIndex) < targetOrder;
  });
}

function renderSceneChat() {
  const scene = journeyScenes[currentSceneIndex];
  chatFeed.innerHTML = "";

  (scene.intro || []).forEach((message) => {
    addChatMessage(message.speaker, message.text, "roommate");
  });

  currentSceneAnswers
    .filter((answer) => answer.sceneIndex === currentSceneIndex && answer.questionIndex < currentQuestionIndex)
    .forEach((answer) => {
      addChatMessage(answer.speaker, answer.question, "roommate");
      addChatMessage(savedIdentity.characterName || "你", answer.answer, "player");
    });
}

function updatePreviousQuestionButton() {
  const hasPreviousQuestion = Boolean(getPreviousQuestionPosition(currentSceneIndex, currentQuestionIndex));

  previousQuestionButton.disabled = !hasPreviousQuestion;
  previousQuestionButton.setAttribute("aria-disabled", String(!hasPreviousQuestion));
}

function updateFinalPreviousQuestionButton() {
  const hasPreviousQuestion = Boolean(getPreviousQuestionPosition(currentSceneIndex, currentQuestionIndex));

  returnPreviousQuestionButton.disabled = !hasPreviousQuestion;
  returnPreviousQuestionButton.setAttribute("aria-disabled", String(!hasPreviousQuestion));
}

function renderFinalScene(scene) {
  stopSceneTimer();
  questionBlock.classList.add("hidden");
  chatPanel.classList.add("is-final");
  sceneComplete.dataset.mode = "final";
  sceneComplete.classList.remove("hidden");
  sceneCompleteTitle.textContent = scene.finalTitle;
  sceneCompleteSummary.textContent = scene.finalSummary(savedIdentity, currentSceneAnswers);
  sceneStatus.textContent = "";
  transitionCta.classList.add("hidden");
  renderFinalIdentity();
  resetDreamRoadmap();
  updateFinalPreviousQuestionButton();
}

function renderFinalIdentity() {
  const values = savedIdentity || {};

  Object.entries(finalSummaryNodes).forEach(([key, node]) => {
    if (!node) {
      return;
    }

    const fallback = key === "major" || key === "characterName" ? "未填写" : "未选择";
    node.textContent = values[key] || fallback;
  });

  finalProfile.classList.remove("hidden");
}

function resetCompletionDetails() {
  resetDreamRoadmap();

  if (transitionCta) {
    transitionCta.classList.add("hidden");
  }

  if (finalProfile) {
    finalProfile.classList.add("hidden");
  }
}

function stopSceneTimer() {
  if (sceneTimer) {
    window.clearTimeout(sceneTimer);
    sceneTimer = null;
  }
}

function getIdentityValues() {
  return {
    characterName: identityControls.characterName.value.trim(),
    occupation: identityControls.occupation.value.trim(),
    education: identityControls.education.value.trim(),
    schoolTier: identityControls.schoolTier.value.trim(),
    familyIncome: identityControls.familyIncome.value.trim(),
    major: identityControls.major.value.trim()
  };
}

function updateIdentitySummary() {
  const values = getIdentityValues();

  summaryNodes.characterName.textContent = values.characterName || "未填写";
  summaryNodes.occupation.textContent = values.occupation || "未选择";
  summaryNodes.education.textContent = values.education || "未选择";
  summaryNodes.schoolTier.textContent = values.schoolTier || "未选择";
  summaryNodes.familyIncome.textContent = values.familyIncome || "未选择";
  summaryNodes.major.textContent = values.major || "未填写";
}

function addChatMessage(speaker, text, type) {
  const message = document.createElement("article");
  message.className = `chat-message ${type}`;

  const speakerNode = document.createElement("span");
  speakerNode.className = "chat-speaker";
  speakerNode.textContent = speaker;

  const textNode = document.createElement("p");
  textNode.textContent = text;

  message.append(speakerNode, textNode);
  chatFeed.appendChild(message);
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

function toggleDreamRoadmap() {
  if (dreamGuide.classList.contains("hidden")) {
    showDreamRoadmap();
    return;
  }

  resetDreamRoadmap();
}

function showDreamRoadmap() {
  dreamGuide.replaceChildren();

  const title = document.createElement("p");
  title.className = "dream-guide-title";
  title.textContent = "接近这个结局，可以先这样走：";

  const list = document.createElement("ol");
  list.className = "dream-guide-list";

  const characterName = savedIdentity?.characterName || "你";
  const occupation = savedIdentity?.occupation || "体制内方向";
  const major = savedIdentity?.major || "专业";

  [
    `先把目标拆清楚：${characterName}现在要做的不是空想，而是先对照岗位要求，把适合 ${occupation} 和 ${major} 的地区、编制类型、学历门槛一项项列出来。`,
    "把备考拆成三块：行测刷题、申论/公文写作、岗位常识，每周都做一次错题复盘。",
    "报考前先算现实账：离家远近、工资水平、生活成本、晋升空间，别只看热闹。",
    "练表达也很重要：多做结构化面试练习，习惯把话说稳、说清、说有逻辑。",
    "入职后把小事做好：流程、材料、沟通、留痕、纪律，先把“靠谱”做成标签。",
    "想走得更远，就找一个能长期学习的节奏，把每一件事都当成升级经验值。"
  ].forEach((stepText) => {
    const item = document.createElement("li");
    item.textContent = stepText;
    list.appendChild(item);
  });

  dreamGuide.append(title, list);
  dreamGuide.classList.remove("hidden");
  dreamRoadmapButton.setAttribute("aria-expanded", "true");
}

function resetDreamRoadmap() {
  if (!dreamGuide) {
    return;
  }

  dreamGuide.classList.add("hidden");
  dreamGuide.replaceChildren();

  if (dreamRoadmapButton) {
    dreamRoadmapButton.setAttribute("aria-expanded", "false");
  }
}

function burst(button) {
  const rect = button.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let index = 0; index < 14; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 14;
    const distance = 44 + Math.random() * 54;

    particle.className = "particle";
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--particle-color", particleColors[index % particleColors.length]);

    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
  }
}
