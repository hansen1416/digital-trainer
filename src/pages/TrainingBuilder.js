import { useEffect, useState, useRef } from "react";
import { loadJSON } from "../lib/ropes";
import "../styles/css/TrainingBuilder.css";

import ExerciseCard from "../components/ExerciseCard";

export default function TrainingBuilder() {
	// const canvasRef = useRef(null);

	const kasten = useRef(null);

	const [itemWidth, setitemWidth] = useState(100);
	const [itemHeight, setitemHeight] = useState(100);

	const pageSize = 12;

	const [totalPage] = useState([1, 2, 3]);
	const [currentPage, setcurrentPage] = useState(1);
	const [allData, setallData] = useState([]);
	const [pageData, setpageData] = useState([]);

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

				const height = width + 300;

				setitemWidth(width);
				setitemHeight(height);
			});
			resizeObserver.observe(kasten.current);
		}

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
		<div className="main-content training-explore" ref={kasten}>
			<div className="title">
				<h1>Training Explore</h1>
			</div>
			<div className="exercise-list">
				{pageData.map((exercise, idx) => {
					return (
						<ExerciseCard
							key={idx}
							data={exercise}
							width={itemWidth}
							height={itemHeight}
						/>
					);
				})}
			</div>
			<div className="pagination">
				{totalPage.map((p) => {
					return (
						<div
							key={p}
							className={[
								"page",
								currentPage === p ? "active" : "",
							].join(" ")}
							onClick={() => {
								loadPageData(p);
							}}
						>
							<span>{p}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
