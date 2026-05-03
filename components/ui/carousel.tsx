// "use client";
//
// type CarouselProps = {
// 	orientation?: "horizontal" | "vertical";
// };
//
// import {
// 	ComponentProps,
// 	createContext,
// 	RefObject,
// 	useContext,
// 	useState,
// } from "react";
//
// import styles from "./LocalIssuesCarousel.module.scss";
//
// type CarouselContextProps = {
// 	carouselRef: RefObject<HTMLDivElement>;
// 	orientation: CarouselProps["orientation"];
// };
// const CarouselContext = createContext<CarouselContextProps | null>(null);
// const useCarousel = () => {
// 	const context = useContext(CarouselContext);
//
// 	if (!context) {
// 		throw new Error("useCarousel must be used within a CarouselProvider");
// 	}
//
// 	return context;
// };
//
// export const CarouselProvider = () => {
// 	const [currentIndex, setCurrentIndex] = useState(0);
// 	const totalSlides = slides.length;
//
// 	const showSlide = (index: number) => {
// 		// Ensure index is within bounds
// 		if (index >= totalSlides) setCurrentIndex(0);
// 		else if (index < 0) setCurrentIndex(totalSlides - 1);
// 		else setCurrentIndex(index);
// 	};
//
// 	const moveCarousel = (direction: number) => {
// 		showSlide(currentIndex + direction);
// 	};
//
// 	const currentSlide = (index: number) => {
// 		showSlide(index - 1);
// 	};
//
// 	return (
// 		<div className={styles.carouselContainer}>
// 			<div
// 				className={styles.carouselImages}
// 				style={{
// 					transform: `translateX(-${currentIndex * 100}%)`,
// 				}}
// 			>
// 				{slides.map((slide, index) => {
// 					return (
// 						<img
// 							key={index}
// 							src={slide.image}
// 							alt={slide.title}
// 							className={styles.carouselImage}
// 						/>
// 					);
// 				})}
// 			</div>
// 			<button
// 				className={`${styles.carouselNav} ${styles.carouselPrev}`}
// 				onClick={() => moveCarousel(-1)}
// 			>
// 				❮
// 			</button>
// 			<button
// 				className={`${styles.carouselNav} ${styles.carouselNext}`}
// 				onClick={() => moveCarousel(1)}
// 			>
// 				❯
// 			</button>
// 			<div className={styles.carouselDots}>
// 				{slides.map((_, index) => {
// 					return (
// 						<button
// 							key={index}
// 							className={
// 								currentIndex === index
// 									? `${styles.carouselDot} ${styles.active}`
// 									: styles.carouselDot
// 							}
// 							onClick={() => currentSlide(index + 1)}
// 						/>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// };
//
// export const CarouselContent = ({ ...props }: ComponentProps<"div">) => {
// 	const { carouselRef, orientation } = useCarousel();
//
// 	return (
// 		<div
// 			ref={carouselRef}
// 			className={"overflow-hidden"}
// 			data-slot={"carousel-content"}
// 		>
// 			<div
// 				className={`flex ${orientation === "horizontal" ? "ml-4" : "mt-4 flex-col"}`}
// 				{...props}
// 			/>
// 		</div>
// 	);
// };
//
// export const CarouselItem = ({ ...props }: ComponentProps<"div">) => {
// 	const { orientation } = useCarousel();
//
// 	return (
// 		<div
// 			role={"group"}
// 			aria-roledescription={"slide"}
// 			data-slot={"carousel-item"}
// 			className={`min-w-0 shrink-0 grow-0 basis-full ${orientation === "horizontal" ? "pl-4" : "pt-4"}`}
// 			{...props}
// 		/>
// 	);
// };
