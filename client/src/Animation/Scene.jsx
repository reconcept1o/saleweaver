// src/Animation/Scene.jsx

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

// Parçacıkların ana bileşeni
function Particles({ count, step }) {
  const points = useRef();

  const particles = useMemo(() => {
    const temp = [];
    const t = Math.PI * (3 - Math.sqrt(5)); // Altın oran
    const r = 2.5;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = t * i;
      const finalX = Math.cos(theta) * radius * r;
      const finalY = y * r;
      const finalZ = Math.sin(theta) * radius * r;

      const { x, y: startY, z } = new THREE.Vector3().setFromSpherical(
        new THREE.Spherical(
          r * (2 + Math.random()),
          Math.acos(1 - Math.random() * 2),
          Math.random() * 2 * Math.PI
        )
      );
      
      temp.push({ x, y: startY, z, finalX, finalY, finalZ });
    }
    return temp;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    points.current.rotation.y += delta * 0.05;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = particles[i];
      const targetX = step >= 2 ? p.finalX : p.x;
      const targetY = step >= 2 ? p.finalY : p.y;
      const targetZ = step >= 2 ? p.finalZ : p.z;
      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX, 0.03);
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY, 0.03);
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, 0.03);
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  const dotTexture = useMemo(() => new THREE.TextureLoader().load('/dot.png'), []);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={step >= 2 ? 0.05 : 0.03} 
        color={step >= 2 ? "#38B2AC" : "#4A5568"} 
        sizeAttenuation transparent opacity={0.8}
        map={dotTexture}
       />
    </points>
  );
}

// Ana Sahne
export function Scene({ step }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={30} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {step >= 2 && (
         <mesh>
            <torusKnotGeometry args={[0.5, 0.15, 256, 32]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#5A67D8" emissiveIntensity={2} />
        </mesh>
      )}
      <Particles count={5000} step={step} />
    </>
  );
}