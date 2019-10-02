class Competition {

  constructor(id, name, startTime = Date.now(), endTime = Date.now(), competidors = new Array(), problems = new Array()) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.competidors = competidors;
    this.problems = problems;
  }
}

module.exports = Competition;