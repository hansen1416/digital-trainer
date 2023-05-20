import { useEffect, useState, useRef } from "react";
import { roundToTwo } from "../lib/ropes";

import MusclePercentage from "../components/MusclePercentage";

export default function ExerciseCard({ data, width, height }) {
	return (
		<div
			className="exercise-block"
			style={{
				width: width + "px",
				height: height + "px",
				display: "inline-block",
			}}
		>
			<div onClick={(e) => {}}>
				<img
					style={{
						width: width - 20 + "px",
						height: width - 20 + "px",
					}}
					src={
						process.env.PUBLIC_URL +
						"/data/imgs/" +
						data.name +
						".png"
					}
					alt=""
				/>
			</div>
			<div className="name">
				<i>{data.display_name}</i>
			</div>
			<div>
				<p>duration: {roundToTwo(data.duration)}</p>
				<p>intensity: {data.intensity}</p>
				<p>calories: {data.calories}</p>
			</div>
			<div>
				<MusclePercentage musclesPercent={data.muscle_groups} />
			</div>
			<div className="add"></div>
		</div>
	);
}
