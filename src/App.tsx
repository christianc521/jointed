import React, { useRef, useState, useEffect, createRef } from 'react';
import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { Part } from './components/Part';
import { ControlPanel } from './components/ControlPanel';
import { PART_TYPES } from './config/parts';
import type { PartProps, PartData } from './types';
import { partsConfig, PartType } from './config/parts';
import { DEFAULT_PART_DATA } from './types';
import { Matrix4, Mesh } from 'three';
import * as THREE from 'three';
const DEG45 = Math.PI / 4;

interface GhostMeshProps {
  toolActive: string;
  position: [number, number, number];
}

const GhostMesh: React.FC<GhostMeshProps> = ({ toolActive, position }) => {
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
      console.log('invalidating');
      invalidate();
    }
  });

  return (toolActive ? ( 
    (<mesh ref={meshRef}>
      <meshStandardMaterial transparent opacity={0.5} />
    </mesh>)
  ) : null);
};

export default function App() {

  // Refs
  const cameraControlRef = useRef<CameraControls | null>(null);
  const partRef = createRef<Mesh>();
  
  

  // State
  const [facePosition, setFacePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [parts, setParts] = useState<PartProps[]>([]);
  const [activePartIndex, setActivePartIndex] = useState<number>(0);
  const [toolActive, setToolActive] = useState<string>('');
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Effects
  useEffect(() => {
    console.log('Active part index updated:', activePartIndex);
  }, [activePartIndex]);

  

  // Handlers
  const addPart = (partType: string) => {
    setToolActive(partType);
    console.log('addPart', partType);
  };

  const placePart = (position: [number, number, number]) => {
    const partCount = parts.length;
    const defaultDimensions = partsConfig[toolActive as PartType].defaultDimensions;
    
    if (!defaultDimensions) {
      console.error(`No default dimensions found for part type: ${toolActive}`);
      return;
    }
    console.log('placing part', position);
    setParts(prevParts => [...prevParts, {
      type: toolActive,
      position: position,
      rotation: [0,0,0],
      key: partCount,
      id: partCount,
      dimensions: defaultDimensions,
      active: true,
    }]);
    // setActivePartIndex(partCount);
    return;
  };

  const addJoint = () => {
    addPart('joint');
  }

  const handlePositionChange = (index: number, newPosition: [number, number, number], newRotation: [number, number, number]) => {
    setParts(parts.map((part, i) => 
      i === index ? { ...part, position: newPosition, rotation: newRotation } : part
    ));
    console.log("setting position", newPosition, index);
  };

  const handleScaleChange = (index: number, newScale: number) => {
    console.log('Scale changed for index', index, 'to', newScale);
    setParts(parts.map((part, i) => 
      i === index ? { ...part, dimensions: { ...part.dimensions, height: newScale } } : part
    ));
  };

  const handleFaceSelected = (index: number, faceIndex: number) => {
    console.log('Face selected for index', index, 'to', faceIndex);
    setFacePosition(parts[index].position);
    setParts(parts.map((part, i) => 
      i === index ? { ...part, faceSelected: faceIndex } : part
    ));
  };

  const handlePartClick = (index: number) => {
    console.log('Part clicked', index);
    console.log(parts[index]);
    setActivePartIndex(index);
  };



  // Render
  return (
    <>
      <Canvas camera={{ position: [0, 3, 3] }} onDoubleClick={() => setActivePartIndex(-1)} >
        <CameraControls ref={cameraControlRef} makeDefault/>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {parts.map((part, index) => (
          <Part 
            {...part}
            key={part.key}
            id={part.id}
            ref={partRef}
            onFaceSelected={(faceIndex) => handleFaceSelected(index, faceIndex)}
            position={part.position}
            rotation={part.rotation}
            active={index === activePartIndex}
            onPositionChange={(id, newPosition, newRotation) => handlePositionChange(id, newPosition, newRotation)}
            onClick={() => {handlePartClick(index);}}
          />
        ))}
        {toolActive && (
          <>
            <gridHelper 
              onClick={(e) => {
                e.stopPropagation();
                placePart(ghostPosition ? ghostPosition : [0,0,0]);
                console.log(parts);
                setToolActive('');
              }}
              onPointerMove={(e) => {
                e.stopPropagation();
                setGhostPosition([e.point.x, e.point.y, e.point.z]);
              }}
            />
            <GhostMesh toolActive={toolActive} position={ghostPosition} />
          </>
        )}
        
        <gridHelper />
      </Canvas>
      <ControlPanel 
        onAddPart={addPart}
        setToolActive={setToolActive}
        facePosition={facePosition}
        onRotateCamera={() => cameraControlRef.current?.rotate(DEG45, 0, true)}
        onResetCamera={() => cameraControlRef.current?.reset(true)}
      />
    </>
  );
}
