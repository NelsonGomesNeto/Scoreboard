class Competition {

  constructor(id, name, startTime = Date.now(), endTime = Date.now(), frozenMinutes = 0, competidors = new Array(), problems = new Array()) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.frozenMinutes = frozenMinutes;
    this.competidors = competidors;
    this.problems = problems;
  }
}

module.exports = Competition;