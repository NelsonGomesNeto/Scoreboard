import { Submission } from './submission';

export class ProblemStatus {
  id: number;
  submissions: number;
  accepted: number;
  lastTime: number;
  firstToSolve: boolean;

  constructor(id: number, submissions: number = 0, accepted: number = 0, lastTime: number = 0, firstToSolve: boolean = false) {
    this.id = id;
    this.submissions = submissions;
    this.accepted = accepted;
    this.lastTime = lastTime;
    this.firstToSolve = firstToSolve;
  }

  static toString(ps: ProblemStatus) {
    if (ps.submissions == 0)
      return ['-', '', 'red', false];
    if (ps.accepted == -1)
      return [ps.lastTime.toString(), ps.submissions.toString(), '#707070', ps.firstToSolve];
    if (ps.accepted == 0)
      return ['-', ps.submissions.toString(), 'red', false];
    if (ps.accepted == 1)
      return [ps.lastTime.toString(), ps.submissions.toString(), '#36f53f', ps.firstToSolve];
    // return ps.submissions.toString();
    // if (ps.accepted == true)
    //   return '🎈 ' + (ps.submissions > 1 ? ps.submissions.toString() : '');
    // return '❌ ' + ps.submissions.toString();
  }

  toString() {
    if (this.submissions == 0)
      return '-';
    if (this.accepted == 1)
      return '🎈 ' + (this.submissions > 1 ? this.submissions.toString() : '');
    return '❌ ' + this.submissions.toString();
  }
}
