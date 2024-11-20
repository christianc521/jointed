import { create, StateCreator, useStore } from "zustand";

export interface ToolSlice {
	activeTool: string;
	setActiveTool: (tool: string) => void;
}

export const createToolSlice: StateCreator<ToolSlice> = (set) => ({
	activeTool: '',
	setActiveTool: (tool: string) => set(() => ({ activeTool: tool }))
})
