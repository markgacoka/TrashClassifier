var express = require('express');
var fs = require('fs');
var http = require("http");
var path = require('path');
var bodyParser = require('body-parser');

var Houndify = require('houndify');

//parse arguments
var argv = require('minimist')(process.argv.slice(2));

//config file
var configFile = argv.config || 'config';
var config = require(path.join(__dirname, configFile));

//express app
var app = express();
var port = 1337;

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//authenticates requests
app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({ 
  clientId:  config.clientId, 
  clientKey: config.clientKey
}));

//sends the request to Houndify backend with authentication headers
app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());

http.createServer(function(req, res) {
    fs.readFile("index.html", function(err, data){
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
      console.log("HTTPS server running on port", port);
      console.log("Open https://localhost:" + port, "in the browser to view the Web SDK demo");
  }).listen(1337, "localhost");

} else {

  app.listen(port, function() {
    console.log("HTTP server running on port", port);
    console.log("Open http://localhost:" + port, "in the browser to view the Web SDK demo");
  }).listen(1337, "localhost");

}
