class Competidor {

  constructor(id, name, totalTime = 0, totalAccepted = 0, problemsStatus = new Array()) {
    this.id = id;
    this.name = name;
    this.totalTime = totalTime;
    this.totalAccepted = totalAccepted;
    this.problemsStatus = problemsStatus;
  }
}

module.exports = Competidor;