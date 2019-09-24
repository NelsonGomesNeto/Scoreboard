export class Submission {
  date: Date;
  verdict: string;

  constructor(date: Date, verdict: string) {
    this.date = date;
    this.verdict = verdict;
  }
}
