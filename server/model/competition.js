class Competition {

  constructor(id, name, competidors = new Array(), problems = new Array()) {
    this.id = id;
    this.name = name;
    this.competidors = competidors;
    this.problems = problems;
  }

  addCompetidors(competidors) {
    competidors.forEach(c => {
      this.competidors.push(c);
    });
  }

  addProblems(problems) {
    problems.forEach(p => {
      this.problems.push(p);
    });
  }
}

module.exports = Competition;