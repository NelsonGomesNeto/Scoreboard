const Competidor = require('./model/competidor.js');
const ProblemStatus = require('./model/problem-status.js');
const Problem = require('./model/problem.js')
const Competition = require('./model/competition.js')

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

const hostname = 'localhost';
const dbPath = 'database/db.json';
var db;
const huxley_url = 'https://thehuxley.com/api';
const port = 3000;

var huxleyToken = null;
var clientToken = null;

async function login(username, password) {
  await request.post(huxley_url + '/login', {json: {username: username, password: password}}, (err, res, body) => {
    if (err || body == undefined) {
      console.log(err);
      return;
    }
    huxleyToken = body['access_token'];
    // console.log("huxleyToken " + huxleyToken);
    // initServer();
  });
}

function loadDatabase() {
  db = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(db);
  // console.log(a);
}

function saveDatabase() {
  fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');
}

function getById(array, id) {
  return array.find(element => element.id == id);
}

function deleteById(array, id) {
  for (var i = 0; i < array.length; i ++)
    if (array[i].id == id) {
      array.splice(i, 1);
      break;
    }
}

function getNextId(array) {
  maximum = -1;
  array.forEach(element => {
    maximum = Math.max(maximum, element.id);
  });
  return maximum + 1;
}

function initServer() {
  loadDatabase();

  huxleyToken = clientToken = null;

  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: false}));
  server.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  server.get('/competitions', (req, res) => {
    res.json({competitions: db['competitions'], time: Date.now()});
  });

  server.post('/competitions', (req, res) => {
    var newCompetition = req.body;
    console.log(newCompetition);
    newCompetition = new Competition(getNextId(db['competitions']), newCompetition.name, newCompetition.startTime, newCompetition.endTime);
    db['competitions'].push(newCompetition);
    saveDatabase();
    res.json(newCompetition);
  });

  server.patch('/competition/:id/changeSchedule', (req, res) => {
    var competition = getById(db['competitions'], req.params.id);
    competition.startTime = new Date(req.body.startTime);
    competition.endTime = new Date(req.body.endTime);
    saveDatabase();
    res.json(competition);
  });
  
  server.put('/competition/:id/newCompetidor', (req, res) => {
    var newCompetidor = req.body;
    var competition = getById(db['competitions'], req.params.id);
    newCompetidor = new Competidor(newCompetidor.id, newCompetidor.name);
    for (var i = 0; i < competition.problems.length; i ++)
      newCompetidor.problemsStatus.push(new ProblemStatus(competition.problems[i].id));
    getById(db['competitions'], req.params.id).competidors.push(newCompetidor);
    saveDatabase();
    res.json(newCompetidor);
  });

  server.put('/competition/:id/newProblem', (req, res) => {
    var newProblem = req.body;
    newProblem = new Problem(newProblem.id);
    getById(db['competitions'], req.params.id).problems.push(newProblem);
    saveDatabase();
    res.json(newProblem);
  });

  server.delete('/competition/:id', (req, res) => {
    deleteById(db['competitions'], req.params.id);
    saveDatabase();
    res.json(db['competitions']);
  });

  server.delete('/competition/:competitionId/competidor/:competidorId', (req, res) => {
    var competition = getById(db['competitions'], req.params.competitionId);
    if (competition)
      deleteById(competition.competidors, req.params.competidorId);
    saveDatabase();
    res.json(competition);
  });

  server.delete('/competition/:competitionId/problem/:problemId', (req, res) => {
    var competition = getById(db['competitions'], req.params.competitionId);
    if (competition)
      deleteById(competition.problems, req.params.problemId);
    saveDatabase();
    res.json(competition);
  });

  server.get('/standings/:id', (req, res) => {
    res.json({standings: getById(db['competitions'], req.params.id), time: Date.now()});
  });

  server.post('/login', (req, res) => {
    login(req.body.username, req.body.password);
    clientToken = crypto.randomBytes(20).toString('hex')
    res.json(clientToken);
  });

  server.post('/valid', (req, res) => {
    res.json(clientToken == req.body.token);
  });
  
  server.listen(port, hostname, () => {
    console.log('Server running at http://${hostname}:${port}/');
  });
}

initServer();