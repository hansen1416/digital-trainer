import { useEffect, useState, useRef } from "react";

export default function TrainingExplore() {
	const canvasRef = useRef(null);

	const [trainingList, settrainingList] = useState([]);

	useEffect(() => {}, []);

	return (
		<div className="main-content training-explore">
			<div className="title">
				<h1>Training Explore</h1>
			</div>
			<div>
				{trainingList.map((training, idx) => {
					return <div key={idx}></div>;
				})}
				<div>
					<canvas ref={canvasRef} />
				</div>
			</div>
		</div>
	);
}
