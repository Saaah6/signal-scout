"use client";

import React, { useEffect, useRef } from "react";

export default function CosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported, falling back to basic background.");
      return;
    }

    // Vertex shader source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader source with interactive liquid ripples
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_ripples[5]; // x, y: position, z: age (0.0 to 1.0)

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main() {
        // Compute base coordinates
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Mouse interactive drift
        p += u_mouse * 0.03;
        
        // Apply interactive ripple wave displacements to 'p'
        // Each ripple warps space coordinates to simulate liquid refraction/ether wave
        vec2 warp = vec2(0.0);
        for (int i = 0; i < 5; i++) {
          vec3 ripple = u_ripples[i];
          float age = ripple.z;
          if (age < 1.0) {
            vec2 r_pos = ripple.xy;
            // Adjust ripple center according to aspect ratio scaling of coordinates
            vec2 diff = p - r_pos;
            float dist = length(diff);
            
            // Outer wave radius moves out with age
            float waveRadius = age * 0.75;
            float distToWave = abs(dist - waveRadius);
            float waveWidth = 0.18;
            
            if (distToWave < waveWidth) {
              // Smooth envelope to fade the wave edge and fade with age
              float envelope = smoothstep(waveWidth, 0.0, distToWave) * (1.0 - age);
              // Sine wave oscillation
              float wave = sin((dist - waveRadius) * 45.0 - age * 8.0) * 0.035 * envelope;
              // Displace coords radially
              if (dist > 0.001) {
                warp += normalize(diff) * wave;
              }
            }
          }
        }
        p += warp;

        // Deep cosmos background colors
        vec3 color = vec3(0.02, 0.012, 0.032) * (1.0 - length(p) * 0.35);
        
        // FBM drifting gas nebulae
        float n = 0.0;
        vec2 q = p * 1.6;
        n += 0.500 * noise(q + u_time * 0.02); q *= 2.02;
        n += 0.250 * noise(q - u_time * 0.015); q *= 2.01;
        n += 0.125 * noise(q + u_time * 0.01);
        
        vec3 nebula = mix(vec3(0.24, 0.06, 0.45), vec3(0.02, 0.2, 0.35), n);
        color += nebula * smoothstep(0.26, 0.8, n) * 0.42;
        
        // Stars Layer 1: background stars
        vec2 st1 = p * 14.0;
        float stars1 = hash(floor(st1));
        if (stars1 > 0.988) {
          float twinkle = sin(u_time * 1.4 + stars1 * 6.28) * 0.5 + 0.5;
          color += vec3(0.85, 0.9, 1.0) * twinkle * smoothstep(0.0, 0.08, fract(st1.x)) * smoothstep(0.0, 0.08, fract(st1.y)) * 0.3;
        }
        
        // Stars Layer 2: foreground brighter stars
        vec2 st2 = p * 7.5;
        float stars2 = hash(floor(st2) + vec2(53.21, 29.47));
        if (stars2 > 0.993) {
          float twinkle = sin(u_time * 2.8 + stars2 * 6.28) * 0.5 + 0.5;
          float dist = length(fract(st2) - 0.5);
          float glow = smoothstep(0.42, 0.0, dist) * 0.6;
          color += vec3(0.9, 0.95, 1.0) * twinkle * glow;
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shader helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed: ", gl.getProgramInfoLog(program));
      return;
    }

    // Screen-spanning quad vertices
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    // Uniform locations
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const ripplesLoc = gl.getUniformLocation(program, "u_ripples");

    // Track mouse coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        targetMouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    // Tracking ripple states
    const MAX_RIPPLES = 5;
    const ripples = Array(MAX_RIPPLES).fill(null).map(() => ({ x: 0, y: 0, age: 1.0 }));
    let activeRippleIndex = 0;

    const handlePointerDown = (e: PointerEvent) => {
      // Calculate WebGL aspect-ratio normalized coordinates
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const aspect = canvasWidth / canvasHeight;

      let x = (e.clientX / canvasWidth) * 2 - 1;
      let y = -(e.clientY / canvasHeight) * 2 + 1;

      // Compensate for viewport ratio in shader coordinate space
      if (aspect > 1.0) {
        x *= aspect;
      } else {
        y /= aspect;
      }

      ripples[activeRippleIndex] = { x, y, age: 0.0 };
      activeRippleIndex = (activeRippleIndex + 1) % MAX_RIPPLES;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("pointerdown", handlePointerDown);

    // Resize handler
    const resize = () => {
      // Limit DPR and max resolution to prevent WebGL crashing on mobile WebViews
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate target resolution
      let targetWidth = width * dpr;
      let targetHeight = height * dpr;
      
      // Cap at 1080p equivalent pixels to avoid Out-Of-Memory crashes
      const MAX_PIXELS = 1920 * 1080;
      if (targetWidth * targetHeight > MAX_PIXELS) {
        const scale = Math.sqrt(MAX_PIXELS / (targetWidth * targetHeight));
        targetWidth *= scale;
        targetHeight *= scale;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    // Render loop
    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      
      // Interpolate mouse coordinates for smooth lag effect
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      gl.useProgram(program);
      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform2f(mouseLoc, mouseX, mouseY);

      // Animate ripples age and populate float array
      const ripplesData = new Float32Array(MAX_RIPPLES * 3);
      for (let i = 0; i < MAX_RIPPLES; i++) {
        if (ripples[i].age < 1.0) {
          ripples[i].age += 0.016; // speed of wave expansion
          if (ripples[i].age > 1.0) ripples[i].age = 1.0;
        }
        ripplesData[i * 3] = ripples[i].x;
        ripplesData[i * 3 + 1] = ripples[i].y;
        ripplesData[i * 3 + 2] = ripples[i].age;
      }
      gl.uniform3fv(ripplesLoc, ripplesData);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none opacity-85 block"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
