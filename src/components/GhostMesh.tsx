import React, { useEffect, useRef } from 'react';
import { partsConfig, PartType } from '../config/parts';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface GhostMeshProps {
  toolActive: string;
  position: [number, number, number];
}

export const GhostMesh: React.FC<GhostMeshProps> = ({ toolActive, position }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { invalidate } = useThree();
  useEffect(() => {
    if (toolActive && partsConfig[toolActive as PartType]) {
      const geometry = partsConfig[toolActive as PartType].shape.clone();
      const material = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.5,
        color: partsConfig[toolActive as PartType].color
      });

      if (meshRef.current) {
        meshRef.current.geometry = geometry;
        meshRef.current.material = material;
        meshRef.current.position.set(...position);
        invalidate();
      }
    }
  }, [toolActive]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      invalidate();
    }
  });

  return (toolActive ? (
    (<mesh ref={meshRef}>
      <meshStandardMaterial transparent opacity={0.5} />
    </mesh>)
  ) : null);
};
