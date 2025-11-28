import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationParams, ParticleState } from '../types';
import { 
  EMITTER_WIDTH, BASE_WIDTH, COLLECTOR_WIDTH, 
  EMITTER_X, BASE_X, COLLECTOR_X, 
  BLOCK_HEIGHT, BLOCK_DEPTH 
} from './TransistorStructure';

const COUNT = 1000;
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Boundaries
const E_START = EMITTER_X - EMITTER_WIDTH / 2;
const E_END = EMITTER_X + EMITTER_WIDTH / 2;
const B_START = BASE_X - BASE_WIDTH / 2;
const B_END = BASE_X + BASE_WIDTH / 2;
const C_START = COLLECTOR_X - COLLECTOR_WIDTH / 2;
const C_END = COLLECTOR_X + COLLECTOR_WIDTH / 2;

interface ElectronData {
  position: THREE.Vector3;
  speed: number;
  state: ParticleState;
  recombinationTargetY: number;
}

export const ElectronSystem: React.FC<{ params: SimulationParams }> = ({ params }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Initialize particles data
  const particles = useMemo(() => {
    const data: ElectronData[] = [];
    for (let i = 0; i < COUNT; i++) {
      data.push({
        position: new THREE.Vector3(
          E_START + Math.random() * EMITTER_WIDTH,
          (Math.random() - 0.5) * BLOCK_HEIGHT * 0.8,
          (Math.random() - 0.5) * BLOCK_DEPTH * 0.8
        ),
        speed: 0,
        state: ParticleState.EMITTER,
        recombinationTargetY: -BLOCK_HEIGHT / 2 - 1 // Target to drop out of base
      });
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Simulation Factors derived from Voltage
    // Vbe controls injection (speed/density potential)
    // Vce controls sweep speed in collector
    const injectionThreshold = 0.6; // Need > 0.6V to flow
    const injectionFactor = Math.max(0, (params.vbe - injectionThreshold) * 2); 
    const sweepSpeed = Math.max(1, params.vce * 2);
    
    // If Vbe is low, particles move very slowly or reset
    const baseSpeed = 0.5 * injectionFactor;

    particles.forEach((particle, i) => {
      let { position, state: pState } = particle;

      // 1. EMITTER REGION (N)
      if (pState === ParticleState.EMITTER) {
        // Move towards base
        particle.speed = 1.0 + Math.random() * 0.5; // Thermal motion
        
        // If VBE is too low, they struggle to cross the depletion region (E-B boundary)
        if (params.vbe < injectionThreshold && position.x > E_END - 0.2) {
             // Bounce back / barrier
             particle.speed = -0.5;
        }

        position.x += particle.speed * delta;

        // Crossing into Base
        if (position.x > E_END) {
          if (params.vbe > injectionThreshold) {
            particle.state = ParticleState.BASE_DIFFUSION;
            // Determine fate: Recombine or Diffuse?
            // Approx 2-5% recombine in a good transistor
            const willRecombine = Math.random() < 0.03; 
            if (willRecombine) {
               particle.state = ParticleState.RECOMBINING;
            }
          } else {
            // Reset if barrier not overcome (simplified physics)
            position.x = E_START;
          }
        }
      }

      // 2. BASE REGION (P) - Diffusion & Recombination
      else if (pState === ParticleState.BASE_DIFFUSION) {
        // Diffusion is slower than drift
        particle.speed = baseSpeed; 
        position.x += particle.speed * delta;

        // Crossing into Collector
        if (position.x > B_END) {
          particle.state = ParticleState.COLLECTOR_SWEEP;
        }
      }

      // 3. RECOMBINATION (Base Current Ib)
      else if (pState === ParticleState.RECOMBINING) {
        // Move slightly right (drift) but mostly DOWN towards Base terminal
        position.x += (baseSpeed * 0.2) * delta;
        position.y -= 2.0 * delta; // Drop down

        // If it exits the block visually
        if (position.y < -BLOCK_HEIGHT/2 - 0.5) {
          // Reset cycle
          particle.state = ParticleState.EMITTER;
          position.x = E_START;
          position.y = (Math.random() - 0.5) * BLOCK_HEIGHT * 0.8;
        }
      }

      // 4. COLLECTOR REGION (N) - Drift (Ic)
      else if (pState === ParticleState.COLLECTOR_SWEEP) {
        // Strong electric field due to Vce
        particle.speed = sweepSpeed + 5; 
        position.x += particle.speed * delta;

        // End of line
        if (position.x > C_END) {
          // Loop back
          particle.state = ParticleState.EMITTER;
          position.x = E_START;
          position.y = (Math.random() - 0.5) * BLOCK_HEIGHT * 0.8;
        }
      }

      // Wrap-around safety
      if (position.x > C_END + 1) {
          position.x = E_START;
          particle.state = ParticleState.EMITTER;
      }
      if (position.x < E_START - 1) {
          position.x = E_START;
      }

      // UPDATE INSTANCE
      tempObject.position.copy(position);
      tempObject.scale.setScalar(0.08); // Electron size
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // COLOR UPDATE
      // Emitter/Collector: Blue (N-type majority)
      // Base: Red tint interaction or Recombining -> Yellow/White flash
      if (pState === ParticleState.RECOMBINING) {
        tempColor.set('#facc15'); // Yellow for hole recombination event
      } else if (pState === ParticleState.BASE_DIFFUSION) {
         tempColor.set('#60a5fa'); // Still an electron
      } else {
        tempColor.set('#3b82f6'); // Standard electron blue
      }
      
      // Dim particles if VBE is low (simulate density reduction)
      if (params.vbe < injectionThreshold && pState === ParticleState.EMITTER) {
          // If voltage is low, visually hide or dim many particles to simulate low current
          // Simple visual hack: send them to infinity if index > threshold
          // But here we just keep them at emitter.
      }
      
      meshRef.current.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};