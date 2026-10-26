"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive 3D particle & wireframe wave field for the hero visual block.
 * Renders behind the 3x3 language grid, rippling with time and reacting to mouse movement.
 */
export function ThreeHeroGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentElement;
    if (!parent) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      parent.clientWidth / parent.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, -2.5, 4.2);
    camera.lookAt(0, 0, 0);

    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const domEl = renderer.domElement;
    domEl.className = "pointer-events-none absolute inset-0 h-full w-full opacity-65";
    container.appendChild(domEl);

    // Theme color resolver:
    // Light theme: bg is maroon (#6a0c06), particles are cream sage (0xb2c7ab).
    // Dark theme: bg is cream sage (#b2c7ab), particles are near black (0x0c0d0d).
    const getColors = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      return {
        point: isDark ? 0x0c0d0d : 0xb2c7ab,
        line: isDark ? 0x0c0d0d : 0xb2c7ab,
        pointOpacity: isDark ? 0.75 : 0.65,
        lineOpacity: isDark ? 0.4 : 0.28,
      };
    };

    // Create a 3D grid of points & lines
    const cols = 28;
    const rows = 18;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    const width = 8.5;
    const height = 5.5;

    let index = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const u = (i / (cols - 1) - 0.5) * width;
        const v = (j / (rows - 1) - 0.5) * height;
        positions[index * 3] = u;
        positions[index * 3 + 1] = v;
        positions[index * 3 + 2] = 0;

        originalPositions[index * 3] = u;
        originalPositions[index * 3 + 1] = v;
        originalPositions[index * 3 + 2] = 0;
        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const initialColors = getColors();

    const material = new THREE.PointsMaterial({
      color: initialColors.point,
      size: 0.09,
      transparent: true,
      opacity: initialColors.pointOpacity,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Connecting line lattice along rows and columns
    const lineIndices: number[] = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const current = i * rows + j;
        if (i < cols - 1) {
          lineIndices.push(current, (i + 1) * rows + j);
        }
        if (j < rows - 1) {
          lineIndices.push(current, i * rows + (j + 1));
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", geometry.getAttribute("position"));
    lineGeometry.setIndex(lineIndices);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: initialColors.line,
      transparent: true,
      opacity: initialColors.lineOpacity,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse coordinates in 3D world space
    const mouse = { x: 999, y: 999, targetX: 999, targetY: 999 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouse.targetX = nx * (width / 2);
        mouse.targetY = ny * (height / 2);
      } else {
        mouse.targetX = 999;
        mouse.targetY = 999;
      }
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // Handle theme observer
    const observer = new MutationObserver(() => {
      const c = getColors();
      material.color.setHex(c.point);
      material.opacity = c.pointOpacity;
      material.needsUpdate = true;
      lineMaterial.color.setHex(c.line);
      lineMaterial.opacity = c.lineOpacity;
      lineMaterial.needsUpdate = true;
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Handle resize
    const handleResize = () => {
      if (!parent || !renderer) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Intersection observer
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(parent);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible || !renderer) return;

      if (!prefersReducedMotion) {
        clock += 0.016;
      }

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let k = 0; k < count; k++) {
        const ox = originalPositions[k * 3];
        const oy = originalPositions[k * 3 + 1];

        // Base 3D undulation
        let z = Math.sin(ox * 0.9 + clock * 1.2) * Math.cos(oy * 0.9 + clock * 0.8) * 0.28;

        // Interactive mouse displacement (gravitational bulge / ripple)
        const dx = ox - mouse.x;
        const dy = oy - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 4.0) {
          const factor = Math.max(0, 1 - distSq / 4.0);
          z += factor * 0.65;
        }

        arr[k * 3 + 2] = z;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      observer.disconnect();
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      if (renderer) {
        renderer.dispose();
      }
      if (container && domEl && container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
