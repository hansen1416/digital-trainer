import { useState } from "react";
import { Outlet } from "react-router-dom";

import { ReactComponent as DarkSvg } from "./svg/sun.svg";
import { ReactComponent as LightSvg } from "./svg/sun-light.svg";

function App() {
	const [theme, settheme] = useState("dark");

	return (
		<div className={`App ${theme}`}>
			<Outlet />
		</div>
	);
}

export default App;
