import { useEffect, useRef, useState } from "react";
import { TransformationStage } from "./TransformationStage";

const acts = [
  {
    number: "01",
    label: "Arrival",
    title: "Take\nthe seat.",
    body: "The chair is waiting. Scroll to begin Ibraheem's transformation ritual.",
  },
  {
    number: "02",
    label: "Drape",
    title: "Set the\ncanvas.",
    body: "One clean movement. The cape settles and the outside world falls away.",
  },
  {
    number: "03",
    label: "Transform",
    title: "Refine every\nangle.",
    body: "As the chair turns, weight disappears, the beard tightens, and the shape comes into focus.",
  },
  {
    number: "04",
    label: "Reveal",
    title: "Meet the\nfinished you.",
    body: "A textured crop, a precise beard, and a finish designed to look right from every side.",
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function CutRitual() {
  const sectionRef = useRef(null);
  const [activeAct, setActiveAct] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let frame = 0;
    let currentAct = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / travel, 0, 1);
      const nextAct = Math.min(acts.length - 1, Math.floor(progress * acts.length));

      section.style.setProperty("--ritual-progress", progress.toFixed(4));
      if (nextAct !== currentAct) {
        currentAct = nextAct;
        setActiveAct(nextAct);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const goToAct = (index) => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetProgress = (index + 0.5) / acts.length;
    const top = sectionTop + targetProgress * travel;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section
      className="ritual"
      id="ritual"
      ref={sectionRef}
      data-act={activeAct}
      aria-labelledby="ritual-title"
    >
      <div className="ritual__sticky">
        <div className="ritual__scene">
          <TransformationStage />
        </div>

        <div className="ritual__topline">
          <p>02 — The transformation</p>
          <p>Scroll to direct the chair</p>
        </div>

        <div className="ritual__copy">
          {acts.map((act, index) => (
            <article
              className={`ritual__act${activeAct === index ? " is-active" : ""}`}
              key={act.label}
              aria-hidden={activeAct !== index}
            >
              <p className="ritual__kicker"><span>{act.number}</span>{act.label}</p>
              <h2 id={index === 0 ? "ritual-title" : undefined}>
                {act.title.split("\n").map((line) => <span key={line}>{line}</span>)}
              </h2>
              <p className="ritual__body">{act.body}</p>
            </article>
          ))}
        </div>

        <nav className="ritual__rail" aria-label="Cut ritual chapters">
          {acts.map((act, index) => (
            <button
              type="button"
              className={activeAct === index ? "is-active" : ""}
              aria-label={`Go to ${act.label}`}
              aria-current={activeAct === index ? "step" : undefined}
              onClick={() => goToAct(index)}
              key={act.label}
            >
              <span>{act.number}</span>
              <i aria-hidden="true" />
              <b>{act.label}</b>
            </button>
          ))}
        </nav>

        <p className="ritual__signature" aria-hidden="true">Arrival / drape / transform / reveal</p>
      </div>
    </section>
  );
}
