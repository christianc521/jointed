import { create, StateCreator, useStore } from "zustand";

export interface ActivePartSlice {
	activePartID: string;
	setActivePartID: (id: string) => void;
}

export const createActivePartSlice: StateCreator<ActivePartSlice> = (set) => ({
	activePartID: '',
	setActivePartID: (id: string) => set(() => ({ activePartID: id }))
})
