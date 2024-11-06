import { Matrix4 } from 'three';

export interface PartData {
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  key: number;
}

export const DEFAULT_PART_DATA: PartData = {
  type: '',
  position: [0,4,0],
  rotation: [0,0,0],
  key: 0
}

export interface PartProps {
  id: number;
  key: number;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  active?: boolean;
  selected?: boolean;
  onFaceSelected?: (faceIndex: number) => void;
  onPositionChange?: (id: number, newPosition: [number, number, number], newRotation: [number, number, number]) => void;
  onScaleChange?: (scale: number) => void;
  onClick?: () => void;
} 