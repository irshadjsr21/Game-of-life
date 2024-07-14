import { randomInt } from "../random";

export class GameOfLife {
  private readonly size: number;
  private board: number[][];
  private generations: number;

  constructor(size: number) {
    this.size = size;
    this.generations = 0;
    this.board = GameOfLife.createEmptyBoard(size);
  }

  private static createEmptyBoard(size: number) {
    return new Array<number>(size)
      .fill(0)
      .map(() => new Array<number>(size).fill(0));
  }

  private isValidIndex(x: number, y: number) {
    return x >= 0 && x < this.board.length && y >= 0 && y < this.board.length;
  }

  public setCellAlive(x: number, y: number) {
    if (this.isValidIndex(x, y)) {
      this.board[x][y] = 1;
    }
  }

  public setCellDead(x: number, y: number) {
    if (this.isValidIndex(x, y)) {
      this.board[x][y] = 0;
    }
  }

  public toggleCell(x: number, y: number) {
    if (this.isValidIndex(x, y)) {
      this.board[x][y] = this.board[x][y] ? 0 : 1;
    }
  }

  public getBoard() {
    return this.board;
  }

  public fillRandom() {
    const alivePoppulationPercent = randomInt(0, 60) / 100;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        this.setCellDead(x, y);
        if (Math.random() < alivePoppulationPercent) {
          this.setCellAlive(x, y);
        }
      }
    }
  }

  public clear() {
    this.board = GameOfLife.createEmptyBoard(this.size);
  }

  private getAliveNeighbors(x: number, y: number) {
    let aliveNeighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (this.isValidIndex(x + i, y + j) && this.board[x + i][y + j] === 1) {
          aliveNeighbors++;
        }
      }
    }
    return aliveNeighbors;
  }

  public nextGeneration() {
    const nextBoard = GameOfLife.createEmptyBoard(this.size);
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const aliveNeighbors = this.getAliveNeighbors(x, y);
        if (this.board[x][y] === 1) {
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
    this.generations += 1;
    this.board = nextBoard;
  }
}
