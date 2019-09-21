const Competidor = require('./model/competidor.js');
const ProblemStatus = require('./model/problem-status.js');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

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

server.get('/standings', (req, res) => {
  res.json([new Competidor('Nelson', 10, [new ProblemStatus(0, 1, true), new ProblemStatus(0, 0, false)]), new Competidor('Jackson', 0, [new ProblemStatus(0, 2, false), new ProblemStatus(0, 2, true)])]);
});

server.listen(port, hostname, () => {
  console.log('Server running at http://${hostname}:${port}/');
});