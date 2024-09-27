import React, { useCallback, useEffect, useRef } from "react";
import { Box, Vec2, World } from "planck-js";

const Puzzle: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const worldRef = useRef<World | null>(null);

	/**
	 * Ground
	 *
	 * Create and return
	 */
	const createAndReturnGround = useCallback(
		(world: World, canvasWidth: number, canvasHeight: number) => {
			const ground = world.createBody({
				type: "static",
				position: new Vec2(0, canvasHeight - 60),
			});
			ground.createFixture(new Box(canvasWidth, 10));
			return ground;
		},
		[]
	);

	/**
	 * Create walls around the canvas
	 *
	 * This function creates static bodies at the edges of the canvas.
	 */
	const createAndReturnWalls = useCallback(
		(world: planck.World, canvasWidth: number, canvasHeight: number) => {
			const wallsBody = world.createBody({ type: "static" });
			const wallHeight = 5;
			const wallSpecs = [
				{
					position: new Vec2(0, canvasHeight / 2),
					size: new Vec2(wallHeight, canvasHeight),
				}, // Left
				{
					position: new Vec2(canvasWidth - wallHeight, canvasHeight / 2),
					size: new Vec2(wallHeight, canvasHeight),
				}, // Right
				{
					position: new Vec2(0, wallHeight / 2),
					size: new Vec2(canvasWidth, wallHeight),
				}, // Bottom
				{
					position: new Vec2(0, canvasHeight - wallHeight / 2),
					size: new Vec2(canvasWidth, wallHeight),
				}, // Top
			];

			wallSpecs.forEach(({ position, size }) => {
				wallsBody.createFixture(new Box(size.x, size.y), {
					isSensor: false,
				});
			});

			return wallSpecs;
		},
		[]
	);

	/**
	 * On first render
	 *
	 * - Define canvas, world, objects
	 * - Run animation
	 */
	useEffect(() => {
		// Check that everything exists
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		// Set world
		const world = new World({ gravity: new Vec2(0, 9.8), allowSleep: true });
		worldRef.current = world;

		// Get canvas measurements
		const canvasHeight = canvas.height;
		const canvasWidth = canvas.width;

		// Create ground
		const walls = createAndReturnWalls(world, canvasWidth, canvasHeight);
		// const ground = createAndReturnGround(world, canvasWidth, canvasHeight);

		// Create a piece
		const piece = world.createBody({
			type: "dynamic",
			position: new Vec2(5, 5),
		});
		piece.createFixture({
			shape: new Box(1, 1),
			density: 1,
			friction: 0.5,
			restitution: 0.5,
		});

		let animationFrameId: number;

		// Animate
		const animate = () => {
			world.step(1 / 60); // Advance physics simulation at 60Hz

			// Clear the canvas
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			// Draw the walls
			ctx.fillStyle = "green"; // Change color for visibility
			walls.forEach(({ position, size }) => {
				ctx.fillRect(position.x, position.y - size.y / 2, size.x, size.y); // Draw wall
			});

			// Draw the puzzle piece
			ctx.fillStyle = "blue";
			const piecePosition = piece.getPosition();
			ctx.fillRect(piecePosition.x * 30, piecePosition.y * 30, 60, 60);

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			world.destroyBody(piece);
			// world.destroyBody(walls);
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
