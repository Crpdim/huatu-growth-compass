"use client";

type PromoHomePageProps = {
  basePath: string;
  onExperience: () => void;
};

export function PromoHomePage({ basePath, onExperience }: PromoHomePageProps) {
  const experienceUrl = `${basePath}/?experience=life-game`;

  return (
    <main className="promo-home">
      <div className="promo-orb promo-orb-one" />
      <div className="promo-orb promo-orb-two" />
      <header className="promo-nav">
        <a className="promo-brand" href={`${basePath}/`} aria-label="职图有声首页">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${basePath}/logo.png`} alt="" width="42" height="42" />
          <span><b>职图有声</b><small>CAREER VOICE</small></span>
        </a>
        <span className="promo-nav-tag"><i /> AI 大学生成长实验系统</span>
      </header>

      <section className="promo-hero">
        <div className="promo-copy">
          <h1>先看见一种未来<br />再走出自己的路</h1>
        </div>

        <div className="promo-video-stage">
          <div className="promo-video-glow" />
          <div className="promo-video-frame">
            <div className="promo-video-bar"><span><i /><i /><i /></span><b>职图有声 · 人生模拟器</b><em>正在演示</em></div>
            <video autoPlay muted loop playsInline controls preload="metadata" poster={`${basePath}/product-demo-poster.jpg`}>
              <source src={`${basePath}/product-demo.mp4`} type="video/mp4" />
              你的浏览器暂不支持视频播放。
            </video>
          </div>
        </div>

        <div className="promo-action">
          <a href={experienceUrl} onClick={(event) => { event.preventDefault(); window.history.pushState(null, "", experienceUrl); onExperience(); }}>
            <span>进入模拟人生</span><b>开始体验</b><i>↗</i>
          </a>
        </div>
      </section>
    </main>
  );
}
