import type { RefObject } from "react";
import type { PathId, Stage } from "../demo-types";

type RoleModelFollowup = { label: string; signal: string; addition: string };
type RoleModelCase = {
  id: string;
  type: string;
  title: string;
  match: string[];
  route: string[];
  now: string;
  gain: string;
  cost: string;
  note: string;
  question: string;
  initialSignal: string;
  followupQuestion: string;
  followups: RoleModelFollowup[];
  searches: string[];
  answer: string;
  candidate: string;
  answerEvidence: string;
};

type Path = { name: string; icon: string; tone: string; summary: string; evidence: string[]; gap: string };

type DirectionPagesProps = {
  stage: Stage;
  sampleDirection: PathId;
  onSetSampleDirection: (direction: PathId) => void;
  roleModelCases: RoleModelCase[];
  activeRoleModel: number;
  onSetActiveRoleModel: (roleModel: number) => void;
  activeRoleModelCase: RoleModelCase;
  activeConversationEvidence: string[];
  routeChatOpen: boolean;
  onSetRouteChatOpen: (open: boolean) => void;
  routeChatStreamRef: RefObject<HTMLDivElement | null>;
  routeChatPhase: number;
  selectedChatFollowup: number | null;
  onChooseRouteFollowup: (followup: number) => void;
  typedRouteQuestion: string;
  onEnterManagement: () => void;
  onSetStage: (stage: Stage) => void;
  pathData: Record<PathId, Path>;
  purposeTitle: string;
};

export function DirectionPages(props: DirectionPagesProps) {
  const { stage, sampleDirection, onSetSampleDirection, roleModelCases, activeRoleModel, onSetActiveRoleModel, activeRoleModelCase, activeConversationEvidence, routeChatOpen, onSetRouteChatOpen, routeChatStreamRef, routeChatPhase, selectedChatFollowup, onChooseRouteFollowup, typedRouteQuestion, onEnterManagement, onSetStage, pathData, purposeTitle } = props;

  if (stage === "rolemodels") {
    return (
      <section className="content-page rolemodel-page">
        <div className="rolemodel-toolbar">
          <div className="rolemodel-heading"><span className="section-kicker">02 · 同路人的今天</span><h2>看看别人走过的路</h2></div>
          <div className="sample-direction-tabs" role="tablist" aria-label="切换案例方向">
            {([{ id: "public" as PathId, label: "考公", status: "3 个样本" }, { id: "postgrad" as PathId, label: "考研", status: "建设中" }, { id: "job" as PathId, label: "求职", status: "建设中" }]).map((item) => <button className={sampleDirection === item.id ? "is-active" : ""} onClick={() => onSetSampleDirection(item.id)} role="tab" aria-selected={sampleDirection === item.id} key={item.id}><b>{item.label}</b><span>{item.status}</span></button>)}
          </div>
        </div>

        {sampleDirection === "public" ? (
          <div className="rolemodel-layout">
            <aside className="rolemodel-list" aria-label="考公人生样本">
              <div className="rolemodel-list-head"><span>选择一个案例</span><small>机会 · 生活 · 风险</small></div>
              {roleModelCases.map((item, index) => <button className={activeRoleModel === index ? "is-active" : ""} onClick={() => onSetActiveRoleModel(index)} key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.type}</small><b>{item.title}</b><p>{item.match.slice(0, 2).join(" · ")}</p></div><i>→</i></button>)}
            </aside>
            <article className="rolemodel-detail">
              <div className="rolemodel-detail-top"><div><span>{activeRoleModelCase.type}</span><h3>{activeRoleModelCase.title}</h3></div><div className="match-tags">{activeRoleModelCase.match.map((item) => <b key={item}>{item}</b>)}{activeConversationEvidence.length > 0 && <b className="is-confirmed">对话线索 {activeConversationEvidence.length}</b>}</div></div>
              <div className="route-timeline" aria-label="案例成长路线">{activeRoleModelCase.route.map((item, index) => <div key={item}><span>{index + 1}</span><b>{item}</b></div>)}</div>
              <div className="rolemodel-now"><span>她现在的生活</span><p>{activeRoleModelCase.now}</p></div>
              <div className="rolemodel-tradeoffs"><div className="gain"><span>得到什么</span><p>{activeRoleModelCase.gain}</p></div><div><span>需要承担</span><p>{activeRoleModelCase.cost}</p></div></div>
              <div className="rolemodel-note"><span>这条路线告诉你</span><p>{activeRoleModelCase.note}</p></div>
              <div className="rolemodel-actions"><button className="ghost-button route-question-button" onClick={() => onSetRouteChatOpen(true)}>✦ 问问这条路</button><button className="primary-button" onClick={onEnterManagement}>完成方向探索，进入成长管理 <span>→</span></button></div>
            </article>
          </div>
        ) : (
          <article className="direction-placeholder"><div>{sampleDirection === "postgrad" ? "研" : "职"}</div><span>{sampleDirection === "postgrad" ? "考研" : "求职"}样本库</span><h3>这个方向正在建设中</h3><p>正式产品会使用相同结构，展示相似起点、关键路线、当前生活和风险案例。</p><div><button className="primary-button" onClick={() => onSetSampleDirection("public")}>先看考公样本</button><button className="ghost-button" onClick={() => onSetStage("futures")}>查看方向概览</button></div></article>
        )}

        {routeChatOpen && (
          <div className="route-chat-backdrop" onMouseDown={() => onSetRouteChatOpen(false)}>
            <aside className="route-chat" role="dialog" aria-modal="true" aria-label="未来体验 Agent 问答" onMouseDown={(event) => event.stopPropagation()}>
              <header className="route-chat-header"><div><span className="agent-avatar">AI</span><div><small>未来体验 Agent</small><h3>问问这条路</h3></div></div><button onClick={() => onSetRouteChatOpen(false)} aria-label="关闭问答">×</button></header>
              <div className="route-chat-context"><span>正在参考</span><b>{activeRoleModelCase.title}</b></div>
              <div className="route-chat-stream" aria-live="polite" ref={routeChatStreamRef}>
                {routeChatPhase >= 1 && <><div className="chat-bubble user"><span>你</span><p>{activeRoleModelCase.question}</p></div>{activeConversationEvidence.includes(activeRoleModelCase.initialSignal) && <div className="chat-profile-update"><span><small>对话线索已更新</small>{activeRoleModelCase.initialSignal}</span></div>}</>}
                {routeChatPhase === 2 && <div className="chat-bubble agent thinking"><span>AI</span><p>正在判断还缺哪项选择依据</p><i><b /><b /><b /></i></div>}
                {routeChatPhase >= 3 && <><div className="chat-bubble agent followup"><span>AI · 还需要确认一件事</span><p>{activeRoleModelCase.followupQuestion}</p></div>{selectedChatFollowup === null && <div className="chat-choice-list" role="group" aria-label="选择你的回答">{activeRoleModelCase.followups.map((item, index) => <button onClick={() => onChooseRouteFollowup(index)} key={item.label}><span>{String.fromCharCode(65 + index)}</span>{item.label}<i>→</i></button>)}</div>}</>}
                {selectedChatFollowup !== null && routeChatPhase >= 4 && <><div className="chat-bubble user"><span>你</span><p>{activeRoleModelCase.followups[selectedChatFollowup].label}</p></div>{activeConversationEvidence.includes(activeRoleModelCase.followups[selectedChatFollowup].signal) && <div className="chat-profile-update"><span><small>对话线索已更新</small>{activeRoleModelCase.followups[selectedChatFollowup].signal}</span></div>}{routeChatPhase === 4 && <div className="chat-bubble agent thinking"><span>AI</span><p>正在结合你的回答重新组织问题</p><i><b /><b /><b /></i></div>}</>}
                {selectedChatFollowup !== null && routeChatPhase >= 5 && <div className={`route-research ${routeChatPhase >= 6 ? "is-done" : ""}`}><div><span>{routeChatPhase >= 6 ? "✓" : "⌕"}</span><b>{routeChatPhase >= 6 ? "资料核对完成" : "正在查询相关资料"}</b></div><div><span>{activeRoleModelCase.followups[selectedChatFollowup].label}</span>{activeRoleModelCase.searches.map((item) => <span key={item}>{item}</span>)}</div></div>}
                {selectedChatFollowup !== null && routeChatPhase >= 6 && <><div className="chat-bubble agent answer"><span>AI · 结合你的回答</span><p>{activeRoleModelCase.answer} {activeRoleModelCase.followups[selectedChatFollowup].addition}</p><small>依据：{activeRoleModelCase.answerEvidence}</small></div>{activeConversationEvidence.includes(activeRoleModelCase.candidate) && <div className="chat-profile-update final"><span><small>本轮画像已更新</small>{activeRoleModelCase.candidate}</span></div>}<div className="chat-final-actions"><button className="ghost-button" onClick={() => onSetRouteChatOpen(false)}>继续看案例</button><button className="primary-button" onClick={() => { onSetRouteChatOpen(false); onEnterManagement(); }}>完成探索，导入成长管理 <span>→</span></button></div></>}
              </div>
              <div className={`route-chat-composer ${routeChatPhase >= 1 ? "is-sent" : ""}`}><span>{typedRouteQuestion}<i /></span><button aria-label="发送问题" disabled>↑</button></div>
              <footer>演示问答使用预置案例与规则资料</footer>
            </aside>
          </div>
        )}
      </section>
    );
  }

  if (stage === "futures") {
    return (
      <section className="content-page futures-page">
        <div className="page-heading futures-heading"><span className="section-kicker">02 · 三条发展路径</span><h2>先管理一条，也保留另外两条</h2><p>结合当前画像，系统建议先从考公方向安排任务；求职和升学继续保留。</p></div>
        <div className="future-decision-grid">
          <article className="future-featured">
            <div className="future-featured-top"><span>{pathData.public.icon}</span><b>本次优先验证</b></div><h3>{pathData.public.name}</h3><p>{pathData.public.summary}</p>
            <div className="future-featured-content"><div><small>匹配线索</small>{pathData.public.evidence.map((item) => <span key={item}>✓ {item}</span>)}</div><div><small>还要确认</small><p>{pathData.public.gap}</p></div></div>
            <footer><p><b>你想解决：</b>{purposeTitle}</p><button className="primary-button" onClick={onEnterManagement}>完成方向探索，进入成长管理 <span>→</span></button></footer>
          </article>
          <aside className="future-alternatives">
            <div className="future-alternatives-heading"><span>继续保留</span><h3>另外两条路</h3></div>
            {(["job", "postgrad"] as PathId[]).map((id) => { const path = pathData[id]; return <article className={`future-alternative ${path.tone}`} key={id}><div className="future-alternative-title"><span>{path.icon}</span><div><small>对照方向</small><h4>{path.name}</h4></div></div><p>{path.summary}</p><div><small>需要补充</small><span>{path.gap}</span></div><button className="ghost-button full" disabled>本次作为对照路径</button></article>; })}
          </aside>
        </div>
      </section>
    );
  }

  return null;
}
