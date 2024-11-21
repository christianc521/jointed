import React from 'react';
import { useBoundStore } from '../stores/useBoundStore.ts';

export const JointToolMenu: React.FC = () => {

  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  const placePart = useBoundStore((state) => state.placePart);
  const selectedFacePosition = useBoundStore((state) => state.selectedFacePosition);


  const handleJointCreate = () => {
    console.log('pressed ok');
    setActiveTool('joint');
    placePart('joint', selectedFacePosition);
  }

  const isFaceSelected = (): boolean => {
    return selectedFacePosition[0] != null && selectedFacePosition.length > 0;
  }

  const JointMenuOK: React.FC<{ faceSelected: boolean }> = ({ faceSelected }) => (
    <button disabled={!faceSelected} onClick={handleJointCreate}> OK </button>
  )

  const JointCreateUI: React.FC = () => (
    <div>
      <h3> {selectedFacePosition[0] ? selectedFacePosition : "Select a face"} </h3>
      <h3> test </h3>
      <JointMenuOK faceSelected={isFaceSelected()} />
    </div>
  );

  return <JointCreateUI />;
};
