import { Competidor } from './competidor';
import { Problem } from './problem';

export class Competition {
  id: number;
  name: string;
  competidors: Competidor[];
  problems: Problem[];

  constructor(id: number, name: string, competidors: Competidor[] = new Array(), problems: Problem[] = new Array()) {
    this.id = id;
    this.name = name;
    this.competidors = competidors;
    this.problems = problems;
  }

  addCompetidors(competidors: Competidor[]) {
    competidors.forEach(c => {
      this.competidors.push(c);
    });
  }

  addProblems(problems: Problem[]) {
    problems.forEach(p => {
      this.problems.push(p);
    });
  }
}
