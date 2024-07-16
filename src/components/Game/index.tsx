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
  const game = useRef<GameOfLife>(new GameOfLife(DEFAULT_BOARD_SIZE));
  const [generation, setGeneration] = useState(0);

  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    game.current.fillRandom();
    resize();
    draw();
    if (canvas.current) {
      return addEventListenersToCanvas(canvas.current, DEFAULT_BOARD_SIZE, {
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
  }, []);

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
      DEFAULT_BOARD_SIZE,
      DEFAULT_CELL_DISPLAY_PIXEL
    );

    resizeCanvas(canvas.current, width, height);
  }, []);

  const draw = useCallback(() => {
    if (!canvas.current) return;

    setGeneration(game.current.generations);

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
        onStartOrStop={onStartOrStop}
        isStarted={isStarted}
        speed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        onNextGeneration={onNextGeneration}
        generation={generation}
      />
    </div>
  );
};
