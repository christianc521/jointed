import { StateCreator } from "zustand";
import { partsConfig, PartType } from '../config/parts';
import { PartProps } from "../types";
import { v4 as uuidv4 } from 'uuid';

export interface PartsSlice {
	parts: PartProps[];
	placePart: (tool: string, position: (number | undefined)[]) => void;
	removePart: (id: string) => void;
	positionChange: (id: string, position: number[], rotation: number[]) => void;
}

export const createPartsSlice: StateCreator<PartsSlice> = (set) => ({
	parts: [],
	placePart: (tool: string, position: (number | undefined)[]) => {
		set((state) => ({
			parts: [
				...state.parts,
				{
					type: tool,
					position: position,
					rotation: [0, 0, 0],
					key: uuidv4(),
					id: uuidv4(),
					dimensions: partsConfig[tool as PartType].defaultDimensions,
					active: true,
				} as PartProps,
			],
		}));
	},
	removePart: (id: string) => {
		set((state) => ({
			parts: state.parts.filter((part) => part.id !== id),
		}));
	},
	positionChange: (id: string, position: number[], rotation: number[]) => {
		set((state) => ({
			parts: state.parts.map((part) =>
				part.id === id ? ({ ...part, position: position, rotation: rotation } as PartProps) : part
			),
		}))
	}
});


