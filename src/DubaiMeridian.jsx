import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function DubaiMeridian() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = reducedMotion.matches ? 0.5 : clamp(-rect.top / travel, 0, 1);
      const sunX = 72 + progress * 34;
      const sunY = 64 - Math.sin(progress * Math.PI) * 22 + progress * 4;
      const sunScale = 0.86 + progress * 0.2;

      section.style.setProperty("--dubai-progress", progress.toFixed(4));
      section.style.setProperty("--dubai-sun-x", `${sunX.toFixed(2)}%`);
      section.style.setProperty("--dubai-sun-y", `${sunY.toFixed(2)}%`);
      section.style.setProperty("--dubai-sun-scale", sunScale.toFixed(3));
      section.dataset.progress = progress.toFixed(3);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className="dubai-meridian"
      id="dubai"
      ref={sectionRef}
      aria-labelledby="dubai-title"
    >
      <div className="dubai-meridian__sticky">
        <img
          className="dubai-meridian__sun"
          src="/images/dubai/dubai-sun.webp"
          width="1254"
          height="1254"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <img
          className="dubai-meridian__plate"
          src="/images/dubai/dubai-meridian-plate.webp"
          width="1774"
          height="887"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />

        <div className="dubai-meridian__coordinates">
          <span>25.2048° N</span>
          <i aria-hidden="true" />
          <span>55.2708° E</span>
        </div>

        <div className="dubai-meridian__copy">
          <h2 id="dubai-title"><span>Cut in</span><span>Dubai.</span></h2>
        </div>

        <div className="dubai-meridian__location">
          <p>Dubai / UAE</p>
          <p lang="ar" dir="rtl">دبي</p>
        </div>

        <p className="dubai-meridian__cue">Scroll to follow the light</p>
      </div>
    </section>
  );
}
