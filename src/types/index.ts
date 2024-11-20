export interface PartData {
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  key: number;
}

export const DEFAULT_PART_DATA: PartData = {
  type: '',
  position: [0, 4, 0],
  rotation: [0, 0, 0],
  key: 0
}

export interface PartProps {
  id: string;
  key: string;
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
  onPositionChange?: (id: string, newPosition: number[], newRotation: number[]) => void;
  onScaleChange?: (id: string, newDimension: number[]) => void;
  onClick?: () => void;
} 
