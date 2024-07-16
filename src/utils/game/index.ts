import { randomInt } from "../random";

export class GameOfLife {
  private readonly _size: number;
  private _board: number[][];
  private _generations: number;

  constructor(size: number) {
    this._size = size;
    this._generations = 0;
    this._board = GameOfLife.createEmptyBoard(size);
  }

  public get generations() {
    return this._generations;
  }

  public get board() {
    return this._board;
  }

  private static createEmptyBoard(size: number) {
    return new Array<number>(size)
      .fill(0)
      .map(() => new Array<number>(size).fill(0));
  }

  private isValidIndex(x: number, y: number) {
    return x >= 0 && x < this._board.length && y >= 0 && y < this._board.length;
  }

  private resetGenerations() {
    this._generations = 0;
  }

  public setCellAlive(x: number, y: number) {
    this.resetGenerations();
    if (this.isValidIndex(x, y)) {
      this._board[x][y] = 1;
    }
  }

  public setCellDead(x: number, y: number) {
    this.resetGenerations();
    if (this.isValidIndex(x, y)) {
      this._board[x][y] = 0;
    }
  }

  public toggleCell(x: number, y: number) {
    this.resetGenerations();
    if (this.isValidIndex(x, y)) {
      this._board[x][y] = this._board[x][y] ? 0 : 1;
    }
  }

  public fillRandom() {
    this.resetGenerations();
    const alivePoppulationPercent = randomInt(0, 60) / 100;

    for (let x = 0; x < this._size; x++) {
      for (let y = 0; y < this._size; y++) {
        this.setCellDead(x, y);
        if (Math.random() < alivePoppulationPercent) {
          this.setCellAlive(x, y);
        }
      }
    }
  }

  public clear() {
    this.resetGenerations();
    this._board = GameOfLife.createEmptyBoard(this._size);
  }

  private getAliveNeighbors(x: number, y: number) {
    let aliveNeighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (this.isValidIndex(x + i, y + j) && this._board[x + i][y + j] === 1) {
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
  }
}
