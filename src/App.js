import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./styles/css/App.css";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListDivider from "@mui/joy/ListDivider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import { ReactComponent as DarkSvg } from "./svg/sun.svg";
import { ReactComponent as LightSvg } from "./svg/sun-light.svg";

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
							href="#horizontal-list"
						>
							Digital Trainer
						</ListItemButton>
					</ListItem>
					<ListDivider />
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							component="a"
							href="#horizontal-list"
						>
							Training Builder
						</ListItemButton>
					</ListItem>
					<ListDivider />
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							component="a"
							href="#horizontal-list"
							aria-label="Profile"
						>
							Training Explorer
						</ListItemButton>
					</ListItem>
					<ListDivider />
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
					</ListItem>
				</List>
			</div>
		</div>
	);
}

export default App;
