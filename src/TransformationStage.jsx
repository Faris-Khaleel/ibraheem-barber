import { useEffect, useRef } from "react";

const TRANSFORMATION_VIDEO = "/videos/ritual-transformation.mp4";

export function TransformationStage() {
  const shellRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const shell = shellRef.current;
    const video = videoRef.current;
    if (!shell || !video) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (reduceMotion.matches || !entry.isIntersecting) {
          video.pause();
          return;
        }

        void video.play().catch(() => {
          // The poster remains visible if a browser blocks autoplay.
        });
      },
      { rootMargin: "30% 0px", threshold: 0.01 },
    );

    const onMotionChange = () => {
      if (reduceMotion.matches) video.pause();
      else void video.play().catch(() => {});
    };

    visibilityObserver.observe(shell);
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      visibilityObserver.disconnect();
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div ref={shellRef} className="transformation-stage">
      <video
        ref={videoRef}
        className="transformation-stage__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/ritual/01-empty-chair.webp"
        aria-hidden="true"
      >
        <source src={TRANSFORMATION_VIDEO} type="video/mp4" />
      </video>
      <span className="sr-only">
        A man takes the barber chair, the cape settles, and his long hair and beard
        transform into a precise finished cut.
      </span>
    </div>
  );
}
