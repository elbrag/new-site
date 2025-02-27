import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
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
	Body,
	Bounds,
} from "matter-js";
import { debounce } from "lodash";
import Button from "@/components/ui/Button";
import SvgImage, { SvgImageMotifs } from "@/components/ui/SvgImage";
import usePuzzleFunctions from "@/hooks/games/usePuzzleFunctions";
import { CustomMatterBody } from "@/lib/types/puzzle";
import { GameContext } from "@/context/GameContext";
import { RoundContext } from "@/context/RoundContext";
import { ProgressContext } from "@/context/ProgressContext";
import { GameName } from "@/lib/types/game";
import { FirebaseContext } from "@/context/FirebaseContext";
import { AnimatePresence, motion } from "framer-motion";
import SuccessScreen from "@/components/ui/SuccessScreen";
import useInfoMessage from "@/hooks/useInfoMessage";
import { puzzleInitMessages } from "@/lib/helpers/messages";
import BackButton from "@/components/ui/BackButton";
import { ProgressRoundProps } from "@/lib/types/progress";

const Puzzle: React.FC = () => {
	// Refs
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Engine>(Engine.create());
	const renderRef = useRef<Render | null>(null);
	const refImageRef = useRef<HTMLDivElement>(null);
	const gameInited = useRef(false);
	const windowWidth = useRef(0);

	// States
	const [matchingPieceId, setMatchingPieceId] = useState<number | null>(null);
	const [showInitMessage, setShowInitMessage] = useState(false);
	const [allowReset, setAllowReset] = useState(false);
	const [allMatched, setAllMatched] = useState(false);
	const [resetting, setResetting] = useState(false);

	// Hooks
	const {
		puzzlePieces,
		refImgOriginalWidth,
		refImgOriginalHeight,
		getImageStartCoords,
		getBasicDimensions,
		checkIfFit,
	} = usePuzzleFunctions();
	const { updateSuccessMessage, successMessage } = useInfoMessage();

	// Contexts
	const { updateProgress, resetGame } = useContext(GameContext);
	const { progress, getGameProgress } = useContext(ProgressContext);
	const { numberOfRounds, setNumberOfRounds, allRoundsPassed } =
		useContext(RoundContext);
	const { userId } = useContext(FirebaseContext);

	// Mirror progress from context
	const progressRef = useRef(progress);
	useEffect(() => {
		progressRef.current = progress;
	}, [progress]);

	// Wall thickness
	const wallThickness = 10;

	// Collision categories
	const wallCategory = 0x0001;
	const pieceCategory = 0x0002;

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
	 * On piece fit
	 */
	const onPieceFit = useCallback(
		async (draggedPieceId: number) => {
			// Check puzzle progress
			const gameProgress = await getGameProgress(
				GameName.Puzzle,
				progressRef.current
			);
			const matchingProgress = gameProgress.find(
				(p) => p.roundId === draggedPieceId
			);
			// If piece is not already fitted, update progress
			if (!matchingProgress || !matchingProgress?.completed) {
				updateProgress(GameName.Puzzle, draggedPieceId, true);
				updateSuccessMessage("It's a fit!");
				if (!allowReset) setAllowReset(true);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[getGameProgress, updateProgress, updateSuccessMessage]
	);

	/**
	 * Set interactive state
	 */
	const setInteractiveState = useCallback(
		(
			canvas: HTMLCanvasElement,
			engine: Engine,
			world: World
		): {
			removeEvent: () => void;
		} => {
			engine.gravity.y = 1;
			setTimeout(() => {
				setShowInitMessage(true);
			}, 800);
			const timeout = setTimeout(() => {
				setShowInitMessage(false);
			}, 5000);

			// Apply scatter, linear + rotation
			Composite.allBodies(world).forEach((body) => {
				const scatterStrength = 12;
				const rotationStrength = 0.16;
				Body.setVelocity(body, {
					x: (Math.random() - 0.5) * scatterStrength,
					y: (Math.random() - 0.5) * scatterStrength,
				});
				Body.setAngularVelocity(body, (Math.random() - 0.5) * rotationStrength);
			});

			// Stop scatter
			setTimeout(() => {
				Composite.allBodies(world).forEach((body) => {
					Body.setVelocity(body, { x: 0, y: 0 });
					Body.setAngularVelocity(body, 0); // Stop any spinning
				});
			}, 500);

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
			const handleMouseMove = async () => {
				if (mouseConstraint.body) {
					const draggedPiece: CustomMatterBody = mouseConstraint.body;
					if (
						draggedPiece.fitted ||
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
						draggedPiece.fitted = true;
						setMatchingPieceId(draggedPiece.id);
						draggedPiece.collisionFilter = { mask: wallCategory };
					}
				}
			};

			// Event listener tracking drag coords
			Events.on(mouseConstraint, "mousemove", handleMouseMove);

			// Define canvas Bounds object
			const canvasBounds = Bounds.create([
				{ x: 0, y: 0 },
				{ x: canvas.width, y: 0 },
				{ x: canvas.width, y: canvas.height },
				{ x: 0, y: canvas.height },
			]);
			/**
			 * Handle bodies escaping (and bring them back)
			 */
			const handleBodiesEscaping = () => {
				Composite.allBodies(world).forEach((body) => {
					if (body.position && !Bounds.contains(canvasBounds, body.position)) {
						Body.setPosition(body, {
							x: canvas.width / 2,
							y: canvas.height / 2,
						});
						Body.setVelocity(body, { x: 0, y: 0 });
					}
				});
			};
			// Event listener
			Events.on(engine, "beforeUpdate", handleBodiesEscaping);

			// Remove events, return to be used along with other cleanups
			return {
				removeEvent: () => {
					Events.off(mouseConstraint, "mousemove", handleMouseMove);
					Events.off(engine, "beforeUpdate", handleBodiesEscaping);
					clearTimeout(timeout);
				},
			};
		},
		[checkIfFit]
	);

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
						fillStyle: "transparent",
						strokeStyle: "transparent",
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
	const addPuzzlePieces = useCallback(
		async (
			world: World,
			gameProgress: ProgressRoundProps[],
			imageStartX: number,
			imageStartY: number,
			sizeScale?: number
		) => {
			const scale = sizeScale ?? 1;
			// If there has been any progress since before, allow reset
			if (gameProgress.some((p) => p.completed)) {
				setAllowReset(true);
			}

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
						restitution: 0.8,
						friction: 0.85,
						density: 0.075,
						render: {
							sprite: {
								texture: piece.url,
								yScale: scale,
								xScale: scale,
							},
						},
						collisionFilter: {
							category: pieceCategory,
							// mask: wallCategory, // Collides with walls
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
				body.id = piece.id;

				// Check if piece is already fitted
				const matchingProgress = gameProgress.find(
					(p) => p.roundId === body.id
				);
				// Don't allow fitted pieces to fall
				if (matchingProgress?.completed) {
					body.isStatic = true;
					body.fitted = true;
					body.collisionFilter = { mask: wallCategory };
				}

				Composite.add(world, body);
			});
		},
		[puzzlePieces, progressRef, getGameProgress]
	);

	/**
	 * Reset pieces
	 */
	const resetPieces = async () => {
		await resetGame(
			GameName.Puzzle,
			puzzlePieces.map((p) => p.id)
		);
		setTimeout(() => {
			resetGameBoard();
		}, 100);
	};

	/**
	 * Reset game
	 */
	const resetGameBoard = async () => {
		if (resetting) return;
		setResetting(true);
		window.removeEventListener("resize", debouncedResizeRef.current);

		const canvas = canvasRef.current;
		const engine = engineRef.current;
		const render = renderRef.current;

		if (canvas && engine) {
			engine.world.bodies.slice().forEach((body) => {
				Composite.remove(engine.world, body, true);
			});
			Composite.clear(engine.world, true);
			World.clear(engine.world, false);

			Engine.clear(engine);

			if (render) Render.stop(render);

			engineRef.current = Engine.create();

			setTimeout(() => {
				initGame();
				setResetting(false);
			}, 200);
		}
	};

	/**
	 * Resize handler for the canvas
	 */
	const resizeHandler = () => {
		// Avoid resize event getting fired falsely on ios
		if (window.innerWidth === windowWidth.current) return;
		resetGameBoard();
		windowWidth.current = window.innerWidth;
	};
	// Debounced resize function
	const debouncedResizeRef = useRef(debounce(resizeHandler, 2000));

	/**
	 * Init game
	 */
	const initGame = useCallback(async () => {
		setAllMatched(false);
		windowWidth.current = window.innerWidth;
		const gameProgress = await getGameProgress(
			GameName.Puzzle,
			progressRef.current
		);

		// Define canvas, reference image and engine and check that they exist
		const refImg = refImageRef.current;
		const canvas = canvasRef.current;
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

		renderRef.current = render;

		// Composite
		const world = engine.world;

		// Elements
		addWalls(world, canvasWidth, canvasHeight);
		addPuzzlePieces(world, gameProgress, imageStartX, imageStartY, sizeScale);

		// Initial state (pieces in place)
		setInitialState(engine);

		// Interactive state (gravity activated, pieces fall down)
		let removeDragEvent: (() => void) | undefined;

		if (!gameProgress.length || gameProgress.some((p) => !p.completed)) {
			setTimeout(async () => {
				const interactiveStateResult = await setInteractiveState(
					canvas,
					engine,
					world
				);
				removeDragEvent = interactiveStateResult.removeEvent;
			}, 1500);
		}

		// Run the engine and render
		Render.run(render);
		const runner = Runner.create();
		Runner.run(runner, engine);

		// Resize event listener
		window.addEventListener("resize", debouncedResizeRef.current);

		// Clean up
		return () => {
			Composite.clear(world, false);
			Engine.clear(engine);
			Render.stop(render);
			if (removeDragEvent) {
				removeDragEvent();
			}
			window.removeEventListener("resize", debouncedResizeRef.current);
		};
	}, [
		addPuzzlePieces,
		getBasicDimensions,
		getImageStartCoords,
		resizeHandler,
		setInteractiveState,
	]);

	/**
	 * Init game on first render
	 */
	useEffect(() => {
		if (userId && !gameInited.current && progressRef.current) {
			const _numberOfRounds = puzzlePieces.length;
			setNumberOfRounds(_numberOfRounds);

			gameInited.current = true;
			initGame();
			setAllMatchedIfAllCompleted(_numberOfRounds);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initGame, userId, progressRef]);

	/**
	 * Watch matching piece, run onPieceFit and then unset state
	 *
	 * Necessary because onPieceFit (particularly updateProgress) cannot be called from within setInteractiveState (states from context get "stuck")
	 */
	useEffect(() => {
		if (!matchingPieceId) return;
		if (matchingPieceId) {
			onPieceFit(matchingPieceId);
			setMatchingPieceId(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchingPieceId]);

	/**
	 * If progress says all are completed, set all matched to display message in heading
	 */
	const setAllMatchedIfAllCompleted = async (_numberOfRounds?: number) => {
		_numberOfRounds = _numberOfRounds ?? numberOfRounds;
		const gameProgress = await getGameProgress(
			GameName.Puzzle,
			progressRef.current
		);
		if (
			gameProgress.length > 0 &&
			gameProgress.length === _numberOfRounds &&
			gameProgress.every((round) => round.completed)
		) {
			setAllMatched(true);
		}
	};

	/**
	 * allRoundsPassed watcher
	 */
	useEffect(() => {
		if (allRoundsPassed) {
			updateSuccessMessage("That's it! Good job.");
			setAllMatchedIfAllCompleted();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allRoundsPassed]);

	return (
		<div className="md:px-6 lg:px-12">
			<div className="flex justify-between min-h-12 mb-6 lg:mb-8">
				<BackButton />
				<AnimatePresence>
					{gameInited.current && allowReset && (
						<motion.div
							className="flex gap-4 md:gap-6 items-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4 }}
						>
							<Button label="Reset" onClick={resetPieces} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<div className="h-60vh sm:h-70vh lg:h-80vh mb-24">
				<div className="relative z-0 h-full bg-paper border border-line1 rounded-xl overflow-hidden">
					<AnimatePresence>
						{allMatched && (
							<AnimatedHeading motionKey="doneMessage">
								<h2>Much better! 💖</h2>
							</AnimatedHeading>
						)}
						{showInitMessage && !allRoundsPassed && !allMatched && (
							<AnimatedHeading motionKey="initMessage">
								{
									<h2>
										{
											puzzleInitMessages[
												Math.floor(Math.random() * puzzleInitMessages.length)
											]
										}
									</h2>
								}
							</AnimatedHeading>
						)}
					</AnimatePresence>
					<canvas
						ref={canvasRef}
						width={600}
						height={400}
						className="w-full h-full"
					/>
					<div className="reference-image absolute w-full h-full left-0 top-0 -z-1 flex justify-center items-center">
						<div
							ref={refImageRef}
							className="max-w-[70%] sm:max-w-[60%] xl:max-w-[70%]"
						>
							<SvgImage
								image={SvgImageMotifs.FullLogo}
								width={refImgOriginalWidth}
								height={refImgOriginalHeight}
								enforceFitContentHeight={true}
							/>
						</div>
					</div>
					<AnimatePresence>
						{successMessage && <SuccessScreen text={successMessage} />}
					</AnimatePresence>
					<AnimatePresence>
						{resetting && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
								className="absolute top-0 left-0 w-full h-full brightness-125 backdrop-saturate-100"
							></motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default Puzzle;

const AnimatedHeading = ({
	children,
	motionKey,
}: {
	children: React.ReactNode;
	motionKey: string;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="absolute top-3 left-4 z-1 text-sm lg:text-base"
			key={motionKey}
		>
			{children}
		</motion.div>
	);
};
