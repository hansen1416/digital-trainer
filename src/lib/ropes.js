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
