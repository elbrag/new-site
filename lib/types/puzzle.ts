import { Body } from "matter-js";

export interface Coord {
	x: number;
	y: number;
}

export interface SteeringCoords {
	bottomLeft: Coord;
	topRight: Coord;
}

export interface PuzzlePiece {
	id: number;
	url: string;
	width: number;
	height: number;
	steeringCoords: SteeringCoords;
	symmetrical?: boolean;
}

export interface CustomMatterBody extends Body {
	steeringCoords?: SteeringCoords;
	originalWidth?: number;
	originalHeight?: number;
	symmetrical?: boolean;
	fitted?: boolean;
}
