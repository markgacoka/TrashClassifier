'use strict';

const express = require('express');
const serverless = require('serverless-http');
const app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var Houndify = require('houndify');

//parse arguments
var argv = require('minimist')(process.argv.slice(2));

//config file
var configFile = argv.config || 'config';
var config = require(path.join(__dirname, configFile));

//express app
const port = 3000;
const hostname = 'localhost';

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());

module.exports.handler = serverless(app);
