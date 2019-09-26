class ProblemStatus {

  constructor(id, submissions = 0, accepted = false) {
    this.id = id;
    this.submissions = submissions;
    this.accepted = accepted;
  }
}

module.exports = ProblemStatus;
