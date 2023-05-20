import { useEffect, useState } from "react";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";

export default function MusclePercentage({ musclesPercent }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		const tmp = [];

		for (let name in musclesPercent) {
			if (~~musclesPercent[name] > 0) {
				tmp.push(name);
			}
		}

		setData(tmp);
	}, [musclesPercent]);

	return (
		<div className="muscle-percentage">
			<Box sx={{ display: "flex", gap: 4 }}>
				{data.map((name, idx) => {
					return (
						<Badge
							key={idx}
							badgeContent={musclesPercent[name] + "%"}
							// variant="solid"
							size="sm"
						>
							<Typography
								level="body1"
								sx={{
									textTransform: "capitalize",
								}}
							>
								{name}
							</Typography>
						</Badge>
					);
				})}
			</Box>
		</div>
	);
}
