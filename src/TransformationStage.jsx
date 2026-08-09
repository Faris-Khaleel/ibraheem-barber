import { useEffect, useRef } from "react";

const TRANSFORMATION_VIDEO = "/videos/ritual-transformation.mp4";
const FALLBACK_FRAMES = [
  "/images/ritual/01-empty-chair.webp",
  "/images/ritual/02-seated-before.webp",
  "/images/ritual/03-cape-before.webp",
  "/images/ritual/04-final-cut.webp",
];
const FRAME_DURATION = 1 / 24;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function TransformationStage({ progressRef }) {
  const shellRef = useRef(null);
  const posterRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const shell = shellRef.current;
    const poster = posterRef.current;
    const video = videoRef.current;
    if (!shell || !poster || !video) return undefined;

    const ritual = shell.closest(".ritual");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let targetProgress = clamp(progressRef?.current ?? 0, 0, 1);
    let visible = true;
    let syncFrame = 0;
    let seekQueued = false;
    let unlockInFlight = false;
    let mobilePauseTimer = 0;
    let fallbackIndex = 0;

    const updateFallback = (progress) => {
      const nextIndex = Math.min(
        FALLBACK_FRAMES.length - 1,
        Math.floor(clamp(progress, 0, 0.9999) * FALLBACK_FRAMES.length),
      );
      if (nextIndex === fallbackIndex) return;
      fallbackIndex = nextIndex;
      poster.src = FALLBACK_FRAMES[nextIndex];
    };

    const markVideoReady = () => shell.classList.add("is-video-ready");

    const pauseMobileVideoSoon = () => {
      if (!coarsePointer.matches) return;
      window.clearTimeout(mobilePauseTimer);
      mobilePauseTimer = window.setTimeout(() => video.pause(), 240);
    };

    const startMobilePlayback = () => {
      if (
        !coarsePointer.matches
        || reduceMotion.matches
        || unlockInFlight
        || (!video.paused && !video.ended)
      ) return;

      unlockInFlight = true;
      const playAttempt = video.play();
      if (!playAttempt?.then) {
        unlockInFlight = false;
        markVideoReady();
        return;
      }

      playAttempt
        .then(() => {
          unlockInFlight = false;
          markVideoReady();
        })
        .catch(() => {
          unlockInFlight = false;
        });
    };

    const syncVideo = () => {
      syncFrame = 0;
      if (!visible || reduceMotion.matches || !Number.isFinite(video.duration)) return;

      const timelineEnd = Math.max(0, video.duration - FRAME_DURATION);
      const targetTime = targetProgress * timelineEnd;
      if (Math.abs(video.currentTime - targetTime) < FRAME_DURATION * 0.55) return;

      if (video.seeking && !coarsePointer.matches) {
        seekQueued = true;
        return;
      }

      // iOS Safari only repaints reliably while the inline video is actively
      // playing. Every frame is an I-frame, so direct seeking remains exact.
      video.currentTime = targetTime;
    };

    const scheduleSync = () => {
      if (!syncFrame) syncFrame = requestAnimationFrame(syncVideo);
    };

    const onProgress = (event) => {
      targetProgress = clamp(event.detail ?? progressRef?.current ?? 0, 0, 1);
      updateFallback(targetProgress);
      if (coarsePointer.matches) {
        startMobilePlayback();
        pauseMobileVideoSoon();
      }
      scheduleSync();
    };

    const onSeeked = () => {
      markVideoReady();
      if (!seekQueued) return;
      seekQueued = false;
      scheduleSync();
    };

    const onLoadedData = () => markVideoReady();
    const onPlaying = () => markVideoReady();
    const onTimeUpdate = () => {
      if (video.currentTime > 0) markVideoReady();
    };

    const onCanPlay = () => {
      if (coarsePointer.matches) startMobilePlayback();
    };

    const onLoadedMetadata = () => {
      if (coarsePointer.matches) {
        startMobilePlayback();
        pauseMobileVideoSoon();
      } else {
        video.pause();
      }
      scheduleSync();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (coarsePointer.matches) {
            startMobilePlayback();
            pauseMobileVideoSoon();
          }
          scheduleSync();
        } else if (syncFrame) {
          cancelAnimationFrame(syncFrame);
          syncFrame = 0;
        }
      },
      { rootMargin: "30% 0px", threshold: 0.01 },
    );

    const onMotionChange = () => scheduleSync();

    if (!coarsePointer.matches) video.pause();
    if (coarsePointer.matches) {
      FALLBACK_FRAMES.slice(1).forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    }
    visibilityObserver.observe(shell);
    ritual?.addEventListener("ritual:progress", onProgress);
    ritual?.addEventListener("touchstart", startMobilePlayback, { passive: true });
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("seeked", onSeeked);
    reduceMotion.addEventListener("change", onMotionChange);
    if (video.readyState >= 1) scheduleSync();

    return () => {
      if (syncFrame) cancelAnimationFrame(syncFrame);
      window.clearTimeout(mobilePauseTimer);
      visibilityObserver.disconnect();
      ritual?.removeEventListener("ritual:progress", onProgress);
      ritual?.removeEventListener("touchstart", startMobilePlayback);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("seeked", onSeeked);
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, [progressRef]);

  return (
    <div ref={shellRef} className="transformation-stage">
      <img
        ref={posterRef}
        className="transformation-stage__poster"
        src="/images/ritual/01-empty-chair.webp"
        alt=""
        aria-hidden="true"
        width="1280"
        height="720"
      />
      <video
        ref={videoRef}
        className="transformation-stage__video"
        autoPlay
        muted
        playsInline
        preload="auto"
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
