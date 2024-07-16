import { copy2DArrayElements } from "../array";
import { randomInt } from "../random";
import { throttle } from "../throttle";

export type OnBoardUpdateCallback = () => void;

export class GameOfLife {
  private _size: number;
  private _board: number[][];
  private _generations: number;
  private _startingBoard: number[][];

  private _onBoardUpdateCallback: OnBoardUpdateCallback | undefined;

  constructor(size: number) {
    this._size = size;
    this._generations = 0;
    this._board = GameOfLife.createEmptyBoard(size);
    this._startingBoard = structuredClone(this._board);
  }

  public addBoardUpdateListener(callback: OnBoardUpdateCallback) {
    this._onBoardUpdateCallback = throttle(callback, 200);
  }

  public removeListeners() {
    this._onBoardUpdateCallback = undefined;
  }

  public get generations() {
    return this._generations;
  }

  public get board() {
    return this._board;
  }

  public get isEmpty() {
    return this._board.every((row) => row.every((cell) => cell === 0));
  }

  public get isStartingBoard() {
    return this._board.every((row, x) =>
      row.every((cell, y) => cell === this._startingBoard[x][y])
    );
  }

  public updateBoardSize(size: number) {
    this._size = size;

    const newBoard = GameOfLife.createEmptyBoard(size);
    copy2DArrayElements(this._board, newBoard);

    this._board = newBoard;
    this._startingBoard = structuredClone(this._board);
    this.onBoardUpdate();
  }

  private static createEmptyBoard(size: number) {
    return new Array<number>(size)
      .fill(0)
      .map(() => new Array<number>(size).fill(0));
  }

  private isValidIndex(x: number, y: number) {
    return x >= 0 && x < this._board.length && y >= 0 && y < this._board.length;
  }

  private onBoardUpdate() {
    if (this._onBoardUpdateCallback) {
      this._onBoardUpdateCallback();
    }
  }

  private setStartingBoard() {
    this._startingBoard = structuredClone(this._board);
  }

  private resetGenerations() {
    this._generations = 0;
    this.onBoardUpdate();
  }

  public setCellAlive(x: number, y: number) {
    this.resetGenerations();
    if (this.isValidIndex(x, y)) {
      this._board[x][y] = 1;
    }
    this.setStartingBoard();
    this.onBoardUpdate();
  }

  public setCellDead(x: number, y: number) {
    this.resetGenerations();
    if (this.isValidIndex(x, y)) {
      this._board[x][y] = 0;
    }
    this.setStartingBoard();
    this.onBoardUpdate();
  }

  public toggleCell(x: number, y: number) {
    this.resetGenerations();
    if (this.isValidIndex(x, y)) {
      this._board[x][y] = this._board[x][y] ? 0 : 1;
    }
    this.setStartingBoard();
    this.onBoardUpdate();
  }

  public fillRandom() {
    this.resetGenerations();
    const alivePoppulationPercent = randomInt(0, 60) / 100;

    for (let x = 0; x < this._size; x++) {
      for (let y = 0; y < this._size; y++) {
        this._board[x][y] = 0;
        if (Math.random() < alivePoppulationPercent) {
          this._board[x][y] = 1;
        }
      }
    }

    this.setStartingBoard();
    this.onBoardUpdate();
  }

  public clear() {
    this.resetGenerations();
    this._board = GameOfLife.createEmptyBoard(this._size);
    this.setStartingBoard();
    this.onBoardUpdate();
  }

  private getAliveNeighbors(x: number, y: number) {
    let aliveNeighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (
          this.isValidIndex(x + i, y + j) &&
          this._board[x + i][y + j] === 1
        ) {
          aliveNeighbors++;
        }
      }
    }
    return aliveNeighbors;
  }

  public nextGeneration() {
    const nextBoard = GameOfLife.createEmptyBoard(this._size);
    for (let x = 0; x < this._size; x++) {
      for (let y = 0; y < this._size; y++) {
        const aliveNeighbors = this.getAliveNeighbors(x, y);
        if (this._board[x][y] === 1) {
          if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            nextBoard[x][y] = 0;
          } else {
            nextBoard[x][y] = 1;
          }
        } else {
          if (aliveNeighbors === 3) {
            nextBoard[x][y] = 1;
          }
        }
      }
    }
    this._generations += 1;
    this._board = nextBoard;
    this.onBoardUpdate();
  }

  public resetBoard() {
    this._generations = 0;
    this._board = structuredClone(this._startingBoard);
    this.onBoardUpdate();
  }
}
