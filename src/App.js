import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./styles/css/App.css";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListDivider from "@mui/joy/ListDivider";
import Avatar from "@mui/joy/Avatar";

// Default theme
// import '@splidejs/react-splide/css';
// or other themes
// import '@splidejs/react-splide/css/skyblue';
import "@splidejs/react-splide/css/sea-green";
// // or only core styles
import "@splidejs/react-splide/css/core";

import { metamaskLogin } from "./lib/ropes";
// import { ReactComponent as DarkSvg } from "./svg/sun.svg";
// import { ReactComponent as LightSvg } from "./svg/sun-light.svg";

function App() {
	const [theme, settheme] = useState("dark");

	useEffect(() => {
		console.log(window.ethereum);
	}, []);

	return (
		<div className={`App ${theme}`}>
			<Outlet />

			<div className="nav">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40px"
						height="40px"
						viewBox="0 0 100 100"
					>
						<g fill="#ffffff">
							<path d="M98.138,81.078c-0.292,0.797-1.009,1.156-2.032,1.235c-1.833-0.086-4.396-1.049-7.253-2.112    c-0.245-0.093-0.484-0.179-0.737-0.272c-1.129-0.411-2.059-0.717-2.749-0.922c-0.04-0.014-0.08-0.027-0.12-0.034    c-0.996-0.232-2.151-0.372-4.104-0.444c-0.718-0.027-28.932-3.255-28.932-3.255l-2.823-0.445l-3.945-0.764l-19.169-3.779    l-3.739-1.009c0-0.007-0.007-0.021-0.007-0.027c-1.454-0.478-2.716-1.282-3.646-2.305c-0.007,0.007-0.013,0.02-0.02,0.026    c-0.372-0.404-0.299-0.465-0.744-0.943l-3.66-4.351c-0.052,3.136-0.305,17.761-0.292,17.788c-0.006,0.02-0.013,0.04-0.026,0.053    c-0.026,0.04-0.086,0.086-0.086,0.179c0,0.007,0,0.007-0.007,0.014c-0.319,0.585-0.817,0.837-0.817,0.844    c-0.119,0.306-2.072,1.753-2.816,1.78H1.897c-0.372,0-0.16-0.824-0.146-1.189c0.061-1.382,3.514-2.962,7.619-2.962    c0.22,0,0.445,0.007,0.671,0.02c0.066,0,0.266,0.014,0.405,0.021L8.957,61.571v-0.007l-0.199-2.226l-0.033-0.505l-0.279-4.117    l-0.007-0.1c-0.106-0.073-0.206-0.153-0.312-0.239c-0.006-0.007-0.02-0.014-0.026-0.021l-1.195-1.254    c-0.651-0.871-1.143-1.934-1.402-3.116c-0.006-0.014-0.014-0.026-0.014-0.046c-0.052-0.445-0.113-0.863-0.179-1.262    c0-0.014,0-0.027-0.006-0.034c-0.558-3.233-1.515-5.094-1.328-8.747c0.086-1.641,2.165-6.303,2.829-6.954    c0.658-0.658,1.86-1.66,2.962-2.251c1.109-0.598,2.471-1.236,2.896-3.189c0.092-0.411,0.158-0.79,0.158-0.962    c-0.006-0.512-0.757-0.897-1.314-0.963c-0.552-0.073-1.621-0.18-2.126-0.432c-0.71-0.365-1.301-1.275-1.275-2.317    c0.027-0.977,0.883-2.504,1.083-2.989c0.021-0.04,0.033-0.067,0.047-0.087c0.418-0.764,1.435-2.577,1.674-2.969    c1.269-2.072,2.019-2.611,2.039-2.617c0.345-0.338,1.096-0.81,1.681-1.135c1.361-0.745,3.161-1.369,4.396-1.401    c3.979-0.114,5.898,1.361,7.141,3.68c0.717,1.328,0.989,2.81,0.876,4.224v0.1c-0.013,0.113-0.026,0.226-0.04,0.338    c-0.02,0.113-0.032,0.219-0.053,0.332c-0.014,0.06-0.021,0.12-0.04,0.179c-0.372,1.914-1.448,3.627-3.055,4.57    c-1.202,0.704-2.073,0.969-2.743,1.075c-0.087,0.04-0.18,0.074-0.279,0.106c-1.209,0.366-1.787,0.983-2.079,1.807    c-0.266,0.73-0.531,1.826-0.458,2.265c0,0.007,0,0.007,0,0.007c0.014,0.053,0.026,0.093,0.047,0.125    c0.053,0.081,0.099,0.167,0.146,0.253c0.113,0.265,0.226,0.551,0.319,0.856c0.624,1.926,0.83,4.543,0.584,6.529l-1.123,9.512    l-0.013,0.126c0.033,0.053,0.066,0.1,0.113,0.153v0.006l0.006,0.014c0.697,0.977,1.768,2.032,2.83,3.215    c0.737,0.816,2.856,3.288,3.992,4.623c0.139-0.007,0.278-0.007,0.425-0.007c3.593,0,6.654,1.873,7.87,4.503l17.488,6.044    c0.04,0.008,0.073,0.014,0.113,0.027l1.063,0.206h0.02l0.021,0.006l30.068,8.396c0.099-0.173,0.205-0.325,0.332-0.445    c0.02-0.02,0.039-0.039,0.06-0.053c0.192-0.166,0.412-0.252,0.644-0.272c0.153-0.021,0.319-0.007,0.479,0.061l8.528,3.261    l5.479,2.099C98.563,79.85,98.317,80.587,98.138,81.078z"></path>
						</g>
					</svg>
				</div>
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
							onClick={() => {
								metamaskLogin().then((result) => {
									console.log(result);
								});
							}}
						>
							<Avatar
								alt="MetaMask"
								src="/svg/MetaMask_Fox.svg"
							/>
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
