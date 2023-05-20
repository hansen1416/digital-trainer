import { useEffect, useState, useRef } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { roundToTwo } from "../lib/ropes";

import MusclePercentage from "../components/MusclePercentage";

export default function ExerciseCard({ data, width, height }) {
	return (
		<Card
			sx={{
				display: "inline-block",
				width: width,
				bgcolor: "initial",
				boxShadow: "none",
				"--Card-padding": "0px",
			}}
		>
			<Box sx={{ position: "relative" }}>
				<AspectRatio ratio="1/1">
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
			<Box sx={{ display: "flex" }}>
				<div>
					<Typography level="body3">
						<i>{data.display_name}</i>
					</Typography>
					<Typography fontSize="lg" fontWeight="lg">
						<p>duration: {roundToTwo(data.duration)}</p>
						<p>intensity: {data.intensity}</p>
						<p>calories: {data.calories}</p>
					</Typography>
				</div>
				<div>
					<MusclePercentage musclesPercent={data.muscle_groups} />
				</div>
				<Button
					variant="solid"
					size="sm"
					color="primary"
					aria-label="Explore Bahamas Islands"
					sx={{
						ml: "auto",
						fontWeight: 600,
					}}
				>
					add
				</Button>
			</Box>
		</Card>
	);
}
