import React, { useCallback, useEffect, useRef } from "react";

import {
	Bodies,
	Engine,
	Render,
	Composite,
	World,
	Runner,
	Mouse,
	MouseConstraint,
	Svg,
} from "matter-js";

const Puzzle: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Engine>(Engine.create());

	/**
	 * Add walls
	 */
	const addWalls = useCallback(
		(world: World, canvasWidth: number, canvasHeight: number) => {
			const wallThickness = 5;
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
					})
				);
			});
		},
		[]
	);

	const addShapes = useCallback(
		(world: World, canvasWidth: number, canvasHeight: number) => {
			const svgPaths = [
				"/static/images/puzzle/piece_1_4.svg",
				"/static/images/puzzle/piece_2.svg",
				"/static/images/puzzle/piece_3.svg",
				"/static/images/puzzle/piece_5.svg",
			];
			svgPaths.forEach((path) => {
				const body = Bodies.rectangle(
					canvasWidth / 2,
					canvasHeight / 2,
					300,
					140,
					{
						restitution: 1,
						friction: 0.8,
						render: {
							sprite: {
								texture: path,
								yScale: 1,
								xScale: 1,
							},
							fillStyle: "#F3ECE3",
						},
					}
				);
				Composite.add(world, body);
			});
		},
		[]
	);

	/**
	 * On first render
	 */
	useEffect(() => {
		// Define canvas, ctx, engine and check that they exist
		const canvas = canvasRef.current;
		if (!canvas) return;

		// const ctx = canvas.getContext("2d");
		const engine = engineRef.current;
		if (!engine) return;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;

		// Renderer
		const render = Render.create({
			canvas,
			engine: engine,
			options: {
				width: canvasWidth,
				height: canvasHeight,
				wireframes: false,
			},
		});

		// Composite
		const world = engine.world;

		// Elements
		addWalls(world, canvasWidth, canvasHeight);
		addShapes(world, canvasWidth, canvasHeight);

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

		// Run the engine and render
		Render.run(render);
		const runner = Runner.create();
		Runner.run(runner, engine);

		// Clean up
		return () => {
			Composite.clear(world, false);
			Engine.clear(engine);
			Render.stop(render);
		};
	}, []);

	return (
		<div className="px-6 lg:px-12">
			Puzzle
			<canvas
				ref={canvasRef}
				width={600}
				height={400}
				className="border bg-paper"
			/>
		</div>
	);
};

export default Puzzle;
