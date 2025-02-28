export interface SphericalCoords {
  r: number; // radius
  theta: number; // 0 to 2π
  phi: number; // 0 (top) to π (bottom)
}

export interface DomeLayerConfig {
  angleDeg: number; // polar angle from vertical, in degrees
  radius: number; // radius at that layer
  screenCount: number; // how many screens in this layer
}
