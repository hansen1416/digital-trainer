import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./pages/ErrorPage";
import DigitalTrainer from "./pages/DigitalTrainer";
import TrainingBuilder from "./pages/TrainingBuilder";
import TrainingExplore from "./pages/TrainingExplore";
import TrainingReport from "./pages/TrainingReport";

const routes = [
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/training-report",
				element: <TrainingReport />,
			},
			{
				path: "/training-builder",
				element: <TrainingBuilder />,
			},
			{
				path: "/training-explore",
				element: <TrainingExplore />,
			},
			{
				path: "/digital-trainer",
				element: <DigitalTrainer />,
			},
		],
	},
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<RouterProvider router={router} />
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
