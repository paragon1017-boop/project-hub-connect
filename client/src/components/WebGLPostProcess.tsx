import { useEffect, useRef, useCallback } from "react";

interface WebGLPostProcessProps {
  sourceCanvas: HTMLCanvasElement | null;
  width: number;
  height: number;
  className?: string;
  effects?: {
    scanlines?: boolean;
    bloom?: boolean;
    vignette?: boolean;
    colorGrading?: boolean;
    crt?: boolean;
    chromatic?: boolean;
  };
  onInitFailed?: () => void;  // Callback when WebGL init fails
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform float u_time;
  
  uniform bool u_scanlines;
  uniform bool u_bloom;
  uniform bool u_vignette;
  uniform bool u_colorGrading;
  uniform bool u_crt;
  uniform bool u_chromatic;
  
  varying vec2 v_texCoord;
  
  vec3 sampleBloom(vec2 uv, float radius) {
    vec3 sum = vec3(0.0);
    float total = 0.0;
    
    for (float x = -2.0; x <= 2.0; x += 1.0) {
      for (float y = -2.0; y <= 2.0; y += 1.0) {
        vec2 offset = vec2(x, y) * radius / u_resolution;
        float weight = 1.0 - length(vec2(x, y)) / 3.0;
        weight = max(weight, 0.0);
        sum += texture2D(u_texture, uv + offset).rgb * weight;
        total += weight;
      }
    }
    
    return sum / total;
  }
  
  vec2 curveUV(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
  }
  
  void main() {
    vec2 uv = v_texCoord;
    
    if (u_crt) {
      uv = curveUV(uv);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }
    }
    
    vec3 color;
    
    if (u_chromatic) {
      float aberration = 0.002;
      float r = texture2D(u_texture, uv + vec2(aberration, 0.0)).r;
      float g = texture2D(u_texture, uv).g;
      float b = texture2D(u_texture, uv - vec2(aberration, 0.0)).b;
      color = vec3(r, g, b);
    } else {
      color = texture2D(u_texture, uv).rgb;
    }
    
    if (u_bloom) {
      vec3 bloom = sampleBloom(uv, 3.0);
      float brightness = dot(bloom, vec3(0.2126, 0.7152, 0.0722));
      if (brightness > 0.5) {
        color += (bloom - color) * 0.15 * (brightness - 0.5) * 2.0;
      }
    }
    
    if (u_scanlines) {
      float scanline = sin(uv.y * u_resolution.y * 1.5) * 0.04;
      color -= scanline;
      
      float flicker = sin(u_time * 8.0) * 0.005 + sin(u_time * 3.7) * 0.003;
      color += flicker;
    }
    
    if (u_vignette) {
      vec2 center = uv - 0.5;
      float dist = length(center);
      float vignette = 1.0 - dist * 0.8;
      vignette = clamp(vignette, 0.0, 1.0);
      vignette = smoothstep(0.0, 1.0, vignette);
      color *= vignette;
    }
    
    if (u_colorGrading) {
      color = pow(color, vec3(0.95));
      
      color.r *= 1.05;
      color.g *= 0.98;
      color.b *= 0.95;
      
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = mix(vec3(luma), color, 1.15);
    }
    
    if (u_crt) {
      if (mod(floor(gl_FragCoord.y), 3.0) == 0.0) {
        color *= 0.92;
      }
      
      float noise = fract(sin(dot(uv + u_time * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
      color += (noise - 0.5) * 0.02;
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function WebGLPostProcess({ 
  sourceCanvas, 
  width, 
  height, 
  className,
  effects = {
    scanlines: true,
    bloom: true,
    vignette: true,
    colorGrading: true,
    crt: false,
    chromatic: true
  },
  onInitFailed
}: WebGLPostProcessProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());
  const initSuccessRef = useRef<boolean>(false);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance"
    });

    if (!gl) {
      console.error("WebGL not supported for post-processing");
      return false;
    }

    glRef.current = gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return false;
    gl.shaderSource(vertexShader, VERTEX_SHADER);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error:", gl.getShaderInfoLog(vertexShader));
      return false;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return false;
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fragmentShader));
      return false;
    }

    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 1,
      1, -1, 1, 1,
      -1, 1, 0, 0,
      1, 1, 1, 0
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const texLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(posLoc);
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 16, 8);

    textureRef.current = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return true;
  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas || !sourceCanvas) {
      animationFrameRef.current = requestAnimationFrame(render);
      return;
    }

    const time = (performance.now() - startTimeRef.current) / 1000;

    gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), canvas.width, canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, "u_time"), time);
    gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);
    
    gl.uniform1i(gl.getUniformLocation(program, "u_scanlines"), effects.scanlines ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_bloom"), effects.bloom ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_vignette"), effects.vignette ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_colorGrading"), effects.colorGrading ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_crt"), effects.crt ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_chromatic"), effects.chromatic ? 1 : 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationFrameRef.current = requestAnimationFrame(render);
  }, [sourceCanvas, effects]);

  useEffect(() => {
    const initialized = initWebGL();
    initSuccessRef.current = initialized;
    
    if (initialized) {
      animationFrameRef.current = requestAnimationFrame(render);
    } else {
      if (onInitFailed) {
        onInitFailed();
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initWebGL, render, onInitFailed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ imageRendering: "auto" }}
      data-testid="webgl-postprocess"
    />
  );
}
