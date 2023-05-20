import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import "../styles/css/TrainingBuilder.css";
import { loadJSON, loadGLTF } from "../lib/ropes";

import ExerciseCard from "../components/ExerciseCard";

export default function TrainingBuilder() {
	const canvasRef = useRef(null);
	const scene = useRef(null);
	const camera = useRef(null);
	const renderer = useRef(null);
	const controls = useRef(null);

	// subscene and its animation
	const [scenePos, setscenePos] = useState({ top: -1000, left: -1000 });
	const mixer = useRef(null);
	const clock = new THREE.Clock();
	const animationPointer = useRef(0);
	const subsceneModel = useRef(null);
	// subscene and its animation

	const kasten = useRef(null);

	const [itemWidth, setitemWidth] = useState(100);
	// const [itemHeight, setitemHeight] = useState(100);

	const pageSize = 12;

	const [totalPage] = useState([1, 2, 3]);
	const [currentPage, setcurrentPage] = useState(1);
	const [allData, setallData] = useState([]);
	const [pageData, setpageData] = useState([]);

	const imgdeduct = 50;

	useEffect(() => {
		let resizeObserver;
		// watch box size change and set size for individual block
		if (kasten.current) {
			// wait for the elementRef to be available
			resizeObserver = new ResizeObserver(([ResizeObserverEntry]) => {
				// Do what you want to do when the size of the element changes
				const width = parseInt(
					ResizeObserverEntry.contentRect.width / 4
				);

				// const height = width + 300;

				setitemWidth(width);
				// setitemHeight(height);

				renderer.current.setSize(width - imgdeduct, width - imgdeduct);
			});
			resizeObserver.observe(kasten.current);
		}

		creatMainScene(itemWidth - imgdeduct, itemWidth - imgdeduct);

		animate();

		fetch(
			process.env.PUBLIC_URL +
				"/data/exercise-list.json?r=" +
				process.env.RANDOM_STRING
		)
			.then((response) => response.json())
			.then((data) => {
				const tasks = [];

				for (let name of data) {
					tasks.push(
						loadJSON(
							process.env.PUBLIC_URL +
								"/data/exercises/" +
								name +
								".json?r=" +
								process.env.RANDOM_STRING
						)
					);
				}

				Promise.all(tasks).then((results) => {
					const tmp = [[]];

					for (let e of results) {
						if (tmp[tmp.length - 1].length >= pageSize) {
							tmp.push([]);
						}

						tmp[tmp.length - 1].push({
							name: e.name,
							display_name: e.display_name,
							muscle_groups: e.muscle_groups,
							duration: e.duration,
							intensity: 8,
							calories: 20,
						});
					}

					setallData(tmp);
				});
			});

		loadGLTF(process.env.PUBLIC_URL + "/glb/dors.glb").then((glb) => {
			subsceneModel.current = glb.scene.children[0];

			scene.current.add(subsceneModel.current);

			mixer.current = new THREE.AnimationMixer(subsceneModel.current);
		});

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect(); // clean up observer
			}
		};
	}, []);

	useEffect(() => {
		if (!pageData || pageData.length === 0) {
			loadPageData(1);
		}

		// eslint-disable-next-line
	}, [allData]);

	function loadPageData(p) {
		setcurrentPage(p);

		const idx = Number(p) - 1;

		if (allData[idx]) {
			setpageData(allData[idx]);
		} else {
			setpageData([]);
		}
	}

	function creatMainScene(viewWidth, viewHeight) {
		/**
		 * main scene, which plays exercise animation
		 * @param {number} viewWidth
		 * @param {number} viewHeight
		 */
		scene.current = new THREE.Scene();
		scene.current.background = new THREE.Color(0xf7797d);

		camera.current = new THREE.PerspectiveCamera(
			90,
			viewWidth / viewHeight,
			0.1,
			1000
		);

		camera.current.position.set(0, 0.2, 1.4);

		{
			// mimic the sun light
			const dlight = new THREE.PointLight(0xf8797d, 0.7);
			dlight.position.set(0, 10, 2);
			scene.current.add(dlight);
			// env light
			scene.current.add(new THREE.AmbientLight(0xffffff, 0.3));
		}

		// drawScene();

		renderer.current = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			// alpha: true,
			// antialias: true,
		});

		renderer.current.toneMappingExposure = 0.5;

		controls.current = new OrbitControls(camera.current, canvasRef.current);

		renderer.current.setSize(viewWidth, viewHeight);
	}
	function animate() {
		/** play animation in example sub scene */
		const delta = clock.getDelta();

		if (mixer.current) mixer.current.update(delta);

		controls.current.update();
		renderer.current.render(scene.current, camera.current);

		animationPointer.current = requestAnimationFrame(animate);
	}

	function viewExercise(e, exercise_data) {
		const exercise_key = exercise_data.name;

		mixer.current.stopAllAction();

		const { top, left } = e.target.getBoundingClientRect();

		setscenePos({ top: top + window.scrollY - 70, left: left - 164 });

		loadJSON(
			process.env.PUBLIC_URL + "/data/exercises/" + exercise_key + ".json"
		).then((animation_data) => {
			if (animation_data.position) {
				subsceneModel.current.position.set(
					animation_data.position.x,
					animation_data.position.y,
					animation_data.position.z
				);
			} else {
				subsceneModel.current.position.set(0, 0, 0);
			}

			if (animation_data.rotation) {
				subsceneModel.current.rotation.set(
					animation_data.rotation.x,
					animation_data.rotation.y,
					animation_data.rotation.z
				);
			} else {
				subsceneModel.current.rotation.set(0, 0, 0);
			}

			// prepare the example exercise action
			const action = mixer.current.clipAction(
				THREE.AnimationClip.parse(animation_data)
			);

			action.reset();
			action.setLoop(THREE.LoopRepeat);
			// action.setLoop(THREE.LoopOnce);

			// keep model at the position where it stops
			action.clampWhenFinished = true;

			action.enable = true;

			action.play();
		});
	}

	return (
		<div className="main-content training-builder" ref={kasten}>
			<div className="title">
				<h1>Training Builder</h1>
			</div>
			<div className="exercise-list">
				{pageData.map((exercise, idx) => {
					return (
						<ExerciseCard
							key={idx}
							data={exercise}
							width={itemWidth}
							onImgClick={viewExercise}
						/>
					);
				})}
			</div>
			<div className="pagination">
				<List
					role="menubar"
					orientation="horizontal"
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-end",
					}}
				>
					{totalPage.map((p) => {
						return (
							<ListItem role="none" key={p}>
								<ListItemButton
									role="menuitem"
									component="a"
									onClick={() => {
										loadPageData(p);
									}}
								>
									{p}
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			</div>
			<canvas
				ref={canvasRef}
				style={{
					position: "absolute",
					top: scenePos.top + "px",
					left: scenePos.left + "px",
					width: itemWidth - imgdeduct + "px",
					height: itemWidth - imgdeduct + "px",
				}}
			/>
		</div>
	);
}
