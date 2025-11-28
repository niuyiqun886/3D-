import React from 'react';
import { Text } from '@react-three/drei';

// Dimensions
export const BLOCK_HEIGHT = 2;
export const BLOCK_DEPTH = 2;
export const EMITTER_WIDTH = 2;
export const BASE_WIDTH = 0.4;
export const COLLECTOR_WIDTH = 2.5;

// Positions
export const EMITTER_X = -(BASE_WIDTH / 2) - (EMITTER_WIDTH / 2);
export const BASE_X = 0;
export const COLLECTOR_X = (BASE_WIDTH / 2) + (COLLECTOR_WIDTH / 2);

export const TransistorStructure: React.FC = () => {
  return (
    <group>
      {/* EMITTER (N-Type) */}
      <mesh position={[EMITTER_X, 0, 0]}>
        <boxGeometry args={[EMITTER_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH]} />
        <meshPhysicalMaterial 
          color="#3b82f6" // Blue
          transparent 
          opacity={0.3} 
          transmission={0.5}
          roughness={0.1}
          metalness={0.1}
          side={2} // DoubleSide
        />
      </mesh>
      <Text 
        position={[EMITTER_X, BLOCK_HEIGHT/2 + 0.4, 0]} 
        fontSize={0.3} 
        color="#60a5fa"
        anchorY="bottom"
      >
        Emitter (N)
      </Text>
      <Text 
        position={[EMITTER_X, -BLOCK_HEIGHT/2 - 0.4, 0]} 
        fontSize={0.2} 
        color="#94a3b8"
      >
        High Doping
      </Text>

      {/* BASE (P-Type) */}
      <mesh position={[BASE_X, 0, 0]}>
        <boxGeometry args={[BASE_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH]} />
        <meshPhysicalMaterial 
          color="#ef4444" // Red
          transparent 
          opacity={0.4} 
          transmission={0.6}
          roughness={0.1}
          side={2} 
        />
      </mesh>
      <Text 
        position={[BASE_X, BLOCK_HEIGHT/2 + 0.6, 0]} 
        fontSize={0.3} 
        color="#f87171"
        anchorY="bottom"
      >
        Base (P)
      </Text>
      <Text 
        position={[BASE_X, -BLOCK_HEIGHT/2 - 0.6, 0]} 
        fontSize={0.15} 
        color="#fca5a5"
      >
        Thin/Light Doped
      </Text>

      {/* COLLECTOR (N-Type) */}
      <mesh position={[COLLECTOR_X, 0, 0]}>
        <boxGeometry args={[COLLECTOR_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH]} />
        <meshPhysicalMaterial 
          color="#3b82f6" // Blue
          transparent 
          opacity={0.3} 
          transmission={0.5}
          roughness={0.1}
          metalness={0.1}
          side={2} 
        />
      </mesh>
      <Text 
        position={[COLLECTOR_X, BLOCK_HEIGHT/2 + 0.4, 0]} 
        fontSize={0.3} 
        color="#60a5fa"
        anchorY="bottom"
      >
        Collector (N)
      </Text>
      
      {/* Leads/Terminals Visualization (Simple cylinders) */}
      <mesh position={[EMITTER_X - EMITTER_WIDTH/2 - 0.5, 0, 0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      <mesh position={[BASE_X, -BLOCK_HEIGHT/2 - 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <mesh position={[COLLECTOR_X + COLLECTOR_WIDTH/2 + 0.5, 0, 0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

    </group>
  );
};