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
  uniform float u_time;
  uniform float u_offset;
  uniform float u_cycleDuration;
  uniform float u_fadeDuration;
  uniform float u_visibleDuration;
  varying vec2 vUv;

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
    float d = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float noiseVal = smoothNoise(vUv * 10.0);
    float effectiveBorder = mix(minBorder, maxBorder, noiseVal);
    float borderFade = smoothstep(0.0, effectiveBorder, d);

    float localTime = mod(u_time - u_offset, u_cycleDuration);
    float scheduledFade = 0.0;
    if (localTime < u_visibleDuration) {
      if (localTime < u_fadeDuration) {
        scheduledFade = smoothstep(0.0, u_fadeDuration, localTime);
      } else if (localTime > (u_visibleDuration - u_fadeDuration)) {
        scheduledFade = 1.0 - smoothstep(u_visibleDuration - u_fadeDuration, u_visibleDuration, localTime);
      } else {
        scheduledFade = 1.0;
      }
    }

    gl_FragColor = vec4(texColor.rgb, texColor.a * borderFade * scheduledFade);
  }
`;
