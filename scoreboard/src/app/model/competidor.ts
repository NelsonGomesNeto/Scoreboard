import { ProblemStatus } from './problem-status';

export class Competidor {
  id: number;
  name: string;
  score: number;
  problemsStatus: ProblemStatus[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
