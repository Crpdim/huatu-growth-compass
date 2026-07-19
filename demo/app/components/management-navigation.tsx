import type { Stage } from "../demo-types";

type ManagementNavigationProps = {
  stage: Stage;
  conversationStage: "execution" | "companion";
  reviewStage: "executionReview" | "companionReview";
  stageSummaryReady: boolean;
  onNavigate: (stage: Stage) => void;
};

const items: { label: string; note: string; stages: Stage[]; destination: Stage }[] = [
  { label: "主对话", note: "计划与答疑", stages: ["execution", "companion"], destination: "execution" },
  { label: "进展", note: "任务完成情况", stages: ["progress"], destination: "progress" },
  { label: "周回顾", note: "完成、缺口、下一步", stages: ["executionReview", "companionReview"], destination: "companionReview" },
  { label: "阶段总结", note: "复盘与下一步", stages: ["stageSummary"], destination: "stageSummary" },
];

export function ManagementNavigation({ stage, conversationStage, reviewStage, stageSummaryReady, onNavigate }: ManagementNavigationProps) {
  if (stage === "importing") return null;
  return <nav className="management-navigation" aria-label="成长管理功能">
    <div className="management-navigation-inner">
      <div className="management-stage-context"><span>当前方向</span><b>考公探索</b><small>阶段性规划</small></div>
      <div className="management-navigation-tabs">
        {items.map((item) => {
          const active = item.stages.includes(stage);
          const destination = item.label === "主对话" ? conversationStage : item.label === "周回顾" ? reviewStage : item.destination;
          const disabled = item.destination === "stageSummary" && !stageSummaryReady;
          return <button className={active ? "is-active" : ""} disabled={disabled} onClick={() => onNavigate(destination)} aria-current={active ? "page" : undefined} key={item.label}>
            <span>{item.label}</span><small>{disabled ? "完成复盘后开放" : item.note}</small>
          </button>;
        })}
      </div>
    </div>
  </nav>;
}
