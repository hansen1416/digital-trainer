import composeLimbVectors from "../lib/PoseSyncVector";

function getJointsPosAtIdx(joints_position, idx) {
	const bonesJoints = [
		"RightArm",
		"RightForeArm",
		"RightHand",
		"LeftArm",
		"LeftForeArm",
		"LeftHand",
		"RightUpLeg",
		"RightLeg",
		"RightFoot",
		"LeftUpLeg",
		"LeftLeg",
		"LeftFoot",
	];

	const res = {};

	for (let name of bonesJoints) {
		res[name] = joints_position[name][idx];
	}

	return res;
}

let animation_states = null;

export function fetchAnimationData(animation_data) {
	animation_states = animation_data;

	return "Animation data received";
}

export function analyzePose(pose3D, idx) {
	if (!animation_states || !pose3D || !pose3D.length) {
		return "";
	}

	const bones = getJointsPosAtIdx(animation_states, idx);

	const result = composeLimbVectors(pose3D, bones);

	return result;
}
