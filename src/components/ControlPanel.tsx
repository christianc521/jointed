import React, { useEffect, useState } from 'react';
import { PART_TYPES } from '../config/parts';
import Dialog from '@mui/material/Dialog';
import { Button, Paper } from '@mui/material';
import { CardActions } from '@mui/material';
import { Typography } from '@mui/material';
import { CardContent } from '@mui/material';
import { PartProps } from '../types/index';

interface ControlPanelProps {
  onAddPart: (partType: string, position: [number, number, number]) => void;
  onRemovePart: (index: number) => void;
  onAddJoint: (position: [number, number, number]) => void;
  setToolActive: (toolActive: string) => void;
  setActivePartID: (activePartID: number) => void;
  onRotateCamera: () => void;
  onResetCamera: () => void;
  facePosition: [number, number, number];
  parts: {
    type: string;
  }[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddPart,
  onRemovePart,
  setActivePartID,
  onAddJoint,
  setToolActive,
  onRotateCamera,
  onResetCamera,
  facePosition,
  parts,
}) => {
  let newFacePosition:number[] = [0,0,0];

  const [open, setOpen] = useState(false);
  const handleOpen = () => { 
    setActivePartID('');
    setOpen(!open); 
  };

  //useEffect(() => { 
  //  newFacePosition = facePosition.facePosition; 
  //  console.log(newFacePosition);
  //}, [facePosition.facePosition]);

  function handlePartClick( type ) {
    console.log({type});
  }

  const card = () => (
    parts?.map((part, index) => 
    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
      <h2 key={index} onClick={ () => setActivePartID(part.id) } >
        { part.type }
      </h2>
      <button onClick={() => onRemovePart(part.id)}>
        Delete
      </button>
    </div>
    ) 
  );

  const jointCreateUI = (facePosition) => (
    <div>
      <h3> {facePosition ? facePosition : [0,0,0]} </h3>
      <h3> test {console.log(facePosition)}</h3>
    </div>
  );

  return (
    <div style={{ position: 'absolute', top: '0' }}>
      <button type="button" onClick={onRotateCamera}>
        Rotate Theta 45deg
      </button>
      <button type="button" onClick={onResetCamera}>
        Reset Camera
      </button>
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
      {card()}
      {open && jointCreateUI(facePosition)}
    </div>
  );
}; 


