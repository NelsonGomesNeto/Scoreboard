import { Submission } from './submission';

export class ProblemStatus {
  id: number;
  submissions: number;
  accepted: number;
  lastTime: number;

  constructor(id: number, submissions: number = 0, accepted: number = 0, lastTime: number = 0) {
    this.id = id;
    this.submissions = submissions;
    this.accepted = accepted;
    this.lastTime = lastTime;
  }

  static toString(ps: ProblemStatus) {
    if (ps.submissions == 0)
      return ['-', '', 'red'];
    if (ps.accepted == -1)
      return [ps.lastTime.toString(), ps.submissions.toString(), '#707070'];
    if (ps.accepted == 0)
      return ['-', ps.submissions.toString(), 'red'];
    if (ps.accepted == 1)
      return [ps.lastTime.toString(), ps.submissions.toString(), '#10FF10'];
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
