class Competidor {

  constructor(id, name, score = 0, problemsStatus = new Array()) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.problemsStatus = problemsStatus;
  }
}

module.exports = Competidor;