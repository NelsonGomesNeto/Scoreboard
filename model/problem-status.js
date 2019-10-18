class ProblemStatus {

  constructor(id, submissions = 0, accepted = false, lastTime = 0, firstToSolve = false) {
    this.id = id;
    this.submissions = submissions;
    this.accepted = accepted;
    this.lastTime = lastTime;
    this.firstToSolve = firstToSolve;
  }
}

module.exports = ProblemStatus;
