const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());

const server = http.createServer(app);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(4010);
