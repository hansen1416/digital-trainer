import { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";

export default function TrainingSlideEditor({ trainingData, settrainingData }) {
	return (
		<div className="training-slide-editor" ref={kasten}>
			{trainingData && trainingData.name && <section></section>}
		</div>
	);
}
