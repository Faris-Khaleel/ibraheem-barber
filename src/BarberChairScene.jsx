import { useEffect, useRef, useState } from "react";

const MODEL_URL = "/models/barber-chair/BarberShopChair_01_1k.gltf";

export function BarberChairScene({
  fallback,
  progressRef,
  sectionRef,
  ritual = false,
}) {
  const canvasRef = useRef(null);
  const shellRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return undefined;

    let disposed = false;
    let initialized = false;
    let destroyScene = () => {};

    const initialize = async () => {
      if (initialized || disposed) return;
      initialized = true;

      const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);

      if (disposed) return;

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(2.65, 1.55, 4.25);
      camera.lookAt(0, 0.78, 0);

      const cameraPath = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(2.65, 1.55, 4.25),
          new THREE.Vector3(1.15, 1.28, 3.25),
          new THREE.Vector3(-1.5, 1.42, 3.15),
          new THREE.Vector3(2.85, 1.72, 4.7),
        ],
        false,
        "catmullrom",
        0.42,
      );
      const targetPath = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0.78, 0),
          new THREE.Vector3(0.05, 0.96, 0),
          new THREE.Vector3(-0.12, 1.08, 0),
          new THREE.Vector3(0, 0.82, 0),
        ],
        false,
        "catmullrom",
        0.42,
      );
      const cameraPoint = new THREE.Vector3();
      const targetPoint = new THREE.Vector3();

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const environment = new RoomEnvironment();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const environmentMap = pmremGenerator.fromScene(environment, 0.04).texture;
      scene.environment = environmentMap;
      environment.dispose();
      pmremGenerator.dispose();

      const warmKey = new THREE.DirectionalLight(0xfff5e6, 4.6);
      warmKey.position.set(3.5, 5.5, 4.5);
      warmKey.castShadow = true;
      warmKey.shadow.mapSize.set(1024, 1024);
      scene.add(warmKey);

      const sandRim = new THREE.PointLight(0xcda16b, 22, 9, 1.5);
      sandRim.position.set(-2.4, 2.1, 1.8);
      scene.add(sandRim);

      const softFill = new THREE.HemisphereLight(0xfff8ef, 0x15120f, 1.75);
      scene.add(softFill);

      const artifact = new THREE.Group();
      artifact.position.y = -0.7;
      artifact.rotation.set(-0.035, -0.5, 0);
      scene.add(artifact);

      const backRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xb8844f,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
      });
      const backRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.06, 0.008, 8, 160),
        backRingMaterial,
      );
      backRing.position.set(0.03, 1.15, -0.4);
      backRing.rotation.x = 0.16;
      artifact.add(backRing);

      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(1.18, 96),
        new THREE.ShadowMaterial({ color: 0x090807, opacity: 0.22 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0.005;
      ground.receiveShadow = true;
      artifact.add(ground);

      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(MODEL_URL);
      if (disposed) return;

      const chair = gltf.scene;
      chair.scale.setScalar(1.52);
      chair.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (!material) return;
          material.envMapIntensity = 1.45;
          material.needsUpdate = true;
        });
      });
      artifact.add(chair);
      setReady(true);

      let pointerX = 0;
      let pointerY = 0;
      let scrollProgress = ritual ? 0 : 0.45;
      let raf = 0;
      let sceneVisible = true;
      let lastTime = performance.now();

      const render = () => renderer.render(scene, camera);

      const syncProgress = () => {
        if (progressRef) {
          scrollProgress = progressRef.current;
          return;
        }
        const source = sectionRef?.current || shell;
        const rect = source.getBoundingClientRect();
        const travel = ritual
          ? Math.max(1, rect.height - window.innerHeight)
          : window.innerHeight + rect.height;
        scrollProgress = ritual
          ? Math.min(1, Math.max(0, -rect.top / travel))
          : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
      };

      const applyScene = (time, delta = 0) => {
        syncProgress();
        const progress = ritual ? scrollProgress : 0.45;

        if (ritual) {
          cameraPath.getPointAt(progress, cameraPoint);
          targetPath.getPointAt(progress, targetPoint);
          camera.position.lerp(cameraPoint, motionQuery.matches ? 1 : Math.min(1, delta * 5.2));
          camera.lookAt(targetPoint);

          const targetRotation = -0.48 + progress * 2.72 + pointerX * 0.2;
          const targetTilt = -0.035 - pointerY * 0.045 + Math.sin(progress * Math.PI) * 0.035;
          artifact.rotation.y += (targetRotation - artifact.rotation.y) * (motionQuery.matches ? 1 : Math.min(1, delta * 4.2));
          artifact.rotation.x += (targetTilt - artifact.rotation.x) * (motionQuery.matches ? 1 : Math.min(1, delta * 4.6));
          artifact.position.x = Math.sin(progress * Math.PI * 2) * 0.12;
          artifact.position.y = -0.72 + Math.sin(progress * Math.PI) * 0.12;
          const scale = 1 + Math.sin(progress * Math.PI) * 0.08;
          artifact.scale.setScalar(scale);
          backRing.material.opacity = 0.2 + Math.sin(progress * Math.PI) * 0.2;
          sandRim.intensity = 18 + Math.sin(progress * Math.PI * 2) * 4;
        } else {
          const targetY = -0.5 + scrollProgress * 1.18 + pointerX * 0.27;
          const targetX = -0.035 - pointerY * 0.055;
          artifact.rotation.y += (targetY - artifact.rotation.y) * Math.min(1, delta * 2.9);
          artifact.rotation.x += (targetX - artifact.rotation.x) * Math.min(1, delta * 3.4);
        }

        if (!motionQuery.matches) {
          artifact.position.y += Math.sin(time * 0.00065) * 0.018;
          backRing.rotation.z = time * 0.000075;
        }
      };

      const resize = () => {
        const { width, height } = shell.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        applyScene(performance.now());
        render();
      };

      const onPointerMove = (event) => {
        const rect = shell.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      const onPointerLeave = () => {
        pointerX = 0;
        pointerY = 0;
      };

      const animate = (time) => {
        raf = 0;
        if (!sceneVisible || motionQuery.matches) return;
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        applyScene(time, delta);
        render();
        raf = requestAnimationFrame(animate);
      };

      const startAnimation = () => {
        if (raf || motionQuery.matches || !sceneVisible) return;
        lastTime = performance.now();
        raf = requestAnimationFrame(animate);
      };

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          sceneVisible = entry.isIntersecting;
          if (sceneVisible) startAnimation();
          else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { rootMargin: "180px 0px", threshold: 0.01 },
      );

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(shell);
      visibilityObserver.observe(shell);
      shell.addEventListener("pointermove", onPointerMove, { passive: true });
      shell.addEventListener("pointerleave", onPointerLeave);
      const onScroll = () => {
        syncProgress();
        if (motionQuery.matches) {
          applyScene(performance.now());
          render();
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      syncProgress();
      resize();
      if (motionQuery.matches) render();
      else startAnimation();

      destroyScene = () => {
        if (raf) cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        shell.removeEventListener("pointermove", onPointerMove);
        shell.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("scroll", onScroll);
        scene.traverse((object) => {
          object.geometry?.dispose?.();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (!material) return;
            Object.values(material).forEach((value) => value?.isTexture && value.dispose());
            material.dispose?.();
          });
        });
        environmentMap.dispose();
        renderer.dispose();
      };
    };

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadObserver.disconnect();
        initialize().catch(() => {
          if (!disposed) setReady(false);
        });
      },
      { rootMargin: "500px 0px", threshold: 0.01 },
    );

    loadObserver.observe(shell);

    return () => {
      disposed = true;
      loadObserver.disconnect();
      destroyScene();
    };
  }, [progressRef, ritual, sectionRef]);

  return (
    <div ref={shellRef} className={`chair-scene${ritual ? " chair-scene--ritual" : ""}${ready ? " is-ready" : ""}`}>
      <img className="chair-scene__fallback" src={fallback} alt="" aria-hidden="true" />
      <canvas ref={canvasRef} className="chair-scene__canvas" aria-hidden="true" />
      <span className="sr-only">Interactive three-dimensional barber chair.</span>
    </div>
  );
}
