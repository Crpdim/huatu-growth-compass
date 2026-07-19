"use client";

import Image from "next/image";

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
        <a className="promo-brand" href={`${basePath}/`} aria-label="华图成长罗盘首页">
          <Image src={`${basePath}/logo.png`} alt="" width={42} height={42} priority />
          <span><b>华图成长罗盘</b><small>GROWTH COMPASS</small></span>
        </a>
        <span className="promo-nav-tag"><i /> AI 大学生成长实验系统</span>
      </header>

      <section className="promo-hero">
        <div className="promo-copy">
          <span className="promo-eyebrow"><i>LIVE</i> 先体验，再选择</span>
          <h1>先看见一种未来<br />再走出自己的路</h1>
          <p>把人生选择变成一次可以亲自参与的模拟。AI 会从你的选择与行动中认识你，再把目标变成下一步。</p>
        </div>

        <div className="promo-video-stage">
          <div className="promo-video-glow" />
          <div className="promo-video-frame">
            <div className="promo-video-bar"><span><i /><i /><i /></span><b>华图成长罗盘 · 人生模拟器</b><em>正在演示</em></div>
            <video autoPlay muted loop playsInline controls preload="metadata" poster={`${basePath}/product-demo-poster.jpg`}>
              <source src={`${basePath}/product-demo.mp4`} type="video/mp4" />
              你的浏览器暂不支持视频播放。
            </video>
          </div>
          <span className="promo-video-note">30 秒，看看一次选择如何变成一条成长路径</span>
        </div>

        <div className="promo-action">
          <a href={experienceUrl} onClick={(event) => { event.preventDefault(); window.history.pushState(null, "", experienceUrl); onExperience(); }}>
            <span>进入模拟人生</span><b>开始体验</b><i>↗</i>
          </a>
          <p><span>01 选择人生</span><span>02 体验未来</span><span>03 补全画像</span><span>04 获得行动计划</span></p>
        </div>
      </section>

      <footer className="promo-footer"><span>HUATU · AI GROWTH COMPASS</span><p>定位 · 定向 · 导航 · 校准</p></footer>
    </main>
  );
}
