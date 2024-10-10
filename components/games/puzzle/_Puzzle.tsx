import React, { useEffect, useRef, useState } from "react";
import FullLogo from "../../../public/static/images/puzzle/full_logo.svg";

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
import { throttle } from "lodash";
import Button from "@/components/ui/Button";

interface SteeringCoords {
	bottomLeft: { x: number; y: number };
	topRight: { x: number; y: number };
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

	// Define collision categories
	const wallCategory = 0x0001;
	const pieceCategory = 0x0002;

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

	/**
	 * On first render (init game)
	 */
	useEffect(() => {
		setRestart(false);
		// Define canvas, refernce image and engine and check that they exist
		const canvas = canvasRef.current;
		const refImg = refImageRef.current;
		const engine = engineRef.current;
		if (!canvas || !engine || !refImg) return;
		resizeCanvas();

		// Determine canvas dimensions
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		// Determine ref image dimensions
		const refImgWidth = refImg.clientWidth;
		const refImgHeight = refImg.clientHeight;
		// Define image starting coords
		const imageStartX = (canvasWidth - refImgWidth) / 2;
		const imageStartY = (canvasHeight - refImgHeight) / 2;

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
		addShapes(world, imageStartX, imageStartY);

		// Initial state (pieces in place)
		setInitialState(engine);

		let removeDragEvent: (() => void) | undefined;

		// Interactive state (gravity activated, pieces fall down)
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

		// Event listener: resize
		const onResize = throttle(() => {
			resizeCanvas(render, world);
		}, 1000);
		window.addEventListener("resize", onResize);

		// Clean up
		return () => {
			Composite.clear(world, false);
			Engine.clear(engine);
			Render.stop(render);
			if (removeDragEvent) {
				removeDragEvent();
			}
			window.removeEventListener("resize", onResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [restart]);

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
					x: imageStartX + draggedPiece.steeringCoords.bottomLeft.x,
					y: imageStartY + draggedPiece.steeringCoords.bottomLeft.y,
				};

				const topRightTarget = {
					x: imageStartX + draggedPiece.steeringCoords.topRight.x,
					y:
						imageStartY +
						draggedPiece.steeringCoords.topRight.y -
						wallThickness * 1.5,
				};

				console.log(
					"topRightCurrent.y:",
					topRightCurrent.y,
					"topRightTarget.y:",
					topRightTarget.y,
					"Difference:",
					Math.abs(topRightCurrent.y - topRightTarget.y)
				);

				console.log(
					"bottomLeftCurrent.y:",
					bottomLeftCurrent.y,
					"bottomLeftTarget.y:",
					bottomLeftTarget.y,
					"Difference:",
					Math.abs(bottomLeftCurrent.y - bottomLeftTarget.y)
				);

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
					console.log("IT fits!");
					draggedPiece.isStatic = true;
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
		const errorMargin = 5;

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
		imageStartY: number
	) => {
		svgs.forEach((svg, i) => {
			const x = imageStartX + (svg.steeringCoords.topRight.x - svg.width / 2);
			const y =
				imageStartY + (svg.steeringCoords.bottomLeft.y - svg.height / 2);
			const w = svg.width;
			const h = svg.height;
			const body: CustomMatterBody = Bodies.rectangle(x, y, w, h, {
				restitution: 1,
				friction: 0.8,
				render: {
					sprite: {
						texture: svg.url,
						yScale: 1,
						xScale: 1,
					},
				},
				collisionFilter: {
					category: pieceCategory,
					mask: wallCategory, // Collides with walls (but no friction)
				},
			});
			body.steeringCoords = svg.steeringCoords;
			body.originalWidth = w;
			body.originalHeight = h;
			Composite.add(world, body);
		});
	};

	/**
	 * Reset pieces
	 */
	const resetPieces = () => {
		setRestart(true);
	};

	/**
	 * Resize canvas
	 */
	const resizeCanvas = (render?: Render, world?: World) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// Get current dimensions
		const prevWidth = canvas.width;
		const prevHeight = canvas.height;

		// Set new dimensions
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		if (render) {
			Render.stop(render);
			// Set render canvas size
			render.canvas.width = canvas.width;
			render.canvas.height = canvas.height;
			render.bounds.max.x = canvas.width;
			render.bounds.max.y = canvas.height;
		}

		// Calculate the scale factor for the objects in the world
		const scaleX = canvas.width / prevWidth;
		const scaleY = canvas.height / prevHeight;

		if (world) {
			// Loop through all bodies and scale them accordingly
			Composite.allBodies(world).forEach((body) => {
				Body.scale(body, scaleX, scaleY);
				Body.setPosition(body, {
					x: body.position.x * scaleX,
					y: body.position.y * scaleY,
				});
			});
		}

		if (render) {
			Render.run(render);
		}
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
						<div ref={refImageRef}>
							<FullLogo />
						</div>
					</div>
					<div className="guide w-4 h-4 absolute bg-military top-[236px] left-[379px]"></div>
				</div>
			</div>
			<Button label="Reset" onClick={resetPieces} />
		</div>
	);
};

export default Puzzle;
