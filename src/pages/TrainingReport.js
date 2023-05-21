import { useEffect, useState } from "react";
import { roundToTwo } from "../lib/ropes";
import "../styles/css/TrainingReport.css";
import Grid from "@mui/joy/Grid";
import Divider from "@mui/joy/Divider";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";

import ExerciseCard from "../components/ExerciseCard";
import MusclePercentage from "../components/MusclePercentage";

export default function TrainingReport() {
	const [report, setreport] = useState(null);

	useEffect(() => {
		let res = window.localStorage.getItem("statistics");

		try {
			res = JSON.parse(res);

			for (let e of res.exercises) {
				e.deviation = [];

				for (let name in e.error_angles) {
					e.deviation.push([
						name,
						(e.error_angles[name] /= e.total_compared_frame),
					]);
				}
			}

			setreport(res);
		} catch (e) {
			console.info(e);
		}
	}, []);

	return (
		<div className="main-content training-report">
			{report && (
				<section>
					<div className="page-title" style={{ marginRight: "20px" }}>
						<h1>{report.name}</h1>
					</div>

					<Box
						component="nav"
						sx={{ flexGrow: 1, marginBottom: "30px" }}
					>
						<span>Duration: </span>
						<span>{roundToTwo(report.duration)}s</span>
					</Box>

					<MusclePercentage musclesPercent={report.muscle_groups} />

					<Divider
						orientation="horizontal"
						sx={{
							// "--Divider-childPosition": "20%",
							margin: "20px 0",
						}}
					>
						<Chip variant="solid" color="primary" size="md">
							Exercises
						</Chip>
					</Divider>

					<Grid container spacing={2} sx={{ flexGrow: 1 }}>
						{report &&
							report.exercises &&
							report.exercises.map((exercise, idx) => {
								return (
									<Grid key={idx} xs={4}>
										<ExerciseCard
											key={idx}
											data={exercise}
											onImgClick={() => {}}
											styles={{
												width: "100%",
												boxSizing: "border-box",
											}}
										/>
									</Grid>
								);
							})}
					</Grid>
				</section>
			)}
		</div>
	);
}
