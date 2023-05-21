import * as THREE from "three";

import { BlazePoseKeypointsValues } from "./ropes";

function quaternionFromBasis(xaxis0, yaxis0, zaxis0, xaxis1, yaxis1, zaxis1) {
	/**
	 * transfer object from basis0 to basis1
	 */
	const m0 = new THREE.Matrix4().makeBasis(xaxis0, yaxis0, zaxis0);
	const m1 = new THREE.Matrix4().makeBasis(xaxis1, yaxis1, zaxis1);

	const m = m1.multiply(m0.invert());

	return new THREE.Quaternion().setFromRotationMatrix(m);
}

function torsoRotation(left_shoulder2, right_shoulder2, left_hip2, right_hip2) {
	/**
		Now you want matrix B that maps from 1st set of coords to 2nd set:
		A2 = B * A1
		This is now a very complex math problem that requires advanced skills to arrive at the solution:
		B = A2 * inverse of A1
	 */

	if (
		(left_shoulder2.visibility && left_shoulder2.visibility < 0.5) ||
		(right_shoulder2.visibility && right_shoulder2.visibility < 0.5) ||
		(left_hip2.visibility && left_hip2.visibility < 0.5) ||
		(right_hip2.visibility && right_hip2.visibility < 0.5)
	) {
		return [false, false];
	}

	const left_oblique = new THREE.Vector3(
		(left_shoulder2.x + left_hip2.x) / 2,
		(left_shoulder2.y + left_hip2.y) / 2,
		(left_shoulder2.z + left_hip2.z) / 2
	);
	const right_oblique = new THREE.Vector3(
		(right_shoulder2.x + right_hip2.x) / 2,
		(right_shoulder2.y + right_hip2.y) / 2,
		(right_shoulder2.z + right_hip2.z) / 2
	);
	const center = new THREE.Vector3(
		(left_oblique.x + right_oblique.x) / 2,
		(left_oblique.y + right_oblique.y) / 2,
		(left_oblique.z + right_oblique.z) / 2
	);

	// origin basis of chest
	const xaxis0 = new THREE.Vector3(1, 0, 0);
	const yaxis0 = new THREE.Vector3(0, -1, 0);
	const zaxis0 = new THREE.Vector3(0, 0, 1);

	// new basis of chest from pose data
	const xaxis1 = new THREE.Vector3(
		left_shoulder2.x - right_shoulder2.x,
		left_shoulder2.y - right_shoulder2.y,
		left_shoulder2.z - right_shoulder2.z
	).normalize();

	const y_tmp1 = new THREE.Vector3(
		left_shoulder2.x - center.x,
		left_shoulder2.y - center.y,
		left_shoulder2.z - center.z
	).normalize();

	const zaxis1 = new THREE.Vector3().crossVectors(xaxis1, y_tmp1).normalize();

	const yaxis1 = new THREE.Vector3().crossVectors(xaxis1, zaxis1).normalize();

	const chest_q = quaternionFromBasis(
		xaxis0,
		yaxis0,
		zaxis0,
		xaxis1,
		yaxis1,
		zaxis1
	);

	// origin basis of abdominal
	const xaxis2 = new THREE.Vector3(1, 0, 0);
	const yaxis2 = new THREE.Vector3(0, 1, 0);
	const zaxis2 = new THREE.Vector3(0, 0, 1);

	// new basis of abdominal from pose data
	const xaxis3 = new THREE.Vector3(
		left_hip2.x - right_hip2.x,
		left_hip2.y - right_hip2.y,
		left_hip2.z - right_hip2.z
	).normalize();

	const y_tmp3 = new THREE.Vector3(
		center.x - left_hip2.x,
		center.y - left_hip2.y,
		center.z - left_hip2.z
	).normalize();

	const zaxis3 = new THREE.Vector3().crossVectors(xaxis3, y_tmp3).normalize();

	const yaxis3 = new THREE.Vector3().crossVectors(zaxis3, xaxis3).normalize();

	// console.log(xaxis3, yaxis3, zaxis3);

	const abs_q = quaternionFromBasis(
		xaxis2,
		yaxis2,
		zaxis2,
		xaxis3,
		yaxis3,
		zaxis3
	);

	return [abs_q, chest_q];
}
