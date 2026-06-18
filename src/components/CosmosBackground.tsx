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

    // Fragment shader source
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

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
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Mouse interactive drift
        p += u_mouse * 0.05;
        
        // Deep cosmos background colors
        vec3 color = vec3(0.02, 0.015, 0.035) * (1.0 - length(p) * 0.4);
        
        // FBM drifting gas nebulae
        float n = 0.0;
        vec2 q = p * 1.6;
        n += 0.500 * noise(q + u_time * 0.025); q *= 2.02;
        n += 0.250 * noise(q - u_time * 0.018); q *= 2.01;
        n += 0.125 * noise(q + u_time * 0.012);
        
        vec3 nebula = mix(vec3(0.25, 0.08, 0.42), vec3(0.04, 0.22, 0.32), n);
        color += nebula * smoothstep(0.28, 0.82, n) * 0.45;
        
        // Stars Layer 1: background stars
        vec2 st1 = p * 14.0;
        float stars1 = hash(floor(st1));
        if (stars1 > 0.988) {
          float twinkle = sin(u_time * 1.4 + stars1 * 6.28) * 0.5 + 0.5;
          color += vec3(0.85, 0.9, 1.0) * twinkle * smoothstep(0.0, 0.08, fract(st1.x)) * smoothstep(0.0, 0.08, fract(st1.y)) * 0.35;
        }
        
        // Stars Layer 2: foreground brighter stars
        vec2 st2 = p * 7.5;
        float stars2 = hash(floor(st2) + vec2(53.21, 29.47));
        if (stars2 > 0.993) {
          float twinkle = sin(u_time * 2.8 + stars2 * 6.28) * 0.5 + 0.5;
          float dist = length(fract(st2) - 0.5);
          float glow = smoothstep(0.42, 0.0, dist) * 0.65;
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Resize handler
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
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
