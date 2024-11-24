import { BoxGeometry, CylinderGeometry, SphereGeometry, MeshStandardMaterial, MeshMatcapMaterial } from "three";

export interface PartConfig {
  shape: any;
  color: number;
  material: MeshStandardMaterial[] | MeshMatcapMaterial[];
  selectableFaceIndexes: number[];
  defaultDimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

export const PART_TYPES = {
  DOWEL: 'dowel',
  BOARD: 'board',
  JOINT: 'joint',
  // Easy to add new types here
} as const;

export type PartType = typeof PART_TYPES[keyof typeof PART_TYPES];

export const partsConfig: Record<PartType, PartConfig> = {
  [PART_TYPES.DOWEL]: {
    shape: new CylinderGeometry(0.1, 0.1, 1, 12).translate(0, 0.5, 0),
    material: [new MeshStandardMaterial({
      color: 0xff0000,
      wireframe: true
    }), new MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true
    })],
    selectableFaceIndexes: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    color: 0xff0000,
    defaultDimensions: {
      width: 1,
      height: 1,
      depth: 1
    }
  },
  [PART_TYPES.BOARD]: {
    shape: new BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
    material: [new MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
    }), new MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: false
    })],
    selectableFaceIndexes: [0, 1],
    color: 0x00ff00,
    defaultDimensions: {
      width: 1,
      height: 1,
      depth: 1
    }
  },
  [PART_TYPES.JOINT]: {
    shape: new SphereGeometry(1, 10, 6).translate(0, 0.5, 0),
    material: [new MeshStandardMaterial({
      color: 0x0000ff,
      wireframe: false,
      flatShading: true
    }), new MeshStandardMaterial({
      color: 0xff0000,
      wireframe: false
    })],
    selectableFaceIndexes: [0, 1],
    color: 0x0000ff,
    defaultDimensions: {
      width: 0.3,
      height: 0.3,
      depth: 0.3
    }
  }
}; 
