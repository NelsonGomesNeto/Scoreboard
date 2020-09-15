export class Problem {
  id: number;
  color: string;
  firstSolve: number;

  constructor(id: number, color: string = '', firstSolve: number = -1) {
    this.id = id;
    this.color = color;
    this.firstSolve = firstSolve;
  }
}
