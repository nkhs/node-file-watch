const express = require("express");
const http = require("http");
const WebSocket = require("ws");
var fs = require('fs');
const path = require("path");

const bodyParser = require('body-parser');
const config = require('./config');
var watch = require('node-watch');
const cors = require('cors');
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '5mb'
}));

app.use(cors());
app.use(function (err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(err);
  }
});

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server
});
var argUser = process.argv.slice(2);

user = 'user1';
if (argUser != null && argUser.length > 0) user = argUser[0];
var DIR = `/opt/${user}`;

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        // console.log("sending data " + data);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};


wss.on('connection', () => {
  console.log('socket connected')
  try {
    var list = fs.readdirSync(DIR);
    list.forEach(name => {
      var content = fs.readFileSync(`${DIR}/${name}`, 'utf8');
      wss.broadcast(JSON.stringify({ file: file, text: content }))
    })
  } catch (e) {

  }
})

watch(DIR, { recursive: false }, function (evt, name) {
  
  var content = fs.readFileSync(name, 'utf8');
  name = name.replace(`${DIR}/`, '');
  console.log('%s changed.', name, content);

  wss.broadcast(JSON.stringify({ file: name, text: content }));
});

var normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
var port = normalizePort(process.env.PORT || "8090");

server.listen(port, function listening() {
  console.log(`HTTP Listening on http://${config.host_url}:${server.address().port}`);
});
