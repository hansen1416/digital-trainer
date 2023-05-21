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

/**
 * calculate chest, abs basis matrix based on 4 joint positions
 * @param {obj} left_shoulder
 * @param {obj} right_shoulder
 * @param {obj} left_hip
 * @param {obj} right_hip
 * @returns
 */
function basisFromTorso(left_shoulder, right_shoulder, left_hip, right_hip) {
	const left_oblique = new THREE.Vector3(
		(left_shoulder.x + left_hip.x) / 2,
		(left_shoulder.y + left_hip.y) / 2,
		(left_shoulder.z + left_hip.z) / 2
	);
	const right_oblique = new THREE.Vector3(
		(right_shoulder.x + right_hip.x) / 2,
		(right_shoulder.y + right_hip.y) / 2,
		(right_shoulder.z + right_hip.z) / 2
	);
	const center = new THREE.Vector3(
		(left_oblique.x + right_oblique.x) / 2,
		(left_oblique.y + right_oblique.y) / 2,
		(left_oblique.z + right_oblique.z) / 2
	);

	// new basis of chest from pose data
	const xaxis = new THREE.Vector3(
		left_shoulder.x - right_shoulder.x,
		left_shoulder.y - right_shoulder.y,
		left_shoulder.z - right_shoulder.z
	).normalize();

	const y_tmp = new THREE.Vector3(
		left_shoulder.x - center.x,
		left_shoulder.y - center.y,
		left_shoulder.z - center.z
	).normalize();

	const zaxis = new THREE.Vector3().crossVectors(xaxis, y_tmp).normalize();

	const yaxis = new THREE.Vector3().crossVectors(xaxis, zaxis).normalize();

	const chest_basis = new THREE.Matrix4().makeBasis(xaxis, yaxis, zaxis);

	// new basis of abs from pose data
	const xaxis3 = new THREE.Vector3(
		left_hip.x - right_hip.x,
		left_hip.y - right_hip.y,
		left_hip.z - right_hip.z
	).normalize();

	const y_tmp3 = new THREE.Vector3(
		center.x - left_hip.x,
		center.y - left_hip.y,
		center.z - left_hip.z
	).normalize();

	const zaxis3 = new THREE.Vector3().crossVectors(xaxis3, y_tmp3).normalize();

	const yaxis3 = new THREE.Vector3().crossVectors(zaxis3, xaxis3).normalize();

	const abs_basis = new THREE.Matrix4().makeBasis(xaxis3, yaxis3, zaxis3);

	return [chest_basis, abs_basis];
}

/**
 * conversion matrix convert vector from bone basis to pose basis
 * @param {obj} bones_pos
 * @param {obj} pose_pos
 * @returns
 */
function boneToPoseMatrix(bones_pos, pose_pos) {
	const [chest_m0, abs_m0] = basisFromTorso(
		bones_pos["LEFT_SHOULDER"],
		bones_pos["RIGHT_SHOULDER"],
		bones_pos["LEFT_HIP"],
		bones_pos["RIGHT_HIP"]
	);

	const [chest_m1, abs_m1] = basisFromTorso(
		pose_pos["LEFT_SHOULDER"],
		pose_pos["RIGHT_SHOULDER"],
		pose_pos["LEFT_HIP"],
		pose_pos["RIGHT_HIP"]
	);

	const chest_m = chest_m1.multiply(chest_m0.invert());
	const abs_m = abs_m1.multiply(abs_m0.invert());

	return [chest_m, abs_m];
}

export default function composeLimbVectors(pose, bones) {}
