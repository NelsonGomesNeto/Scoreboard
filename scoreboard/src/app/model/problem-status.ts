export class ProblemStatus {
  id: number;
  submissions: number;
  accepted: boolean;

  static toString(obj) {
    if (obj.submissions == 0)
      return '-';
    if (obj.accepted)
      return '✔ ' + (obj.submissions > 1 ? obj.submissions.toString() : '');
    return '❌ ' + obj.submissions.toString();
  }

  toString() {
    if (this.submissions == 0)
      return '-';
    if (this.accepted)
      return '✔ ' + (this.submissions > 1 ? this.submissions.toString() : '');
    return '❌ ' + this.submissions.toString();
  }
}
