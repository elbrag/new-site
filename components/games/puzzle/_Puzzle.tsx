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
	Body,
	Events,
} from "matter-js";
import { throttle, debounce } from "lodash";
import Button from "@/components/ui/Button";
import SvgImage, { SvgImageMotifs } from "@/components/ui/SvgImage";

interface Coord {
	x: number;
	y: number;
}

interface SteeringCoords {
	bottomLeft: Coord;
	topRight: Coord;
}
interface PuzzlePiece {
	id: number;
	url: string;
	width: number;
	height: number;
	steeringCoords: SteeringCoords;
	symmetrical?: boolean;
}

interface CustomMatterBody extends Body {
	steeringCoords?: SteeringCoords;
	originalWidth?: number;
	originalHeight?: number;
}

const Puzzle: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Engine>(Engine.create());
	const refImageRef = useRef<HTMLDivElement>(null);
	const [restart, setRestart] = useState<boolean>(false);

	const wallThickness = 5;

	const refImgOriginalWidth = 600;
	const refImgOriginalHeight = 215;

	// Define collision categories
	const wallCategory = 0x0001;
	const pieceCategory = 0x0002;

	const [guides, setGuides] = useState<Coord[]>([]);

	/**
	 * Puzzle pieces
	 */
	const svgs: PuzzlePiece[] = [
		{
			id: 1,
			url: "/static/images/puzzle/piece_1_4.svg",
			width: 249,
			height: 53,
			steeringCoords: {
				bottomLeft: { x: 0, y: 53 },
				topRight: { x: 249, y: 0 },
			},
			symmetrical: true,
		},
		{
			id: 2,
			url: "/static/images/puzzle/piece_2.svg",
			width: 300,
			height: 134,
			steeringCoords: {
				bottomLeft: { x: 300, y: 133.5 },
				topRight: { x: 600, y: 0 },
			},
		},
		{
			id: 3,
			url: "/static/images/puzzle/piece_3.svg",
			width: 300,
			height: 54,
			steeringCoords: {
				bottomLeft: { x: 0, y: 133.5 },
				topRight: { x: 300, y: 90.5 },
			},
		},
		{
			id: 4,
			url: "/static/images/puzzle/piece_1_4.svg",
			width: 249,
			height: 53,
			steeringCoords: {
				bottomLeft: { x: 0, y: 214 },
				topRight: { x: 249, y: 171 },
			},
			symmetrical: true,
		},
		{
			id: 5,
			url: "/static/images/puzzle/piece_5.svg",
			width: 246,
			height: 69,
			steeringCoords: {
				bottomLeft: { x: 354, y: 214 },
				topRight: { x: 600, y: 145 },
			},
		},
	];

	const createGuideline = (coord: Coord) => {
		setGuides((prevGuides) => [...prevGuides, coord]);
	};

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
			const interactiveStateResult = setInteractiveState(
				canvas,
				engine,
				world,
				imageStartX,
				imageStartY
			);
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
			engine.world,
			imageStartX,
			imageStartY
		);
		const newRemoveDragEvent = interactiveStateResult.removeEvent;

		// Clean up the previous drag event
		if (removeDragEvent) {
			removeDragEvent();
		}
		removeDragEvent = newRemoveDragEvent;
	};

	/**
	 * Get basic (canvas and reference image) dimensions
	 */
	const getBasicDimensions = (
		canvas: HTMLCanvasElement,
		refImg: HTMLDivElement
	) => {
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const refImgWidth = refImg.clientWidth;
		const refImgHeight = refImg.clientHeight;

		// Calculate scale factor based on original dimensions
		const sizeScale =
			refImgWidth < refImgOriginalWidth
				? refImgWidth / refImgOriginalWidth
				: undefined;

		return { canvasWidth, canvasHeight, refImgWidth, refImgHeight, sizeScale };
	};

	/**
	 * Calculate starting coords for ref image
	 */
	const getImageStartCoords = (
		canvasWidth: number,
		canvasHeight: number,
		refImgWidth: number,
		refImgHeight: number
	) => {
		const imageStartX = (canvasWidth - refImgWidth) / 2;
		const imageStartY = (canvasHeight - refImgHeight) / 2;
		return { imageStartX, imageStartY };
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
		world: World,
		imageStartX: number,
		imageStartY: number
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

				const draggedPiecePosition = draggedPiece.position;

				// Dimensions
				const width = draggedPiece.originalWidth;
				const height = draggedPiece.originalHeight;

				// Get corners
				const bottomLeftCurrent = {
					x: draggedPiecePosition.x - width / 2,
					y: draggedPiecePosition.y + height / 2,
				};
				const topRightCurrent = {
					x: draggedPiecePosition.x + width / 2,
					y: draggedPiecePosition.y - height / 2,
				};

				const bottomLeftTarget = {
					x: draggedPiece.steeringCoords.bottomLeft.x,
					y: draggedPiece.steeringCoords.bottomLeft.y,
				};

				const topRightTarget = {
					x: draggedPiece.steeringCoords.topRight.x,
					y: draggedPiece.steeringCoords.topRight.y,
				};

				// Check if target coords match current coords by comparing corners, x and y
				if (
					checkIfCoordsAreWithinErrorMargin(
						bottomLeftCurrent.x,
						bottomLeftTarget.x
					) &&
					checkIfCoordsAreWithinErrorMargin(
						bottomLeftCurrent.y,
						bottomLeftTarget.y
					) &&
					checkIfCoordsAreWithinErrorMargin(
						topRightCurrent.y,
						topRightTarget.y
					) &&
					checkIfCoordsAreWithinErrorMargin(topRightCurrent.x, topRightTarget.x)
				) {
					console.log("IT fits!", draggedPiece);
					draggedPiece.isStatic = true;
					draggedPiece.position.x = bottomLeftTarget.x + width / 2;
					draggedPiece.position.y = topRightTarget.y + height / 2;
					draggedPiece.angle = 0;
				}
			}
		}, 600);

		// Event listener: track the dragging coords
		Events.on(mouseConstraint, "mousemove", handleMouseMove);

		// Remove event, return to be used along with other cleanups
		return {
			removeEvent: () =>
				Events.off(mouseConstraint, "mousemove", handleMouseMove),
		};
	};

	/**
	 * Check if compared coord values are within error margin of each other
	 */
	const checkIfCoordsAreWithinErrorMargin = (
		coordValue1: number,
		coordValue2: number
	): boolean => {
		const errorMargin = 10;

		return Math.abs(coordValue1 - coordValue2) <= errorMargin;
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
						mask: pieceCategory, // Only collide with puzzle pieces
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

		svgs.forEach((svg, i) => {
			const svgWidth = svg.width * scale;
			const svgHeight = svg.height * scale;

			const scaledTopRightX = svg.steeringCoords.topRight.x * scale;
			const scaledBottomLeftY = svg.steeringCoords.bottomLeft.y * scale;

			const x = imageStartX + scaledTopRightX - svgWidth / 2;
			const y = imageStartY + scaledBottomLeftY - svgHeight / 2;

			const body: CustomMatterBody = Bodies.rectangle(
				x,
				y,
				svgWidth,
				svgHeight,
				{
					restitution: 1,
					friction: 0.8,
					render: {
						sprite: {
							texture: svg.url,
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
					y: imageStartY + svg.steeringCoords.topRight.y * scale,
				},
				bottomLeft: {
					x: imageStartX + svg.steeringCoords.bottomLeft.x * scale,
					y: imageStartY + scaledBottomLeftY,
				},
			};

			body.originalWidth = svgWidth;
			body.originalHeight = svgHeight;
			Composite.add(world, body);
			createGuideline(body.steeringCoords.topRight);
			createGuideline(body.steeringCoords.bottomLeft);
		});
	};

	/**
	 * Reset pieces
	 */
	const resetPieces = () => {
		setRestart(true);
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
							className="absolute w-4 h-4 bg-military"
							style={{ top: guide.y + "px", left: guide.x + "px" }}
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
