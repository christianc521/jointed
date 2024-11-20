import { create } from "zustand";
import { PartsSlice, createPartsSlice } from "./PartsSlice";
import { ToolSlice, createToolSlice } from "./ToolSlice";
import { ActivePartSlice, createActivePartSlice } from "./ActivePartSlice";
import { JointSlice, createJointSlice } from "./JointSlice";

export const useBoundStore = create<PartsSlice & ToolSlice & ActivePartSlice & JointSlice>((...a) => ({
	...createPartsSlice(...a),
	...createToolSlice(...a),
	...createActivePartSlice(...a),
	...createJointSlice(...a),
}))

