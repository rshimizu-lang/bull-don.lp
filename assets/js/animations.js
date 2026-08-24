// ─── GSAP ScrollTrigger: ヒーロー パララックス ─────────
// .hero-screen-img（スマホモックアップ）をヒーロー通過中だけ
// 背景/テキストと異なる速度で動かす視差効果。
// .hero-visual は 640px 以下で display:none（style.css）のため、
// PC/タブレット幅のみで有効化する。
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.matchMedia().add('(min-width: 641px)', () => {
    const heroImg = document.querySelector('.hero-screen-img');
    if (!heroImg) return;

    gsap.to(heroImg, {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}
