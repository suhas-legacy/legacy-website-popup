"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeSymbolTexture(symbol: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 98px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255, 215, 0, 1)";
  ctx.shadowColor = "rgba(0,0,0,0)";
  ctx.shadowBlur = 0;
  ctx.fillText(symbol, canvas.width / 2, canvas.height / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 5;

    const symbols = ["€", "$", "₿", "₽", "£", "¥"];
    const symbolPoints: THREE.Points[] = [];
    const symbolGeos: THREE.BufferGeometry[] = [];
    const symbolMats: THREE.PointsMaterial[] = [];

    const N = 1600;
    const per = Math.floor(N / symbols.length);
    for (let si = 0; si < symbols.length; si++) {
      const geo = new THREE.BufferGeometry();
      const count = si === symbols.length - 1 ? N - per * si : per;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 20;
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

      const tex = makeSymbolTexture(symbols[si]);
      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.36,
        map: tex,
        transparent: true,
        opacity: 1,
        alphaTest: 0.45,
        depthWrite: false,
        blending: THREE.NormalBlending,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      pts.rotation.z = Math.random() * Math.PI;
      scene.add(pts);

      symbolPoints.push(pts);
      symbolGeos.push(geo);
      symbolMats.push(mat);
    }

    const gridMat = new THREE.LineBasicMaterial({
      color: 0x2a2a2a,
      transparent: true,
      opacity: 0.14,
    });
    const gridLines: THREE.Line[] = [];
    for (let i = -10; i <= 10; i += 2) {
      const g1 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -10, 0),
        new THREE.Vector3(i, 10, 0),
      ]);
      const g2 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, i, 0),
        new THREE.Vector3(10, i, 0),
      ]);
      const l1 = new THREE.Line(g1, gridMat);
      const l2 = new THREE.Line(g2, gridMat);
      scene.add(l1, l2);
      gridLines.push(l1, l2);
    }

    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };

    const setSize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    setSize();
    document.addEventListener("mousemove", onMove);
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement!);

    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      for (let i = 0; i < symbolPoints.length; i++) {
        symbolPoints[i].rotation.y += 0.00035 + i * 0.00002;
        symbolPoints[i].rotation.x += 0.00018 + i * 0.00001;
      }
      camera.position.x += (-mx * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (my * 0.3 - camera.position.y) * 0.02;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      ro.disconnect();
      renderer.dispose();
      symbolGeos.forEach((g) => g.dispose());
      symbolMats.forEach((m) => {
        const map = m.map;
        if (map) map.dispose();
        m.dispose();
      });
      gridMat.dispose();
      gridLines.forEach((l) => l.geometry.dispose());
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" />;
}
