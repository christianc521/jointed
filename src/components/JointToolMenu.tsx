import React from 'react';
import { useBoundStore } from '../stores/useBoundStore.ts';
import styles from './jointtool.module.css';

interface JointToolMenuProps {
  handleOpen: () => void;
}
export const JointToolMenu: React.FC<JointToolMenuProps> = ({ handleOpen }) => {

  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  const activeTool = useBoundStore((state) => state.activeTool);
  const placePart = useBoundStore((state) => state.placePart);
  const selectedFacePosition = useBoundStore((state) => state.selectedFacePosition);

  // placeholder button variable to toggle add connection
  let isAddingConnect = true;

  function toggleAddConnect() {
    isAddingConnect = !isAddingConnect;
    isAddingConnect ? setActiveTool('connection') : setActiveTool('');
    console.log(activeTool);
  }
  const handleJointCreate = () => {
    setActiveTool('');
    placePart('joint', selectedFacePosition);
    handleOpen();
  }

  const isFaceSelected = (): boolean => {
    return selectedFacePosition[0] != null && selectedFacePosition.length > 0;
  }

  const JointMenuOK: React.FC<{ faceSelected: boolean }> = ({ faceSelected }) => (
    <button disabled={!faceSelected} onClick={handleJointCreate}> OK </button>
  )

  const JointCreateUI: React.FC = () => (
    <div className={styles.jointPanel}>
      <h3> {selectedFacePosition[0] ? selectedFacePosition : "Select a face"} </h3>
      <h3> test </h3>
      <button onClick={toggleAddConnect} > Add a connection </button>
      <JointMenuOK faceSelected={isFaceSelected()} />
    </div>
  );

  return <JointCreateUI />;
};

