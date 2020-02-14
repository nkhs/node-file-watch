const express = require("express");
const https = require("https");
const WebSocket = require("ws");
var fs = require('fs');
const path = require("path");

const bodyParser = require('body-parser');
const config = require('./config');
var watch = require('node-watch');
const cors = require('cors');
const app = express();

var http_options = {
    key: fs.readFileSync('./tdn-ssl/HSSL-5e2bccb3bc761.key'),
    cert : fs.readFileSync('./tdn-ssl/todonetworks_com.crt'),
    ca: [
      fs.readFileSync('./tdn-ssl/AddTrustExternalCARoot.crt'),
      fs.readFileSync('./tdn-ssl/SectigoRSADomainValidationSecureServerCA.crt'),
      fs.readFileSync('./tdn-ssl/USERTrustRSAAddTrustCA.crt')
    ]
  }

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

const server = https.createServer(http_options, app);

const wss = new WebSocket.Server({
  server
});
var argUser = process.argv.slice(2);

user = 'user1';
console.log(argUser)
if (argUser != null && argUser.length > 0) user = argUser[0];
if (process.env.USER_ID != null) {
  console.log('ENV')
  user = process.env.USER_ID;
}
var DIR = `/opt/${user}`;
fs.writeFileSync('debug.txt', user);
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
    setTimeout(function () {
      var list = fs.readdirSync(DIR);
      list.forEach(name => {
        var content = fs.readFileSync(`${DIR}/${name}`, 'utf8');
        wss.broadcast(JSON.stringify({ file: name, text: content }))
      })
    }, 500);
  } catch (e) {

  }
})

watch(DIR, { recursive: false }, function (evt, name) {
  if (!name.endsWith('.log')) return;
  var content = fs.readFileSync(name, 'utf8');
  name = name.replace(`${DIR}/`, '');
  console.log('%s changed.', name, content);

  wss.broadcast(JSON.stringify({ file: name, text: content }));
});

// server.getConnections('/getport/:user', (req, res) => {
//   try {
//     var port = fs.readFileSync(`/opt/${req.params.user}/port.txt`);
//     res.send({ 'port': port });
//   } catch (e) {
//     res.send({ 'port': -1 });
//   }
// });

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
// var port = normalizePort(process.env.PORT || "8090");
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var port = randomIntFromInterval(10000, 50000);

fs.writeFileSync(`${DIR}/port.txt`, '' + port);
server.listen(port, function listening() {
  console.log(`HTTPS Listening on https://${config.host_url}:${server.address().port}`);
});
