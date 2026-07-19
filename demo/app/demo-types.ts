export type Stage =
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

export type QuizOption = {
  label: string;
  signal: string;
  scores: Record<PathId, number>;
};
