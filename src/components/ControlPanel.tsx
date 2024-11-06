import React, { useState } from 'react';
import { PART_TYPES } from '../config/parts';
import Dialog from '@mui/material/Dialog';
import { Button, Paper } from '@mui/material';
import { CardActions } from '@mui/material';
import { Typography } from '@mui/material';
import { CardContent } from '@mui/material';

interface ControlPanelProps {
  onAddPart: (partType: string, position: [number, number, number]) => void;
  onAddJoint: (position: [number, number, number]) => void;
  setToolActive: (toolActive: string) => void;
  onRotateCamera: () => void;
  onResetCamera: () => void;
  facePosition: [number, number, number];
}



export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddPart,
  onAddJoint,
  setToolActive,
  onRotateCamera,
  onResetCamera,
  facePosition,
}) => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const card = () => (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Select a face
        </Typography>
        <Typography variant="h5" component="div">
          face
        </Typography>
        <h1>
          {facePosition[0]} {facePosition[1]} {facePosition[2]}
        </h1>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleClose}>close</Button>
        <Button size="small" onClick={() => onAddJoint(facePosition)}>Add Joint</Button>
      </CardActions>
    </React.Fragment>
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
        Select Face
      </button>
      { open ? card() : null }
    </div>
  );
}; 


