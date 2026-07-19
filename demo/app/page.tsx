"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type {
  AuthorizationSourceId,
  NextStageChoice,
  PathId,
  PurposeId,
  ReviewWindow,
  Stage,
} from "./demo-types";
import { AppChrome } from "./components/app-chrome";
import { ExplorationPages } from "./components/exploration-pages";
import { ProfilePages } from "./components/profile-pages";
import { DirectionPages } from "./components/direction-pages";
import { ManagementActionPages } from "./components/management-action-pages";
import { ProgressPage } from "./components/progress-page";
import { CompanionPage } from "./components/companion-page";
import { ReviewPages } from "./components/review-pages";
import { LifeGamePage } from "./components/life-game-page";
import * as demoData from "./demo-data";

const {
  basePath,
  journeySteps,
  journeyDestinations,
  growthManagementStages,
  abilityDimensions,
  analysisSteps,
  authorizationSources,
  profileImportSteps,
  confidenceLabels,
  interpretationSteps,
  lifePurposes,
  questions,
  pathData,
  roleModelCases,
  executionObstacles,
  executionTasks,
  huatuDemoResources,
  companionObstacles,
  companionFeedbacks,
  reviewWindowData,
  nextStageOptions,
  stageRank,
} = demoData;

export default function Home() {
  const landingVisualRef = useRef<HTMLDivElement>(null);
  const routeChatStreamRef = useRef<HTMLDivElement>(null);
  const executionChatRef = useRef<HTMLDivElement>(null);
  const companionChatRef = useRef<HTMLDivElement>(null);
  const launchTimerRef = useRef<number | null>(null);
  const [stage, setStage] = useState<Stage>("lifeGame");
  const [isLaunching, setIsLaunching] = useState(false);
  const [furthestRank, setFurthestRank] = useState(0);
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeId | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [consent, setConsent] = useState(true);
  const [resumeName, setResumeName] = useState("");
  const [authorizedSources, setAuthorizedSources] = useState<Record<AuthorizationSourceId, boolean>>({ bilibili: true, github: true, huatu: true, watch: false });
  const [profileImportStep, setProfileImportStep] = useState(0);
  const [executionPhase, setExecutionPhase] = useState(0);
  const [executionTaskDone, setExecutionTaskDone] = useState([false, false, false, false]);
  const [selectedObstacle, setSelectedObstacle] = useState<number | null>(null);
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
  const [companionPhase, setCompanionPhase] = useState(0);
  const [typedCompanionQuestion, setTypedCompanionQuestion] = useState("");
  const [selectedCompanionObstacle, setSelectedCompanionObstacle] = useState<number | null>(null);
  const [companionSearchStep, setCompanionSearchStep] = useState(0);
  const [selectedLearningFeedback, setSelectedLearningFeedback] = useState<number | null>(null);
  const [companionTaskTab, setCompanionTaskTab] = useState<"completed" | "pending">("pending");
  const [evidenceWithdrawn, setEvidenceWithdrawn] = useState(false);
  const [reviewWindow, setReviewWindow] = useState<ReviewWindow>("week");
  const [reviewDimension, setReviewDimension] = useState(1);
  const [nextStageChoice, setNextStageChoice] = useState<NextStageChoice | null>(null);
  const [stagePlanPhase, setStagePlanPhase] = useState<0 | 1 | 2>(0);
  const [stagePlanStep, setStagePlanStep] = useState(0);
  const [taskManagerActions, setTaskManagerActions] = useState<Record<number, "rescheduled" | "abandoned">>({});
  const [taskManagerAgentPrompt, setTaskManagerAgentPrompt] = useState("");

  const currentRank = stageRank[stage];
  const availableRank = Math.min(journeySteps.length, Math.max(currentRank, furthestRank));
  const isGrowthManagementApp = growthManagementStages.includes(stage);
  const quizProgress = ((quizIndex + 1) / questions.length) * 100;

  const profileSignals = useMemo(
    () => answers
      .map((answer, index) => answer >= 0 ? questions[index]?.options[answer]?.signal : null)
      .filter((signal): signal is string => Boolean(signal))
      .slice(0, 4),
    [answers],
  );

  const purpose = lifePurposes.find((item) => item.id === selectedPurpose) ?? lifePurposes[4];
  const selectedAuthorizationSources = authorizationSources.filter((source) => authorizedSources[source.id]);
  const selectedDimension = abilityDimensions[activeDimension];
  const activeRoleModelCase = roleModelCases[activeRoleModel];
  const activeConversationEvidence = conversationEvidence[activeRoleModelCase.id] ?? [];
  const radarPoints = abilityDimensions.map((item, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / abilityDimensions.length);
    const radius = (item.value / 5) * 42;
    return `${50 + Math.cos(angle) * radius}% ${50 + Math.sin(angle) * radius}%`;
  }).join(", ");
  const resultSignals = useMemo(() => [
    { text: purpose.signal, source: "人生课题 · 用户主动选择", confidence: "high" },
    ...profileSignals.slice(0, 3).map((text, index) => ({ text, source: `情境回答 ${String(index + 1).padStart(2, "0")}`, confidence: index === 0 ? "medium" : "low" })),
  ], [profileSignals, purpose]);

  const activeExecutionObstacle = executionObstacles[selectedObstacle ?? 0];
  const executionProgress = executionTasks.reduce((total, task, index) => total + (executionTaskDone[index] ? task.weight : 0), 0);
  const completedExecutionTasks = executionTasks.filter((_, index) => executionTaskDone[index]);
  const executionProgressClass = executionProgress < 15 ? "is-start" : executionProgress < 40 ? "is-exploring" : executionProgress < 70 ? "is-accelerating" : executionProgress < 95 ? "is-sprinting" : "is-finished";
  const analysisComplete = analysisStep >= analysisSteps.length;
  const analysisProgress = analysisComplete ? 100 : Math.round(8 + (analysisStep / analysisSteps.length) * 84);
  const activeCompanionObstacle = companionObstacles[selectedCompanionObstacle ?? 0];
  const activeHuatuResource = huatuDemoResources[activeCompanionObstacle.id];
  const learningFeedbackInterpretation = selectedLearningFeedback === 0
    ? {
        outcome: "材料数据定位已经出现主观改善，下一步用一组短练习确认速度变化。",
        nextTask: activeCompanionObstacle.nextTask,
      }
    : selectedLearningFeedback === 2
      ? {
          outcome: "方法能够理解，但枯燥感可能影响连续投入，下一步先缩短练习并观察完成状态。",
          nextTask: "10 分钟短练习 + 记录投入感",
        }
      : selectedLearningFeedback === 3
        ? {
            outcome: "随堂题形成了客观结果，但你暂时没有感到改善，下一步先做前后测对比，不急着提高任务量。",
            nextTask: "复做 5 道基线题 + 对比用时与错因",
          }
        : {
            outcome: activeCompanionObstacle.outcome,
            nextTask: activeCompanionObstacle.nextTask,
          };
  const companionBaseProgress = Math.max(executionProgress, 50);
  const companionProgress = Math.min(100, companionBaseProgress + (companionPhase >= 7 && !executionTaskDone[2] ? 10 : 0));
  const managementTaskCredits = executionTasks.map((task, index) => executionTaskDone[index] ? task.weight : index === 2 && companionPhase >= 7 ? 10 : 0);
  const managementProgress = managementTaskCredits.reduce((total, credit) => total + credit, 0);
  const managementProgressClass = managementProgress < 15 ? "is-start" : managementProgress < 40 ? "is-exploring" : managementProgress < 70 ? "is-accelerating" : managementProgress < 95 ? "is-sprinting" : "is-finished";
  const managementConversationStage: "execution" | "companion" = companionPhase > 0 ? "companion" : "execution";
  const updatedAbilityDimensions = abilityDimensions.map((item, index) => ({
    ...item,
    currentValue: evidenceWithdrawn ? item.value : index === 1 || index === 3 ? Math.min(5, item.value + .2) : item.value,
  }));
  const updatedRadarPoints = updatedAbilityDimensions.map((item, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / updatedAbilityDimensions.length);
    const radius = (item.currentValue / 5) * 42;
    return `${50 + Math.cos(angle) * radius}% ${50 + Math.sin(angle) * radius}%`;
  }).join(", ");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stage, quizIndex]);

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
    if (stage !== "companion" || companionPhase !== 0) return;
    const timer = window.setTimeout(() => setCompanionPhase(1), 480);
    return () => window.clearTimeout(timer);
  }, [stage, companionPhase]);

  useEffect(() => {
    if (stage !== "companion" || companionPhase !== 1) return;
    const question = "我做资料分析总是很慢，不知道应该怎么练。";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setTypedCompanionQuestion(question);
        setCompanionPhase(2);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    let cursor = 0;
    let finishTimer: number | null = null;
    const typing = window.setInterval(() => {
      cursor += 1;
      setTypedCompanionQuestion(question.slice(0, cursor));
      if (cursor >= question.length) {
        window.clearInterval(typing);
        finishTimer = window.setTimeout(() => setCompanionPhase(2), 520);
      }
    }, 68);
    return () => {
      window.clearInterval(typing);
      if (finishTimer !== null) window.clearTimeout(finishTimer);
    };
  }, [stage, companionPhase]);

  useEffect(() => {
    if (stage !== "companion" || companionPhase !== 4) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setCompanionSearchStep(4);
        setCompanionPhase(5);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setCompanionSearchStep(1), 180),
      window.setTimeout(() => setCompanionSearchStep(2), 720),
      window.setTimeout(() => setCompanionSearchStep(3), 1260),
      window.setTimeout(() => setCompanionSearchStep(4), 1800),
      window.setTimeout(() => setCompanionPhase(5), 2180),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [stage, companionPhase]);

  useEffect(() => {
    if (stage !== "companion") return;
    const stream = companionChatRef.current;
    if (!stream) return;
    stream.scrollTo({ top: stream.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [stage, companionPhase, companionSearchStep, selectedLearningFeedback]);

  useEffect(() => {
    if (stage !== "stageSummary" || stagePlanPhase !== 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setStagePlanStep(3);
        setStagePlanPhase(2);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setStagePlanStep(1), 260),
      window.setTimeout(() => setStagePlanStep(2), 880),
      window.setTimeout(() => setStagePlanStep(3), 1500),
      window.setTimeout(() => setStagePlanPhase(2), 2100),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [stage, stagePlanPhase]);

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
    if (stage !== "importing") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setProfileImportStep(profileImportSteps.length);
        setStage("execution");
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timers = [
      window.setTimeout(() => setProfileImportStep(1), 380),
      window.setTimeout(() => setProfileImportStep(2), 980),
      window.setTimeout(() => setProfileImportStep(3), 1580),
      window.setTimeout(() => setStage("execution"), 2350),
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
    launchTimerRef.current = null;
    setIsLaunching(false);
    setFurthestRank(0);
    setStage("lifeGame");
    setSelectedPurpose(null);
    setQuizIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setConsent(true);
    setResumeName("");
    setAuthorizedSources({ bilibili: true, github: true, huatu: true, watch: false });
    setProfileImportStep(0);
    setExecutionPhase(0);
    setExecutionTaskDone([false, false, false, false]);
    setSelectedObstacle(null);
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
    setCompanionPhase(0);
    setTypedCompanionQuestion("");
    setSelectedCompanionObstacle(null);
    setCompanionSearchStep(0);
    setSelectedLearningFeedback(null);
    setCompanionTaskTab("pending");
    setEvidenceWithdrawn(false);
    setReviewWindow("week");
    setReviewDimension(1);
    setNextStageChoice(null);
    setStagePlanPhase(0);
    setStagePlanStep(0);
    setTaskManagerActions({});
    setTaskManagerAgentPrompt("");
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

  function toggleExecutionTask(index: number) {
    const next = executionTaskDone.map((done, taskIndex) => taskIndex === index ? !done : done);
    setExecutionTaskDone(next);
    setTaskManagerActions((current) => {
      if (!(index in current)) return current;
      const updated = { ...current };
      delete updated[index];
      return updated;
    });
    if (next[0] && next[1]) {
      setExecutionPhase(4);
    } else if (executionPhase >= 4) {
      setExecutionPhase(selectedObstacle === null ? 0 : 2);
    }
  }

  function goToActionStage(nextStage: Stage) {
    setStage(nextStage);
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

  if (stage === "lifeGame") {
    return (
      <LifeGamePage
        basePath={basePath}
        onExplorePlanning={() => setStage("landing")}
        onCompleteProfile={() => {
          setSelectedPurpose("steady");
          setStage("profile");
        }}
      />
    );
  }

  return (
    <main className={`app-shell stage-${stage} ${isGrowthManagementApp ? "app-mode-management" : "app-mode-compass"}`}>
      <AppChrome
        basePath={basePath}
        stage={stage}
        isGrowthManagementApp={isGrowthManagementApp}
        journeySteps={journeySteps}
        journeyDestinations={journeyDestinations}
        currentRank={currentRank}
        availableRank={availableRank}
        onReset={resetDemo}
        onReturnToCompass={() => setStage("rolemodels")}
        onNavigateJourney={navigateJourney}
      />
      <ExplorationPages
        stage={stage}
        landingVisualRef={landingVisualRef}
        onLandingPointerMove={handleLandingPointerMove}
        onLandingPointerLeave={resetLandingPointer}
        isLaunching={isLaunching}
        onStartJourney={startJourney}
        onEnterManagement={() => setStage("execution")}
        lifePurposes={lifePurposes}
        selectedPurpose={selectedPurpose}
        onSelectPurpose={setSelectedPurpose}
        onSetStage={setStage}
        purpose={purpose}
        quizIndex={quizIndex}
        questions={questions}
        quizProgress={quizProgress}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={setSelectedAnswer}
        onSkipQuestion={skipQuestion}
        onNextQuestion={nextQuestion}
        answers={answers}
        interpretationStep={interpretationStep}
        interpretationSteps={interpretationSteps}
      />
      <ProfilePages
        stage={stage}
        purpose={purpose}
        resultSignals={resultSignals}
        signalReviews={signalReviews}
        onReviewSignal={(index, review) => setSignalReviews((current) => ({ ...current, [index]: review }))}
        confidenceLabels={confidenceLabels}
        onSetStage={setStage}
        resumeName={resumeName}
        onResumeNameChange={setResumeName}
        authorizationSources={authorizationSources}
        authorizedSources={authorizedSources}
        onToggleAuthorization={(source) => setAuthorizedSources((current) => ({ ...current, [source]: !current[source] }))}
        consent={consent}
        onConsentChange={setConsent}
        selectedAuthorizationSources={selectedAuthorizationSources}
        analysisComplete={analysisComplete}
        analysisProgress={analysisProgress}
        analysisStep={analysisStep}
        analysisSteps={analysisSteps}
        onSetAnalysisStep={setAnalysisStep}
        answeredCount={answers.filter((answer) => answer >= 0).length}
        abilityDimensions={abilityDimensions}
        radarPoints={radarPoints}
        activeDimension={activeDimension}
        onSetActiveDimension={setActiveDimension}
        selectedDimension={selectedDimension}
      />
      <DirectionPages
        stage={stage}
        sampleDirection={sampleDirection}
        onSetSampleDirection={setSampleDirection}
        roleModelCases={roleModelCases}
        activeRoleModel={activeRoleModel}
        onSetActiveRoleModel={setActiveRoleModel}
        activeRoleModelCase={activeRoleModelCase}
        activeConversationEvidence={activeConversationEvidence}
        routeChatOpen={routeChatOpen}
        onSetRouteChatOpen={setRouteChatOpen}
        routeChatStreamRef={routeChatStreamRef}
        routeChatPhase={routeChatPhase}
        selectedChatFollowup={selectedChatFollowup}
        onChooseRouteFollowup={chooseRouteFollowup}
        typedRouteQuestion={typedRouteQuestion}
        onEnterManagement={() => { setProfileImportStep(0); setStage("importing"); }}
        onSetStage={setStage}
        pathData={pathData}
        purposeTitle={purpose.title}
      />
      <ManagementActionPages
        key={stage === "importing" ? "management-import" : "management-workspace"}
        stage={stage}
        selectedAuthorizationSources={selectedAuthorizationSources}
        profileImportSteps={profileImportSteps}
        profileImportStep={profileImportStep}
        executionProgress={executionProgress}
        executionProgressClass={executionProgressClass}
        executionTasks={executionTasks}
        executionTaskDone={executionTaskDone}
        taskManagerActions={taskManagerActions}
        executionPhase={executionPhase}
        activeExecutionObstacle={activeExecutionObstacle}
        completedExecutionTasks={completedExecutionTasks}
        onToggleExecutionTask={toggleExecutionTask}
        onGoToStage={goToActionStage}
        executionChatRef={executionChatRef}
        onSetExecutionPhase={setExecutionPhase}
        onRestartPlanningDemo={() => { setExecutionTaskDone([false, false, false, false]); setTaskManagerActions({}); setExecutionPhase(0); setSelectedObstacle(null); }}
        nextPlanPhase={nextPlanPhase}
        nextPlanStep={nextPlanStep}
        onStartNextPlan={() => { setNextPlanStep(0); setNextPlanPhase(1); }}
        agentHandoffPrompt={taskManagerAgentPrompt}
        onConsumeAgentHandoff={() => setTaskManagerAgentPrompt("")}
      />

      {stage === "progress" && <ProgressPage progress={managementProgress} progressClass={managementProgressClass} tasks={executionTasks} taskCredits={managementTaskCredits} taskActions={taskManagerActions} reviewSnapshot={companionPhase >= 8} conversationStage={managementConversationStage} onToggleTask={toggleExecutionTask} onSetTaskAction={(index, action) => setTaskManagerActions((current) => { const next = { ...current }; if (action) next[index] = action; else delete next[index]; return next; })} onNavigate={goToActionStage} onAskAgent={(prompt) => { setTaskManagerAgentPrompt(prompt); setStage("execution"); }} />}

      {stage === "companion" && (
        <CompanionPage
          companionChatRef={companionChatRef}
          companionPhase={companionPhase}
          typedCompanionQuestion={typedCompanionQuestion}
          companionObstacles={companionObstacles}
          selectedCompanionObstacle={selectedCompanionObstacle}
          onSelectCompanionObstacle={(index) => { setSelectedCompanionObstacle(index); setCompanionSearchStep(0); setCompanionPhase(3); }}
          activeCompanionObstacle={activeCompanionObstacle}
          onSetCompanionPhase={setCompanionPhase}
          companionSearchStep={companionSearchStep}
          activeHuatuResource={activeHuatuResource}
          companionFeedbacks={companionFeedbacks}
          selectedLearningFeedback={selectedLearningFeedback}
          onSelectLearningFeedback={(index) => { setSelectedLearningFeedback(index); setCompanionPhase(8); }}
          evidenceWithdrawn={evidenceWithdrawn}
          onToggleEvidence={() => setEvidenceWithdrawn((current) => !current)}
          learningFeedbackOutcome={learningFeedbackInterpretation.outcome}
          onOpenReview={() => goToActionStage("companionReview")}
          companionProgress={companionProgress}
          companionTaskTab={companionTaskTab}
          onSetCompanionTaskTab={setCompanionTaskTab}
        />
      )}
      <ReviewPages
        stage={stage}
        reviewWindow={reviewWindow}
        onSetReviewWindow={setReviewWindow}
        reviewWindowData={reviewWindowData}
        evidenceWithdrawn={evidenceWithdrawn}
        abilityDimensions={abilityDimensions}
        radarPoints={radarPoints}
        updatedRadarPoints={updatedRadarPoints}
        updatedAbilityDimensions={updatedAbilityDimensions}
        reviewDimension={reviewDimension}
        onSetReviewDimension={setReviewDimension}
        learningFeedbackOutcome={learningFeedbackInterpretation.outcome}
        learningFeedbackNextTask={learningFeedbackInterpretation.nextTask}
        activeResourceTitle={activeHuatuResource.title}
        onGoToStage={goToActionStage}
        nextStageOptions={nextStageOptions}
        nextStageChoice={nextStageChoice}
        onSelectNextStage={(choice) => { setNextStageChoice(choice); setStagePlanPhase(0); setStagePlanStep(0); }}
        stagePlanPhase={stagePlanPhase}
        stagePlanStep={stagePlanStep}
        onStartStagePlan={() => { setStagePlanStep(0); setStagePlanPhase(1); }}
      />
    </main>
  );
}
