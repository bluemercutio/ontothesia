// vertexShader.ts
export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// fragmentShader.ts
export const fragmentShader = `
  uniform sampler2D map;
  uniform float minBorder;  // e.g. 0.07
  uniform float maxBorder;  // e.g. 0.17
  varying vec2 vUv;

  // Simple 2D noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453123);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453123);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453123);

    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) +
           (c - a)*u.y*(1.0 - u.x) +
           (d - b)*u.x*u.y;
  }

  void main() {
    // Sample the texture
    vec4 texColor = texture2D(map, vUv);

    // Distance from edge (0 = at edge, ~0.5 in center for a square plane)
    float d = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    
    // Use noise to vary the width of the border
    float noiseVal = smoothNoise(vUv * 10.0);
    float effectiveBorder = mix(minBorder, maxBorder, noiseVal);

    // smoothstep(0, border, d) => 0 near edges, 1 in center
    float borderFade = smoothstep(0.0, effectiveBorder, d);

    // Output color (with alpha = texColor.a * borderFade)
    gl_FragColor = vec4(texColor.rgb, texColor.a * borderFade);
  }
`;
