import React from "react";

const GameBoard: React.FC = ({}) => {

    const brickClasses = "border border-yellow rounded-lg"

    return <div className="game-board h-full w-full flex flex-grow">
        <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-4 p-4 h-full w-full">
            <div className={brickClasses}></div>
            <div className={brickClasses}></div>
            <div className={brickClasses}></div>
            <div className={brickClasses}></div>
            <div className={brickClasses}></div>
            <div className={brickClasses}></div>

        </div>
    </div>
}

export default GameBoard;