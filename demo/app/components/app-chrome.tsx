import type { Stage } from "../demo-types";

type JourneyStep = { label: string; short: string };

type AppChromeProps = {
  basePath: string;
  stage: Stage;
  isGrowthManagementApp: boolean;
  journeySteps: JourneyStep[];
  journeyDestinations: Stage[];
  currentRank: number;
  availableRank: number;
  onReset: () => void;
  onReturnToCompass: () => void;
  onNavigateJourney: (rank: number) => void;
};

export function AppChrome({
  basePath,
  stage,
  isGrowthManagementApp,
  journeySteps,
  journeyDestinations,
  currentRank,
  availableRank,
  onReset,
  onReturnToCompass,
  onNavigateJourney,
}: AppChromeProps) {
  return (
    <>
      <header className={`topbar ${isGrowthManagementApp ? "management-topbar" : ""}`}>
        <button
          className="brand"
          onClick={isGrowthManagementApp ? onReturnToCompass : onReset}
          aria-label={isGrowthManagementApp ? "返回成长罗盘方向探索" : "返回首页"}
        >
          <span className="brand-mark">
            {/* 静态导出需保留仓库 basePath，避免图片优化路由影响 GitHub Pages。 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/logo.png`} alt="" />
          </span>
          <span>
            <strong>{isGrowthManagementApp ? "华图成长管理" : "华图成长罗盘"}</strong>
            <small>{isGrowthManagementApp ? "GROWTH MANAGER" : "GROWTH COMPASS"}</small>
          </span>
        </button>
        <div className="topbar-actions">
          {isGrowthManagementApp && stage !== "importing" && <span className="management-app-badge">{stage === "progress" ? "任务管理" : "成长规划 Agent"}</span>}
          {isGrowthManagementApp && <button className="ghost-button compact management-back" onClick={onReturnToCompass}>← 返回方向探索</button>}
          {stage !== "landing" && <button className="ghost-button compact" onClick={onReset}>↻ 重置 Demo</button>}
        </div>
      </header>

      {!isGrowthManagementApp && stage !== "landing" && stage !== "purpose" && stage !== "quiz" && (
        <nav className="journey-nav" aria-label="体验进度">
          {journeySteps.map((item, index) => {
            const rank = index + 1;
            const destination = journeyDestinations[index];
            const isCurrent = rank === currentRank;
            const isReached = rank <= availableRank;
            const canNavigate = isReached && destination !== stage;
            return (
              <button
                className={`journey-step ${isCurrent ? "is-active" : ""} ${isReached && !isCurrent ? "is-done" : ""} ${rank < availableRank ? "is-connected" : ""} ${canNavigate ? "is-clickable" : ""}`}
                onClick={() => onNavigateJourney(rank)}
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
    </>
  );
}
