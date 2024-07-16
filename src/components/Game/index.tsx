"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithRef } from "~/hooks";
import {
  GameOfLife,
  drawBoardOnCanvas,
  resizeCanvas,
  calulateBoardSize,
  type DrawBoardOnCanvasOptions,
  addEventListenersToCanvas,
} from "~/utils";
import { Canvas } from "./Canvas";
import { Controls } from "./Controls";

const DEFAULT_CELL_DISPLAY_PIXEL = 100;
const DEFAULT_BOARD_SIZE = 30;

const canvasColors: DrawBoardOnCanvasOptions["colors"] = {
  alive: "#339989",
  dead: "#fff",
  border: "#333",
};

const drawingModesList = [
  {
    id: "toggle",
    name: "Toggle",
  },
  {
    id: "Alive",
    name: "Alive",
  },
  {
    id: "Dead",
    name: "Dead",
  },
];

export const Game = () => {
  const [drawingMode, setDrawingMode, drawingModeRef] =
    useStateWithRef("toggle");

  const [isStarted, setIsStarted, isStartedRef] = useStateWithRef(false);
  const [animationSpeed, setAnimationSpeed, animationSpeedRef] =
    useStateWithRef(10);

  const canvas = useRef<HTMLCanvasElement>(null);
  const [boardSize, setBoardSize, boardSizeRef] =
    useStateWithRef(DEFAULT_BOARD_SIZE);
  const game = useRef<GameOfLife>(new GameOfLife(DEFAULT_BOARD_SIZE));
  const [generation, setGeneration] = useState(0);
  const [isStartingBoard, setIsStartingBoard] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

  const onBoardUpdate = useCallback(() => {
    setGeneration(game.current.generations);
    setIsStartingBoard(game.current.isStartingBoard);
    setIsEmpty(game.current.isEmpty);

    if (game.current.isEmpty) {
      setIsStarted(false);
    }
  }, []);

  useEffect(() => {
    game.current.addBoardUpdateListener(onBoardUpdate);
    game.current.fillRandom();
    draw();

    return () => {
      game.current.removeListeners();
    };
  }, []);

  useEffect(() => {
    game.current.updateBoardSize(boardSize);
    resize();
    draw();

    if (canvas.current) {
      return addEventListenersToCanvas(canvas.current, boardSize, {
        onCellClick: (x, y) => {
          if (isStartedRef.current) return;

          if (drawingModeRef.current === "Alive") {
            game.current.setCellAlive(x, y);
          } else if (drawingModeRef.current === "Dead") {
            game.current.setCellDead(x, y);
          } else {
            game.current.toggleCell(x, y);
          }
          draw();
        },
      });
    }
  }, [boardSize]);

  useEffect(() => {
    if (isStarted) {
      onNextGeneration();
      setTimer();
    } else {
      if (interval.current) {
        clearInterval(interval.current);
      }
      interval.current = undefined;
    }
  }, [isStarted]);

  const setTimer = () => {
    const speedInterval = 3000 / animationSpeedRef.current;

    interval.current = setTimeout(() => {
      onNextGeneration();
      setTimer();
    }, speedInterval);
  };

  const resize = useCallback(() => {
    if (!canvas.current) return;

    const { width, height } = calulateBoardSize(
      boardSizeRef.current,
      DEFAULT_CELL_DISPLAY_PIXEL
    );

    resizeCanvas(canvas.current, width, height);
  }, []);

  const draw = useCallback(() => {
    if (!canvas.current) return;

    drawBoardOnCanvas(canvas.current, game.current.board, {
      cellSize: DEFAULT_CELL_DISPLAY_PIXEL,
      colors: canvasColors,
    });
  }, []);

  const onRandom = useCallback(() => {
    game.current.fillRandom();
    draw();
  }, []);

  const onStartOrStop = useCallback(() => {
    setIsStarted(!isStartedRef.current);
  }, []);

  const onClear = useCallback(() => {
    game.current.clear();
    draw();
  }, []);

  const onReset = useCallback(() => {
    game.current.resetBoard();
    draw();
  }, []);

  const onNextGeneration = useCallback(() => {
    game.current.nextGeneration();
    draw();
  }, []);

  return (
    <div className="align-center flex h-[calc(100vh-100px)] flex-col justify-center justify-evenly">
      <Canvas isStarted={isStarted} ref={canvas} />
      <Controls
        onRandom={onRandom}
        drawingMode={drawingMode}
        drawingModesList={drawingModesList}
        onDrawingModeChange={setDrawingMode}
        onClear={onClear}
        onReset={onReset}
        onStartOrStop={onStartOrStop}
        isStarted={isStarted}
        speed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        onNextGeneration={onNextGeneration}
        generation={generation}
        isStartingBoard={isStartingBoard}
        isEmpty={isEmpty}
        boardSize={boardSize}
        onBoardSizeChange={setBoardSize}
      />
    </div>
  );
};
