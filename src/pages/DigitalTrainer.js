import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { cloneDeep } from "lodash";
import { Pose } from "@mediapipe/pose";
import RangeSlider from "react-range-slider-input";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import "react-range-slider-input/dist/style.css";

import "../styles/css/DigitalTrainer.css";
import Silhouette3D from "../components/Silhouette3D";
import Counter from "../components/Counter";
import PoseSync from "../components/PoseSync";

export default function DigitalTrainer() {
	const canvasRef = useRef(null);
	const scene = useRef(null);
	const camera = useRef(null);
	const renderer = useRef(null);
	const controls = useRef(null);
	// an integer number, used for cancelAnimationFrame
	const animationPointer = useRef(0);
	const counter = useRef(0);

	const videoRef = useRef(null);

	// ======== main scene 3d model start
	const mannequinModel = useRef(null);
	const figureParts = useRef({});
	// ======== main scene 3d model end

	// ======== for comparing start
	// blazepose pose model
	const poseDetector = useRef(null);
	// landmarks of human joints
	// const keypoints2D = useRef(null);
	const keypoints3D = useRef(null);
	// compare by joints distances
	const poseSync = useRef(null);
	const [poseSyncThreshold, setposeSyncThreshold] = useState(80);
	const poseSyncThresholdRef = useRef(0);
	const [diffScore, setdiffScore] = useState(0);
	const poseCompareResult = useRef(null);
	// const poseSyncVector = useRef(null);
	// ======== for comparing end

	// ======== loading status
	const [loadingCamera, setloadingCamera] = useState(true);
	const [loadingModel, setloadingModel] = useState(true);
	const [loadingCharacter, setloadingCharacter] = useState(true);
	const [loadingSilhouette, setloadingSilhouette] = useState(true);
	const [loadingTraining, setloadingTraining] = useState(true);
	// ======== loading status

	// ======== sub scene start
	// example exercise subscene
	const canvasRefEg = useRef(null);
	const sceneEg = useRef(null);
	const cameraEg = useRef(null);
	const rendererEg = useRef(null);
	const controlsEg = useRef(null);

	const mixer = useRef(null);
	const clock = new THREE.Clock();

	// pose capture sub scene
	const canvasRefSub = useRef(null);
	const sceneSub = useRef(null);
	const cameraSub = useRef(null);
	const rendererSub = useRef(null);
	const controlsSub = useRef(null);

	const [subsceneWidth, setsubsceneWidth] = useState(0);
	const [subsceneHeight, setsubsceneHeight] = useState(0);
	const subsceneWidthRef = useRef(0);
	const subsceneHeightRef = useRef(0);

	// the width and height in the 3.js world
	const visibleWidthSub = useRef(0);
	const visibleHeightSub = useRef(0);

	// the pose retargetting model instance
	const silhouette = useRef(null);
	// ======== sub scene end

	// ======== training process related start
	const [startBtnShow, setstartBtnShow] = useState(false);
	const [stopBtnShow, setstopBtnShow] = useState(false);
	const inExercise = useRef(false);

	const [trainingList, settrainingList] = useState([]);
	const [selectedTrainingIndx, setselectedTrainingIndx] = useState(-1);

	// store the actual animation data, in a name=>value format
	const animationJSONs = useRef({});
	// the exercise queue, an array of names
	const exerciseQueue = useRef([]);
	// the index of the current exercise in the `exerciseQueue`
	const exerciseQueueIndx = useRef(0);
	// the current frame index of the current exercise(animation)
	const currentAnimationIndx = useRef(0);
	// the logest track of the current exercise(animation)
	const currentLongestTrack = useRef(0);
	// number of round of the current exercise(animation)
	const currentRound = useRef(0);

	const [currentExerciseName, setcurrentExerciseName] = useState("");
	const [currentExerciseRemainRound, setcurrentExerciseRemainRound] =
		useState(0);

	const [counterNumber, setcounterNumber] = useState(-1);

	// get ready count down
	const getReadyCountDown = useRef(0);

	// rest time in seconds, between exercises
	const resetTime = useRef(180);
	// count down during rest
	const restCountDown = useRef(0);
	// when training finished
	const [showCompleted, setshowCompleted] = useState(false);
	// ======== training process related end

	const worker = useWorker(createWorker);

	const workerAvailable = useRef(true);
	// record user's training result
	// details refer to `TrainingReport.js`
	const statistics = useRef({});

	const animationFps = 30;

	useEffect(() => {
		/**
		 * create main scene, pose scene, eg scene
		 * load pose detector, models, training list
		 */
		const documentWidth = document.documentElement.clientWidth;
		const documentHeight = document.documentElement.clientHeight;

		setsubsceneWidth(documentWidth * 0.3);
		// remember not to use a squared video
		setsubsceneHeight((documentWidth * 0.3 * 480) / 640);

		subsceneWidthRef.current = documentWidth * 0.3;
		subsceneHeightRef.current = (documentWidth * 0.3 * 480) / 640;

		// scene take entire screen
		creatMainScene(documentWidth, documentHeight);
		// sub scene play captured pose
		createSubScene();
		// sub scene play example exercise
		createEgScene();

		invokeCamera(videoRef.current, () => {
			setloadingCamera(false);
		});

		poseDetector.current = new Pose({
			locateFile: (file) => {
				return process.env.PUBLIC_URL + `/mediapipe/pose/${file}`;
				// return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
			},
		});
		poseDetector.current.setOptions({
			modelComplexity: 2,
			smoothLandmarks: true,
			enableSegmentation: false,
			smoothSegmentation: false,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		poseDetector.current.onResults(capturePoseCallback);

		poseDetector.current.initialize().then(() => {
			setloadingModel(false);

			animate();
		});

		Promise.all([
			// poseDetection.createDetector(
			// 	poseDetection.SupportedModels.BlazePose,
			// 	BlazePoseConfig
			// ),
			loadGLTF(process.env.PUBLIC_URL + "/glb/dors.glb"),
			loadGLTF(process.env.PUBLIC_URL + "/glb/dors.glb"),
			// loadGLTF(process.env.PUBLIC_URL + "/glb/yundong.glb"),
			// loadGLTF(process.env.PUBLIC_URL + "/glb/girl.glb"),
		]).then(([glb, glbEg]) => {
			// add 3d model to main scene
			mannequinModel.current = glb.scene.children[0];
			mannequinModel.current.position.set(0, -1, 0);

			// store all limbs to `mannequinModel`
			traverseModel(mannequinModel.current, figureParts.current);

			// console.log(Object.keys(figureParts.current));

			scene.current.add(mannequinModel.current);

			// example exercise sub scene
			const modelEg = glbEg.scene.children[0];
			sceneEg.current.add(modelEg);

			modelEg.position.set(0, -1, 0);

			mixer.current = new THREE.AnimationMixer(modelEg);

			setloadingCharacter(false);
		});

		// add silhouette to subscene
		Promise.all(
			Silhouette3D.limbs.map((name) =>
				loadJSON(process.env.PUBLIC_URL + "/t/" + name + ".json")
			)
		).then((results) => {
			const geos = {};

			for (let data of results) {
				geos[data.name] = jsonToBufferGeometry(data);
			}

			silhouette.current = new Silhouette3D(geos);
			const body = silhouette.current.init();

			// getMeshSize(figure.current.foot_l.mesh, scene.current)

			sceneSub.current.add(body);

			setloadingSilhouette(false);
		});

		// we can load training list separately
		// todo, use API for this feature
		Promise.all([
			loadJSON(
				process.env.PUBLIC_URL +
					"/data/basic-training.json?r=" +
					process.env.RANDOM_STRING
			),
		]).then(([training1]) => {
			let mytraining = window.localStorage.getItem("mytraining");

			if (mytraining) {
				mytraining = JSON.parse(mytraining);

				settrainingList([training1, mytraining]);
			} else {
				settrainingList([training1]);
			}

			setloadingTraining(false);
		});

		return () => {
			cancelAnimationFrame(animationPointer.current);
		};

		// eslint-disable-next-line
	}, []);

	return (
		<div className="digital-trainer">
			<video
				ref={videoRef}
				autoPlay={true}
				width={subsceneWidth + "px"}
				height={subsceneHeight + "px"}
				style={{
					display: "none",
				}}
			></video>

			<canvas ref={canvasRef} />
		</div>
	);
}
