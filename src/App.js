import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./styles/css/App.css";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";

import { ReactComponent as DarkSvg } from "./svg/sun.svg";
import { ReactComponent as LightSvg } from "./svg/sun-light.svg";

function App() {
	const [theme, settheme] = useState("dark");

	return (
		<div className={`App ${theme}`}>
			<Outlet />

			<div className="nav">
				<div className="menu">
					<Menu>
						<MenuItem>Report</MenuItem>
					</Menu>
				</div>
				<div className="controls">
					<Button
						// id="basic-demo-button"
						// aria-controls={ "basic-menu" }
						// aria-haspopup="true"
						// aria-expanded={ "true" }
						// variant="outlined"
						// color="neutral"
						onClick={() => {
							settheme(theme === "dark" ? "light" : "dark");
						}}
					>
						{theme === "dark" ? <LightSvg /> : <DarkSvg />}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default App;
