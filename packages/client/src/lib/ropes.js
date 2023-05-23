import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const typeSizes = {
	undefined: () => 0,
	boolean: () => 4,
	number: () => 8,
	string: (item) => 2 * item.length,
	object: (item) =>
		!item
			? 0
			: Object.keys(item).reduce(
					(total, key) => sizeOf(key) + sizeOf(item[key]) + total,
					0
			  ),
};

export const sizeOf = (value) => typeSizes[typeof value](value);

export const BlazePoseConfig = {
	// runtime: "mediapipe", // or 'tfjs'
	runtime: "tfjs",
	enableSmoothing: true,
	modelType: "full",
	detectorModelUrl:
		process.env.PUBLIC_URL +
		"/models/tfjs-model_blazepose_3d_detector_1/model.json",
	landmarkModelUrl:
		process.env.PUBLIC_URL +
		"/models/tfjs-model_blazepose_3d_landmark_full_2/model.json",
	// solutionPath: process.env.PUBLIC_URL + `/models/mediapipe/pose`,
};

export const muscleGroupsColors = {
	chest: "rgba(255, 0, 0)",
	shoulders: "rgb(228, 106, 18)",
	back: "rgb(255, 234, 2)",
	arms: "rgb(59,148,94)",
	abdominals: "rgb(136,96,208)",
	legs: "rgb(2, 36, 255)",
};

// Integrate navigator.getUserMedia & navigator.mediaDevices.getUserMedia
export function getUserMedia(constraints, successCallback, errorCallback) {
	if (!constraints || !successCallback || !errorCallback) {
		return;
	}

	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(successCallback, errorCallback);
	} else {
		navigator.getUserMedia(constraints, successCallback, errorCallback);
	}
}

export function invokeCamera(videoElement, callback) {
	const errorCallback = (e) => {
		alert("camera error!!", e);
	};

	const constraints = {
		audio: false,
		// facingMode: "user", // selfie camera
		// facingMode: "environment", // back camera
		video: {
			frameRate: { ideal: 20, max: 30 },
			width: { ideal: 640, max: 640 },
			height: { ideal: 480, max: 480 },
		},
	};

	const successCallback = (stream) => {
		// Yay, now our webcam input is treated as a normal video and
		// we can start having fun
		try {
			videoElement.srcObject = stream;

			// console.log(stream_settings);
		} catch (error) {
			videoElement.src = window.URL.createObjectURL(stream);
		}

		if (callback) {
			callback();
		}
	};

	navigator.getUserMedia =
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;

	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(successCallback, errorCallback);
	} else if (navigator.getUserMedia) {
		navigator.getUserMedia(constraints, successCallback, errorCallback);
	} else {
		alert("getUserMedia() is not supported in your browser");
	}
}

export function roundToTwo(num) {
	return +(Math.round(num + "e+2") + "e-2");
}

export function srotIndex(arr) {
	return Array.from(Array(arr.length).keys()).sort((a, b) =>
		arr[a] < arr[b] ? -1 : (arr[b] < arr[a]) | 0
	);
}

export function array_average(array) {
	return array.reduce((a, b) => a + b) / array.length;
}

export function pearson_corr(x, y) {
	let sumX = 0,
		sumY = 0,
		sumXY = 0,
		sumX2 = 0,
		sumY2 = 0;
	const minLength = (x.length = y.length = Math.min(x.length, y.length)),
		reduce = (xi, idx) => {
			const yi = y[idx];
			sumX += xi;
			sumY += yi;
			sumXY += xi * yi;
			sumX2 += xi * xi;
			sumY2 += yi * yi;
		};
	x.forEach(reduce);
	return (
		(minLength * sumXY - sumX * sumY) /
		Math.sqrt(
			(minLength * sumX2 - sumX * sumX) *
				(minLength * sumY2 - sumY * sumY)
		)
	);
}

export function loadJSON(url) {
	return new Promise((resolve) => {
		fetch(url).then((response) => resolve(response.json()));
	});
}

export function loadGLTF(url) {
	return new Promise((resolve) => {
		const loader = new GLTFLoader();
		loader.load(url, (gltf) => resolve(gltf));
	});
}

export function traverseModel(model, bodyParts) {
	if (model && model.isBone && model.children.length) {
		// console.log(model.name, model.children.length)
		bodyParts[model.name] = model;
	}
	// console.log(model, model.name, model.matrix);

	model.children.forEach((child) => {
		traverseModel(child, bodyParts);
	});
}

export function calculateLongestTrackFromAnimation(animation_tracks) {
	/**
	 * get the number of longest track from the animation
	 * used by apply animation frame by frame
	 * @param {Array} animation_tracks
	 * @returns
	 */
	let longest = 0;

	for (const v of animation_tracks) {
		if (v.type === "quaternion" && v.quaternions.length > longest) {
			longest = v.quaternions.length;
		}
	}

	return longest;
}

/**
 * read data from animations
 * munnually assign translation and rotation to model
 * @param {*} model
 * @param {*} animation
 * @param {*} indx
 */
export function applyTransfer(model, animation, indx) {
	for (let item of Object.values(animation)) {
		const item_name = item["name"].split(".")[0];

		if (!model[item_name]) {
			continue;
		}

		if (item["type"] === "vector") {
			if (indx < item["vectors"].length) {
				model[item_name].position.set(
					item["vectors"][indx].x,
					item["vectors"][indx].y,
					item["vectors"][indx].z
				);
			} else {
				model[item_name].position.set(
					item["vectors"][item["vectors"].length - 1].x,
					item["vectors"][item["vectors"].length - 1].y,
					item["vectors"][item["vectors"].length - 1].z
				);
			}
		}

		if (item["type"] === "quaternion") {
			let q =
				indx < item["quaternions"].length
					? item["quaternions"][indx]
					: item["quaternions"][item["quaternions"].length - 1];

			if (!(q instanceof THREE.Quaternion)) {
				q = new THREE.Quaternion(q._x, q._y, q._z, q._w);
			}

			model[item_name].setRotationFromQuaternion(q);
		}
	}
}

/**
 * convert radian to a color, gradiently
 * @param {number} radian
 * @returns
 */
export function radianGradientColor(radian) {
	if (radian < Math.PI / 6) {
		return [71, 77, 245];
	} else if (radian < Math.PI / 3) {
		return [71, 245, 88];
	} else if (radian < Math.PI / 2) {
		return [245, 245, 71];
	} else if (radian < (Math.PI * 4) / 6) {
		return [250, 122, 53];
	} else if (radian < (Math.PI * 5) / 6) {
		return [245, 71, 204];
	} else {
		return [68, 170, 136];
	}
}

export function jsonToBufferGeometry(data) {
	const geometry = new THREE.BufferGeometry();

	geometry.setAttribute(
		"position",
		new THREE.BufferAttribute(
			new Float32Array(data.data.attributes.position.array),
			3
		)
	);
	geometry.setAttribute(
		"normal",
		new THREE.BufferAttribute(
			new Float32Array(data.data.attributes.normal.array),
			3
		)
	);
	geometry.setAttribute(
		"uv",
		new THREE.BufferAttribute(
			new Float32Array(data.data.attributes.uv.array),
			2
		)
	);

	return geometry;
}

export function distanceBetweenPoints(a, b) {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

export const BlazePoseKeypointsValues = {
	NOSE: 0,
	LEFT_EYE_INNER: 1,
	LEFT_EYE: 2,
	LEFT_EYE_OUTER: 3,
	RIGHT_EYE_INNER: 4,
	RIGHT_EYE: 5,
	RIGHT_EYE_OUTER: 6,
	LEFT_EAR: 7,
	RIGHT_EAR: 8,
	LEFT_RIGHT: 9,
	RIGHT_LEFT: 10,
	LEFT_SHOULDER: 11,
	RIGHT_SHOULDER: 12,
	LEFT_ELBOW: 13,
	RIGHT_ELBOW: 14,
	LEFT_WRIST: 15,
	RIGHT_WRIST: 16,
	LEFT_PINKY: 17,
	RIGHT_PINKY: 18,
	LEFT_INDEX: 19,
	RIGHT_INDEX: 20,
	LEFT_THUMB: 21,
	RIGHT_THUMB: 22,
	LEFT_HIP: 23,
	RIGHT_HIP: 24,
	LEFT_KNEE: 25,
	RIGHT_KNEE: 26,
	LEFT_ANKLE: 27,
	RIGHT_ANKLE: 28,
	LEFT_HEEL: 29,
	RIGHT_HEEL: 30,
	LEFT_FOOT_INDEX: 31,
	RIGHT_FOOT_INDEX: 32,
};

export function isLowerBodyVisible(poseData) {
	return (
		poseData[BlazePoseKeypointsValues["LEFT_KNEE"]].visibility > 0.5 &&
		poseData[BlazePoseKeypointsValues["RIGHT_KNEE"]].visibility > 0.5 &&
		poseData[BlazePoseKeypointsValues["LEFT_ANKLE"]].visibility > 0.5 &&
		poseData[BlazePoseKeypointsValues["RIGHT_ANKLE"]].visibility > 0.5
	);
}

export async function metamaskLogin() {
	if (window.ethereum) {
		return await window.ethereum.request({method: 'eth_requestAccounts'})
	} else {
		console.info('metamask not installed')
	}
}