import { Submission } from './submission';

export class ProblemStatus {
  id: number;
  submissions: number;
  accepted: boolean;

  constructor(id: number, submissions: number = 0, accepted: boolean = false) {
    this.id = id;
    this.submissions = submissions;
    this.accepted = accepted;
  }

  static toString(ps: ProblemStatus) {
    if (ps.submissions == 0)
      return '-';
    // if (ps.submissions == 1)
      // return '';
    return ps.submissions.toString();
    // if (ps.accepted == true)
    //   return '🎈 ' + (ps.submissions > 1 ? ps.submissions.toString() : '');
    // return '❌ ' + ps.submissions.toString();
  }

  toString() {
    if (this.submissions == 0)
      return '-';
    if (this.accepted == true)
      return '🎈 ' + (this.submissions > 1 ? this.submissions.toString() : '');
    return '❌ ' + this.submissions.toString();
  }
}
