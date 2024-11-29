/**
 * Use Puzzle Functions
 *
 * Supporting functions that are non-setters, non-state-dependant, a bit bloated, and non-crucial to understand the overview of game functionality
 *
 * - Basic value definitions
 * - Utility functions
 *   - Checkers / bool-returning functions
 *   - Dimension getters
 */

import { Coord, CustomMatterBody, PuzzlePiece } from "@/lib/types/puzzle";

const usePuzzleFunctions = () => {
	const refImgOriginalWidth = 600;
	const refImgOriginalHeight = 215;

	/**
	 * Puzzle pieces
	 */
	const puzzlePieces: PuzzlePiece[] = [
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
				topRight: { x: 300, y: 80.5 },
			},
		},
		{
			id: 4,
			url: "/static/images/puzzle/piece_1_4.svg",
			width: 249,
			height: 53,
			steeringCoords: {
				bottomLeft: { x: 0, y: 214 },
				topRight: { x: 249, y: 161 },
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
	 * Calculate starting coords for ref image
	 */
	const getImageStartCoords = (
		canvasWidth: number,
		canvasHeight: number,
		refImgWidth: number,
		refImgHeight: number
	): { imageStartX: number; imageStartY: number } => {
		const imageStartX = (canvasWidth - refImgWidth) / 2;
		const imageStartY = (canvasHeight - refImgHeight) / 2;
		return { imageStartX, imageStartY };
	};

	/**
	 * Get basic (canvas and reference image) dimensions
	 */
	const getBasicDimensions = (
		canvas: HTMLCanvasElement,
		refImg: HTMLDivElement
	): {
		canvasWidth: number;
		canvasHeight: number;
		refImgWidth: number;
		refImgHeight: number;
		sizeScale?: number;
	} => {
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
	 * Check if piece fits
	 */
	const checkIfFit = (
		draggedPiece: CustomMatterBody,
		bottomLeftTarget: Coord,
		topRightTarget: Coord
	): boolean => {
		const draggedPiecePosition = draggedPiece.position;
		const width = draggedPiece.originalWidth ?? 0;
		const height = draggedPiece.originalHeight ?? 0;

		// Get corners
		const bottomLeftCurrent = {
			x: draggedPiecePosition.x - width / 2,
			y: draggedPiecePosition.y + height / 2,
		};
		const topRightCurrent = {
			x: draggedPiecePosition.x + width / 2,
			y: draggedPiecePosition.y - height / 2,
		};

		// Exact fit: Check if target coords match current coords by comparing corners, x and y
		const hasExactFit =
			checkIfCoordsAreWithinErrorMargin(
				bottomLeftCurrent.x,
				bottomLeftTarget.x
			) &&
			checkIfCoordsAreWithinErrorMargin(
				bottomLeftCurrent.y,
				bottomLeftTarget.y
			) &&
			checkIfCoordsAreWithinErrorMargin(topRightCurrent.y, topRightTarget.y) &&
			checkIfCoordsAreWithinErrorMargin(topRightCurrent.x, topRightTarget.x);

		// Normalize angle to 0–360 degree range (360 becomes 0)
		let angleInDegrees = draggedPiece.angle * (180 / Math.PI);
		angleInDegrees = ((angleInDegrees % 360) + 360) % 360;

		// Determine if the piece is flipped (close to 180°)
		const isFlipped = Math.abs(angleInDegrees - 180) < 10;

		if (draggedPiece.symmetrical) {
			// For symmetrical pieces, allow fit regardless of rotation
			const visualFit =
				checkIfCoordsAreWithinErrorMargin(
					bottomLeftCurrent.x,
					topRightTarget.x
				) &&
				checkIfCoordsAreWithinErrorMargin(
					bottomLeftCurrent.y,
					topRightTarget.y
				);

			return hasExactFit || visualFit;
		} else {
			// For non-symmetrical pieces, only exact fit expected
			return hasExactFit && !isFlipped;
		}
	};

	return {
		puzzlePieces,
		refImgOriginalWidth,
		refImgOriginalHeight,
		getImageStartCoords,
		getBasicDimensions,
		checkIfFit,
	};
};

export default usePuzzleFunctions;
