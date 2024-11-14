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
import  { v4 as uuidv4 } from 'uuid';
const DEG45 = Math.PI / 4;
// Global Variables

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

  // Global Variables

  // Refs
  const cameraControlRef = useRef<CameraControls | null>(null);
  const partRef = createRef<Mesh>();
  
  

  // State
  const [facePosition, setFacePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [parts, setParts] = useState<PartProps[] | null>(null);
  const [activePartID, setActivePartID] = useState<string>('');
  const [toolActive, setToolActive] = useState<string>('');
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [shouldSetActive, setShouldActive] = useState<boolean>(false);
  // Effects
  useEffect(() => {
    console.log('Active part index updated:', activePartID);
  }, [activePartID]);

  useEffect(() => {
    invalidate();
    console.log(parts);
  }, [parts]);

  useEffect(() => {
    if (shouldSetActive) {
      setActivePartID(parts[parts.length - 1].id);
      setShouldActive(false);
    }
  }, [shouldSetActive]);

    

  // Handlers
  const addPart = (partType: string) => {
    setToolActive(partType);
    setActivePartID('');
  };

  const removePart = (id: string) => {
    setParts(p => p.filter(part => part.id !== id));
  };

  const placePart = (position: [number, number, number]) => {
    const partCount = ( parts ? parts.length : 0 );
    console.log('placing part', position);
    handlePlacePart(position);
    return;
  };

  const addJoint = () => {
    addPart('joint');
  }

  const handlePositionChange = (id: string, newPosition: [number, number, number], newRotation: [number, number, number]) => {
    setParts(parts.map((part, i) => 
      parts[i].id === id ? { ...part, position: newPosition, rotation: newRotation } : part
    ));
   // console.log("setting position", newPosition, index);
  };

  const handleScaleChange = (index: number, newScale: number) => {
    console.log('Scale changed for index', index, 'to', newScale);
    setParts(parts.map((part, i) => 
      i === index ? { ...part, dimensions: { ...part.dimensions, height: newScale } } : part
    ));
  };

  const handleFaceSelected = (selectedPart: PartProps[], faceIndex: number) => {
    console.log('Face selected for prop', selectedPart, 'to', faceIndex);
    console.log(selectedPart.position);
    setFacePosition(selectedPart.postition);
  };

  const handlePartClick = (id: string) => {
    setActivePartID(id);
  };

  const handlePlacePart = (position: [number, number, number]) => {

    const defaultDimensions = partsConfig[toolActive as PartType].defaultDimensions;
    if (!defaultDimensions) {
      console.error(`No default dimensions found for part type: ${toolActive}`);
      return;
    }

    setParts(
      prevParts => ([ ...( prevParts || [] ), {
        type: toolActive,
        position: position,
        rotation: [0,0,0],
        key: uuidv4(),
        id: uuidv4(),
        dimensions: defaultDimensions,
        active: true,
      }]),
    );
    setShouldActive(true);
//    useEffect(() => {
//      setActivePartID(parts[parts.length].id);
//    }, [parts]);
  };



  // Render
  return (
    <>
      <Canvas camera={{ position: [0, 3, 3] }} onDoubleClick={() => setActivePartID('')} >
        <CameraControls ref={cameraControlRef} makeDefault/>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {parts?.map((part, index) => (
          <Part 
            {...part}
            key={part.key}
            id={part.id}
            ref={partRef}
            onFaceSelected={(faceIndex) => handleFaceSelected(part, faceIndex)}
            position={part.position}
            rotation={part.rotation}
            active={part.id === activePartID}
            onPositionChange={(id, newPosition, newRotation) => handlePositionChange(id, newPosition, newRotation)}
            onClick={() => {handlePartClick(part.id);}}
          />
        ))}
        {toolActive && (
          <>
            <gridHelper 
              onClick={(e) => {
                e.stopPropagation();
                placePart(ghostPosition ? ghostPosition : [0,0,0]);
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
        onRemovePart={removePart}
        setActivePartID={setActivePartID}
        setToolActive={setToolActive}
        // TODO: Update ControlPanel to accept onFaceSelected
        // when joint UI is clicked, set facePosition to [0,0,0]
        // when joint UI 'confirm' is clicked, set facePosition to part position
        onFaceSelected={(faceIndex) => handleFaceSelected(part, faceIndex)}
        onRotateCamera={() => cameraControlRef.current?.rotate(DEG45, 0, true)}
        onResetCamera={() => cameraControlRef.current?.reset(true)}
        parts={parts}
      />
    </>
  );
}
