import { ProblemStatus } from './problem-status';

export class Competidor {
  id: number;
  name: string;
  totalTime: number;
  totalAccepted: number;
  problemsStatus: ProblemStatus[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static compare(a: Competidor, b: Competidor) {
    if (a.totalAccepted > b.totalAccepted || (a.totalAccepted == b.totalAccepted && a.totalTime < b.totalTime)) return -1;
    return 1;
  }
}
