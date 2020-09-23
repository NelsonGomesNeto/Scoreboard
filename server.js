const Competidor = require("./model/competidor.js");
const ProblemStatus = require("./model/problem-status.js");
const Problem = require("./model/problem.js")
const Competition = require("./model/competition.js")

const request = require("request");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const production = true;

// PRODUCTION DB
var pgdb;
if (production) {
  pgdb = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  pgdb.connect();
  pgdb.query("CREATE TABLE IF NOT EXISTS db(key INTEGER PRIMARY KEY, data JSONB)", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Created table");
    }
  });
}

const hostname = "localhost";
const dbPath = "database/db.json";
const huxley_url = "https://thehuxley.com/api";
const sha256password = "9d0f22969bde723554a7f33afe897d2faa370165406dc8531d94384c5c610ec6";
const port = 3000;
var db;

const allowedExt = [
  ".js",
  ".ico",
  ".css",
  ".png",
  ".jpg",
  ".woff2",
  ".woff",
  ".ttf",
  ".svg",
];

var huxleyToken = null;
var clientToken = null;

function huxleyLogin(username, password) {
  request.post(huxley_url + "/login", {json: {username: username, password: password}}, (err, res, body) => {
    if (err || body == undefined) {
      console.log(err);
      return;
    }
    huxleyToken = body["access_token"];
  });
}

function getHuxleyDateString(date, minuteShift) {
  str = new Date(date);
  str.setMinutes(str.getMinutes() + minuteShift);
  return str.toJSON().replace(".000Z", "-00:00");
}

// Will continue updating the scoreboard for 30 minutes after the competition is over
function didExpire(competition) {
  let endTime = new Date(competition.endTime);
  let expirationTime = new Date(Date.now() + 30 * 60000).getTime()
  return new Date(endTime.getTime()) > expirationTime;
}

// Will freeze the scoreboard in the last x minutes
function freezeScoreboard(competition) {
  let endTime = new Date(competition.endTime);
  let freezeTime = new Date(endTime.getTime() - competition.frozenMinutes * 60000).getTime();
  return Date.now() >= freezeTime && Date.now() < endTime.getTime()
}

function calculateTotalTime(accepted, lastTime, totalSubmissions) {
  return accepted * Math.ceil(lastTime + accepted * (totalSubmissions - 1) * 15);
}

function getSubmissionDeltaFromCompetitionStart(startTime, submissionTime) {
  return Math.ceil((new Date(submissionTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));
}

function updateCompetitionsSubmissions() {
  try {
    if (huxleyToken == null) {
      console.log("Couldn't update because huxleyToken is null");
      return;
    }
  
    // https://www.thehuxley.com/api/v1/submissions?submissionDateGe=2017-10-28T17:22:54-03:00&user=5875&submissionDateLe=2017-10-28T17:22:56-03:00&problem=794
    // Ge == Greater, Le == Less
    let headers = {"Authorization": "Bearer " + huxleyToken, "Content-Type": "application/json"};
    aux = JSON.parse(JSON.stringify(db["competitions"]));
  
    var done = 0, totalRequired = 0;
    for (var i = 0; i < aux.length; i++)
      totalRequired += aux[i].competidors.length * aux[i].problems.length;
  
    for (var i = 0; i < aux.length; i++) {// for each competition
      if (didExpire(aux[i]) || freezeScoreboard(aux[i])) {
        continue;
      }
  
      for (var j = 0; j < aux[i].competidors.length; j++) { // for each competidor
        aux[i].competidors[j].totalTime = aux[i].competidors[j].totalAccepted = 0;
  
        for (var k = 0; k < aux[i].problems.length; k++) {
          let url = (huxley_url + "/v1/submissions?user=" + aux[i].competidors[j].id.toString() + "&problem=" + aux[i].problems[k].id.toString()
                    + "&submissionDateGe=" + getHuxleyDateString(aux[i].startTime, -1) + "&submissionDateLe=" + getHuxleyDateString(aux[i].endTime, 1)
                    + "&max=100");
          request.get({url: url, headers: headers, competitionIndex: i, competidorIndex: j, problemIndex: k}, (err, res, body) => {
            console.log("here");
            if (err || body == undefined) {
              console.log(err);
              return;
            }
  
            let ci = res.request.competitionIndex, cj = res.request.competidorIndex, ck = res.request.problemIndex;
            var submissions;
            try {
              submissions = JSON.parse(body);
            } catch (e) {
              console.log("Something is wrong with submission JSON", e);
              return;
            }
  
            var problem = aux[ci].problems[ck];

            var problemStatus = getById(aux[ci].competidors[cj].problemsStatus, aux[ci].problems[ck].id);
            problemStatus.submissions = submissions.length;
            if (submissions.length > 0) {
              problemStatus.accepted = submissions[0].evaluation == "CORRECT";
              if (submissions[0].evaluation == "WAITING") problemStatus.submissions--;
            }
            else
              problemStatus.accepted = false;
  
            if (submissions.length) {
              problemStatus.lastTime = getSubmissionDeltaFromCompetitionStart(aux[ci].startTime, submissions[0].submissionDate);
              aux[ci].competidors[cj].totalTime += calculateTotalTime(problemStatus.accepted, problemStatus.lastTime, submissions.length);
              if (problemStatus.accepted)
              problem.firstSolve = problem.firstSolve == -1 ? problemStatus.lastTime : Math.min(problem.firstSolve, problemStatus.lastTime);
            }
            aux[ci].competidors[cj].totalAccepted += problemStatus.accepted;
  
            if (++done == totalRequired) {
              console.log("Updated competitions submissions successfully");
              db["competitions"] = aux;
              saveDatabase();
            }
          });
        }
      }
    }
  } catch (error) {
    console.log("Couldn't update", error);
  }
}

async function loadDatabase() {
  if (production) {
    db = {"competitions": []};
    try {
      data = await pgdb.query("SELECT data FROM db");

      if (data.rows.length == 0) {
        try {
          await pgdb.query("INSERT INTO db(key, data) values($1, $2)", [1, "{\"competitions\": []}"]);
        } catch (error) {
          console.log(error);
          return;
        }
      } else {
        db = data.rows[0].data;
      }

      console.log("Loaded data");
    } catch (error) {
      console.log("Couldn't load data from db", error);
      return;
    }
  } else {
    db = fs.readFileSync(dbPath, "utf8");
    db = JSON.parse(db);
  }
}

async function saveDatabase() {
  if (production) {
    try {
      await pgdb.query("UPDATE db set data = $1 WHERE key = 1", [db]);
    } catch (error) {
      console.log("Couldn't save data on db", error);
      return;
    }
  } else {
    fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");
  }
}

function sortById(a, b) {
  return a.id - b.id;
}

function getById(array, id) {
  return array.find(element => element.id == id);
}

function deleteById(array, id) {
  for (var i = 0; i < array.length; i++)
    if (array[i].id == id) {
      array.splice(i, 1);
      break;
    }
}

function authenticated(token, res) {
  if (clientToken == null || clientToken != token) {
    res.sendStatus(403);
    console.log("Not allowed");
    return false;
  }
  return true;
}

function initServer() {
  loadDatabase();
  setInterval(() => updateCompetitionsSubmissions(), production ? 10000 : 5000);

  huxleyToken = clientToken = null;

  const server = express();
  server.use(cors());
  server.use(express.static(path.join(__dirname, "public")));
  server.use(bodyParser.json());
  server.use(bodyParser.text());
  server.use(bodyParser.raw());
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "content-type, token");
    // res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  server.get("/api/competitions", (req, res) => {
    res.json({competitions: db["competitions"], time: Date.now()});
  });

  server.post("/api/competitions", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var newCompetition = req.body.competition;
    newCompetition = new Competition(newCompetition.id, newCompetition.name, newCompetition.startTime, newCompetition.endTime, newCompetition.frozenMinutes);
    db["competitions"].push(newCompetition);

    saveDatabase();
    res.json(newCompetition);
  });

  server.patch("/api/competition/:id/editInfo", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var competition = getById(db["competitions"], req.params.id);
    competition.name = req.body.info.name;
    competition.id = req.body.info.id;

    saveDatabase();
    res.json(competition);
  });

  server.patch("/api/competition/:id/editSchedule", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var competition = getById(db["competitions"], req.params.id);
    competition.startTime = new Date(req.body.schedule.startTime);
    competition.endTime = new Date(req.body.schedule.endTime);
    competition.frozenMinutes = req.body.schedule.frozenMinutes;

    saveDatabase();
    res.json(competition);
  });
  
  server.put("/api/competition/:id/newCompetidor", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var newCompetidor = req.body.competidor;
    var competition = getById(db["competitions"], req.params.id);
    newCompetidor = new Competidor(newCompetidor.id, newCompetidor.name);

    for (var i = 0; i < competition.problems.length; i++) {
      newCompetidor.problemsStatus.push(new ProblemStatus(competition.problems[i].id));
      newCompetidor.problemsStatus.sort(sortById);
    }
    
    deleteById(competition.competidors, newCompetidor.id);
    competition.competidors.push(newCompetidor);
    competition.competidors.sort(sortById);

    saveDatabase();
    res.json(newCompetidor);
  });

  server.put("/api/competition/:id/newProblem", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var newProblem = req.body.problem;
    newProblem = new Problem(newProblem.id);

    var competition = getById(db["competitions"], req.params.id);
    deleteById(competition.problems, newProblem.id);
    competition.problems.push(newProblem);
    competition.problems.sort(sortById);

    for (var i = 0; i < competition.competidors.length; i++) {
      deleteById(competition.competidors[i].problemsStatus, newProblem.id);
      competition.competidors[i].problemsStatus.push(new ProblemStatus(newProblem.id));
      competition.competidors[i].problemsStatus.sort(sortById);
    }

    saveDatabase();
    res.json(newProblem);
  });

  server.delete("/api/competition/:id", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    deleteById(db["competitions"], req.params.id);

    saveDatabase();
    res.json(db["competitions"]);
  });

  server.delete("/api/competition/:competitionId/competidor/:competidorId", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var competition = getById(db["competitions"], req.params.competitionId);
    if (competition) {
      deleteById(competition.competidors, req.params.competidorId);
      competition.competidors.sort(sortById);
    }

    saveDatabase();
    res.json(competition);
  });

  server.delete("/api/competition/:competitionId/problem/:problemId", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var competition = getById(db["competitions"], req.params.competitionId);
    if (competition) {
      deleteById(competition.problems, req.params.problemId);
      competition.problems.sort(sortById);
    }

    saveDatabase();
    res.json(competition);
  });

  server.patch("/api/competition/:competitionId/problem/:problemId", (req, res) => {
    if (!authenticated(req.headers.token, res))
      return;

    var competition = getById(db["competitions"], req.params.competitionId);
    if (competition) {
      var problem = getById(competition.problems, req.params.problemId);
      problem.color = req.body.color;
    }

    saveDatabase();
    res.json(competition);
  });

  server.get("/api/standings/:id", (req, res) => {
    res.json({standings: getById(db["competitions"], req.params.id), time: Date.now()});
  });

  server.post("/api/login", (req, res) => {
    if (sha256password != crypto.createHash("sha256").update(req.body.password).digest("hex")) {
      res.sendStatus(403);
      console.log("Not allowed");
      return;
    }

    huxleyLogin(req.body.username, req.body.password);
    clientToken = crypto.randomBytes(20).toString("hex");

    res.json(clientToken);
  });

  server.post("/api/valid", (req, res) => {
    res.json(clientToken == req.body.token);
  });

  server.get("*", (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      res.sendFile(path.resolve("public" + req.url));
    } else {
      res.sendFile(path.resolve("public/index.html"));
    }
  });

  if (production) {
    server.listen(process.env.PORT || 5000, () => {
      console.log("Server running at http://${hostname}:${port}/");
    });
  } else {
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
}

initServer();
