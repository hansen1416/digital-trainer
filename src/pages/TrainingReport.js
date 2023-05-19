import { useEffect, useState } from "react";
import { roundToTwo } from "../lib/ropes";
import "../styles/css/TrainingReport.css";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";

import MusclePercentage from "../components/MusclePercentage";

export default function TrainingReport() {
	const [report, setreport] = useState(null);

	useEffect(() => {
		// todo load report
		setreport({
			name: "some name",
			duration: 30,
			muscle_groups: null,
			exercises: [1, 2, 3, 4],
		});
	}, []);

	return (
		<div className="main-content training-report">
			{report && (
				<section>
					<div className="page-title">
						<h1>Training Report</h1>
					</div>
					<div className="name">
						<h3>{report.name}</h3>
					</div>
					<Box
						component="nav"
						aria-label="My site"
						sx={{ flexGrow: 1 }}
					>
						<List role="menubar" orientation="horizontal">
							<ListItem role="none">
								<span>Duration: </span>
								<span>{report.duration}s</span>
							</ListItem>
							<ListDivider />
							<List role="menubar" orientation="horizontal">
								<ListItem role="none"></ListItem>
								<ListDivider />
								<ListItem role="none"></ListItem>
							</List>
						</List>
					</Box>

					<Divider
						orientation="horizontal"
						sx={{
							"--Divider-childPosition": "20%",
							margin: "20px 0",
						}}
					>
						<Chip variant="solid" color="info" size="md">
							Exercises
						</Chip>
					</Divider>

					<Grid container spacing={2} sx={{ flexGrow: 1 }}>
						{report &&
							report.exercises &&
							report.exercises.map((exercise, i) => {
								return (
									<Grid xs={4}>
										<Card
											sx={{
												width: "auto",
												bgcolor: "initial",
												boxShadow: "none",
												"--Card-padding": "0px",
											}}
										>
											<Box sx={{ position: "relative" }}>
												<AspectRatio ratio="4/3">
													<figure>
														<img
															src="https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&w=300"
															srcSet="https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&w=300&dpr=2 2x"
															loading="lazy"
															alt="Yosemite by Casey Horner"
														/>
													</figure>
												</AspectRatio>
											</Box>
											<Box sx={{ display: "flex" }}>
												<div>
													<Typography level="body3">
														Total price:
													</Typography>
													<Typography
														fontSize="lg"
														fontWeight="lg"
													>
														$2,900
													</Typography>
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
													Explore
												</Button>
											</Box>
										</Card>
									</Grid>
								);
							})}
					</Grid>
				</section>
			)}
		</div>
	);
}
