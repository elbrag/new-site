import React, { useEffect, useRef, useState } from "react";

import {
	Bodies,
	Engine,
	Render,
	Composite,
	World,
	Runner,
	Mouse,
	MouseConstraint,
	Events,
} from "matter-js";
import { throttle, debounce } from "lodash";
import Button from "@/components/ui/Button";
import SvgImage, { SvgImageMotifs } from "@/components/ui/SvgImage";
import usePuzzleFunctions from "@/hooks/games/usePuzzleFunctions";
import {
	Coord,
	CustomMatterBody,
	Guide,
	PuzzlePiece,
} from "@/lib/types/puzzle";
// import { getRandomColor } from "@/lib/helpers/effects";

const Puzzle: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Engine>(Engine.create());
	const refImageRef = useRef<HTMLDivElement>(null);
	const [restart, setRestart] = useState<boolean>(false);
	const [guides, setGuides] = useState<Guide[]>([]);

	const {
		puzzlePieces,
		refImgOriginalWidth,
		refImgOriginalHeight,
		getImageStartCoords,
		getBasicDimensions,
		checkIfFit,
	} = usePuzzleFunctions();

	const wallThickness = 5;

	// Collision categories
	const wallCategory = 0x0001;
	const pieceCategory = 0x0002;

	/**
	 * On first render (init game)
	 */
	useEffect(() => {
		setRestart(false);
		// Define canvas, reference image, and engine and check that they exist
		const canvas = canvasRef.current;
		const refImg = refImageRef.current;
		const engine = engineRef.current;
		if (!canvas || !engine || !refImg) return;

		setupCanvas(canvas);
		const { canvasWidth, canvasHeight, refImgWidth, refImgHeight, sizeScale } =
			getBasicDimensions(canvas, refImg);
		const { imageStartX, imageStartY } = getImageStartCoords(
			canvasWidth,
			canvasHeight,
			refImgWidth,
			refImgHeight
		);

		// Renderer
		const render = Render.create({
			canvas,
			engine: engine,
			options: {
				width: canvasWidth,
				height: canvasHeight,
				wireframes: false,
				background: "transparent",
			},
		});

		// Composite
		const world = engine.world;

		// Elements
		addWalls(world, canvasWidth, canvasHeight);
		addShapes(world, imageStartX, imageStartY, sizeScale);

		// Initial state (pieces in place)
		setInitialState(engine);

		// Interactive state (gravity activated, pieces fall down)
		let removeDragEvent: (() => void) | undefined;
		setTimeout(() => {
			const interactiveStateResult = setInteractiveState(canvas, engine, world);
			removeDragEvent = interactiveStateResult.removeEvent;
		}, 1500);

		// Run the engine and render
		Render.run(render);
		const runner = Runner.create();
		Runner.run(runner, engine);

		// Resize event listener
		const debouncedResize = debounce(
			() => resizeHandler(canvas, refImg, engine, removeDragEvent),
			1000
		);
		window.addEventListener("resize", debouncedResize);

		// Clean up
		return () => {
			Composite.clear(world, false);
			Engine.clear(engine);
			Render.stop(render);
			if (removeDragEvent) {
				removeDragEvent(); // Clean up the drag event
			}
			window.removeEventListener("resize", debouncedResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [restart]);

	/**
	 * Resize handler for the canvas
	 */
	const resizeHandler = (
		canvas: HTMLCanvasElement,
		refImg: HTMLDivElement,
		engine: Engine,
		removeDragEvent: (() => void) | undefined
	) => {
		Composite.clear(engine.world, false);

		// Get updated dimensions
		setupCanvas(canvas);
		const { refImgWidth, refImgHeight, sizeScale } = getBasicDimensions(
			canvas,
			refImg
		);
		const { imageStartX, imageStartY } = getImageStartCoords(
			canvas.width,
			canvas.height,
			refImgWidth,
			refImgHeight
		);

		// Re-add walls and puzzle pieces
		addWalls(engine.world, canvas.width, canvas.height);
		addShapes(engine.world, imageStartX, imageStartY, sizeScale);

		// Reset the interactive state
		const interactiveStateResult = setInteractiveState(
			canvas,
			engine,
			engine.world
		);
		const newRemoveDragEvent = interactiveStateResult.removeEvent;

		// Clean up the previous drag event
		if (removeDragEvent) {
			removeDragEvent();
		}
		removeDragEvent = newRemoveDragEvent;
	};

	/**
	 * Setup canvas dimensions
	 */
	const setupCanvas = (canvas: HTMLCanvasElement) => {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	};

	/**
	 * Set initial state
	 */
	const setInitialState = (engine: Engine) => {
		engine.gravity.y = 0;
	};

	/**
	 * Set interactive state
	 */
	const setInteractiveState = (
		canvas: HTMLCanvasElement,
		engine: Engine,
		world: World
	): {
		removeEvent: () => void;
	} => {
		engine.gravity.y = 1;

		// Mouse
		const mouse = Mouse.create(canvas);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
		});
		// Add mouse constraint to the world
		Composite.add(world, mouseConstraint);

		/**
		 * Handle mouse move
		 */
		const handleMouseMove = throttle(() => {
			if (mouseConstraint.body) {
				const draggedPiece: CustomMatterBody = mouseConstraint.body;
				if (
					!draggedPiece.steeringCoords ||
					!draggedPiece.originalWidth ||
					!draggedPiece.originalHeight
				)
					return;

				// Dimensions
				const width = draggedPiece.originalWidth;
				const height = draggedPiece.originalHeight;

				const bottomLeftTarget = {
					x: draggedPiece.steeringCoords.bottomLeft.x,
					y: draggedPiece.steeringCoords.bottomLeft.y,
				};

				const topRightTarget = {
					x: draggedPiece.steeringCoords.topRight.x,
					y: draggedPiece.steeringCoords.topRight.y,
				};

				const itFits = checkIfFit(
					draggedPiece,
					bottomLeftTarget,
					topRightTarget
				);

				if (itFits) {
					draggedPiece.isStatic = true;
					draggedPiece.position.x = bottomLeftTarget.x + width / 2;
					draggedPiece.position.y = topRightTarget.y + height / 2;
					draggedPiece.angle = 0;
				}
			}
		}, 600);

		// Event listener tracking drag coords
		Events.on(mouseConstraint, "mousemove", handleMouseMove);

		// Remove event, return to be used along with other cleanups
		return {
			removeEvent: () =>
				Events.off(mouseConstraint, "mousemove", handleMouseMove),
		};
	};

	/**
	 * Add walls
	 */
	const addWalls = (
		world: World,
		canvasWidth: number,
		canvasHeight: number
	) => {
		const yZero = canvasHeight / 2;
		const xZero = canvasWidth / 2;
		const wallDefs: [number, number, number, number][] = [
			[xZero, 0, canvasWidth, wallThickness],
			[canvasWidth, yZero, wallThickness, canvasHeight],
			[xZero, canvasHeight, canvasWidth, wallThickness],
			[0, yZero, wallThickness, canvasHeight],
		];
		wallDefs.forEach((wallDef) => {
			Composite.add(
				world,
				Bodies.rectangle(...wallDef, {
					isStatic: true,
					label: "wall",
					render: {
						fillStyle: "#5EFC5B",
						// lineWidth: 1,
						strokeStyle: "white",
						visible: true,
					},
					collisionFilter: {
						category: wallCategory,
						mask: pieceCategory, // Collides with puzzle pieces
					},
				})
			);
		});
	};

	/**
	 * Add shapes
	 */
	const addShapes = (
		world: World,
		imageStartX: number,
		imageStartY: number,
		sizeScale?: number
	) => {
		const scale = sizeScale ?? 1;

		puzzlePieces.forEach((piece, i) => {
			const pieceWidth = piece.width * scale;
			const pieceHeight = piece.height * scale;

			const scaledTopRightX = piece.steeringCoords.topRight.x * scale;
			const scaledBottomLeftY = piece.steeringCoords.bottomLeft.y * scale;

			const x = imageStartX + scaledTopRightX - pieceWidth / 2;
			const y = imageStartY + scaledBottomLeftY - pieceHeight / 2;

			const body: CustomMatterBody = Bodies.rectangle(
				x,
				y,
				pieceWidth,
				pieceHeight,
				{
					restitution: 1,
					friction: 0.8,
					render: {
						sprite: {
							texture: piece.url,
							yScale: scale,
							xScale: scale,
						},
					},
					collisionFilter: {
						category: pieceCategory,
						mask: wallCategory, // Collides with walls
					},
				}
			);
			body.steeringCoords = {
				topRight: {
					x: imageStartX + scaledTopRightX,
					y: imageStartY + piece.steeringCoords.topRight.y * scale,
				},
				bottomLeft: {
					x: imageStartX + piece.steeringCoords.bottomLeft.x * scale,
					y: imageStartY + scaledBottomLeftY,
				},
			};

			body.originalWidth = pieceWidth;
			body.originalHeight = pieceHeight;
			body.symmetrical = piece.symmetrical;
			Composite.add(world, body);

			// const guideColor = getRandomColor();
			// createGuideline(body.steeringCoords.topRight, guideColor);
			// createGuideline(body.steeringCoords.bottomLeft, guideColor);
		});
	};

	/**
	 * Reset pieces
	 */
	const resetPieces = () => {
		setRestart(true);
	};

	/**
	 * Create guidelines, helpful for debugging
	 */
	const createGuideline = (coord: Coord, color: string) => {
		setGuides((prevGuides) => [...prevGuides, { coord: coord, color: color }]);
	};

	return (
		<div className="px-6 lg:px-12">
			<div className="h-70vh">
				<div className="relative z-0 h-full bg-paper">
					<canvas
						ref={canvasRef}
						width={600}
						height={400}
						className="border w-full h-full"
					/>
					<div className="reference-image absolute w-full h-full left-0 top-0 -z-1 flex justify-center items-center">
						<div ref={refImageRef} className="max-w-[90%]">
							<SvgImage
								image={SvgImageMotifs.FullLogo}
								width={refImgOriginalWidth}
								height={refImgOriginalHeight}
							/>
						</div>
					</div>
					{guides.map((guide, i) => (
						<div
							className="absolute w-4 h-4 "
							style={{
								top: guide.coord.y + "px",
								left: guide.coord.x + "px",
								backgroundColor: guide.color,
							}}
							key={i}
						></div>
					))}
				</div>
			</div>
			<Button label="Reset" onClick={resetPieces} />
		</div>
	);
};

export default Puzzle;
