'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var webpush = require('web-push');
var http = require('http');

var server = express();
var client = express();

server.use(bodyParser.json());

server.post('/api/send', (req, res) => {
  const options = {
    vapidDetails: {
      subject: 'http://sivasankar.in/',
      publicKey: req.body.applicationKeys.public,
      privateKey: req.body.applicationKeys.private
    },
    TTL: 60 * 60
  };

  webpush.sendNotification(
    req.body.subscription,
    req.body.data,
    options
  )
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      if (err.statusCode) {
        res.status(err.statusCode).send(err.body);
      } else {
        res.status(400).send(err.message);
      }
    });
});

server.use('/', express.static('server'));
client.use('/', express.static('client'));

http.createServer(server).listen(3001, function () {
  console.log('Server application listening on port 3001');
});

http.createServer(client).listen(3002, function () {
  console.log('Client application listening on port 3002');
});