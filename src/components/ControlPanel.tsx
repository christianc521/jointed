import React, { useEffect, useState } from 'react';
import { useBoundStore } from '../stores/useBoundStore.ts';
import { PART_TYPES } from '../config/parts';
import { JointToolMenu } from './JointToolMenu';
import { LeftPanel } from './UIComponents/LeftPanel';
import styles from "./toolbutton.module.css";
interface ControlPanelProps {
  onAddPart: (partType: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddPart,
}) => {

  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);
  const setSelectedFacePosition = useBoundStore((state) => state.setSelectedFacePosition);

  // Handles the opening and closing of the joint tool menu
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  // Resets editor to empty selection and tool
  // If any parts were selected, deselect
  // Sets facePosition to [0,0,0] (should probably make nil), use this to handle impossible set joint with no selection
  useEffect(() => {
    setActivePartID('');
    setActiveTool(open ? 'joint-panel' : '');
    setSelectedFacePosition([undefined, undefined, undefined]);
  }, [open]);


  return (
    <div>
      <div style={{ position: 'absolute', top: '0' }} className={styles.toolbar} >
        {Object.values(PART_TYPES).map(partType => (
          <button
            key={partType}
            type="button"
            className={styles.toolButton}
            onClick={() => {
              onAddPart(partType);
            }}
          >
            <div className={styles.buttonCircle}>
              o
            </div>
          </button>
        ))}
        <button type="button" onClick={handleOpen}>
          Dowel Joint
        </button>
      </div>
      <LeftPanel />
      {open && <JointToolMenu handleOpen={() => handleOpen()} />}
    </div>
  );
};
