import { useEffect } from "react";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";
import { muscleGroupsColors } from "../lib/ropes";
import { clone } from "lodash";

export default function MusclePercentage({ musclesPercent }) {
	const muscleArr = Object.keys(muscleGroupsColors);

	useEffect(() => {
		console.log(musclesPercent);
	}, [musclesPercent]);

	return (
		<div className="muscle-percentage">
			<Box sx={{ display: "flex", gap: 4 }}>
				{muscleArr.map((name, idx) => {
					return (
						<Badge
							key={idx}
							badgeContent={musclesPercent[name] + "%"}
							variant="solid"
						>
							<Typography fontSize="xl">{name}</Typography>
						</Badge>
					);
				})}
			</Box>
		</div>
	);
}
