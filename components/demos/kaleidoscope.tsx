"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Web Worker for offloading computations
const createWorker = () => {
  const workerCode = `
    self.onmessage = function(e) {
      const { type, data } = e.data;
      
      if (type === 'processAudio') {
        const { audioData } = data;
        const average = audioData.reduce((a, b) => a + b, 0) / audioData.length;
        const bass = audioData.slice(0, audioData.length / 4).reduce((a, b) => a + b, 0) / (audioData.length / 4);
        const treble = audioData.slice(audioData.length * 3 / 4).reduce((a, b) => a + b, 0) / (audioData.length / 4);
        
        self.postMessage({
          type: 'audioProcessed',
          data: { average: average / 255, bass: bass / 255, treble: treble / 255 }
        });
      }
      
      if (type === 'computePatternOffsets') {
        const { time, speeds, pulseSpeed, pulseAmount } = data;
        const pulse = Math.sin(time * pulseSpeed) * pulseAmount + 1.0;
        const rotations = speeds.map(speed => time * speed * 0.01);
        
        self.postMessage({
          type: 'patternOffsetsComputed',
          data: { pulse, rotations }
        });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
};

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
  const [config, setConfig] = useState({
    segments: 12,
    layer1Speed: 0.3,
    layer2Speed: -0.5,
    layer3Speed: 0.7,
    pulseSpeed: 0.5,
    pulseAmount: 0.05,
    zoom: 4,
    chromaticAberration: 0.015,
    refractiveIndex: 1.5,
    dispersion: 0.03,
    leadThickness: 0.015,
    glassOpacity: 0.85,
    voronoiCells: 50,
    lightIntensity: 1.5,
    audioReactive: false,
    parallaxStrength: 0.5,
  });

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 8));

    sceneRef.current = scene;
    cameraRef.current = camera;

    // Stained Glass Shader
    const stainedGlassShader = {
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerHeight, window.innerHeight),
        },
        segments: { value: config.segments },
        layer1Rotation: { value: 0 },
        layer2Rotation: { value: 0 },
        layer3Rotation: { value: 0 },
        pulseAmount: { value: config.pulseAmount },
        zoom: { value: config.zoom },
        chromaticAberration: { value: config.chromaticAberration },
        refractiveIndex: { value: config.refractiveIndex },
        dispersion: { value: config.dispersion },
        leadThickness: { value: config.leadThickness },
        glassOpacity: { value: config.glassOpacity },
        voronoiCells: { value: config.voronoiCells },
        lightIntensity: { value: config.lightIntensity },
        mousePos: { value: new THREE.Vector2(0.5, 0.5) },
        parallaxStrength: { value: config.parallaxStrength },
        audioLevel: { value: 0 },
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
        uniform float audioLevel;
        
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
        
        // Chromatic dispersion (rainbow edges)
        vec3 chromaticDispersion(vec2 uv, vec3 vorInfo, float strength) {
          float edgeDist = vorInfo.y - vorInfo.x;
          float edge = smoothstep(0.0, 0.05, edgeDist);
          
          vec3 color;
          color.r = vorInfo.z;
          color.g = hash(vec2(vorInfo.z * 7.13, 0.0));
          color.b = hash(vec2(vorInfo.z * 13.71, 0.0));
          
          // Add prismatic dispersion at edges
          if(edge < 0.5) {
            float prism = (1.0 - edge * 2.0) * strength;
            color.r += prism * 0.3;
            color.g += prism * 0.1;
            color.b += prism * 0.5;
          }
          
          return color;
        }
        
        // Refraction effect
        vec2 refract2D(vec2 uv, vec3 vorInfo, float ior) {
          float edgeDist = vorInfo.y - vorInfo.x;
          vec2 normal = normalize(uv);
          
          float angle = asin(sin(edgeDist * 10.0) / ior);
          return uv + normal * angle * 0.1;
        }
        
        // Caustic light patterns
        float caustics(vec2 uv, float t) {
          vec2 p = uv * 3.0;
          float c = 0.0;
          
          for(float i = 0.0; i < 4.0; i++) {
            float angle = t * 0.3 + i * 1.5;
            vec2 offset = vec2(cos(angle), sin(angle)) * 0.5;
            float d = length(p - offset);
            c += sin(d * 8.0 - t * 2.0) * 0.5 + 0.5;
          }
          
          return c / 4.0;
        }
        
        // Volumetric light shafts
        float volumetricLight(vec2 uv, float t) {
          float rays = 0.0;
          vec2 center = vec2(0.0);
          vec2 dir = normalize(uv - center);
          
          for(float i = 0.0; i < 8.0; i++) {
            float dist = i * 0.1;
            vec2 pos = center + dir * dist;
            float intensity = 1.0 - dist;
            rays += sin(length(pos) * 10.0 - t * 3.0) * intensity;
          }
          
          return rays * 0.125;
        }
        
        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          uv.x *= resolution.x / resolution.y;
          
          // Apply zoom
          uv /= zoom;
          
          // Parallax rotation based on mouse
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
          
          // Generate stained glass colors with chromatic dispersion
          vec3 color1 = chromaticDispersion(uv1, vor1Refracted, dispersion);
          vec3 color2 = chromaticDispersion(uv2, vor2Refracted, dispersion);
          vec3 color3 = chromaticDispersion(uv3, vor3, dispersion * 0.5);
          
          // Blend layers
          vec3 finalColor = mix(color1, color2, 0.4);
          finalColor = mix(finalColor, color3, 0.3);
          
          // Lead borders (metallic outlines)
          float edge1 = smoothstep(leadThickness, leadThickness * 2.0, vor1.y - vor1.x);
          float edge2 = smoothstep(leadThickness, leadThickness * 2.0, vor2.y - vor2.x);
          float edge3 = smoothstep(leadThickness, leadThickness * 2.0, vor3.y - vor3.x);
          float lead = min(min(edge1, edge2), edge3);
          
          vec3 leadColor = vec3(0.15, 0.15, 0.2); // Dark metallic
          finalColor = mix(leadColor, finalColor, lead);
          
          // Add segment borders (thick lead lines between kaleidoscope segments)
          // Use distance in pixel space for constant thickness
          float segAngle = TAU / segments;
          float currentAngle = atan(kaleido.y, kaleido.x);
          currentAngle = mod(currentAngle, segAngle);
          
          // Calculate distance to segment edge in UV space
          float radius = length(kaleido);
          float angleToEdge = min(currentAngle, segAngle - currentAngle);
          float distToEdge = radius * angleToEdge; // Convert angle to linear distance
          
          // Make border thickness constant in screen space
          float borderWidth = leadThickness * 0.03;
          float segmentBorder = smoothstep(borderWidth * 0.5, borderWidth * 1.5, distToEdge);
          finalColor = mix(leadColor, finalColor, segmentBorder);
          
          // Chromatic aberration at edges
          float dist = length(uv);
          if(dist > 0.5) {
            vec2 offset = normalize(uv) * chromaticAberration * (dist - 0.5);
            float r = voronoi(refract2D(uv1 + offset, vor1, refractiveIndex), voronoiCells).z;
            float b = voronoi(refract2D(uv1 - offset, vor1, refractiveIndex), voronoiCells).z;
            finalColor.r = mix(finalColor.r, r, 0.3);
            finalColor.b = mix(finalColor.b, b, 0.3);
          }
          
          // Enhance saturation and vibrancy (stained glass effect)
          vec3 hsv = vec3(atan(finalColor.b, finalColor.r), 
                          sqrt(finalColor.r * finalColor.r + finalColor.b * finalColor.b),
                          finalColor.g);
          hsv.y *= 1.3; // Increase saturation
          
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
    material.uniforms.resolution.value.set(initialRect.width, initialRect.height);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      material.uniforms.mousePos.value.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Web Worker message handler
    worker.onmessage = (e) => {
      const { type, data } = e.data;

      if (type === "audioProcessed") {
        material.uniforms.audioLevel.value = data.average;
      }

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

      const time = performance.now() * 0.001;
      material.uniforms.time.value = time;

      // Offload pattern computation to worker every 2 frames to reduce load
      if (frameCount % 2 === 0) {
        worker.postMessage({
          type: "computePatternOffsets",
          data: {
            time,
            speeds: [
              config.layer1Speed,
              config.layer2Speed,
              config.layer3Speed,
            ],
            pulseSpeed: config.pulseSpeed,
            pulseAmount: config.pulseAmount,
          },
        });
      } else {
        // Lightweight local update between worker calls
        layer1RotRef.current += config.layer1Speed * 0.01;
        layer2RotRef.current += config.layer2Speed * 0.01;
        layer3RotRef.current += config.layer3Speed * 0.01;
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
      const dpr = Math.min(window.devicePixelRatio, 4);
      const width = rect.width;
      const height = rect.height;
      renderer.setSize(width, height, false);
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (workerRef.current) workerRef.current.terminate();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [config]);

  const updateConfig = (key: string, value: number | boolean) => {
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

  const enableAudio = async () => {
    const newState = !config.audioReactive;
    setConfig((prev) => ({ ...prev, audioReactive: newState }));

    // This will trigger the effect that sets up audio when audioReactive changes
  };

  // Separate effect for audio setup when audioReactive changes
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let animationId: number | null = null;

    const setupAudio = async () => {
      if (!config.audioReactive) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Process audio in loop
        const processAudio = () => {
          if (!analyser || !dataArray || !workerRef.current) return;

          analyser.getByteFrequencyData(dataArray);
          workerRef.current.postMessage({
            type: "processAudio",
            data: { audioData: Array.from(dataArray) },
          });

          animationId = requestAnimationFrame(processAudio);
        };

        processAudio();
      } catch (err) {
        console.log("Audio not available:", err);
        setConfig((prev) => ({ ...prev, audioReactive: false }));
      }
    };

    setupAudio();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
    };
  }, [config.audioReactive]);

  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-1">
      <canvas ref={canvasRef} className="aspect-square m-auto max-h-full p-0 col-span-2" />
      <div className="bg-black/80 backdrop-blur-md p-6 max-h-full overflow-y-auto w-80 text-white mx-auto">
        <h2 className="text-xl font-bold mb-4 bg-clip-text bg-white">
          Kaleidoscope Controls
        </h2>

        <div className="space-y-4 text-sm">
          <div className="border-b border-gray-700 pb-3 space-y-2">
            <button
              onClick={shufflePattern}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              🎲 Shuffle Pattern
            </button>
            {/* <button
              onClick={enableAudio}
              className={`w-full py-2 px-4 rounded ${
                config.audioReactive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } transition-colors`}
            >
              {config.audioReactive ? "🎵 Audio Active" : "🎵 Enable Audio"}
            </button> */}

            <button
              onClick={exportImage}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
            >
            📸 Export Artwork
            </button>
          </div>
          <div>
            <label className="block mb-1">
              Zoom: {config.zoom.toFixed(2)}x
            </label>
            <input
              type="range"
              min="1"
              max="5.0" 
              step="0.01"
              value={config.zoom}
              onChange={(e) => updateConfig("zoom", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Segments: {config.segments}</label>
            <input
              type="range"
              min="3"
              max="16"
              value={config.segments}
              onChange={(e) =>
                updateConfig("segments", parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">
              Layer Rotation
            </h3>

            <div>
              <label className="block mb-1">
                Layer 1: {config.layer1Speed.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.layer1Speed}
                onChange={(e) =>
                  updateConfig("layer1Speed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Layer 2: {config.layer2Speed.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.layer2Speed}
                onChange={(e) =>
                  updateConfig("layer2Speed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Layer 3: {config.layer3Speed.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.layer3Speed}
                onChange={(e) =>
                  updateConfig("layer3Speed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">Animation</h3>

            <div>
              <label className="block mb-1">
                Parallax: {config.parallaxStrength.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.parallaxStrength}
                onChange={(e) =>
                  updateConfig("parallaxStrength", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">
              Glass Effects
            </h3>

            <div>
              <label className="block mb-1">
                Chromatic Aberration: {config.chromaticAberration.toFixed(3)}
              </label>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.001"
                value={config.chromaticAberration}
                onChange={(e) =>
                  updateConfig(
                    "chromaticAberration",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Refractive Index: {config.refractiveIndex.toFixed(2)}
              </label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={config.refractiveIndex}
                onChange={(e) =>
                  updateConfig("refractiveIndex", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Dispersion: {config.dispersion.toFixed(3)}
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.01"
                value={config.dispersion}
                onChange={(e) =>
                  updateConfig("dispersion", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Glass Opacity: {config.glassOpacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={config.glassOpacity}
                onChange={(e) =>
                  updateConfig("glassOpacity", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">Pattern</h3>

            <div>
              <label className="block mb-1">
                Voronoi Cells: {config.voronoiCells}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={config.voronoiCells}
                onChange={(e) =>
                  updateConfig("voronoiCells", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Lead Thickness: {config.leadThickness.toFixed(3)}
              </label>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.005"
                value={config.leadThickness}
                onChange={(e) =>
                  updateConfig("leadThickness", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">Lighting</h3>

            <div>
              <label className="block mb-1">
                Light Intensity: {config.lightIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={config.lightIntensity}
                onChange={(e) =>
                  updateConfig("lightIntensity", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Controls Panel */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-6 rounded-lg max-h-[90vh] overflow-y-auto w-80 text-white">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-white">
          Kaleidoscope Controls
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1">
              Zoom: {config.zoom.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={config.zoom}
              onChange={(e) => updateConfig("zoom", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Segments: {config.segments}</label>
            <input
              type="range"
              min="3"
              max="16"
              value={config.segments}
              onChange={(e) =>
                updateConfig("segments", parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">
              Layer Rotation
            </h3>

            <div>
              <label className="block mb-1">
                Layer 1: {config.layer1Speed.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.layer1Speed}
                onChange={(e) =>
                  updateConfig("layer1Speed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Layer 2: {config.layer2Speed.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.layer2Speed}
                onChange={(e) =>
                  updateConfig("layer2Speed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Layer 3: {config.layer3Speed.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.layer3Speed}
                onChange={(e) =>
                  updateConfig("layer3Speed", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">Animation</h3>

            <div>
              <label className="block mb-1">
                Parallax: {config.parallaxStrength.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.parallaxStrength}
                onChange={(e) =>
                  updateConfig("parallaxStrength", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">
              Glass Effects
            </h3>

            <div>
              <label className="block mb-1">
                Chromatic Aberration: {config.chromaticAberration.toFixed(3)}
              </label>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.001"
                value={config.chromaticAberration}
                onChange={(e) =>
                  updateConfig(
                    "chromaticAberration",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Refractive Index: {config.refractiveIndex.toFixed(2)}
              </label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={config.refractiveIndex}
                onChange={(e) =>
                  updateConfig("refractiveIndex", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Dispersion: {config.dispersion.toFixed(3)}
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.01"
                value={config.dispersion}
                onChange={(e) =>
                  updateConfig("dispersion", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Glass Opacity: {config.glassOpacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={config.glassOpacity}
                onChange={(e) =>
                  updateConfig("glassOpacity", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">Pattern</h3>

            <div>
              <label className="block mb-1">
                Voronoi Cells: {config.voronoiCells}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={config.voronoiCells}
                onChange={(e) =>
                  updateConfig("voronoiCells", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">
                Lead Thickness: {config.leadThickness.toFixed(3)}
              </label>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.005"
                value={config.leadThickness}
                onChange={(e) =>
                  updateConfig("leadThickness", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="font-semibold mb-2 text-purple-300">Lighting</h3>

            <div>
              <label className="block mb-1">
                Light Intensity: {config.lightIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={config.lightIntensity}
                onChange={(e) =>
                  updateConfig("lightIntensity", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3 space-y-2">
            <button
              onClick={shufflePattern}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              🎲 Shuffle Pattern
            </button>
            <button
              onClick={enableAudio}
              className={`w-full py-2 px-4 rounded ${
                config.audioReactive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } transition-colors`}
            >
              {config.audioReactive ? "🎵 Audio Active" : "🎵 Enable Audio"}
            </button>

            <button
              onClick={exportImage}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
            >
              📸 Export Artwork
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg text-white text-sm max-w-md">
        <h3 className="font-bold mb-2">✨ Interactive Features</h3>
        <ul className="space-y-1 text-xs">
          <li>🖱️ Move mouse for parallax rotation</li>
          <li>🎨 Multiple layers rotating independently</li>
          <li>💎 Real refraction & chromatic dispersion</li>
          <li>🌈 Voronoi stained glass shards</li>
          <li>⚡ Segment borders match lead thickness</li>
          <li>🎵 Audio reactive mode available</li>
          <li>🎲 Shuffle for random patterns</li>
          <li>⚙️ Web Worker optimized (reduced main thread load)</li>
        </ul>
      </div>
    </div>
  );
}
