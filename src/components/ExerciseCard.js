import { useEffect, useState, useRef } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { roundToTwo } from "../lib/ropes";

import MusclePercentage from "../components/MusclePercentage";

export default function ExerciseCard({ data, width, height }) {
	console.log(data);

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
				}}
			>
				<div>
					<Typography fontSize="lg" fontWeight="lg">
						<span>{data.display_name}</span>
					</Typography>
					<Typography level="body3">
						<span>duration: {roundToTwo(data.duration)}</span>
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
							textTransform: "capitalize",
						}}
					>
						add
					</Button>
				</div>
			</Box>
			<Box
				sx={{
					position: "relative",
					// paddingLeft: "20px",
					// paddingRight: "20px",
					// paddingTop: "20px",
				}}
			>
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
					<Typography fontSize="lg" fontWeight="lg">
						<span>{data.display_name}</span>
						<span>duration: {roundToTwo(data.duration)}</span>
					</Typography>
					<Typography level="body3"></Typography>
				</div>
				{/* <div>
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
				</Button> */}
			</Box>
		</Card>
	);
}
