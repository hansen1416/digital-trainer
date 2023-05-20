import { useEffect, useState, useRef } from "react";
import { roundToTwo, loadJSON } from "../lib/ropes";

import MusclePercentage from "../components/MusclePercentage";

export default function TrainingExplore() {
	// const canvasRef = useRef(null);

	const [itemWidth, setitemWidth] = useState(100);
	const [itemHeight, setitemHeight] = useState(100);

	const pageSize = 12;

	const [totalPage] = useState([1, 2, 3]);
	const [currentPage, setcurrentPage] = useState(1);
	const [allData, setallData] = useState([]);
	const [pageData, setpageData] = useState([]);

	useEffect(() => {
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

	return (
		<div className="main-content training-explore">
			<div className="title">
				<h1>Training Explore</h1>
			</div>
			<div className="exercise-list">
				{pageData.map((exercise, idx) => {
					return (
						<div
							key={idx}
							className="exercise-block"
							style={{
								width: itemWidth + "px",
								height: itemHeight + "px",
							}}
						>
							<div onClick={(e) => {}}>
								<img
									style={{
										width: itemWidth - 20 + "px",
										height: itemWidth - 20 + "px",
									}}
									src={
										process.env.PUBLIC_URL +
										"/data/imgs/" +
										exercise.name +
										".png"
									}
									alt=""
								/>
							</div>
							<div className="name">
								<i>{exercise.display_name}</i>
							</div>
							<div>
								<p>duration: {roundToTwo(exercise.duration)}</p>
								<p>intensity: {exercise.intensity}</p>
								<p>calories: {exercise.calories}</p>
							</div>
							<div>
								<MusclePercentage
									musclesPercent={exercise.muscle_groups}
								/>
							</div>
							<div className="add"></div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
