import { ProblemStatus } from './problem-status';

export class Competidor {
  id: number;
  name: string;
  total: number;
  problemsStatus: ProblemStatus[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
