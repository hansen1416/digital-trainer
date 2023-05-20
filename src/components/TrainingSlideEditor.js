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

	useEffect(() => {
		if (
			trainingDataRef.current &&
			(!trainingDataRef.current.exercises ||
				trainingDataRef.current.exercises.length !==
					trainingData.exercises.length)
		) {
			calculateTrainingInfo(trainingData);
		}

		trainingDataRef.current = trainingData;
		// eslint-disable-next-line
	}, [trainingData]);

	return (
		<div className="training-slide-editor" ref={kasten}>
			{trainingData && trainingData.name && (
				<section>
					<div className="title">
						<div>
							<div className="name">
								<span>
									name:{" "}
									<input
										value={trainingData.name}
										onChange={(e) => {
											const tmp = cloneDeep(trainingData);

											tmp.name = e.target.value;

											settrainingData(tmp);
										}}
									/>
								</span>
							</div>
							<div className="stats">
								<span>
									duration:{" "}
									{roundToTwo(trainingData.duration)}
								</span>
								<span>
									intensity:{" "}
									{roundToTwo(trainingData.intensity)}
								</span>
								<span>
									calories:{" "}
									{roundToTwo(trainingData.calories)}
								</span>
							</div>
							<div>
								<MusclePercentage
									musclesPercent={trainingData.muscle_groups}
								/>
							</div>
						</div>
						<div className="operation">
							<Button
								variant="primary"
								onClick={() => {
									// todo, save to API
									window.localStorage.setItem(
										"mytraining",
										JSON.stringify(trainingData)
									);

									alert("Training Saved, let's try it!");
								}}
							>
								Save to my list
							</Button>
						</div>
					</div>
					<Splide
						options={{
							type: "slide",
							focus: 0,
							perMove: 1,
							fixedWidth: itemWidth,
							// fixedHeight: 200,
							gap: 10,
							arrows: false,
							rewind: true,
							pagination: false,
						}}
					>
						{Boolean(trainingData && trainingData.exercises) &&
							trainingData.exercises.map((exercise, idx) => {
								return (
									<SplideSlide key={idx}>
										<div
											style={{
												width: itemWidth,
												height: "100%",
											}}
										>
											<div
												style={{
													width: itemWidth,
													height: itemWidth,
												}}
											>
												<img
													style={{
														width: "100%",
														height: "100%",
													}}
													src={
														process.env.PUBLIC_URL +
														"/data/imgs/" +
														exercise.name +
														".png"
													}
													alt=""
												/>
											</div>
											<div>
												<div className="num-control">
													<span>reps: </span>
													<span>
														<InputIncreaseDecrease
															value={
																exercise.reps
															}
															onChange={(v) => {
																updateExercise(
																	idx,
																	{ reps: v }
																);
															}}
														/>
													</span>
												</div>
												<div className="num-control">
													<span>rest: </span>
													<span>
														<InputIncreaseDecrease
															value={
																exercise.rest
															}
															onChange={(v) => {
																updateExercise(
																	idx,
																	{ rest: v }
																);
															}}
														/>
													</span>
												</div>
											</div>
										</div>
									</SplideSlide>
								);
							})}
					</Splide>
				</section>
			)}
		</div>
	);
}
