import React, { useEffect, useState } from 'react';
import { useBoundStore } from '../stores/useBoundStore.ts';
import { PART_TYPES } from '../config/parts';
import { JointToolMenu } from './JointToolMenu';
import { LeftPanel } from './UIComponents/LeftPanel';
interface ControlPanelProps {
  onAddPart: (partType: string) => void;
  setFacePosition: (position: number[]) => [number, number, number];
  facePosition: [number, number, number];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddPart,
  setFacePosition,
  facePosition,
}) => {

  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);

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
    setFacePosition([null, null, null]);
  }, [open]);


  return (
    <div style={{ position: 'absolute', top: '0' }}>
      {Object.values(PART_TYPES).map(partType => (
        <button
          key={partType}
          type="button"
          onClick={() => {
            onAddPart(partType);
          }}
        >
          Add {partType}
        </button>
      ))}
      <button type="button" onClick={handleOpen}>
        Dowel Joint
      </button>
      <LeftPanel />
      {open && <JointToolMenu />}
    </div>
  );
};
