import { useEffect, useState, useRef } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { roundToTwo } from "../lib/ropes";

import MusclePercentage from "../components/MusclePercentage";

export default function ExerciseCard({ data, width, onImgClick, addExercise }) {
	return (
		<Card
			sx={{
				display: "inline-block",
				width: width - 48,
				bgcolor: "#2A3E96",
				boxShadow: "none",
				marginRight: "16px",
				marginBottom: "16px",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginBottom: "10px",
				}}
			>
				<div>
					<Typography fontSize="lg" fontWeight="lg">
						<span>{data.display_name}</span>
					</Typography>
					<Typography level="body2">
						<span>duration: {roundToTwo(data.duration)}s</span>
					</Typography>
				</div>
				<div>
					<Button
						variant="solid"
						size="sm"
						color="primary"
						sx={{
							ml: "auto",
							fontWeight: 600,
						}}
						onClick={() => {
							addExercise(data);
						}}
					>
						Add
					</Button>
				</div>
			</Box>
			<Box
				sx={{
					position: "relative",
					marginBottom: "16px",
				}}
			>
				<AspectRatio
					ratio="1/1"
					onClick={(e) => {
						onImgClick(e, data);
					}}
				>
					<figure>
						<img
							src={
								process.env.PUBLIC_URL +
								"/data/imgs/" +
								data.name +
								".png"
							}
							loading="lazy"
							alt="Yosemite by Casey Horner"
						/>
					</figure>
				</AspectRatio>
			</Box>
			<MusclePercentage musclesPercent={data.muscle_groups} />
		</Card>
	);
}
