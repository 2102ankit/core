"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DiceFaces06Icon,
  ImageDownload02Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type KaleidoConfig = {
  segments: number;
  layer1Speed: number;
  layer2Speed: number;
  layer3Speed: number;
  pulseSpeed: number;
  pulseAmount: number;
  zoom: number;
  chromaticAberration: number;
  refractiveIndex: number;
  dispersion: number;
  leadThickness: number;
  glassOpacity: number;
  voronoiCells: number;
  lightIntensity: number;
  parallaxStrength: number;
};

const DEFAULT_CONFIG: KaleidoConfig = {
  segments: 12,
  layer1Speed: 0.3,
  layer2Speed: -0.5,
  layer3Speed: 0.7,
  pulseSpeed: 0.5,
  pulseAmount: 0.05,
  zoom: 4,
  chromaticAberration: 0.008,
  refractiveIndex: 1.5,
  dispersion: 0.02,
  leadThickness: 0.015,
  glassOpacity: 0.85,
  voronoiCells: 50,
  lightIntensity: 1.15,
  parallaxStrength: 0.5,
};

// Web Worker for offloading computations
const createWorker = () => {
  const workerCode = `
    self.onmessage = function(e) {
      const { type, data } = e.data;

      if (type === 'computePatternOffsets') {
        const { time, speeds } = data;
        const rotations = speeds.map(speed => time * speed * 0.01);
        self.postMessage({
          type: 'patternOffsetsComputed',
          data: { rotations }
        });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
};

function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-caption text-muted-foreground">{label}</label>
        <span className="text-caption font-medium tabular-nums text-foreground">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-foreground"
      />
    </div>
  );
}

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-4 space-y-3.5 first:border-t-0 first:pt-0">
      <h3 className="text-caption font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function KaleidoscopeViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const layer1RotRef = useRef<number>(0);
  const layer2RotRef = useRef<number>(0);
  const layer3RotRef = useRef<number>(0);
  const [config, setConfig] = useState<KaleidoConfig>(DEFAULT_CONFIG);

  // Keep latest config available inside the one-time animation loop
  // without tearing down the WebGL context on every slider tick.
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Web Worker
    workerRef.current = createWorker();
    const worker = workerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    sceneRef.current = scene;
    cameraRef.current = camera;

    // Stained Glass Shader
    const stainedGlassShader = {
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(1, 1),
        },
        segments: { value: DEFAULT_CONFIG.segments },
        layer1Rotation: { value: 0 },
        layer2Rotation: { value: 0 },
        layer3Rotation: { value: 0 },
        pulseAmount: { value: DEFAULT_CONFIG.pulseAmount },
        zoom: { value: DEFAULT_CONFIG.zoom },
        chromaticAberration: { value: DEFAULT_CONFIG.chromaticAberration },
        refractiveIndex: { value: DEFAULT_CONFIG.refractiveIndex },
        dispersion: { value: DEFAULT_CONFIG.dispersion },
        leadThickness: { value: DEFAULT_CONFIG.leadThickness },
        glassOpacity: { value: DEFAULT_CONFIG.glassOpacity },
        voronoiCells: { value: DEFAULT_CONFIG.voronoiCells },
        lightIntensity: { value: DEFAULT_CONFIG.lightIntensity },
        mousePos: { value: new THREE.Vector2(0.5, 0.5) },
        parallaxStrength: { value: DEFAULT_CONFIG.parallaxStrength },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform float segments;
        uniform float layer1Rotation;
        uniform float layer2Rotation;
        uniform float layer3Rotation;
        uniform float pulseAmount;
        uniform float zoom;
        uniform float chromaticAberration;
        uniform float refractiveIndex;
        uniform float dispersion;
        uniform float leadThickness;
        uniform float glassOpacity;
        uniform float voronoiCells;
        uniform float lightIntensity;
        uniform vec2 mousePos;
        uniform float parallaxStrength;
        
        varying vec2 vUv;
        
        const float PI = 3.14159265359;
        const float TAU = 6.28318530718;
        
        // Hash functions for procedural generation
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        
        vec2 hash2(vec2 p) {
          return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
        }
        
        // Voronoi pattern for stained glass shards
        vec3 voronoi(vec2 x, float cells) {
          vec2 n = floor(x * cells);
          vec2 f = fract(x * cells);
          
          float minDist = 1.0;
          vec2 minPoint;
          float secondMinDist = 1.0;
          
          for(int j = -1; j <= 1; j++) {
            for(int i = -1; i <= 1; i++) {
              vec2 neighbor = vec2(float(i), float(j));
              vec2 point = hash2(n + neighbor);
              vec2 diff = neighbor + point - f;
              float dist = length(diff);
              
              if(dist < minDist) {
                secondMinDist = minDist;
                minDist = dist;
                minPoint = n + neighbor;
              } else if(dist < secondMinDist) {
                secondMinDist = dist;
              }
            }
          }
          
          return vec3(minDist, secondMinDist, hash(minPoint));
        }
        
        // Rotate point around center
        vec2 rotate(vec2 p, float angle) {
          float c = cos(angle);
          float s = sin(angle);
          return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
        }
        
        // Create kaleidoscope effect
        vec2 kaleidoscope(vec2 uv, float segs) {
          float angle = atan(uv.y, uv.x);
          float radius = length(uv);
          
          float segAngle = TAU / segs;
          angle = mod(angle, segAngle);
          
          // Mirror every other segment
          float halfSeg = segAngle * 0.5;
          if(angle > halfSeg) {
            angle = segAngle - angle;
          }
          
          return vec2(cos(angle), sin(angle)) * radius;
        }
        
        // Curated stained-glass palette — jewel tones instead of raw noise
        vec3 paletteColor(float t) {
          vec3 c;
          if (t < 0.18) c = vec3(0.686, 0.173, 0.204);     // ruby
          else if (t < 0.36) c = vec3(0.902, 0.557, 0.161); // amber
          else if (t < 0.54) c = vec3(0.125, 0.427, 0.373); // viridian
          else if (t < 0.72) c = vec3(0.180, 0.278, 0.512); // cobalt
          else if (t < 0.88) c = vec3(0.447, 0.212, 0.443); // amethyst
          else c = vec3(0.867, 0.808, 0.639);               // cream
          return c;
        }
        
        // Refraction effect
        vec2 refract2D(vec2 uv, vec3 vorInfo, float ior) {
          float edgeDist = vorInfo.y - vorInfo.x;
          vec2 normal = normalize(uv);
          
          float angle = asin(sin(edgeDist * 10.0) / ior);
          return uv + normal * angle * 0.1;
        }
        
        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          uv.x *= resolution.x / resolution.y;
          
          // Apply zoom
          uv /= zoom;
          
          // Parallax rotation based on pointer
          vec2 mouseOffset = (mousePos - 0.5) * parallaxStrength;
          uv = rotate(uv, mouseOffset.x * 0.5);
          
          // Apply kaleidoscope symmetry
          vec2 kaleido = kaleidoscope(uv, segments);
          
          // Layer 1 - Base voronoi pattern
          vec2 uv1 = rotate(kaleido, layer1Rotation);
          vec3 vor1 = voronoi(uv1, voronoiCells);
          
          // Layer 2 - Secondary pattern
          vec2 uv2 = rotate(kaleido, layer2Rotation);
          vec3 vor2 = voronoi(uv2, voronoiCells * 0.7);
          
          // Layer 3 - Fine details
          vec2 uv3 = rotate(kaleido, layer3Rotation);
          vec3 vor3 = voronoi(uv3, voronoiCells * 1.3);
          
          // Combine layers with refraction
          vec2 refractedUV1 = refract2D(uv1, vor1, refractiveIndex);
          vec2 refractedUV2 = refract2D(uv2, vor2, refractiveIndex);
          
          vec3 vor1Refracted = voronoi(refractedUV1, voronoiCells);
          vec3 vor2Refracted = voronoi(refractedUV2, voronoiCells * 0.7);
          
          // Palette-driven glass colors with a whisper of edge prism
          float shade1 = 0.84 + 0.22 * hash(vec2(vor1.z * 17.31, 3.7));
          float shade2 = 0.84 + 0.22 * hash(vec2(vor2.z * 13.13, 7.1));
          float shade3 = 0.88 + 0.16 * hash(vec2(vor3.z * 11.71, 1.9));
          
          vec3 color1 = paletteColor(vor1Refracted.z) * shade1;
          vec3 color2 = paletteColor(vor2Refracted.z) * shade2;
          vec3 color3 = paletteColor(vor3.z) * shade3;
          
          // Blend layers — base layer dominates so shards stay readable
          vec3 finalColor = mix(color1, color2, 0.32);
          finalColor = mix(finalColor, color3, 0.18);
          
          // Lead borders (metallic outlines)
          float edge1 = smoothstep(leadThickness, leadThickness * 2.0, vor1.y - vor1.x);
          float edge2 = smoothstep(leadThickness, leadThickness * 2.0, vor2.y - vor2.x);
          float edge3 = smoothstep(leadThickness, leadThickness * 2.0, vor3.y - vor3.x);
          float lead = min(min(edge1, edge2), edge3);
          
          vec3 leadColor = vec3(0.12, 0.12, 0.14); // Dark metallic
          finalColor = mix(leadColor, finalColor, lead);
          
          // Segment borders (thick lead lines between kaleidoscope segments)
          float segAngle = TAU / segments;
          float currentAngle = atan(kaleido.y, kaleido.x);
          currentAngle = mod(currentAngle, segAngle);
          
          float radius = length(kaleido);
          float angleToEdge = min(currentAngle, segAngle - currentAngle);
          float distToEdge = radius * angleToEdge;
          
          float borderWidth = leadThickness * 0.03;
          float segmentBorder = smoothstep(borderWidth * 0.5, borderWidth * 1.5, distToEdge);
          finalColor = mix(leadColor, finalColor, segmentBorder);
          
          // Subtle chromatic aberration toward the rim
          float dist = length(uv);
          if(dist > 0.5) {
            vec2 offset = normalize(uv) * chromaticAberration * (dist - 0.5);
            float r = voronoi(refract2D(uv1 + offset, vor1, refractiveIndex), voronoiCells).z;
            float b = voronoi(refract2D(uv1 - offset, vor1, refractiveIndex), voronoiCells).z;
            vec3 rimR = paletteColor(r);
            vec3 rimB = paletteColor(b);
            finalColor.r = mix(finalColor.r, rimR.r, 0.25);
            finalColor.b = mix(finalColor.b, rimB.b, 0.25);
          }
          
          // Add glass translucency
          finalColor = mix(finalColor, vec3(1.0), (1.0 - glassOpacity) * 0.3);
          
          // Subtle vignette
          float vignette = smoothstep(1.2, 0.3, length(uv));
          finalColor *= vignette * 0.3 + 0.7;
          
          gl_FragColor = vec4(finalColor * lightIntensity, 1.0);
        }
      `,
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(stainedGlassShader);
    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Set initial size based on canvas displayed dimensions
    const initialRect = canvasRef.current.getBoundingClientRect();
    renderer.setSize(initialRect.width, initialRect.height, false);
    material.uniforms.resolution.value.set(
      initialRect.width,
      initialRect.height,
    );

    // Pointer tracking (mouse + touch)
    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      material.uniforms.mousePos.value.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      );
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Web Worker message handler
    worker.onmessage = (e) => {
      const { type, data } = e.data;

      if (type === "patternOffsetsComputed") {
        layer1RotRef.current = data.rotations[0];
        layer2RotRef.current = data.rotations[1];
        layer3RotRef.current = data.rotations[2];
      }
    };

    // Animation loop with Web Worker offloading
    let frameCount = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const cfg = configRef.current;
      const time = performance.now() * 0.001;
      material.uniforms.time.value = time;

      // Offload pattern computation to worker every 2 frames to reduce load
      if (frameCount % 2 === 0) {
        worker.postMessage({
          type: "computePatternOffsets",
          data: {
            time,
            speeds: [cfg.layer1Speed, cfg.layer2Speed, cfg.layer3Speed],
          },
        });
      } else {
        // Lightweight local update between worker calls
        layer1RotRef.current += cfg.layer1Speed * 0.01;
        layer2RotRef.current += cfg.layer2Speed * 0.01;
        layer3RotRef.current += cfg.layer3Speed * 0.01;
      }

      material.uniforms.layer1Rotation.value = layer1RotRef.current;
      material.uniforms.layer2Rotation.value = layer2RotRef.current;
      material.uniforms.layer3Rotation.value = layer3RotRef.current;

      renderer.render(scene, camera);
      frameCount++;
    };

    // Start animation immediately
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      renderer.setSize(width, height, false);
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (workerRef.current) workerRef.current.terminate();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  const updateConfig = (key: keyof KaleidoConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const shufflePattern = () => {
    const randomSpeed = () => (Math.random() - 0.5) * 3; // -1.5 to 1.5
    const randomSegments = Math.floor(Math.random() * 10) + 4; // 4-13 segments

    setConfig((prev) => ({
      ...prev,
      segments: randomSegments,
      layer1Speed: randomSpeed(),
      layer2Speed: randomSpeed(),
      layer3Speed: randomSpeed(),
    }));
  };

  // Update shader uniforms when config changes
  useEffect(() => {
    if (!materialRef.current) return;

    const material = materialRef.current;
    material.uniforms.zoom.value = config.zoom;
    material.uniforms.segments.value = config.segments;
    material.uniforms.chromaticAberration.value = config.chromaticAberration;
    material.uniforms.refractiveIndex.value = config.refractiveIndex;
    material.uniforms.dispersion.value = config.dispersion;
    material.uniforms.leadThickness.value = config.leadThickness;
    material.uniforms.glassOpacity.value = config.glassOpacity;
    material.uniforms.voronoiCells.value = config.voronoiCells;
    material.uniforms.lightIntensity.value = config.lightIntensity;
    material.uniforms.parallaxStrength.value = config.parallaxStrength;
  }, [config]);

  const exportImage = () => {
    if (!canvasRef.current || !materialRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Store original resolution
    const originalWidth = rendererRef.current.domElement.width;
    const originalHeight = rendererRef.current.domElement.height;
    const originalResolution = materialRef.current.uniforms.resolution.value.clone();

    // Set high resolution for export (2x pixel ratio for better quality)
    const exportScale = 2;
    const rect = canvasRef.current.getBoundingClientRect();
    const highResWidth = rect.width * exportScale;
    const highResHeight = rect.height * exportScale;

    rendererRef.current.setSize(highResWidth, highResHeight, false);
    materialRef.current.uniforms.resolution.value.set(highResWidth, highResHeight);

    // Render one frame at high resolution
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    // Export the high-res image
    const link = document.createElement("a");
    link.download = `kaleidoscope-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png", 1.0);
    link.click();

    // Restore original resolution
    rendererRef.current.setSize(originalWidth, originalHeight, false);
    materialRef.current.uniforms.resolution.value.copy(originalResolution);

    // Render to update display
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-5 px-4 py-6">
      
      <div className="relative w-full aspect-square self-center max-w-[min(100%,calc(100svh-10rem))] mx-auto lg:mx-0 lg:flex-1">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full rounded-xl border border-border shadow-elevation-2"
        />
      </div>

      
      <aside className="w-full lg:w-80 shrink-0 rounded-xl border border-border bg-card p-4 sm:p-5 lg:max-h-[calc(100vh-10rem)] overflow-y-auto space-y-5">
        <div className="grid grid-cols-2 gap-2.5">
          <Button onClick={shufflePattern} variant="default" size="sm">
            <HugeiconsIcon icon={DiceFaces06Icon} className="size-4" />
            Shuffle
          </Button>
          <Button onClick={exportImage} variant="outline" size="sm">
            <HugeiconsIcon icon={ImageDownload02Icon} className="size-4" />
            Export PNG
          </Button>
        </div>

        <ControlSection title="Pattern">
          <ControlSlider
            label="Segments"
            value={config.segments}
            min={3}
            max={16}
            step={1}
            onChange={(v) => updateConfig("segments", v)}
          />
          <ControlSlider
            label="Voronoi cells"
            value={config.voronoiCells}
            min={10}
            max={100}
            step={1}
            onChange={(v) => updateConfig("voronoiCells", v)}
          />
          <ControlSlider
            label="Lead thickness"
            value={config.leadThickness}
            min={0}
            max={0.05}
            step={0.005}
            format={(v) => v.toFixed(3)}
            onChange={(v) => updateConfig("leadThickness", v)}
          />
        </ControlSection>

        <ControlSection title="Motion">
          <ControlSlider
            label="Zoom"
            value={config.zoom}
            min={1}
            max={5}
            step={0.01}
            format={(v) => `${v.toFixed(2)}x`}
            onChange={(v) => updateConfig("zoom", v)}
          />
          <ControlSlider
            label="Parallax"
            value={config.parallaxStrength}
            min={0}
            max={2}
            step={0.1}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("parallaxStrength", v)}
          />
          <ControlSlider
            label="Layer 1 rotation"
            value={config.layer1Speed}
            min={-2}
            max={2}
            step={0.1}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("layer1Speed", v)}
          />
          <ControlSlider
            label="Layer 2 rotation"
            value={config.layer2Speed}
            min={-2}
            max={2}
            step={0.1}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("layer2Speed", v)}
          />
          <ControlSlider
            label="Layer 3 rotation"
            value={config.layer3Speed}
            min={-2}
            max={2}
            step={0.1}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("layer3Speed", v)}
          />
        </ControlSection>

        <ControlSection title="Glass">
          <ControlSlider
            label="Dispersion"
            value={config.dispersion}
            min={0}
            max={0.1}
            step={0.01}
            format={(v) => v.toFixed(3)}
            onChange={(v) => updateConfig("dispersion", v)}
          />
          <ControlSlider
            label="Chromatic aberration"
            value={config.chromaticAberration}
            min={0}
            max={0.05}
            step={0.001}
            format={(v) => v.toFixed(3)}
            onChange={(v) => updateConfig("chromaticAberration", v)}
          />
          <ControlSlider
            label="Refractive index"
            value={config.refractiveIndex}
            min={1}
            max={2.5}
            step={0.1}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("refractiveIndex", v)}
          />
          <ControlSlider
            label="Glass opacity"
            value={config.glassOpacity}
            min={0.5}
            max={1}
            step={0.05}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("glassOpacity", v)}
          />
          <ControlSlider
            label="Light intensity"
            value={config.lightIntensity}
            min={0.5}
            max={3}
            step={0.1}
            format={(v) => v.toFixed(2)}
            onChange={(v) => updateConfig("lightIntensity", v)}
          />
        </ControlSection>
      </aside>
    </div>
  );
}
