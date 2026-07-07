import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch (e) {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry - Particle system forming a gorgeous wave grid
    const numParticles = 1200;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const color1 = new THREE.Color("#5dade2"); // baby blue (Warm Organic)
    const color2 = new THREE.Color("#a8dadc"); // baby teal (Warm Organic)

    let index = 0;
    const rows = 40;
    const cols = 30;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * 0.4;
        const z = (r - rows / 2) * 0.4;
        const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8;

        positions[index] = x;
        positions[index + 1] = y;
        positions[index + 2] = z;

        // Mix baby blue and baby teal colors based on position
        const mixedColor = color1.clone().lerp(color2, (c / cols + r / rows) / 2);
        colors[index] = mixedColor.r;
        colors[index + 1] = mixedColor.g;
        colors[index + 2] = mixedColor.b;

        index += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.16,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse movement interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      targetMouseY = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    container.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const positionAttr = geometry.attributes.position as THREE.BufferAttribute;

      // Soft interpolation for smooth mouse interaction
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Deform wave particles based on time + mouse
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = positionAttr.getX(idx);
          const z = positionAttr.getZ(idx);

          // Standard wave equation
          let y = Math.sin(x * 0.4 + elapsedTime * 1.2) * Math.cos(z * 0.4 + elapsedTime * 0.8) * 0.7;

          // Mouse ripple influence
          const distToMouse = Math.sqrt(Math.pow(x - mouseX * 5, 2) + Math.pow(z - mouseY * 5, 2));
          if (distToMouse < 4) {
            y += Math.sin(distToMouse * 3 - elapsedTime * 4) * (4 - distToMouse) * 0.15;
          }

          positionAttr.setY(idx, y);
          idx++;
        }
      }
      positionAttr.needsUpdate = true;

      // Gentle camera orbit animation following mouse coordinates
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 2 + 2 - camera.position.y) * 0.03;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Slow continuous rotation of the particle system
      points.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer for fluidity
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[450px]">
      {webGlSupported ? (
        <div ref={containerRef} className="w-full h-full select-none" id="three-container" />
      ) : (
        /* Flat fallback structure for systems with WebGL disabled */
        <div className="w-full h-full flex items-center justify-center bg-radial from-pastel-blue to-cream relative overflow-hidden">
          <svg className="w-full h-full max-h-[400px] opacity-75" viewBox="0 0 800 400" id="fallback-3d-svg">
            <g fill="none" stroke="currentColor" strokeWidth="1" className="text-baby-teal">
              {Array.from({ length: 15 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${-50 + i * 20} 200 Q 200 ${100 + i * 15} 400 200 T 850 ${200 + i * 5}`}
                  className="animate-[pulse_4s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-cream via-transparent to-transparent">
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">Atmospheric Wave Canvas</p>
          </div>
        </div>
      )}
    </div>
  );
}
