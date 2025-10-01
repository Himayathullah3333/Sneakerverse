'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface SneakerModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animated?: boolean;
}

const SneakerModel = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, animated = true }: SneakerModelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[2, 1, 0.8]} />
      <meshStandardMaterial
        color="#ff6b6b"
        roughness={0.1}
        metalness={0.8}
        envMapIntensity={1}
      />
      {/* Sneaker details */}
      <mesh position={[0, 0.5, 0]} scale={[0.8, 0.2, 0.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6, -0.2, 0]} scale={[0.4, 0.3, 0.8]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Laces */}
      <mesh position={[0, 0.3, 0.4]} scale={[1.4, 0.05, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </mesh>
  );
};

const FloatingText = () => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <Center top position={[0, 2, 0]}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
      >
        SneakerVerse
        <meshStandardMaterial color="#00ff88" />
      </Text3D>
    </Center>
  );
};

const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#4ecdc4" transparent opacity={0.6} />
    </points>
  );
};

interface Scene3DProps {
  showText?: boolean;
  showParticles?: boolean;
  cameraPosition?: [number, number, number];
  useEnv?: boolean;
  children?: React.ReactNode;
}

export const Scene3D = ({ 
  showText = false, 
  showParticles = true, 
  cameraPosition = [0, 0, 8],
  useEnv = false,
  children 
}: Scene3DProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      // Safari fallback
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  const effectiveParticles = showParticles && !isMobile;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: cameraPosition, fov: isMobile ? 50 : 45 }}
        shadows={false}
        dpr={[1, isMobile ? 1.2 : 1.5]}
        frameloop="demand"
        gl={{ antialias: !isMobile, powerPreference: 'low-power' }}
      >
        <color attach="background" args={['#0a0a0a']} />
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          
          {showText && !isMobile && <FloatingText />}
          {effectiveParticles && <ParticleSystem />}
          
          {children || <SneakerModel />}
          
          {!isMobile && (
            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.25}
              scale={12}
              blur={1.2}
            />
          )}
          
          {useEnv && !isMobile && <Environment preset="city" />}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export { SneakerModel };