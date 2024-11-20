import React from 'react';
import { useBoundStore } from '../stores/useBoundStore.ts';

export const JointToolMenu: React.FC = () => {

  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  const placePart = useBoundStore((state) => state.placePart);
  const selectedFacePosition = useBoundStore((state) => state.selectedFacePosition);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);

  const handleJointCreate = () => {
    console.log('pressed ok');
    setActiveTool('joint');
    placePart('joint', selectedFacePosition);
  }

  const isFaceSelected = (position: number[]): boolean => {
    return position[0] != null && position.length > 0;
  }

  const JointMenuOK: React.FC<{ faceSelected: boolean }> = ({ faceSelected }) => (
    <button disabled={!faceSelected} onClick={handleJointCreate}> OK </button>
  )

  const JointCreateUI: React.FC<{ facePosition: number[] }> = ({ facePosition }) => (
    <div>
      <h3> {facePosition[0] ? facePosition : "Select a face"} </h3>
      <h3> test </h3>
      <JointMenuOK faceSelected={isFaceSelected(facePosition)} />
    </div>
  );

  return <JointCreateUI facePosition={selectedFacePosition} />;
};
