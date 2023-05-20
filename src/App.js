import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./styles/css/App.css";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListDivider from "@mui/joy/ListDivider";

// Default theme
// import '@splidejs/react-splide/css';
// or other themes
// import '@splidejs/react-splide/css/skyblue';
import "@splidejs/react-splide/css/sea-green";
// // or only core styles
import "@splidejs/react-splide/css/core";

// import { ReactComponent as DarkSvg } from "./svg/sun.svg";
// import { ReactComponent as LightSvg } from "./svg/sun-light.svg";

function App() {
	const [theme, settheme] = useState("dark");

	return (
		<div className={`App ${theme}`}>
			<Outlet />

			<div className="nav">
				<List
					role="menubar"
					orientation="horizontal"
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-end",
					}}
				>
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							component="a"
							href="/digital-trainer"
						>
							D-Trainer
						</ListItemButton>
					</ListItem>
					<ListDivider />
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							component="a"
							href="/training-builder"
						>
							Training Builder
						</ListItemButton>
					</ListItem>
					<ListDivider />
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							component="a"
							href="/training-explore"
							aria-label="Profile"
						>
							Training Explorer
						</ListItemButton>
					</ListItem>
					{/* <ListDivider />
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							component="a"
							href="#horizontal-list"
							aria-label="Profile"
							onClick={() => {
								settheme(theme === "dark" ? "light" : "dark");
							}}
						>
							{theme === "dark" ? <LightSvg /> : <DarkSvg />}
						</ListItemButton>
					</ListItem> */}
				</List>
			</div>
		</div>
	);
}

export default App;
