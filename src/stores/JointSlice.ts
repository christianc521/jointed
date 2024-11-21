import { StateCreator } from "zustand";

export interface JointSlice {
	selectedFacePosition: (number | undefined)[];
	setSelectedFacePosition: (position: (number | undefined)[]) => void;
}

export const createJointSlice: StateCreator<JointSlice> = (set) => ({
	selectedFacePosition: [0, 0, 0],
	setSelectedFacePosition: (position: (number | undefined)[]) => set(() => ({ selectedFacePosition: position }))
})
