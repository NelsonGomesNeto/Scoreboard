class ProblemStatus {

  constructor(problemId, submissions = new Array()) {
    this.problemId = problemId;
    this.submissions = submissions;
  }
}

module.exports = ProblemStatus;
