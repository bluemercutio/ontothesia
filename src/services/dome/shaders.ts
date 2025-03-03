// Vertex shader: pass UVs to the fragment shader.
export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader: fade out alpha near the edges (7–17%), with noise to create an uneven border.
export const fragmentShader = `
  uniform sampler2D map;
  uniform float minBorder; 
  uniform float maxBorder;
  varying vec2 vUv;

  // Smooth random function based on Perlin-style interpolation
  float smoothNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453123);
      float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453123);
      float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123);
      float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123);

      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
      vec4 texColor = texture2D(map, vUv);

      // Distance from nearest edge
      float d = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));

      // Use noise to determine a "wavy" fade region
      float noise = smoothNoise(vUv * 10.0);
      float effectiveBorder = mix(minBorder, maxBorder, noise);

      // Create a **soft dissolve** using smoothstep (gradual alpha falloff)
      float fade = smoothstep(0.0, effectiveBorder, d);  
      // Final color with smooth transparency
      gl_FragColor = vec4(texColor.rgb, texColor.a * fade);
  }
`;
