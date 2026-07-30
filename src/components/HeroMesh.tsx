import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import type { Mesh } from 'three';
import useReducedMotion from '../hooks/useReducedMotion';

function DistortedMesh() {
  const meshRef = useRef<Mesh>(null);
  const reducedMotion = useReducedMotion();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.y += 0.0015;
    meshRef.current.rotation.x += 0.0008;
    const targetX = (state.pointer.x * viewport.width) / 40;
    const targetY = (state.pointer.y * viewport.height) / 40;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 4]}>
      <MeshDistortMaterial
        color="#1A1A1A"
        wireframe
        transparent
        opacity={0.12}
        distort={0.35}
        speed={reducedMotion ? 0 : 1.5}
      />
    </Icosahedron>
  );
}

export default function HeroMesh() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <DistortedMesh />
      </Canvas>
    </div>
  );
}
