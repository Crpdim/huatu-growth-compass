import type { AgentMessageType } from "../demo-types";

type AgentMessageProps = {
  type: AgentMessageType;
  label: string;
  title?: string;
  tone?: "default" | "warning" | "care" | "success";
  children: React.ReactNode;
};

export function AgentMessage({ type, label, title, tone = "default", children }: AgentMessageProps) {
  return <article className={`agent-card-message tone-${tone}`} data-message-type={type}>
    <div className="agent-card-avatar">AI</div>
    <div className="agent-card-body">
      <header><span>{label}</span><small>{type}</small></header>
      {title && <h4>{title}</h4>}
      {children}
    </div>
  </article>;
}
