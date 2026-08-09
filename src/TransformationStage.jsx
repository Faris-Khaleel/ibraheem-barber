import { useEffect, useRef } from "react";

const TRANSFORMATION_VIDEO = "/videos/ritual-transformation.mp4";
const FRAME_DURATION = 1 / 24;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function TransformationStage({ progressRef }) {
  const shellRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const shell = shellRef.current;
    const video = videoRef.current;
    if (!shell || !video) return undefined;

    const ritual = shell.closest(".ritual");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let targetProgress = clamp(progressRef?.current ?? 0, 0, 1);
    let visible = true;
    let syncFrame = 0;
    let seekQueued = false;
    let videoUnlocked = false;
    let unlockInFlight = false;

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

      if (coarsePointer.matches && typeof video.fastSeek === "function") {
        try {
          video.fastSeek(targetTime);
        } catch {
          video.currentTime = targetTime;
        }
      } else {
        video.currentTime = targetTime;
      }
    };

    const scheduleSync = () => {
      if (!syncFrame) syncFrame = requestAnimationFrame(syncVideo);
    };

    const onProgress = (event) => {
      targetProgress = clamp(event.detail ?? progressRef?.current ?? 0, 0, 1);
      scheduleSync();
    };

    const onSeeked = () => {
      shell.classList.add("is-video-ready");
      if (!seekQueued) return;
      seekQueued = false;
      scheduleSync();
    };

    const onLoadedData = () => shell.classList.add("is-video-ready");

    const unlockVideo = () => {
      if (videoUnlocked || unlockInFlight || reduceMotion.matches) return;
      unlockInFlight = true;

      const playAttempt = video.play();
      if (!playAttempt?.then) {
        video.pause();
        videoUnlocked = true;
        unlockInFlight = false;
        scheduleSync();
        return;
      }

      playAttempt
        .then(() => {
          video.pause();
          videoUnlocked = true;
          unlockInFlight = false;
          scheduleSync();
        })
        .catch(() => {
          unlockInFlight = false;
        });
    };

    const onCanPlay = () => {
      if (coarsePointer.matches) unlockVideo();
    };

    const onLoadedMetadata = () => {
      video.pause();
      scheduleSync();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) scheduleSync();
        else if (syncFrame) {
          cancelAnimationFrame(syncFrame);
          syncFrame = 0;
        }
      },
      { rootMargin: "30% 0px", threshold: 0.01 },
    );

    const onMotionChange = () => scheduleSync();

    video.pause();
    visibilityObserver.observe(shell);
    ritual?.addEventListener("ritual:progress", onProgress);
    ritual?.addEventListener("touchstart", unlockVideo, { passive: true });
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("seeked", onSeeked);
    reduceMotion.addEventListener("change", onMotionChange);
    if (video.readyState >= 1) scheduleSync();

    return () => {
      if (syncFrame) cancelAnimationFrame(syncFrame);
      visibilityObserver.disconnect();
      ritual?.removeEventListener("ritual:progress", onProgress);
      ritual?.removeEventListener("touchstart", unlockVideo);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("seeked", onSeeked);
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, [progressRef]);

  return (
    <div ref={shellRef} className="transformation-stage">
      <img
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
        muted
        playsInline
        preload="auto"
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
