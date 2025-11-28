import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, PerspectiveCamera } from '@react-three/drei';
import { TransistorStructure } from './TransistorStructure';
import { ElectronSystem } from './ElectronSystem';
import { SimulationParams } from '../types';

interface TransistorCanvasProps {
  params: SimulationParams;
}

export const TransistorCanvas: React.FC<TransistorCanvasProps> = ({ params }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <OrbitControls 
        target={[0, 0, 0]} 
        maxPolarAngle={Math.PI / 2 + 0.2} // Limit dragging below ground too much
        minDistance={5}
        maxDistance={15}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 5, -5]} intensity={0.5} color="#4ade80" />

      <Suspense fallback={<Text color="white" position={[0,0,0]}>Loading 3D Model...</Text>}>
        <group position={[0, -0.5, 0]}>
          {/* Static Geometry of the NPN layers */}
          <TransistorStructure />
          
          {/* Dynamic Particle System */}
          <ElectronSystem params={params} />
        </group>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};