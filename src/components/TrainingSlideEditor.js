import { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";

export default function TrainingSlideEditor({ trainingData, settrainingData }) {
	const kasten = useRef(null);

	const [itemWidth, setitemWidth] = useState(0);
	const trainingDataRef = useRef(null);

	useEffect(() => {
		let resizeObserver;
		// watch box size change and set size for individual block
		if (kasten.current) {
			// wait for the elementRef to be available
			resizeObserver = new ResizeObserver(([ResizeObserverEntry]) => {
				// Do what you want to do when the size of the element changes
				const width = parseInt(
					ResizeObserverEntry.contentRect.width / 6
				);

				setitemWidth(width);
			});
			resizeObserver.observe(kasten.current);
		}
	}, []);

	return (
		<div className="training-slide-editor" ref={kasten}>
			{trainingData && trainingData.name && <section></section>}
		</div>
	);
}
