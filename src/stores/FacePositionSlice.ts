import { StateCreator } from "zustand";

export interface FacePositionSlice {
	facePosition: [number?, number?, number?];
	setFacePosition: (position: []) => void;
}

export const createFacePositionSlice: StateCreator<FacePositionSlice> = (set) => ({
	facePosition: [0, 0, 0],
	setFacePosition: (position: []) => set(() => ({ facePosition: position }))
})
