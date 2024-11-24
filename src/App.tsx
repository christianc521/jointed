import { useState, useEffect, createRef } from 'react';
import { useBoundStore } from './stores/useBoundStore.ts';
import { GhostMesh } from './components/GhostMesh';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, Plane } from '@react-three/drei';
import { Part } from './components/Part';
import { ControlPanel } from './components/ControlPanel';
import { Mesh } from 'three';
import { DowelEndJoint } from './components/customThree/DowelEndJoint.tsx';

export default function App() {

  // Refs
  const partRef = createRef<Mesh>();

  // State
  const parts = useBoundStore((state) => state.parts);
  const placePart = useBoundStore((state) => state.placePart);
  const activePartID = useBoundStore((state) => state.activePartID);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);
  const activeTool = useBoundStore((state) => state.activeTool);
  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  // TODO: replace these states with BoundStore
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
    setActiveTool(partType);
    setActivePartID('');
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
        {parts?.map((part) => (
          <Part
            {...part}
            key={part.key}
            id={part.id}
            ref={partRef}
            position={part.position}
            rotation={part.rotation}
            active={part.id === activePartID}
            onClick={() => { (activeTool !== 'joint-panel') && (setActivePartID(part.id)); }}
          />
        ))}
        {(activeTool && activeTool !== 'joint-panel') && (
          <>
            <Grid />
            {activeTool == 'connection' ?
              <Plane
                args={[10, 10]}
                visible={false}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  placePart(activeTool, [e.point.x, e.point.y, e.point.z]);
                  setActiveTool('');
                }}
                onPointerMove={(e) => {
                  e.stopPropagation();
                  setGhostPosition([e.point.x, e.point.y, e.point.z]);
                }}
              /> : <DowelEndJoint setGhostPosition={(position: [number, number, number]) => (setGhostPosition(position))} />
            }
            <GhostMesh toolActive={activeTool} position={ghostPosition} />
          </>
        )}
      </Canvas>
      <ControlPanel
        onAddPart={(partType: string) => addPart(partType)}
      />
    </>
  );
}
