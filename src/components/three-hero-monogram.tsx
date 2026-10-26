"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { site } from "@/data/site.config";

/**
 * An interactive 3D brutalist wireframe monogram built with Three.js.
 * Responds to pointer movements, dragging, and theme changes.
 * Falls back cleanly to the static SVG monogram when WebGL is unavailable or without JS.
 */
export function ThreeHeroMonogram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglAvailable, setWebglAvailable] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect WebGL support
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    setWebglAvailable(true);

    // Color resolver based on current theme
    const getColors = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      return {
        line: isDark ? 0xb2c7ab : 0x6a0c06,
        fill: isDark ? 0xb2c7ab : 0x6a0c06,
        accent: isDark ? 0xffffff : 0x1a1512,
      };
    };

    const width = container.clientWidth || 140;
    const height = container.clientHeight || 140;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Master group for interactive rotation
    const group = new THREE.Group();
    scene.add(group);

    // Initial colors
    const colors = getColors();

    // 1. Outer Box Wireframe (isometric bounding box)
    const boxGeo = new THREE.BoxGeometry(2.1, 2.1, 2.1);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxLineMat = new THREE.LineBasicMaterial({
      color: colors.line,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const boxWireframe = new THREE.LineSegments(boxEdges, boxLineMat);
    group.add(boxWireframe);

    // 2. Inner Nested Polyhedron (Octahedron for brutalist tension)
    const octaGeo = new THREE.OctahedronGeometry(1.2, 0);
    const octaEdges = new THREE.EdgesGeometry(octaGeo);
    const octaLineMat = new THREE.LineBasicMaterial({
      color: colors.line,
      linewidth: 2,
      transparent: true,
      opacity: 0.95,
    });
    const octaWireframe = new THREE.LineSegments(octaEdges, octaLineMat);
    group.add(octaWireframe);

    // 3. Facets with subtle opacity
    const octaFaceMat = new THREE.MeshBasicMaterial({
      color: colors.fill,
      transparent: true,
      opacity: 0.08,
      wireframe: false,
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaFaceMat);
    group.add(octaMesh);

    // 4. Center Node Sphere (the point/dot of "d.")
    const dotGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({
      color: colors.line,
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(0.4, -0.4, 0.4);
    group.add(dot);

    // Interaction state
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotSpeedX = 0.005;
    let rotSpeedY = 0.008;
    let targetRotX = 0.4;
    let targetRotY = 0.5;
    let isHovered = false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Pointer events
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotY += deltaX * 0.015;
        targetRotX += deltaY * 0.015;
        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        // Subtle tilt toward pointer
        const rect = container.getBoundingClientRect();
        const nx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        if (isHovered) {
          targetRotY += nx * 0.02;
          targetRotX += ny * 0.02;
        }
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onMouseEnter = () => {
      isHovered = true;
      rotSpeedY = 0.02;
    };

    const onMouseLeave = () => {
      isHovered = false;
      isDragging = false;
      rotSpeedY = 0.008;
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = "grab";
    domEl.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    domEl.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    // Watch theme changes
    const observer = new MutationObserver(() => {
      const newColors = getColors();
      boxLineMat.color.setHex(newColors.line);
      octaLineMat.color.setHex(newColors.line);
      octaFaceMat.color.setHex(newColors.fill);
      dotMat.color.setHex(newColors.line);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 140;
      const h = container.clientHeight || 140;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Visibility observer to pause RAF when offscreen
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      if (!isDragging && !prefersReducedMotion) {
        targetRotY += rotSpeedY;
        targetRotX += rotSpeedX;
      }

      // Smooth damping interpolation
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.08;

      // Gentle counter-rotation for inner octahedron
      octaWireframe.rotation.y += 0.006;
      octaMesh.rotation.y += 0.006;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      io.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      domEl.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);

      boxGeo.dispose();
      boxEdges.dispose();
      boxLineMat.dispose();
      octaGeo.dispose();
      octaEdges.dispose();
      octaLineMat.dispose();
      octaFaceMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-20 w-20 items-center justify-center md:h-36 md:w-36 select-none"
      role="img"
      aria-label={`${site.owner} interactive 3D monogram`}
    >
      {!webglAvailable && (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-auto md:h-36"
          role="img"
          aria-label={`${site.owner} monogram`}
        >
          <rect
            x="2"
            y="2"
            width="116"
            height="116"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <text
            x="60"
            y="80"
            textAnchor="middle"
            className="fill-current font-bold"
            style={{ fontSize: 64, letterSpacing: "-0.06em" }}
          >
            {site.displayName.charAt(0).toLowerCase()}.
          </text>
        </svg>
      )}
      <span className="sr-only">
        {site.displayName.charAt(0).toLowerCase()}. 3D isometric monogram
      </span>
    </div>
  );
}
