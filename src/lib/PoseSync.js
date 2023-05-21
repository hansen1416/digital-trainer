import { Vector2, Vector3 } from "three";
import {
	distanceBetweenPoints,
	BlazePoseKeypointsValues,
	isLowerBodyVisible,
	pearson_corr,
	array_average,
} from "./ropes";
import * as THREE from "three";

export default class PoseSync {
	#bufferStepThreshold = 10;
	#bufferStep = 10;
	// #longestTrack = 0;

	diffScore = 0;
	poseSpline = null;
	bnoneSpline = null;

	keypointsDistances(
		keypoints3D,
		compare_upper = true,
		compare_lower = false
	) {
		const upper = [
			"LEFT_SHOULDER",
			"RIGHT_SHOULDER",
			"LEFT_ELBOW",
			"RIGHT_ELBOW",
			"LEFT_WRIST",
			"RIGHT_WRIST",
			"LEFT_HIP",
			"RIGHT_HIP",
		];

		const lower = [
			"LEFT_HIP",
			"RIGHT_HIP",
			"LEFT_KNEE",
			"RIGHT_KNEE",
			"LEFT_ANKLE",
			"RIGHT_ANKLE",
		];

		const distances = [];

		if (compare_upper) {
			for (let i = 0; i < upper.length - 1; i++) {
				for (let j = i + 1; j < upper.length; j++) {
					distances.push(
						distanceBetweenPoints(
							keypoints3D[BlazePoseKeypointsValues[upper[i]]],
							keypoints3D[BlazePoseKeypointsValues[upper[j]]]
						)
					);
				}
			}
		}

		if (compare_lower) {
			for (let i = 0; i < lower.length - 1; i++) {
				for (let j = i + 1; j < lower.length; j++) {
					distances.push(
						distanceBetweenPoints(
							keypoints3D[BlazePoseKeypointsValues[lower[i]]],
							keypoints3D[BlazePoseKeypointsValues[lower[j]]]
						)
					);
				}
			}
		}

		return distances;
	}
}
