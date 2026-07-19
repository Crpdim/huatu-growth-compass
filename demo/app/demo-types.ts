export type Stage =
  | "lifeGame"
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
  | "importing"
  | "execution"
  | "progress"
  | "executionReview"
  | "companion"
  | "companionReview"
  | "stageSummary";

export type PathId = "public" | "job" | "postgrad";
export type PurposeId = "steady" | "independent" | "growth" | "self" | "unclear";
export type ReviewWindow = "day" | "week" | "month" | "semester";
export type NextStageChoice = "continue" | "compare" | "life";
export type AuthorizationSourceId = "bilibili" | "github" | "huatu" | "watch";
export type AgentMessageType = "text" | "decision_trace" | "path_compare" | "profile_radar" | "task_list" | "progress_update" | "reminder" | "deadline_alert" | "checkpoint_alert" | "stress_probe" | "review_card" | "page_link";

export type TaskSubtask = {
  id: string;
  title: string;
  done: boolean;
};

export type TaskLink = {
  title: string;
  url: string;
  source: string;
};

export type ExecutionTask = {
  id: string;
  title: string;
  category: string;
  weight: number;
  deadline: string;
  priority: string;
  durationMinutes: number;
  deadlineOrder: number;
  unlocks: number;
  criteria: string;
  subtasks?: TaskSubtask[];
  link?: TaskLink;
};

export type TaskDraft = Pick<ExecutionTask, "title" | "category" | "priority" | "deadline" | "durationMinutes" | "criteria">;

export type QuizOption = {
  label: string;
  signal: string;
  scores: Record<PathId, number>;
};
