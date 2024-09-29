import React, { useCallback, useEffect, useRef, useState } from "react";
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
} from "matter-js";
import { throttle } from "lodash";

const Puzzle: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Engine>(Engine.create());

	/**
	 * On first render
	 */
	useEffect(() => {
		// Define canvas + engine and check that they exist
		const canvas = canvasRef.current;
		if (!canvas) return;
		resizeCanvas();
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
				background: "transparent",
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

		const onResize = throttle(() => {
			resizeCanvas(render);
		}, 1000);
		window.addEventListener("resize", onResize);

		// Clean up
		return () => {
			Composite.clear(world, false);
			Engine.clear(engine);
			Render.stop(render);
			window.removeEventListener("resize", onResize);
		};
	}, []);

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

	/**
	 * Add shapes
	 */
	const addShapes = useCallback(
		(world: World, canvasWidth: number, canvasHeight: number) => {
			const svgs = [
				{ url: "/static/images/puzzle/piece_1_4.svg", width: 249, height: 53 },
				{ url: "/static/images/puzzle/piece_2.svg", width: 300, height: 134 },
				{ url: "/static/images/puzzle/piece_3.svg", width: 300, height: 54 },
				{ url: "/static/images/puzzle/piece_1_4.svg", width: 249, height: 53 },
				{ url: "/static/images/puzzle/piece_5.svg", width: 246, height: 69 },
			];
			svgs.forEach((svg) => {
				const body = Bodies.rectangle(
					canvasWidth / 2,
					canvasHeight / 2,
					svg.width,
					svg.height,
					{
						restitution: 1,
						friction: 0.8,
						render: {
							sprite: {
								texture: svg.url,
								yScale: 1,
								xScale: 1,
							},
						},
					}
				);
				Composite.add(world, body);
			});
		},
		[]
	);

	/**
	 * Resize canvas
	 */
	const resizeCanvas = (render?: Render) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		if (render) {
			Render.stop(render);
			render.canvas.width = window.innerWidth;
			render.canvas.height = window.innerHeight;
			Render.run(render);
		}
	};

	return (
		<div className="px-6 lg:px-12 h-70vh">
			Puzzle
			<div className="relative z-0 h-full bg-paper">
				<canvas
					ref={canvasRef}
					width={600}
					height={400}
					className="border w-full h-full"
				/>
				<div className="reference-image absolute w-full h-full left-0 top-0 -z-1 flex justify-center items-center">
					<FullLogo />
				</div>
			</div>
		</div>
	);
};

export default Puzzle;
