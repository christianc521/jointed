import { create, StateCreator, useStore } from "zustand";

export interface JointSlice {
	selectedFacePosition: number[];
	setSelectedFacePosition: (position: number[]) => void;
}

export const createJointSlice: StateCreator<JointSlice> = (set) => ({
	selectedFacePosition: [0, 0, 0],
	setSelectedFacePosition: (position: number[]) => set(() => ({ selectedFacePosition: position }))
})
