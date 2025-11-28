import { ThreeElements } from '@react-three/fiber';

export enum ParticleState {
  EMITTER = 0,
  BASE_DIFFUSION = 1,
  RECOMBINING = 2,
  COLLECTOR_SWEEP = 3,
  HIDDEN = 4
}

export interface SimulationParams {
  vbe: number; // Base-Emitter Voltage
  vce: number; // Collector-Emitter Voltage
  electronDensity: number;
}

// Augment the global JSX namespace to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
