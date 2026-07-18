import type { Stage } from "../demo-types";

type ManagementNavigationProps = {
  stage: Stage;
  conversationStage: "execution" | "companion";
  onNavigate: (stage: Stage) => void;
};

const items: { label: string; note: string; stages: Stage[]; destination: Stage }[] = [
  { label: "主对话", note: "规划与互动", stages: ["execution", "companion"], destination: "execution" },
  { label: "进展", note: "加权任务", stages: ["progress"], destination: "progress" },
  { label: "周回顾", note: "反馈与预警", stages: ["executionReview", "companionReview"], destination: "companionReview" },
  { label: "阶段总结", note: "复盘与下一步", stages: ["stageSummary"], destination: "stageSummary" },
];

export function ManagementNavigation({ stage, conversationStage, onNavigate }: ManagementNavigationProps) {
  if (stage === "importing") return null;
  return <nav className="management-navigation" aria-label="成长管理功能">
    <div className="management-navigation-inner">
      <div className="management-stage-context"><span>当前方向</span><b>考公探索</b><small>阶段性规划</small></div>
      <div className="management-navigation-tabs">
        {items.map((item) => {
          const active = item.stages.includes(stage);
          const destination = item.label === "主对话" ? conversationStage : item.destination;
          return <button className={active ? "is-active" : ""} onClick={() => onNavigate(destination)} aria-current={active ? "page" : undefined} key={item.label}>
            <span>{item.label}</span><small>{item.note}</small>
          </button>;
        })}
      </div>
    </div>
  </nav>;
}
