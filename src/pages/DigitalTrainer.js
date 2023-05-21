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

	useEffect(() => {
		/**
		 * update subscene size
		 */
		if (!subsceneWidth || !subsceneHeight) {
			return;
		}

		cameraSub.current.aspect = subsceneWidth / subsceneHeight;
		cameraSub.current.updateProjectionMatrix();
		rendererSub.current.setSize(subsceneWidth, subsceneHeight);

		cameraEg.current.aspect = subsceneWidth / subsceneHeight;
		cameraEg.current.updateProjectionMatrix();
		rendererEg.current.setSize(subsceneWidth, subsceneHeight);
	}, [subsceneWidth, subsceneHeight]);

	useEffect(() => {
		/**
		 * when select one of the training
		 * load all of the animation jsons `animationJSONs`
		 * add then add all names to `exerciseQueue`
		 * in `animate`, we consume `exerciseQueue`
		 */
		if (selectedTrainingIndx >= 0 && trainingList[selectedTrainingIndx]) {
			const tasks = [];
			const tmp_queue = [];

			// initialize statistics
			// clear the exercise array
			// initialize exercise progress in `initializeExercise`
			// update exercise progres in `applyAnimation`
			statistics.current = cloneDeep(trainingList[selectedTrainingIndx]);

			try {
				// todo, update rest time after each exercise
				resetTime.current = parseInt(
					// trainingList[selectedTrainingIndx].rest
					5
				);
			} catch (e) {
				console.error(e);
			}

			for (const e of trainingList[selectedTrainingIndx].exercises) {
				tasks.push(
					loadJSON(
						process.env.PUBLIC_URL +
							"/data/exercises/" +
							e.name +
							".json?r=" +
							process.env.RANDOM_STRING
					)
				);

				tmp_queue.push(e);
			}

			exerciseQueue.current = tmp_queue;

			Promise.all(tasks).then((data) => {
				/**
				 * load exercise animation data
				 * save them to `animationJSONs`
				 * note: training.exercises[i].name must be equal to data[i].name
				 */

				for (const v of data) {
					animationJSONs.current[v.name] = v;
				}

				exerciseQueueIndx.current = 0;

				initializeExercise();

				if (videoRef.current) {
					// startCamera(videoRef.current);

					inExercise.current = true;

					// count down loop hook. default 5 seconds

					getReadyCountDown.current = 60;

					setstartBtnShow(false);
					setstopBtnShow(true);
				}
			});
		}
		// eslint-disable-next-line
	}, [selectedTrainingIndx]);

	useEffect(() => {
		/**
		 * user tunning the threshold
		 * it affect how strict user should follow the animation
		 * pearson correlation * 100
		 * default 80,
		 */
		poseSyncThresholdRef.current = poseSyncThreshold;
	}, [poseSyncThreshold]);

	function creatMainScene(viewWidth, viewHeight) {
		/**
		 * main scene, which plays exercise animation
		 * @param {number} viewWidth
		 * @param {number} viewHeight
		 */
		scene.current = new THREE.Scene();
		// scene.current.background = new THREE.Color(0x022244);

		camera.current = new THREE.PerspectiveCamera(
			90,
			viewWidth / viewHeight,
			0.1,
			500
		);

		camera.current.position.set(0, 0, 2);

		{
			// mimic the sun light
			const dlight = new THREE.PointLight(0xffffff, 0.4);
			dlight.position.set(0, 10, 10);
			scene.current.add(dlight);
			// env light
			scene.current.add(new THREE.AmbientLight(0xffffff, 0.6));
		}

		// drawScene();

		renderer.current = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			alpha: true,
			antialias: true,
		});

		renderer.current.toneMappingExposure = 0.5;

		controls.current = new OrbitControls(camera.current, canvasRef.current);

		// controls.current.enablePan = false;
		// controls.current.minPolarAngle = THREE.MathUtils.degToRad(60);
		// controls.current.maxPolarAngle = THREE.MathUtils.degToRad(90);
		controls.current.minDistance = 1;
		controls.current.maxDistance = 500;

		// this line will cause the control to be lagging
		// controls.current.enableDamping = true;

		renderer.current.setSize(viewWidth, viewHeight);
	}

	function createSubScene() {
		/**
		 * subscene, play the silhouette
		 * an mapping from pose3d data
		 *
		 * assume sqaure canvas, aspect = 1
		 * visible_x / (tan(fov/2)) = object_z + camera_z
		 * visible_x = (object_z + camera_z) * tan(fov/2)
		 *
		 * so for pose,
		 * assume x=0.6, the actual x position of pos should be 0.6*visible_x, same for y, since we're using square canvas
		 * can we apply this to z as well?
		 */

		sceneSub.current = new THREE.Scene();
		// sceneSub.current.background = new THREE.Color(0x22244);

		cameraSub.current = new THREE.PerspectiveCamera(90, 1, 0.1, 500);

		cameraSub.current.position.set(0, 30, 100);

		/**
		 * visible_height = 2 * tan(camera_fov / 2) * camera_z
		 * visible_width = visible_height * camera_aspect
		 */

		const vFOV = THREE.MathUtils.degToRad(cameraSub.current.fov); // convert vertical fov to radians

		visibleHeightSub.current =
			2 * Math.tan(vFOV / 2) * cameraSub.current.position.z; // visible height

		visibleWidthSub.current =
			visibleHeightSub.current * cameraSub.current.aspect; // visible width

		sceneSub.current.add(new THREE.AmbientLight(0xffffff, 1));

		rendererSub.current = new THREE.WebGLRenderer({
			canvas: canvasRefSub.current,
			alpha: true,
			antialias: true,
		});

		controlsSub.current = new OrbitControls(
			cameraSub.current,
			canvasRefSub.current
		);
	}

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
