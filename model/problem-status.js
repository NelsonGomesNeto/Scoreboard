class ProblemStatus {

  constructor(id, submissions = 0, accepted = false, lastTime = 0) {
    this.id = id;
    this.submissions = submissions;
    this.accepted = accepted;
    this.lastTime = 0;
  }
}

module.exports = ProblemStatus;
