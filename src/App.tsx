import React, { useRef, useState, useEffect, createRef } from 'react';
import { useBoundStore } from './stores/useBoundStore.ts';
import { GhostMesh } from './components/GhostMesh';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Grid, OrthographicCamera, Plane } from '@react-three/drei';
import { Part } from './components/Part';
import { ControlPanel } from './components/ControlPanel';
import type { PartProps } from './types';
import { partsConfig, PartType } from './config/parts';
import { Mesh } from 'three';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
const DEG45 = Math.PI / 4;

export default function App() {

  // Refs
  const partRef = createRef<Mesh>();

  // State
  const parts = useBoundStore((state) => state.parts);
  const placePart = useBoundStore((state) => state.placePart);
  const positionChange = useBoundStore((state) => state.positionChange);
  const activePartID = useBoundStore((state) => state.activePartID);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);
  const activeTool = useBoundStore((state) => state.activeTool);
  const [facePosition, setFacePosition] = useState<number[]>([0, 0, 0]);

  //const [parts, setParts] = useState<PartProps[] | null>(null);
  const [toolActive, setToolActive] = useState<string>('');
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [shouldSetActive, setShouldActive] = useState<boolean>(false);

  // Effects


  useEffect(() => {
    if (shouldSetActive) {
      setActivePartID(parts[parts.length].id);
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

  const addJoint = (position: [number, number, number]) => {
    setToolActive('joint');
    handlePlacePart(position);
  }

  const handlePositionChange = (id: string, newPosition: [number, number, number], newRotation: [number, number, number]) => {
    // console.log("setting position", newPosition, index);
    positionChange(id, newPosition, newRotation);
  };

  const handleScaleChange = (id: string, newScale: number) => {
    console.log('Scale changed for index', id, 'to', newScale);
    setParts(parts.map((part, i) =>
      parts[i].id === id ? { ...part, dimensions: { ...part.dimensions, height: newScale } } : part
    ));
  };

  const handleFaceSelected = (selectedPart: PartProps[], faceIndex: number) => {
    console.log('Face selected for prop', selectedPart, 'to', faceIndex);
    console.log(selectedPart.position);
    setFacePosition(selectedPart.position);
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

    placePart(activeTool, position);
    setShouldActive(true);
  };

  // Render
  return (
    <>
      <Canvas camera={{
        position: [0, 4, 8],
        fov: 50
      }} onDoubleClick={() => setActivePartID('')} >
        <CameraControls makeDefault />
        <ambientLight intensity={0.5} />
        <gridHelper />
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
            onScaleChange={(id, newScale) => handleScaleChange(id, newScale)}
            onClick={() => { (toolActive !== 'joint-panel') && (handlePartClick(part.id)); }}
          />
        ))}
        {(toolActive && toolActive !== 'joint-panel') && (
          <>
            <Grid />
            <Plane
              args={[10, 10]}
              visible={false}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                placePart(toolActive, [e.point.x, e.point.y, e.point.z]);
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
      </Canvas>
      <ControlPanel
        onAddPart={(partType: string) => addPart(partType)}
        setFacePosition={(position) => setFacePosition(position)}
        facePosition={facePosition ? facePosition : [0, 0, 0]}
      />
    </>
  );
}
