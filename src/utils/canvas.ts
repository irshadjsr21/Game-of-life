export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;

    return true;
  }

  return false;
};

export interface DrawBoardOnCanvasOptions {
  cellSize?: number;
  colors?: { alive: string; dead: string; border: string };
}

export const drawBoardOnCanvas = (
  canvas: HTMLCanvasElement,
  board: number[][],
  options?: DrawBoardOnCanvasOptions
) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const cellSize = options?.cellSize ?? 20;
  const strokeColor = options?.colors?.border ?? "#000";
  const aliveColor = options?.colors?.alive ?? "#000";
  const deadColor = options?.colors?.dead ?? "#fff";

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      ctx.fillStyle = board[row][col] === 1 ? aliveColor : deadColor;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.strokeStyle = strokeColor;
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
};

export const calulateBoardSize = (boardSize: number, cellSize: number) => {
  const result = boardSize * cellSize;

  return { width: result, height: result };
};

export const getCellIndexFromOffset = (
  canvas: HTMLCanvasElement,
  boardSize: number,
  x: number,
  y: number
) => {
  const { width, height } = canvas.getBoundingClientRect();

  return {
    x: Math.floor((y / width) * boardSize),
    y: Math.floor((x / height) * boardSize),
  };
};

export interface AddEventListenersToCanvasCallbacks {
  onCellClick: (x: number, y: number) => void;
}

export const addEventListenersToCanvas = (
  canvas: HTMLCanvasElement,
  boardSize: number,
  callbacks: AddEventListenersToCanvasCallbacks
) => {
  let isDragging = false;
  const cellsClicked = new Set<string>();

  const onClickElement = (x: number, y: number) => {
    const result = getCellIndexFromOffset(canvas, boardSize, x, y);
    const key = JSON.stringify(result);

    if (cellsClicked.has(key)) return;
    cellsClicked.add(key);
    callbacks.onCellClick(result.x, result.y);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    onClickElement(e.offsetX, e.offsetY);
  };

  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    onClickElement(e.offsetX, e.offsetY);
  };

  const onMouseUp = () => {
    isDragging = false;
    cellsClicked.clear();
  };

  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);

  return () => {
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
  };
};
