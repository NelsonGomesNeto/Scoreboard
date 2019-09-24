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

function getMaxId(array) {
  maximum = -1;
  array.forEach(element => {
    maximum = Math.max(maximum, element.id);
  });
  return maximum;
}

function initServer() {
  loadDatabase();

  huxleyToken = clientToken = null;

  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: false}));
  server.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  server.get('/competitions', (req, res) => {
    res.json(db['competitions']);
  });

  server.post('/competitions', (req, res) => {
    var newCompetition = req.body;
    console.log(newCompetition);
    newCompetition = new Competition(getMaxId(db['competitions']) + 1, newCompetition.name);
    db['competitions'].push(newCompetition);
    saveDatabase();
    res.json(newCompetition);
  });
  
  server.put('/competition/:id/newCompetidor', (req, res) => {
    var newCompetidor = req.body;
    newCompetidor = new Competidor(newCompetidor.id, newCompetidor.name);
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

  server.get('/standings/:id', (req, res) => {
    res.json(getById(db['competitions'], req.params.id));
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