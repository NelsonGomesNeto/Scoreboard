class Competidor {

  constructor(id, name, total = 0, problemsStatus = new Array()) {
    this.id = id;
    this.name = name;
    this.total = total;
    this.problemsStatus = problemsStatus;
  }
}

module.exports = Competidor;