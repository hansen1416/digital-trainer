import * as THREE from "three";

import { BlazePoseKeypointsValues } from "./ropes";

const poseJoints = {
	LEFT_SHOULDER: "LEFT_SHOULDER",
	LEFT_ELBOW: "LEFT_ELBOW",
	LEFT_WRIST: "LEFT_WRIST",
	RIGHT_SHOULDER: "RIGHT_SHOULDER",
	RIGHT_ELBOW: "RIGHT_ELBOW",
	RIGHT_WRIST: "RIGHT_WRIST",
	LEFT_HIP: "LEFT_HIP",
	LEFT_KNEE: "LEFT_KNEE",
	LEFT_ANKLE: "LEFT_ANKLE",
	RIGHT_HIP: "RIGHT_HIP",
	RIGHT_KNEE: "RIGHT_KNEE",
	RIGHT_ANKLE: "RIGHT_ANKLE",
};

/**
 * pose node to model bone name mapping
 */
const bonesJoints = {
	LEFT_SHOULDER: "RightArm",
	LEFT_ELBOW: "RightForeArm",
	LEFT_WRIST: "RightHand",
	RIGHT_SHOULDER: "LeftArm",
	RIGHT_ELBOW: "LeftForeArm",
	RIGHT_WRIST: "LeftHand",
	LEFT_HIP: "RightUpLeg",
	LEFT_KNEE: "RightLeg",
	LEFT_ANKLE: "RightFoot",
	RIGHT_HIP: "LeftUpLeg",
	RIGHT_KNEE: "LeftLeg",
	RIGHT_ANKLE: "LeftFoot",
};

export default function composeLimbVectors(pose, bones) {}
