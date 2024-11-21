import { create } from "zustand";
import { PartsSlice, createPartsSlice } from "./PartsSlice";
import { ToolSlice, createToolSlice } from "./ToolSlice";
import { ActivePartSlice, createActivePartSlice } from "./ActivePartSlice";
import { JointSlice, createJointSlice } from "./JointSlice";
import { FacePositionSlice, createFacePositionSlice } from "./FacePositionSlice";

export const useBoundStore = create<PartsSlice & ToolSlice & ActivePartSlice & JointSlice & FacePositionSlice>((...a) => ({
	...createPartsSlice(...a),
	...createToolSlice(...a),
	...createActivePartSlice(...a),
	...createJointSlice(...a),
	...createFacePositionSlice(...a),
}))

