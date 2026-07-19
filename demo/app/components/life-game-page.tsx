"use client";

import { useEffect, useRef } from "react";

type LifeGamePageProps = {
  basePath: string;
  onExplorePlanning: () => void;
  onCompleteProfile: () => void;
};

const lifeGameAssetVersion = "20260719-remove-dream";

export function LifeGamePage({ basePath, onExplorePlanning, onCompleteProfile }: LifeGamePageProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function receiveLifeGameMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;

      if (event.data?.type === "huatu:explore-planning") {
        onExplorePlanning();
      }

      if (event.data?.type === "huatu:life-game-complete") {
        onCompleteProfile();
      }
    }

    window.addEventListener("message", receiveLifeGameMessage);
    return () => window.removeEventListener("message", receiveLifeGameMessage);
  }, [onCompleteProfile, onExplorePlanning]);

  return (
    <main className="life-game-shell">
      <iframe
        ref={frameRef}
        className="life-game-frame"
        src={`${basePath}/life-game/index.html?v=${lifeGameAssetVersion}`}
        title="人生模拟器"
      />
    </main>
  );
}
