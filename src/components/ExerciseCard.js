import { useEffect, useState, useRef } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { roundToTwo } from "../lib/ropes";

import MusclePercentage from "../components/MusclePercentage";

export default function ExerciseCard({
	data,
	styles,
	onImgClick,
	addExercise,
}) {
	return (
		<Card
			sx={{
				...{
					display: "inline-block",
					bgcolor: "#2A3E96",
					boxShadow: "none",
					marginRight: "16px",
					marginBottom: "16px",
				},
				...styles,
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
						{data.start_time && data.end_time ? (
							<span>
								Duration:{" "}
								{roundToTwo(
									(data.end_time - data.start_time) / 1000
								)}
								s
							</span>
						) : (
							<span>Duration: {roundToTwo(data.duration)}s</span>
						)}
						{data.reps && (
							<span
								style={{
									marginLeft: 10,
								}}
							>
								Reps: {data.reps}
							</span>
						)}
					</Typography>
				</div>
				{addExercise && (
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
				)}
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
